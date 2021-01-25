import * as P from "../data/geometry/path"
import { Color, Degree, Metre, Point } from "../data/geometry/type"
import * as C from "./connection"

export interface Model {
    id: string
    centerLine: P.Path
    centerPoint: Point
    color: Color
    interface: C.Location[]
    outline: P.Path
}

export interface Item {
    id: string
    model: Model
    position: Point
    rotation: Degree
    connections: C.Connection[]
    matrix: DOMMatrixReadOnly
}

export const straight = (id: string, length: Metre, width: Metre, color: Color): Model => {
    return {
        id,
        centerLine: [P.moveTo({ x: -length / 2, y: 0 }), P.lineTo({ x: length / 2, y: 0 })],
        centerPoint: { x: 0, y: 0 },
        color,
        interface: [
            {
                position: { x: -length / 2, y: 0 },
                direction: 180,
            },
            {
                position: { x: length / 2, y: 0 },
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

export const curve = (id: string, radius: Metre, angle: Degree, width: Metre, color: Color): Model => {
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
        centerLine: [P.moveTo(begin), P.arcTo(radius, angle < 0, end)],
        centerPoint: {
            x: Math.sin(radians / 2) * radius,
            y: (Math.cos(radians / 2) - 1) * radius,
        },
        color,
        interface: [
            {
                position: begin,
                direction: 180,
            },
            {
                position: end,
                direction: -angle,
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

export const place = (id: string, model: Model, position: Point, rotation: Degree): Item => {
    const matrix = new DOMMatrixReadOnly()
        .translate(position.x, position.y)
        .rotate(0, 0, rotation)
        .translate(-model.centerPoint.x, -model.centerPoint.y)

    return {
        id,
        model,
        position,
        rotation,
        connections: model.interface.map((i) => ({
            location: {
                position: matrix.transformPoint(i.position),
                direction: (rotation + i.direction) % 360,
            },
            info: null,
        })),
        matrix,
    }
}

export const move = (item: Item, position: Point, rotation: Degree): Item => {
    const moved = place(item.id, item.model, position, rotation)
    moved.connections.forEach((c, i) => {
        c.info = item.connections[i].info
    })
    return moved
}
