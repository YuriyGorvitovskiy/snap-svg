import ReduxToolkit from "@reduxjs/toolkit"
import reduceReducers from "reduce-reducers"
import Redux from "redux"
import featuresReducer from "./features"
import * as Model from "./model"
import * as Track from "./track"

const combinedReducer = Redux.combineReducers({
    models: Model.slice.reducer,
    tracks: Track.slice.reducer,
})

export const store = ReduxToolkit.configureStore({
    reducer: reduceReducers(combinedReducer, featuresReducer),
})
