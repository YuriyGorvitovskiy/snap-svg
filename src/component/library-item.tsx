import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import React from "react"
import Model from "../data/model/track"
import * as Path from "../data/geometry/path"
import { ListItem } from "material-ui"

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1),
        flex: 1,
        width: "240px",
        height: "180px",
    },
    svg: {
        width: "208px",
        height: "156px",
    },
}))

interface Params {
    item: Model
}
const LibraryItemComponent: React.FunctionComponent<Params> = (params) => {
    const { item } = params
    const classes = useStyles()
    const left = item.centerPoint.x - item.size.x / 2
    const top = item.centerPoint.y - item.size.y / 2
    return (
        <Card className={classes.root}>
            <CardContent>
                <svg
                    className={classes.svg}
                    viewBox={`${left - 1} ${top - 1} ${item.size.x + 2} ${item.size.y + 2}`}
                    transform="scale(1, -1)"
                >
                    <g>
                        <path d={Path.toSVG(item.outLine)} fill={item.color} strokeWidth={0.25} stroke="black" />
                        <path d={Path.toSVG(item.centerLine)} fill="none" strokeWidth={0.25} stroke="black" />
                    </g>
                </svg>
                <Typography variant="h4" align="center">
                    {item.id}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default LibraryItemComponent
