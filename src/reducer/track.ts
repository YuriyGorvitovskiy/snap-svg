import * as ReduxToolkit from "@reduxjs/toolkit"
import Track, { r1, r2, s1, s2 } from "../data/item/track"

export const adapter = ReduxToolkit.createEntityAdapter<Track>({})

const initialState = adapter.upsertMany(adapter.getInitialState(), [s1, s2, r1, r2])

export const slice = ReduxToolkit.createSlice({
    name: "track",
    initialState: initialState,
    reducers: {
        addOne: adapter.addOne,
        removeOne: adapter.removeOne,
        updateOne: adapter.updateOne,
    },
})
