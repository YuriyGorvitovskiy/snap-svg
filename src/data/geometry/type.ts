export type Meter = number
export type Degree = number
export type Color = string

export interface Point {
    x: Meter
    y: Meter
}

export interface Rectangle {
    min: Point
    max: Point
}

export interface Placement {
    pos: Point
    dir: Degree
}

export const point = (pt: SVGPoint | DOMPoint | Point): Point => ({
    x: pt.x,
    y: pt.y,
})

export const add = (pt: SVGPoint | DOMPoint | Point, vt: SVGPoint | DOMPoint | Point): Point => ({
    x: pt.x + vt.x,
    y: pt.y + vt.y,
})

export const direction = (from: SVGPoint | DOMPoint | Point, to: SVGPoint | DOMPoint | Point): Point => ({
    x: to.x - from.x,
    y: to.y - from.y,
})

export const scale = (vt: SVGPoint | DOMPoint | Point, factor: number): Point => ({
    x: vt.x * factor,
    y: vt.y * factor,
})

export const inverse = (vt: SVGPoint | DOMPoint | Point): Point => ({
    x: -vt.x,
    y: -vt.y,
})

export const boundingBox = (...points: (SVGPoint | DOMPoint | Point)[]): Rectangle => ({
    min: {
        x: Math.min(...points.map((c) => c.x)),
        y: Math.min(...points.map((c) => c.y)),
    },
    max: {
        x: Math.max(...points.map((c) => c.x)),
        y: Math.max(...points.map((c) => c.y)),
    },
})

export const center = (rect: Rectangle): Point => ({
    x: (rect.min.x + rect.max.x) / 2,
    y: (rect.min.y + rect.max.y) / 2,
})

export const size = (rect: Rectangle): Point => direction(rect.min, rect.max)
