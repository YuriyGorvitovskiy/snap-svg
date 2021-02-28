import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import * as ReactRedux from "react-redux"
import { add, boundingBox, center, direction, Point, scale, size } from "../data/geometry/type"
import Track, { place, snap } from "../data/item/track"
import Model from "../data/model/track"
import { addTrack, moveTrack, panLayout, selectLayoutItem, zoomLayout } from "../reducer/actions"
import * as ModelSlice from "../reducer/model"
import State from "../reducer/state"
import * as TrackSlice from "../reducer/track"
import TrackComponent from "./track"

const useStyles = makeStyles(() => ({
    root: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
}))

const NEW_ITEM = "new-item"

interface Drag {
    track: Track
    model: Model
    adjust: Point
}

interface Pan {
    start: Point
    center: Point
}

const LayoutComponent: React.FunctionComponent<unknown> = () => {
    const classes = useStyles()
    const tracks = ReactRedux.useSelector((s: State) => TrackSlice.adapter.getSelectors().selectAll(s.tracks))
    const uistate = ReactRedux.useSelector((s: State) => s.uistate)
    const selectedModel = ReactRedux.useSelector((s: State) =>
        ModelSlice.adapter.getSelectors().selectById(s.models, uistate.selection.libraryModelId)
    )
    const selectedTrack = ReactRedux.useSelector((s: State) =>
        TrackSlice.adapter.getSelectors().selectById(s.tracks, uistate.selection.layoutTrackId)
    )
    const selectedTrackModel = ReactRedux.useSelector((s: State) =>
        ModelSlice.adapter.getSelectors().selectById(s.models, selectedTrack?.modelId)
    )

    const dispatch = ReactRedux.useDispatch()
    const [drag, setDrag] = React.useState(null as Drag)
    const [pan, setPan] = React.useState(null as Pan)

    const svgRef: React.MutableRefObject<SVGSVGElement> = React.useRef()
    const viewBox =
        "" +
        ((pan?.center.x || uistate.layoutCenter.x) - uistate.layoutZoom / 2) +
        " " +
        (-(pan?.center.y || uistate.layoutCenter.y) - uistate.layoutZoom / 2) +
        " " +
        uistate.layoutZoom +
        " " +
        uistate.layoutZoom

    const toSvgPoint = (ev: React.MouseEvent): DOMPoint => {
        const svg = svgRef.current
        const htmlPt = svg.createSVGPoint()
        htmlPt.x = ev.clientX
        htmlPt.y = ev.clientY
        return htmlPt.matrixTransform(svg.getScreenCTM().flipY().inverse())
    }

    const panCenter = (ev: React.MouseEvent): Point => {
        const svg = svgRef.current
        const transform = svg.getScreenCTM().flipY().inverse()
        const htmlStart = svg.createSVGPoint()
        htmlStart.x = pan.start.x
        htmlStart.y = pan.start.y
        const start = htmlStart.matrixTransform(transform)

        const htmlCurrent = svg.createSVGPoint()
        htmlCurrent.x = ev.clientX
        htmlCurrent.y = ev.clientY
        const current = htmlCurrent.matrixTransform(transform)

        return add(uistate.layoutCenter, direction(current, start))
    }

    const onMouseDownTrack = (track: Track, model: Model, ev: React.MouseEvent) => {
        ev.preventDefault()
        ev.stopPropagation()
        svgRef.current.focus()
        if (drag || pan) return

        if (ev.shiftKey) {
            setPan({
                center: uistate.layoutCenter,
                start: {
                    x: ev.clientX,
                    y: ev.clientY,
                },
            })
        } else {
            dispatch(selectLayoutItem(track.id))

            const svgPt = toSvgPoint(ev)
            setDrag({
                track: track,
                model: model,
                adjust: direction(svgPt, track.placement.pos),
            })
        }
    }

    const onMouseDownLayout = (ev: React.MouseEvent) => {
        ev.preventDefault()
        svgRef.current.focus()
        if (drag || pan) return

        if (ev.shiftKey) {
            setPan({
                center: uistate.layoutCenter,
                start: {
                    x: ev.clientX,
                    y: ev.clientY,
                },
            })
        } else if (selectedModel) {
            const svgPt = toSvgPoint(ev)
            setDrag({
                track: {
                    id: NEW_ITEM,
                    modelId: selectedModel.id,
                    ...place(null, selectedModel, { pos: svgPt, dir: 0 }),
                },
                model: selectedModel,
                adjust: { x: 0, y: 0 },
            })
        }
    }

    const onMouseMove = (ev: React.MouseEvent) => {
        ev.preventDefault()
        if (pan) {
            setPan({
                ...pan,
                center: panCenter(ev),
            })
        } else if (drag) {
            const svgPt = toSvgPoint(ev)
            const pos = add(svgPt, drag.adjust)

            const track = { ...drag.track, ...place(drag.track, drag.model, { ...drag.track.placement, pos }) }
            const snapPt = snap(tracks, track, drag.model, 5)
            const placement = place(drag.track, drag.model, snapPt)

            setDrag({
                ...drag,
                track: { ...drag.track, ...placement },
            })
        }
    }

    const onMouseUp = (ev: React.MouseEvent) => {
        ev.preventDefault()
        if (pan) {
            dispatch(panLayout(panCenter(ev)))
            setPan(null)
        } else if (drag) {
            const svgPt = toSvgPoint(ev)
            const pos = add(svgPt, drag.adjust)

            const track = { ...drag.track, ...place(drag.track, drag.model, { ...drag.track.placement, pos }) }
            const snapPt = snap(tracks, track, drag.model, 5)
            const placement = place(drag.track, drag.model, snapPt)
            if (NEW_ITEM === track.id) {
                dispatch(addTrack(drag.track.modelId, placement.placement))
            } else {
                dispatch(moveTrack(drag.track.id, placement.placement))
            }
            setDrag(null)
        }
    }

    const onWheel = (ev: React.WheelEvent) => {
        const delta = ev.detail || ev.deltaY || ev.deltaX
        if (!delta) return

        const svgPt = toSvgPoint(ev)
        const factor = 1 + 0.001 * delta
        const center = add(svgPt, scale(direction(svgPt, uistate.layoutCenter), factor))
        dispatch(zoomLayout(uistate.layoutZoom * factor, center))
    }

    const onKeyDown = (ev: React.KeyboardEvent) => {
        if (ev.key === "Escape" && drag) {
            ev.preventDefault()
            setDrag(null)
        }
        if (ev.key === "r" || ev.key === "R") {
            ev.preventDefault()
            if (drag) {
                const dir = drag.track.placement.dir + (ev.key === "R" ? -7.5 : 7.5)
                const placement = place(drag.track, drag.model, { ...drag.track.placement, dir })
                setDrag({
                    ...drag,
                    track: { ...drag.track, ...placement },
                })
            } else if (uistate.selection.layoutTrackId) {
                const dir = selectedTrack.placement.dir + (ev.key === "R" ? -7.5 : 7.5)
                const placement = place(selectedTrack, selectedTrackModel, { ...selectedTrack.placement, dir })

                dispatch(moveTrack(selectedTrack.id, placement.placement))
            }
        }
        if (["f", "c"].includes(ev.key.toLowerCase())) {
            const completeArea = boundingBox(...tracks.flatMap((t) => [t.boundingBox.min, t.boundingBox.max]))
            const sz = size(completeArea)
            dispatch(zoomLayout(Math.max(sz.x, sz.y) * 1.1, center(completeArea)))
        }
    }

    return (
        <svg
            ref={svgRef}
            tabIndex={0}
            className={classes.root}
            viewBox={viewBox}
            onMouseDown={onMouseDownLayout}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onKeyDown={onKeyDown}
            onWheel={onWheel}
        >
            <g transform="scale(1, -1)">
                {tracks
                    .filter((t) => t.id !== drag?.track?.id)
                    .map((t) => (
                        <TrackComponent
                            key={t.id}
                            track={t}
                            selected={uistate.selection.layoutTrackId === t.id}
                            onMouseDown={onMouseDownTrack}
                        />
                    ))}
                {drag ? (
                    <TrackComponent
                        key={drag.track.id}
                        track={drag.track}
                        selected={uistate.selection.layoutTrackId === drag.track.id}
                    />
                ) : null}
            </g>
        </svg>
    )
}

export default LayoutComponent
