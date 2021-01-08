import React from "react";

interface Props {
    length: number
    trackWidth: number
    transform: string
    onMouseDown: (ev: React.MouseEvent) => void
}

export default (props: Props) => {

    return (
        <g transform={props.transform}
            onMouseDown={props.onMouseDown}>
            <rect fill="lightblue"
                strokeWidth={0.25}
                stroke="black"
                x={-props.length / 2}
                y={-props.trackWidth / 2}
                width={props.length}
                height={props.trackWidth}
            />
            <line
                strokeWidth={0.25}
                stroke="black"
                x1={-props.length / 2}
                y1={0}
                x2={props.length / 2}
                y2={0}
            />
        </g>
    )
}
