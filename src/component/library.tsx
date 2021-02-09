import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import * as ReactRedux from "react-redux"
import * as ModelSlice from "../reducer/model"
import State from "../reducer/state"
import Item from "./library-item"

const useStyles = makeStyles(() => ({
    root: {
        width: "100%",
    },
}))

const LibraryComponent: React.FunctionComponent<unknown> = () => {
    const classes = useStyles()
    const models = ReactRedux.useSelector((s: State) => ModelSlice.adapter.getSelectors().selectAll(s.models))

    return (
        <Grid container direction="column" className={classes.root}>
            {models.map((m) => (
                <Item key={m.id} item={m}>
                    {m.id}
                </Item>
            ))}
        </Grid>
    )
}

export default LibraryComponent
