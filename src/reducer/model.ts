import ReduxToolkit from "@reduxjs/toolkit"

import Model from "../data/model/track"

export const adapter = ReduxToolkit.createEntityAdapter<Model>({})

export const slice = ReduxToolkit.createSlice({
    name: "model",
    initialState: adapter.getInitialState(),
    reducers: {
        add: adapter.addOne,
        remove: adapter.removeOne,
    },
})
