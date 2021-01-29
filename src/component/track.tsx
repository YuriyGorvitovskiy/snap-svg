import React from "react"
import * as ReactRedux from "react-redux"
import * as Path from "../data/geometry/path"
import Track from "../data/item/track"
import Model from "../data/model/track"
import * as ModelSlice from "../reducer/model"
import State from "../reducer/state"

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

export default TrackComponent
