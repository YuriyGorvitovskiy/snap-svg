import { Placement } from "../geometry/type"
import Model, { curveR5, straight480 } from "../model/track"
import Joint from "./joint"

export default interface Track {
    readonly id: string
    readonly modelId: string
    readonly placement: Placement
    readonly joints: Joint[]
    readonly matrix: DOMMatrixReadOnly
}

type PlaceReturn = Pick<Track, "placement" | "joints" | "matrix">

export const place = (track: Track, model: Model, placement: Placement): PlaceReturn => {
    const matrix = new DOMMatrixReadOnly()
        .translate(placement.pos.x, placement.pos.y)
        .rotate(0, 0, placement.dir)
        .translate(-model.centerPoint.x, -model.centerPoint.y)

    return {
        placement,
        joints: model.joints.map((joint, index) => ({
            placement: {
                pos: matrix.transformPoint(joint.pos),
                dir: (placement.dir + joint.dir) % 360,
            },
            to: track?.joints[index].to,
        })),
        matrix,
    }
}

export const s1: Track = {
    id: "s1",
    modelId: straight480.id,
    ...place(null, straight480, { pos: { x: -24, y: -20 }, dir: 0 }),
}
export const s2: Track = {
    id: "s2",
    modelId: straight480.id,
    ...place(null, straight480, { pos: { x: -30, y: 30 }, dir: 30 }),
}

export const r1: Track = {
    id: "r1",
    modelId: curveR5.id,
    ...place(null, curveR5, { pos: { x: 0, y: 0 }, dir: 0 }),
}
export const r2: Track = {
    id: "r2",
    modelId: curveR5.id,
    ...place(null, curveR5, { pos: { x: 30, y: 30 }, dir: 0 }),
}
