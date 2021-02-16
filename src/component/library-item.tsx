import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import React from "react"
import * as Path from "../data/geometry/path"
import Model from "../data/model/track"
import { SELECTED_BG } from "../style/color"

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1),
        flex: 1,
        width: "240px",
        height: "180px",
    },
    selected: {
        backgroundColor: SELECTED_BG,
    },
    svg: {
        width: "208px",
        height: "156px",
    },
}))

interface Params {
    item: Model
    selected: boolean
    onClick: () => void
}
const LibraryItemComponent: React.FunctionComponent<Params> = ({ item, selected, onClick }: Params) => {
    const classes = useStyles()
    const left = item.centerPoint.x - item.size.x / 2
    const top = item.centerPoint.y - item.size.y / 2
    return (
        <Card className={classes.root + (selected ? " " + classes.selected : "")} onClick={onClick}>
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
