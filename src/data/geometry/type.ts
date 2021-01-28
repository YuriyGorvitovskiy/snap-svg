export type Meter = number
export type Degree = number
export type Color = string

export interface Point {
    x: Meter
    y: Meter
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

export const inverse = (vt: SVGPoint | DOMPoint | Point): Point => ({
    x: -vt.x,
    y: -vt.y,
})
