import { nanoid } from "@reduxjs/toolkit"
import { Placement } from "../data/geometry/type"

export interface AddTrack {
    type: "AddTrack"
    id: string
    placement: Placement
}

export const addTrack = (placement: Placement): AddTrack => {
    return {
        type: "AddTrack",
        id: nanoid(),
        placement,
    }
}

export interface MoveTrack {
    type: "MoveTrack"
    id: string
    placement: Placement
}

export const moveTrack = (id: string, placement: Placement): MoveTrack => {
    return {
        type: "MoveTrack",
        id,
        placement,
    }
}
