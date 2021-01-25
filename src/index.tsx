import React from "react"
import ReactDOM from "react-dom"
import * as ReactRedux from "react-redux"

import { ThemeProvider } from "@material-ui/core/styles"
import Layout from "./component/page-layout"
import theme from "./style/theme"

import { store } from "./reducer/root"

const App = () => (
    <ReactRedux.Provider store={store}>
        <ThemeProvider theme={theme}>
            <Layout />
        </ThemeProvider>
    </ReactRedux.Provider>
)

ReactDOM.render(<App />, document.getElementById("root"))
