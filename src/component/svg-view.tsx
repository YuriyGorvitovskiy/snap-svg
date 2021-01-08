import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import CurveTrack from './curve';
import StraightTrack from './straight';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "100%",
    },
}))

interface Drag {
    startA: number
    startX: number
    startY: number
    adjustX: number
    adjustY: number
}

export default () => {
    const classes = useStyles()
    const [a, setA] = React.useState(0)
    const [x, setX] = React.useState(0)
    const [y, setY] = React.useState(0)
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
        const adjustX = x - svgPt.x;
        const adjustY = y - svgPt.y;
        setDrag({ startA: a, startX: x, startY: y, adjustX, adjustY });
    }

    const onMouseMove = (ev: React.MouseEvent) => {
        if (drag) {
            ev.preventDefault();
            const svgPt = toSvgPoint(ev);
            setX(drag.adjustX + svgPt.x);
            setY(drag.adjustY + svgPt.y);
        }
    }

    const onMouseUp = (ev: React.MouseEvent) => {
        if (drag) {
            ev.preventDefault();
            const svgPt = toSvgPoint(ev);
            setX(drag.adjustX + svgPt.x);
            setY(drag.adjustY + svgPt.y);
            setDrag(null);
        }
    }

    const onKeyDown = (ev: React.KeyboardEvent) => {
        if (ev.key === 'Escape' && drag) {
            ev.preventDefault();
            setA(drag.startA);
            setX(drag.startX);
            setY(drag.startY);
            setDrag(null);
        }
        if (ev.key === 'r' && drag) {
            ev.preventDefault();
            setA(a + 7.5);
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
            <CurveTrack
                curveAngle={-15}
                curveRadius={120}
                trackWidth={4.5}
                transform={`translate(${x}, ${y}) rotate(${a})`}
                onMouseDown={onMouseDown} />
            <StraightTrack
                length={30}
                trackWidth={4.5}
                transform={`translate(15, 0)`}
                onMouseDown={onMouseDown} />
        </svg>
    );
}
