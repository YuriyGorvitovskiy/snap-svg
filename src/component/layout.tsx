import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import * as ReactRedux from "react-redux"
import * as Path from "../data/geometry/path"
import Track from "../data/item/track"
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
}
const TrackComponent: React.FunctionComponent<Props> = ({ track }: Props) => {
    const model = ReactRedux.useSelector((s: State) =>
        ModelSlice.adapter.getSelectors().selectById(s.models, track.modelId)
    )
    const transform =
        `translate(${track.placement.pos.x}, ${track.placement.pos.y}) ` +
        `rotate(${track.placement.dir}) ` +
        `translate(${-model.centerPoint.x}, ${-model.centerPoint.y})`

    return (
        <g transform={transform}>
            <path d={Path.toSVG(model.outLine)} fill={model.color} strokeWidth={0.25} stroke="black" />
            <path d={Path.toSVG(model.centerLine)} fill="none" strokeWidth={0.25} stroke="black" />
        </g>
    )
}

const LayoutComponent: React.FunctionComponent<unknown> = () => {
    const classes = useStyles()
    const tracks = ReactRedux.useSelector((s: State) => TrackSlice.adapter.getSelectors().selectAll(s.tracks))

    return (
        <svg tabIndex={0} className={classes.root} viewBox="-100 -100 200 200">
            <g transform="scale(1, -1)">
                {tracks.map((t) => (
                    <TrackComponent key={t.id} track={t} />
                ))}
            </g>
        </svg>
    )
}

export default LayoutComponent
