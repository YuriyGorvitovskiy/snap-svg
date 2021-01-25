import { Path } from "../geometry/path"
import { Color, Placement, Point } from "../geometry/type"

export default interface Track {
    readonly id: string
    readonly centerPoint: Point
    readonly centerLine: Path
    readonly outLine: Path
    readonly color: Color
    readonly joints: Placement[]
}
