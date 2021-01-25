import ReduxToolkit from "@reduxjs/toolkit"
import reduceReducers from "reduce-reducers"
import Redux from "redux"
import { Placement } from "../data/geometry/type"
import * as Model from "./model"
import * as Track from "./track"

const combinedReducer = Redux.combineReducers({
    models: Model.slice.reducer,
    tracks: Track.slice.reducer,
})
export interface State {
    models: ReturnType<typeof Model.slice.reducer>
    tracks: ReturnType<typeof Track.slice.reducer>
}
const addTrack = (
    state: State,
    action: ReduxToolkit.ActionCreatorWithPayload<{ id: string; modelId: string; placement: Placement }>
): State => {
    const model = Model.adapter.getSelectors().selectById(state.models, action.arguments.modelId)
    return {
        ...state,
        tracks: Track.adapter.addOne(state.tracks, {
            id: action.arguments.id,
            modelId: model.id,
            ...Track.place(null, model, action.arguments.placement),
        }),
    }
}

const moveTrack = (
    state: State,
    action: ReduxToolkit.ActionCreatorWithPayload<{ id: string; placement: Placement }>
): State => {
    const track = Track.adapter.getSelectors().selectById(state.tracks, action.arguments.id)
    const model = Model.adapter.getSelectors().selectById(state.models, track.modelId)
    return {
        ...state,
        tracks: Track.adapter.updateOne(state.tracks, {
            id: action.arguments.id,
            changes: Track.place(track, model, action.arguments.placement),
        }),
    }
}

const featuresReducer = ReduxToolkit.createReducer(
    {},
    {
        AddTrack: addTrack,
        MoveTrack: moveTrack,
    }
)

export const store = ReduxToolkit.configureStore({
    reducer: reduceReducers(combinedReducer, featuresReducer),
})
