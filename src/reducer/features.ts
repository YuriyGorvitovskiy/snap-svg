import * as ReduxToolkit from "@reduxjs/toolkit"
import * as Action from "./actions"
import * as Model from "./model"
import State from "./state"
import * as Track from "./track"
import { place } from "../data/item/track"

const addTrack = (state: State, action: Action.AddTrack): State => {
    const model = Model.adapter.getSelectors().selectById(state.models, action.payload.modelId)
    return {
        ...state,
        tracks: Track.adapter.addOne(state.tracks, {
            id: action.payload.id,
            modelId: model.id,
            ...place(null, model, action.payload.placement),
        }),
    }
}

const moveTrack = (state: State, action: Action.MoveTrack): void => {
    const track = Track.adapter.getSelectors().selectById(state.tracks, action.payload.id)
    const model = Model.adapter.getSelectors().selectById(state.models, track.modelId)

    state.tracks = Track.adapter.updateOne(state.tracks, {
        id: action.payload.id,
        changes: place(track, model, action.payload.placement),
    })
}

const featuresReducer = ReduxToolkit.createReducer(
    {},
    {
        AddTrack: addTrack,
        MoveTrack: moveTrack,
    }
)
export default featuresReducer
