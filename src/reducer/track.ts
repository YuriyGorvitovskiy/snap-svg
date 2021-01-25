import ReduxToolkit from "@reduxjs/toolkit"
import { Placement } from "../data/geometry/type"
import Track from "../data/item/track"
import Model from "../data/model/track"

export const adapter = ReduxToolkit.createEntityAdapter<Track>({})

export const slice = ReduxToolkit.createSlice({
    name: "track",
    initialState: adapter.getInitialState(),
    reducers: {
        addOne: adapter.addOne,
        removeOne: adapter.removeOne,
        updateOne: adapter.updateOne,
    },
})

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
