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
