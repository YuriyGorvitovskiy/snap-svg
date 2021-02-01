import { grey } from "@material-ui/core/colors"
import MuiAppBar from "@material-ui/core/AppBar"
import MuiToolbar from "@material-ui/core/Toolbar"
import MuiTypography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/styles"
import React from "react"

const useStyles = makeStyles(() => ({
    root: {
        background: grey[500],
        color: "white",
        top: "auto",
        bottom: 0,
    },
    toolbar: {
        minHeight: "24px",
        paddingLeft: "12px",
        paddingRight: "12px",
    },
    title: {
        flexGrow: 1,
        textAlign: "right",
    },
}))

const Footbar: React.FunctionComponent<unknown> = () => {
    const classes = useStyles()
    return (
        <MuiAppBar position="fixed" className={classes.root}>
            <MuiToolbar className={classes.toolbar}>
                <MuiTypography variant="body2" className={classes.title}>
                    v.1.0.0
                </MuiTypography>
            </MuiToolbar>
        </MuiAppBar>
    )
}

export default Footbar
