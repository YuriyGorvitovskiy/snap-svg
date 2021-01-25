import { Placement } from "../geometry/type"
import Joint from "./joint"

export default interface Track {
    readonly id: string
    readonly modelId: string
    readonly placement: Placement
    readonly joints: Joint[]
    readonly matrix: DOMMatrixReadOnly
}
