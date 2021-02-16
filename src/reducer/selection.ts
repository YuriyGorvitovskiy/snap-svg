import * as ReduxToolkit from "@reduxjs/toolkit"
import { SelectLayoutItem, SelectLibraryItem } from "./actions"

export interface State {
    readonly libraryModelId: string
    readonly layoutTrackId: string
}
const initialState: State = {
    libraryModelId: null,
    layoutTrackId: null,
}

export const slice = ReduxToolkit.createSlice({
    name: "selection",
    initialState: initialState,
    reducers: {
        SelectLibraryItem: (s: State, a: SelectLibraryItem): State => ({
            libraryModelId: a.payload.modelId,
            layoutTrackId: null,
        }),
        SelectLayoutItem: (s: State, a: SelectLayoutItem): State => ({
            libraryModelId: null,
            layoutTrackId: a.payload.trackId,
        }),
    },
})
