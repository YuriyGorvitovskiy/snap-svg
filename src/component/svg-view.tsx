import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import TrackComponent from "./track"
import * as T from "../model/track"
import * as C from "../model/connection"
import * as L from "../model/layout"

const useStyles = makeStyles(() => ({
    root: {
        width: "100%",
        height: "100%",
    },
}))

interface Drag {
    itemId: string
    startA: number
    startX: number
    startY: number
    adjustX: number
    adjustY: number
}

const maxSnapDistSq = 5 * 5

const snap = (layout: L.Layout, id: string, item: T.Item): C.Location => {
    return L.connections(layout, ([i]) => id !== i).reduce(
        (a, c) =>
            item.connections.reduce((ia, ic, ix) => {
                const dx = c.location.position.x - ic.location.position.x
                const dy = c.location.position.y - ic.location.position.y
                const d = dx * dx + dy * dy
                return d < ia.d
                    ? {
                          d,
                          p: {
                              position: new DOMMatrixReadOnly()
                                  .translate(c.location.position.x, c.location.position.y)
                                  .rotate(0, 0, (180 + c.location.direction - item.model.interface[ix].direction) % 360)
                                  .translate(-item.model.interface[ix].position.x, -item.model.interface[ix].position.y)
                                  .transformPoint(item.model.centerPoint),
                              direction: (180 + c.location.direction - item.model.interface[ix].direction) % 360,
                          },
                      }
                    : ia
            }, a),
        { d: maxSnapDistSq, p: { position: item.position, direction: item.rotation } }
    ).p
}

const model = {
    straiht_480: T.straight(48, 9, "orange"),
    curve_1240_225: T.curve(120, 22.5, 9, "#1F45FC"),
}

const initialLayout: L.Layout = {
    model,
    items: {
        s1: T.place(model.straiht_480, { x: -24, y: -20 }, 0),
        s2: T.place(model.straiht_480, { x: -30, y: 30 }, -30),
        r1: T.place(model.curve_1240_225, { x: 0, y: 0 }, 0),
        r2: T.place(model.curve_1240_225, { x: 30, y: 30 }, 0),
    },
}

const SVGComponent: React.FunctionComponent<unknown> = () => {
    const classes = useStyles()

    const [layout, setLayout] = React.useState(initialLayout)
    const [drag, setDrag] = React.useState(null as Drag)

    const svgRef: React.MutableRefObject<SVGSVGElement> = React.useRef()

    const toSvgPoint = (ev: React.MouseEvent) => {
        const svg = svgRef.current
        const htmlPt = svg.createSVGPoint()
        htmlPt.x = ev.clientX
        htmlPt.y = ev.clientY
        return htmlPt.matrixTransform(svg.getScreenCTM().flipY().inverse())
    }

    const onMouseDown = (itemId: string, ev: React.MouseEvent) => {
        const svgPt = toSvgPoint(ev)
        const item = layout.items[itemId]
        const adjustX = item.position.x - svgPt.x
        const adjustY = item.position.y - svgPt.y
        setDrag({ itemId, startA: item.rotation, startX: item.position.x, startY: item.position.y, adjustX, adjustY })
    }

    const onMouseMove = (ev: React.MouseEvent) => {
        if (drag) {
            ev.preventDefault()
            const svgPt = toSvgPoint(ev)
            svgPt.x += drag.adjustX
            svgPt.y += drag.adjustY

            let item = layout.items[drag.itemId]
            item = T.move(item, { x: svgPt.x, y: svgPt.y }, item.rotation)

            const snapPt = snap(layout, drag.itemId, item)
            item = T.move(item, snapPt.position, snapPt.direction)

            const modified = { ...layout }
            modified.items[drag.itemId] = item
            setLayout(modified)
        }
    }

    const onMouseUp = (ev: React.MouseEvent) => {
        if (drag) {
            ev.preventDefault()
            const svgPt = toSvgPoint(ev)
            svgPt.x += drag.adjustX
            svgPt.y += drag.adjustY

            let item = layout.items[drag.itemId]
            item = T.move(item, { x: svgPt.x, y: svgPt.y }, item.rotation)

            const snapPt = snap(layout, drag.itemId, item)
            item = T.move(item, snapPt.position, snapPt.direction)

            const modified = { ...layout }
            modified.items[drag.itemId] = item
            setLayout(modified)
            setDrag(null)
        }
    }

    const onKeyDown = (ev: React.KeyboardEvent) => {
        if (ev.key === "Escape" && drag) {
            ev.preventDefault()
            const item = layout.items[drag.itemId]
            const modified = { ...layout }
            modified.items[drag.itemId] = T.move(item, { x: drag.startX, y: drag.startY }, drag.startA)
            setLayout(modified)
            setDrag(null)
        }
        if (ev.key === "r" && drag) {
            ev.preventDefault()
            const item = layout.items[drag.itemId]
            const modified = { ...layout }
            modified.items[drag.itemId] = T.move(item, item.position, item.rotation + 7.5)
            setLayout(modified)
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
            <g transform="scale(1, -1)">
                {Object.entries(layout.items).map(([k, i]) => (
                    <TrackComponent key={k} track={i} onMouseDown={(e) => onMouseDown(k, e)} />
                ))}
            </g>
        </svg>
    )
}

export default SVGComponent
