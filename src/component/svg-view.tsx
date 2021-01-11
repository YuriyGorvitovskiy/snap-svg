import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import TrackComponent from "./track"
import * as TrackModel from "../model/track"

const useStyles = makeStyles(() => ({
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

interface Snap {
    x: number
    y: number
    a: number
}

const snaps: Snap[] = [
    { x: -48, y: 0, a: 0 },
    { x: 0, y: 0, a: 180 },
    { x: -30 - 24 * Math.cos((Math.PI * 30) / 180), y: 30 + 24 * Math.sin((Math.PI * 30) / 180), a: -30 },
    { x: -30 + 24 * Math.cos((Math.PI * 30) / 180), y: 30 - 24 * Math.sin((Math.PI * 30) / 180), a: 150 },
]
const maxSnapDistSq = 5 * 5

const snap = (pos: Snap): Snap => {
    return snaps.reduce(
        (a, s) => {
            const dx = s.x - pos.x
            const dy = s.y - pos.y
            const d = dx * dx + dy * dy
            return d < a.d ? { d, p: { ...s, a: (180 + s.a) % 360 } } : a
        },
        { d: maxSnapDistSq, p: pos }
    ).p
}

const straiht_480 = TrackModel.straight(48, 9, "orange")
const curve_1240_225 = TrackModel.curve(120, 22.5, 9, "#1F45FC")

const SVGComponent: React.FunctionComponent<unknown> = () => {
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
        const svgPt = toSvgPoint(ev)
        const adjustX = x - svgPt.x
        const adjustY = y - svgPt.y
        setDrag({ startA: a, startX: x, startY: y, adjustX, adjustY })
    }

    const onMouseMove = (ev: React.MouseEvent) => {
        if (drag) {
            ev.preventDefault()
            const svgPt = toSvgPoint(ev)
            svgPt.x += drag.adjustX
            svgPt.y += drag.adjustY
            const snapPt = snap({ x: svgPt.x, y: svgPt.y, a })
            setA(snapPt.a)
            setX(snapPt.x)
            setY(snapPt.y)
        }
    }

    const onMouseUp = (ev: React.MouseEvent) => {
        if (drag) {
            ev.preventDefault()
            const svgPt = toSvgPoint(ev)
            svgPt.x += drag.adjustX
            svgPt.y += drag.adjustY
            const snapPt = snap({ x: svgPt.x, y: svgPt.y, a })
            setA(snapPt.a)
            setX(snapPt.x)
            setY(snapPt.y)
            setDrag(null)
        }
    }

    const onKeyDown = (ev: React.KeyboardEvent) => {
        if (ev.key === "Escape" && drag) {
            ev.preventDefault()
            setA(drag.startA)
            setX(drag.startX)
            setY(drag.startY)
            setDrag(null)
        }
        if (ev.key === "r" && drag) {
            ev.preventDefault()
            setA(a + 7.5)
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
            onKeyDown={onKeyDown}
        >
            <TrackComponent
                track={{
                    model: straiht_480,
                    position: { x: -24, y: 0 },
                    rotation: 0,
                }}
                onMouseDown={() => null}
            />
            <TrackComponent
                track={{
                    model: straiht_480,
                    position: { x: -30, y: 30 },
                    rotation: -30,
                }}
                onMouseDown={() => null}
            />
            <TrackComponent
                track={{
                    model: curve_1240_225,
                    position: { x, y },
                    rotation: a,
                }}
                onMouseDown={onMouseDown}
            />
        </svg>
    )
}

export default SVGComponent
