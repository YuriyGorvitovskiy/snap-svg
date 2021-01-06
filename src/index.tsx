import React from "react";
import ReactDOM from "react-dom";

import { ThemeProvider } from "@material-ui/core/styles";
import Layout from "./component/page-layout";
import theme from "./style/theme";

const App = () =>
    <ThemeProvider theme={theme}>
        <Layout />
    </ThemeProvider>

ReactDOM.render(<App />, document.getElementById("root"));
