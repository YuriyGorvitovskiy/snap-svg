import { add, boundingBox, Placement, point, Rectangle, scale } from "../geometry/type"
import Model, { curveR5, straight480 } from "../model/track"
import Joint from "./joint"

export default interface Track {
    readonly id: string
    readonly modelId: string
    readonly placement: Placement
    readonly joints: Joint[]
    readonly boundingBox: Rectangle
}

type PlaceReturn = Pick<Track, "placement" | "joints" | "boundingBox">

export const place = (track: Track, model: Model, placement: Placement): PlaceReturn => {
    const matrix = new DOMMatrixReadOnly()
        .translate(placement.pos.x, placement.pos.y)
        .rotate(0, 0, placement.dir)
        .translate(-model.centerPoint.x, -model.centerPoint.y)

    const corner1 = matrix.transformPoint(add(model.centerPoint, scale(model.size, -0.5)))
    const corner2 = matrix.transformPoint(add(model.centerPoint, scale(model.size, 0.5)))

    return {
        placement,
        joints: model.joints.map((joint, index) => ({
            placement: {
                pos: point(matrix.transformPoint(joint.pos)),
                dir: (placement.dir + joint.dir) % 360,
            },
            to: track?.joints[index].to,
        })),
        boundingBox: boundingBox(corner1, corner2),
    }
}

export const snap = (tracks: Track[], item: Track, model: Model, maxSnapDist: number): Placement => {
    return tracks
        .filter((t) => t.id != item.id)
        .flatMap((t) => t.joints)
        .reduce(
            (a, c) =>
                item.joints.reduce((ia, ic, ix) => {
                    const dx = c.placement.pos.x - ic.placement.pos.x
                    const dy = c.placement.pos.y - ic.placement.pos.y
                    const d = dx * dx + dy * dy
                    return d < ia.d
                        ? {
                              d,
                              p: {
                                  pos: point(
                                      new DOMMatrixReadOnly()
                                          .translate(c.placement.pos.x, c.placement.pos.y)
                                          .rotate(0, 0, (180 + c.placement.dir - model.joints[ix].dir) % 360)
                                          .translate(-model.joints[ix].pos.x, -model.joints[ix].pos.y)
                                          .transformPoint(model.centerPoint)
                                  ),
                                  dir: (180 + c.placement.dir - model.joints[ix].dir) % 360,
                              },
                          }
                        : ia
                }, a),
            { d: maxSnapDist * maxSnapDist, p: item.placement }
        ).p
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
