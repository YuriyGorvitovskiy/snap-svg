import React from "react";

import Grid from "@material-ui/core/Grid";

import { makeStyles } from '@material-ui/core/styles';

import SvgView from "./svg-view";

const useStyles = makeStyles((theme) => ({
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
}));

export default () => {
    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item>
                <h1>Hello, Webpack!</h1>
            </Grid>
            <Grid item className={classes.main}>
                <SvgView />
            </Grid>
        </Grid>
    );
}