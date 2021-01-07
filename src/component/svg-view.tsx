import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "100%",
    },
}))

interface Drag {
    startX: number
    startY: number
    adjustX: number
    adjustY: number
}

export default () => {
    const classes = useStyles()
    const [cx, setCx] = React.useState(0)
    const [cy, setCy] = React.useState(0)
    const [drag, setDrag] = React.useState(null as Drag)
    const svgRef: React.MutableRefObject<SVGSVGElement> = React.useRef()

    const toSvgPoint = (ev: React.MouseEvent) => {
        const svg = svgRef.current
        const htmlPt = svg.createSVGPoint()
        htmlPt.x = ev.clientX
        htmlPt.y = ev.clientY
        return htmlPt.matrixTransform(svg.getScreenCTM().inverse())
    }

    const onMouseDown = (ev: React.MouseEvent) => {
        const svgPt = toSvgPoint(ev);
        const adjustX = cx - svgPt.x;
        const adjustY = cy - svgPt.y;
        setDrag({ startX: cx, startY: cy, adjustX, adjustY });
    }

    const onMouseMove = (ev: React.MouseEvent) => {
        if (drag) {
            ev.preventDefault();
            const svgPt = toSvgPoint(ev);
            setCx(drag.adjustX + svgPt.x);
            setCy(drag.adjustY + svgPt.y);
        }
    }
    const onMouseUp = (ev: React.MouseEvent) => {
        if (drag) {
            ev.preventDefault();
            const svgPt = toSvgPoint(ev);
            setCx(drag.adjustX + svgPt.x);
            setCy(drag.adjustY + svgPt.y);
            setDrag(null);
        }
    }
    const onKeyDown = (ev: React.KeyboardEvent) => {
        if (ev.key === 'Escape' && drag) {
            ev.preventDefault();
            setCx(drag.startX);
            setCy(drag.startY);
            setDrag(null);
        }
    }

    return (
        <svg
            ref={svgRef}
            tabIndex={0}
            className={classes.root}
            viewBox="-100 -100 200 200"
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onKeyDown={onKeyDown}>
            <circle
                cx={0}
                cy={0}
                r="10"
                transform={`translate(${cx}, ${cy})`}
                onMouseDown={onMouseDown} />
        </svg>
    );
}
