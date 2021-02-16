import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import * as ReactRedux from "react-redux"
import { add, inverse, Point } from "../data/geometry/type"
import Track, { place, snap } from "../data/item/track"
import Model from "../data/model/track"
import { addTrack, moveTrack, selectLayoutItem } from "../reducer/actions"
import State from "../reducer/state"
import * as TrackSlice from "../reducer/track"
import * as ModelSlice from "../reducer/model"
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

const LayoutComponent: React.FunctionComponent<unknown> = () => {
    const classes = useStyles()
    const tracks = ReactRedux.useSelector((s: State) => TrackSlice.adapter.getSelectors().selectAll(s.tracks))
    const selection = ReactRedux.useSelector((s: State) => s.selection)
    const selectedModel = ReactRedux.useSelector((s: State) =>
        ModelSlice.adapter.getSelectors().selectById(s.models, selection.libraryModelId)
    )
    const dispatch = ReactRedux.useDispatch()
    const [drag, setDrag] = React.useState(null as Drag)

    const svgRef: React.MutableRefObject<SVGSVGElement> = React.useRef()

    const toSvgPoint = (ev: React.MouseEvent) => {
        const svg = svgRef.current
        const htmlPt = svg.createSVGPoint()
        htmlPt.x = ev.clientX
        htmlPt.y = ev.clientY
        return htmlPt.matrixTransform(svg.getScreenCTM().flipY().inverse())
    }

    const onMouseDownTrack = (track: Track, model: Model, ev: React.MouseEvent) => {
        ev.preventDefault()
        ev.stopPropagation()
        svgRef.current.focus()

        dispatch(selectLayoutItem(track.id))

        const svgPt = toSvgPoint(ev)
        setDrag({
            track: track,
            model: model,
            adjust: add(track.placement.pos, inverse(svgPt)),
        })
    }

    const onMouseDownLayout = (ev: React.MouseEvent) => {
        ev.preventDefault()
        svgRef.current.focus()
        if (null == selectedModel || null != drag) {
            return
        }

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

    const onMouseMove = (ev: React.MouseEvent) => {
        if (!drag) return

        ev.preventDefault()
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

    const onMouseUp = (ev: React.MouseEvent) => {
        if (!drag) return

        ev.preventDefault()
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

    const onKeyDown = (ev: React.KeyboardEvent) => {
        if (ev.key === "Escape" && drag) {
            ev.preventDefault()
            setDrag(null)
        }
        if (ev.key === "r" && drag) {
            ev.preventDefault()

            const dir = drag.track.placement.dir + 7.5
            const placement = place(drag.track, drag.model, { ...drag.track.placement, dir })
            setDrag({
                ...drag,
                track: { ...drag.track, ...placement },
            })
        }
    }

    return (
        <svg
            ref={svgRef}
            tabIndex={0}
            className={classes.root}
            viewBox="-100 -100 200 200"
            onMouseDown={onMouseDownLayout}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onKeyDown={onKeyDown}
        >
            <g transform="scale(1, -1)">
                {tracks
                    .filter((t) => t.id !== drag?.track?.id)
                    .map((t) => (
                        <TrackComponent
                            key={t.id}
                            track={t}
                            selected={selection.layoutTrackId === t.id}
                            onMouseDown={onMouseDownTrack}
                        />
                    ))}
                {drag ? (
                    <TrackComponent
                        key={drag.track.id}
                        track={drag.track}
                        selected={selection.layoutTrackId === drag.track.id}
                    />
                ) : null}
            </g>
        </svg>
    )
}

export default LayoutComponent
