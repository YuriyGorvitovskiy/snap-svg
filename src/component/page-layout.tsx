import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Divider from "@material-ui/core/Divider"
import React from "react"
import LibraryComponent from "./library"
import Footbar from "./footbar"
import LayoutComponent from "./layout"
import Toolbar from "./toolbar"

const useStyles = makeStyles(() => ({
    main: {
        position: "absolute",
        top: "48px",
        left: 0,
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
                <Grid item style={{ width: "256px", overflowY: "scroll" }}>
                    <LibraryComponent />
                </Grid>
                <Divider orientation="vertical" flexItem />
                <LayoutComponent />
            </Grid>
            <Footbar />
        </React.Fragment>
    )
}

export default PageLayout
