import * as G from "../data/geometry/type"

export interface Location {
    position: G.Point
    direction: G.Degree
}

export interface Info {
    item: string
    number: number
}

export interface Connection {
    location: Location
    info: Info
}
