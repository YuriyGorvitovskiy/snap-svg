import React, { FunctionComponent } from "react"
import * as Path from "../geometry/path"
import * as Track from "../model/track"

interface Props {
    track: Track.Instance
    onMouseDown: (ev: React.MouseEvent) => void
}

const TrackComponent: FunctionComponent<Props> = (props: Props) => {
    const transform = `translate(${props.track.position.x}, ${props.track.position.y}) rotate(${props.track.rotation})`
    return (
        <g transform={transform} onMouseDown={props.onMouseDown}>
            <path
                d={Path.toSVG(props.track.model.outline)}
                fill={props.track.model.color}
                strokeWidth={0.25}
                stroke="black"
            />
            <path d={Path.toSVG(props.track.model.centerLine)} fill="none" strokeWidth={0.25} stroke="black" />
        </g>
    )
}

export default TrackComponent
