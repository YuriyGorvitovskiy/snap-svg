import React from "react"
import MUIAppBar from "@material-ui/core/AppBar"
import MUIToolbar from "@material-ui/core/Toolbar"
import MUITypography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles(() => ({
    title: {
        flexGrow: 1,
    },
}))

const Toolbar: React.FunctionComponent<unknown> = () => {
    const classes = useStyles()
    return (
        <MUIAppBar position="fixed">
            <MUIToolbar variant="dense">
                <MUITypography variant="h6" className={classes.title}>
                    Snap Layout
                </MUITypography>
            </MUIToolbar>
        </MUIAppBar>
    )
}

export default Toolbar
