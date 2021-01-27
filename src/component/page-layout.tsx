import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import React, { FunctionComponent } from "react"
import LayoutComponent from "./layout"

const useStyles = makeStyles(() => ({
    root: {
        flexDirection: "column",
        height: "100%",
        left: 0,
        position: "absolute",
        top: 0,
        width: "100%",
    },
    main: {
        flex: "1",
        height: "100%",
        minWidth: 0,
    },
}))

const PageLayout: FunctionComponent<unknown> = () => {
    const classes = useStyles()

    return (
        <Grid container className={classes.root}>
            <Grid item>
                <h1>Hello, SVG!</h1>
            </Grid>
            <Grid item className={classes.main}>
                {/*<SvgView />*/}
                <LayoutComponent />
            </Grid>
        </Grid>
    )
}

export default PageLayout
