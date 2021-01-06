import React from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "100%",
    },
}));

export default () => {
    const classes = useStyles();

    return (
        <svg className={classes.root} viewBox="-100 -100 200 200" >
            <circle cx="0" cy="0" r="50" />
        </svg>
    );
}
