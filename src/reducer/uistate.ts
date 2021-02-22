import * as ReduxToolkit from "@reduxjs/toolkit"
import { Point, add } from "../data/geometry/type"
import { SelectLayoutItem, SelectLibraryItem, PanLayout, ZoomLayout } from "./actions"

export interface State {
    readonly selection: {
        readonly libraryModelId: string
        readonly layoutTrackId: string
    }
    readonly layoutCenter: Point
    readonly layoutZoom: number
}
const initialState: State = {
    selection: {
        libraryModelId: null,
        layoutTrackId: null,
    },
    layoutCenter: { x: 0, y: 0 },
    layoutZoom: 200,
}

export const slice = ReduxToolkit.createSlice({
    name: "uistate",
    initialState: initialState,
    reducers: {
        SelectLibraryItem: (s: State, a: SelectLibraryItem): State => ({
            ...s,
            selection: {
                libraryModelId: a.payload.modelId,
                layoutTrackId: null,
            },
        }),
        SelectLayoutItem: (s: State, a: SelectLayoutItem): State => ({
            ...s,
            selection: {
                libraryModelId: null,
                layoutTrackId: a.payload.trackId,
            },
        }),
        PanLayout: (s: State, a: PanLayout): State => ({
            ...s,
            layoutCenter: a.payload.center,
        }),
        ZoomLayout: (s: State, a: ZoomLayout): State => ({
            ...s,
            layoutCenter: a.payload.center,
            layoutZoom: a.payload.zoom,
        }),
    },
})
