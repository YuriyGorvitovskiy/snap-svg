import MuiPaper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/styles"
import React from "react"

const drawerWidth = "256px"
const useStyles = makeStyles(() => ({
    drawer: {
        height: "100%",
        width: drawerWidth,
    },
}))

const Drawer: React.FunctionComponent<unknown> = () => {
    const classes = useStyles()
    return <MuiPaper className={classes.drawer} />
}

export default Drawer
