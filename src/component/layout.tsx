import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import * as ReactRedux from "react-redux"
import { add, inverse, Point } from "../data/geometry/type"
import Track, { place, snap } from "../data/item/track"
import Model from "../data/model/track"
import { moveTrack } from "../reducer/actions"
import State from "../reducer/state"
import TrackComponent from "./track"
import * as TrackSlice from "../reducer/track"

const useStyles = makeStyles(() => ({
    root: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
}))

interface Drag {
    track: Track
    model: Model
    adjust: Point
}

const LayoutComponent: React.FunctionComponent<unknown> = () => {
    const classes = useStyles()
    const tracks = ReactRedux.useSelector((s: State) => TrackSlice.adapter.getSelectors().selectAll(s.tracks))
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

    const onMouseDown = (track: Track, model: Model, ev: React.MouseEvent) => {
        ev.preventDefault()
        svgRef.current.focus()

        const svgPt = toSvgPoint(ev)
        setDrag({
            track: track,
            model: model,
            adjust: add(track.placement.pos, inverse(svgPt)),
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

        dispatch(moveTrack(drag.track.id, placement.placement))
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
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onKeyDown={onKeyDown}
        >
            <g transform="scale(1, -1)">
                {tracks
                    .filter((t) => t.id !== drag?.track?.id)
                    .map((t) => (
                        <TrackComponent key={t.id} track={t} onMouseDown={onMouseDown} />
                    ))}
                {drag ? <TrackComponent key={drag.track.id} track={drag.track} /> : null}
            </g>
        </svg>
    )
}

export default LayoutComponent
