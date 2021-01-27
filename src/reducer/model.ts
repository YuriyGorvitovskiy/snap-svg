import * as ReduxToolkit from "@reduxjs/toolkit"
import Model, { straight480, curveR5 } from "../data/model/track"

export const adapter = ReduxToolkit.createEntityAdapter<Model>({})

const initialState = adapter.upsertMany(adapter.getInitialState(), [straight480, curveR5])

export const slice = ReduxToolkit.createSlice({
    name: "model",
    initialState: initialState,
    reducers: {
        add: adapter.addOne,
        remove: adapter.removeOne,
    },
})
