import { nanoid } from "@reduxjs/toolkit"
import { Placement, Point } from "../data/geometry/type"

export interface AddTrack {
    type: "AddTrack"
    payload: {
        id: string
        modelId: string
        placement: Placement
    }
}

export const addTrack = (modelId: string, placement: Placement): AddTrack => {
    return {
        type: "AddTrack",
        payload: {
            id: nanoid(),
            modelId,
            placement,
        },
    }
}

export interface MoveTrack {
    type: "MoveTrack"
    payload: {
        id: string
        placement: Placement
    }
}

export const moveTrack = (id: string, placement: Placement): MoveTrack => {
    return {
        type: "MoveTrack",
        payload: {
            id,
            placement,
        },
    }
}

export interface SelectLibraryItem {
    type: "uistate/SelectLibraryItem"
    payload: {
        modelId: string
    }
}

export const selectLibraryItem = (modelId: string): SelectLibraryItem => {
    return {
        type: "uistate/SelectLibraryItem",
        payload: {
            modelId,
        },
    }
}

export interface SelectLayoutItem {
    type: "uistate/SelectLayoutItem"
    payload: {
        trackId: string
    }
}

export const selectLayoutItem = (trackId: string): SelectLayoutItem => {
    return {
        type: "uistate/SelectLayoutItem",
        payload: {
            trackId,
        },
    }
}

export interface PanLayout {
    type: "uistate/PanLayout"
    payload: {
        center: Point
    }
}

export const panLayout = (center: Point): PanLayout => {
    return {
        type: "uistate/PanLayout",
        payload: {
            center,
        },
    }
}

export interface ZoomLayout {
    type: "uistate/ZoomLayout"
    payload: {
        center: Point
        zoom: number
    }
}

export const zoomLayout = (zoom: number, center: Point): ZoomLayout => {
    return {
        type: "uistate/ZoomLayout",
        payload: {
            center,
            zoom,
        },
    }
}
