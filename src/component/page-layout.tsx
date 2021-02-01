import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Divider from "@material-ui/core/Divider"
import React from "react"
import Drawer from "./Drawer"
import Footbar from "./footbar"
import LayoutComponent from "./layout"
import Toolbar from "./toolbar"

const useStyles = makeStyles(() => ({
    main: {
        flex: "1",
        position: "absolute",
        top: "48px",
        bottom: "20px",
        width: "100%",
        minWidth: 0,
        flexDirection: "row",
        flexWrap: "nowrap",
    },
}))

const PageLayout: React.FunctionComponent<unknown> = () => {
    const classes = useStyles()

    return (
        <React.Fragment>
            <Toolbar />
            <Grid container className={classes.main}>
                <Grid item style={{ width: "240px", height: "100%" }} />
                <Divider orientation="vertical" flexItem />
                <LayoutComponent />
            </Grid>
            <Footbar />
        </React.Fragment>
    )
}

export default PageLayout
