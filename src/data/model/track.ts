import * as Path from "../geometry/path"
import { Color, Degree, Meter, Placement, Point } from "../geometry/type"

export default interface Track {
    readonly id: string
    readonly centerPoint: Point
    readonly centerLine: Path.Path
    readonly outLine: Path.Path
    readonly color: Color
    readonly joints: Placement[]
}

export const straight = (id: string, length: Meter, width: Meter, color: Color): Track => {
    return {
        id,
        centerLine: [Path.moveTo({ x: -length / 2, y: 0 }), Path.lineTo({ x: length / 2, y: 0 })],
        centerPoint: { x: 0, y: 0 },
        color,
        joints: [
            {
                pos: { x: -length / 2, y: 0 },
                dir: 180,
            },
            {
                pos: { x: length / 2, y: 0 },
                dir: 0,
            },
        ],
        outLine: [
            Path.moveTo({ x: -length / 2, y: width / 2 }),
            Path.lineTo({ x: length / 2, y: width / 2 }),
            Path.lineTo({ x: length / 2, y: -width / 2 }),
            Path.lineTo({ x: -length / 2, y: -width / 2 }),
            Path.close(),
        ],
    }
}

export const curve = (id: string, radius: Meter, angle: Degree, width: Meter, color: Color): Track => {
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
        id,
        centerLine: [Path.moveTo(begin), Path.arcTo(radius, angle < 0, end)],
        centerPoint: {
            x: Math.sin(radians / 2) * radius,
            y: (Math.cos(radians / 2) - 1) * radius,
        },
        color,
        joints: [
            {
                pos: begin,
                dir: 180,
            },
            {
                pos: end,
                dir: -angle,
            },
        ],
        outLine: [
            Path.moveTo({ x: begin.x, y: begin.y - width / 2 }),
            Path.arcTo(radius - width / 2, angle < 0, {
                x: Math.sin(radians) * (radius - width / 2),
                y: (Math.cos(radians) - 1) * (radius - width / 2) - width / 2,
            }),
            Path.lineTo({
                x: Math.sin(radians) * (radius + width / 2),
                y: (Math.cos(radians) - 1) * (radius + width / 2) + width / 2,
            }),
            Path.arcTo(radius + width / 2, angle > 0, {
                x: begin.x,
                y: begin.y + width / 2,
            }),
            Path.close(),
        ],
    }
}

export const straight480 = straight("S480", 48, 9, "orange")

export const curveR5 = curve("R5", 120, 22.5, 9, "#1F45FC")
