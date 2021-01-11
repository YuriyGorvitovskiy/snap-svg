import * as P from "../geometry/path"
import { Color, Degree, Metre, Point } from "../geometry/type"
import Connection from "./connection"

export interface Model {
    centerLine: P.Path
    centerPoint: Point
    color: Color
    connections: Connection[]
    outline: P.Path
}

export interface Instance {
    model: Model
    position: Point
    rotation: Degree
}

export const straight = (length: Metre, width: Metre, color: Color): Model => {
    return {
        centerLine: [P.moveTo({ x: -length / 2, y: 0 }), P.lineTo({ x: length / 2, y: 0 })],
        centerPoint: { x: 0, y: 0 },
        color,
        connections: [
            {
                position: { x: -length / 2, y: 0 },
                direction: 180,
            },
            {
                position: { x: -length / 2, y: 0 },
                direction: 0,
            },
        ],
        outline: [
            P.moveTo({ x: -length / 2, y: width / 2 }),
            P.lineTo({ x: length / 2, y: width / 2 }),
            P.lineTo({ x: length / 2, y: -width / 2 }),
            P.lineTo({ x: -length / 2, y: -width / 2 }),
            P.close(),
        ],
    }
}

export const curve = (radius: Metre, angle: Degree, width: Metre, color: Color): Model => {
    const radians = (Math.PI * angle) / 180
    const begin = {
        x: 0,
        y: 0,
    }

    const end = {
        x: Math.sin(radians) * radius,
        y: (Math.cos(radians) - 1) * radius,
    }

    return {
        centerLine: [P.moveTo(begin), P.arcTo(radius, angle < 0, end)],
        centerPoint: {
            x: Math.sin(radians / 2) * radius,
            y: (Math.cos(radians / 2) - 1) * radius,
        },
        color,
        connections: [
            {
                position: begin,
                direction: 0,
            },
            {
                position: end,
                direction: angle,
            },
        ],
        outline: [
            P.moveTo({ x: begin.x, y: begin.y - width / 2 }),
            P.arcTo(radius - width / 2, angle < 0, {
                x: Math.sin(radians) * (radius - width / 2),
                y: (Math.cos(radians) - 1) * (radius - width / 2) - width / 2,
            }),
            P.lineTo({
                x: Math.sin(radians) * (radius + width / 2),
                y: (Math.cos(radians) - 1) * (radius + width / 2) + width / 2,
            }),
            P.arcTo(radius + width / 2, angle > 0, {
                x: begin.x,
                y: begin.y + width / 2,
            }),
            P.close(),
        ],
    }
}
