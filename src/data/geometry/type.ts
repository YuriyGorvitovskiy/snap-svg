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
