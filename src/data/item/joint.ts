import { Placement } from "../geometry/type"

export default interface Joint {
    readonly placement: Placement
    readonly to: {
        readonly itemId: string
        readonly jointIx: number
    }
}
