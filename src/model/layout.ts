import * as C from "./connection"
import * as T from "./track"

export interface Layout {
    model: { [id: string]: T.Model }
    items: { [id: string]: T.Item }
}

export const connections = (layout: Layout, filter: (i: [string, T.Item]) => boolean): C.Connection[] => {
    return Object.entries(layout.items)
        .filter((e) => filter(e))
        .flatMap(([, i]) => i.connections)
}

export const openConnection = (layout: Layout, filter: (i: [string, T.Item]) => boolean): C.Connection[] => {
    return connections(layout, filter).filter((c) => null == c.info)
}
