export type Metre = number
export type Degree = number
export type Color = string

export interface Point {
    x: Metre
    y: Metre
}

export interface Placement {
    pos: Point
    dir: Degree
}
