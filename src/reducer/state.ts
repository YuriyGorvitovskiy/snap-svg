import * as Model from "./model"
import * as Track from "./track"

export default interface State {
    models: ReturnType<typeof Model.slice.reducer>
    tracks: ReturnType<typeof Track.slice.reducer>
}
