import { Metre, Point } from "./type"

export interface Element {
    svg: string
}

export const arcTo = (radius: Metre, clockwise: boolean, to: Point): Element => {
    return { svg: "A " + radius + "," + radius + (clockwise ? " 0,0,1 " : " 0,0,0 ") + to.x + "," + to.y }
}

export const lineTo = (to: Point): Element => {
    return { svg: "L " + to.x + "," + to.y }
}

export const moveTo = (to: Point): Element => {
    return { svg: "M " + to.x + "," + to.y }
}

export const close = (): Element => {
    return { svg: "Z" }
}

export type Path = Element[]

export const toSVG = (path: Path): string => {
    return path.reduce((a, e) => (a ? a + " " : a) + e.svg, "")
}
