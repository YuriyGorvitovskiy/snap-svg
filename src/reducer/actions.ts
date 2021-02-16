import { nanoid } from "@reduxjs/toolkit"
import { Placement } from "../data/geometry/type"

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
    type: "selection/SelectLibraryItem"
    payload: {
        modelId: string
    }
}

export const selectLibraryItem = (modelId: string): SelectLibraryItem => {
    return {
        type: "selection/SelectLibraryItem",
        payload: {
            modelId,
        },
    }
}

export interface SelectLayoutItem {
    type: "selection/SelectLayoutItem"
    payload: {
        trackId: string
    }
}

export const selectLayoutItem = (trackId: string): SelectLayoutItem => {
    return {
        type: "selection/SelectLayoutItem",
        payload: {
            trackId,
        },
    }
}
