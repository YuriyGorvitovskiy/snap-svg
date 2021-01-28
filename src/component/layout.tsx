import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import * as ReactRedux from "react-redux"
import * as Path from "../data/geometry/path"
import { Point, add, inverse } from "../data/geometry/type"
import Track, { place } from "../data/item/track"
import Model from "../data/model/track"
import { moveTrack } from "../reducer/actions"
import * as ModelSlice from "../reducer/model"
import State from "../reducer/state"
import * as TrackSlice from "../reducer/track"

const useStyles = makeStyles(() => ({
    root: {
        width: "100%",
        height: "100%",
    },
}))
interface Props {
    track: Track

    onMouseDown?: (track: Track, model: Model, ev: React.MouseEvent) => void
}

const TrackComponent: React.FunctionComponent<Props> = ({ track, onMouseDown }: Props) => {
    const model = ReactRedux.useSelector((s: State) =>
        ModelSlice.adapter.getSelectors().selectById(s.models, track.modelId)
    )
    const transform =
        `translate(${track.placement.pos.x}, ${track.placement.pos.y}) ` +
        `rotate(${track.placement.dir}) ` +
        `translate(${-model.centerPoint.x}, ${-model.centerPoint.y})`

    return (
        <g transform={transform} onMouseDown={(ev) => onMouseDown(track, model, ev)}>
            <path d={Path.toSVG(model.outLine)} fill={model.color} strokeWidth={0.25} stroke="black" />
            <path d={Path.toSVG(model.centerLine)} fill="none" strokeWidth={0.25} stroke="black" />
        </g>
    )
}

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

        const placement = place(drag.track, drag.model, { ...drag.track.placement, pos })

        //const snapPt = snap(layout, drag.itemId, item)
        //placement = place(drag.track, drag.model, snapPt)

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

        const placement = place(drag.track, drag.model, { ...drag.track.placement, pos })
        // const snapPt = snap(layout, drag.itemId, item)
        // placement = place(drag.track, drag.model, snapPt.position, snapPt.direction)

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
