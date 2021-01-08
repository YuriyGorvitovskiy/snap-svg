import React from "react";

interface Props {
    curveAngle: number
    curveRadius: number
    trackWidth: number
    transform: string
    onMouseDown: (ev: React.MouseEvent) => void
}

export default (props: Props) => {
    const d1 =
        " M 0," + (-props.trackWidth / 2) +
        " A" + props.curveRadius +
        "," + props.curveRadius +
        " 0,0,0 " + (Math.sin(Math.PI * props.curveAngle / 180) * (props.curveRadius - props.trackWidth / 2)) +
        "," + ((Math.cos(Math.PI * props.curveAngle / 180)) * (props.curveRadius - props.trackWidth / 2) - props.curveRadius) +
        " L" + (Math.sin(Math.PI * props.curveAngle / 180) * (props.curveRadius + props.trackWidth / 2)) +
        "," + ((Math.cos(Math.PI * props.curveAngle / 180)) * (props.curveRadius + props.trackWidth / 2) - props.curveRadius) +
        " A" + props.curveRadius +
        "," + props.curveRadius +
        " 0,0,1 0," + props.trackWidth / 2 +
        " Z"

    const d2 =
        " M 0,0" +
        " A " + props.curveRadius + "," + props.curveRadius +
        " 0,0,0 " + (Math.sin(Math.PI * props.curveAngle / 180) * props.curveRadius) +
        "," + ((Math.cos(Math.PI * props.curveAngle / 180) - 1) * props.curveRadius)

    return (
        <g transform={props.transform}
            onMouseDown={props.onMouseDown}>
            <path d={d1}
                fill="orange"
                strokeWidth={0.25}
                stroke="black"
            />
            <path d={d2}
                strokeWidth={0.25}
                stroke="black"
                fill="none"
            />
        </g>
    )
}
