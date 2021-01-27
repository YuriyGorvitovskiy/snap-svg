const CopyPlugin = require("copy-webpack-plugin")
const path = require("path")

const destDir = "build/web/"
module.exports = {
    mode: "development",
    target: "web",
    entry: "./src/index.tsx",
    devtool: "source-map",
    output: {
        filename: "snap-svg-bundle.js",
        path: path.resolve(__dirname, destDir),
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"],
    },

    module: {
        rules: [
            // All files with a '.ts' and '.tsx' extensions will be handled by 'ts-loader'.
            {
                test: /\.(ts|tsx)$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },

    devServer: {
        contentBase: path.join(__dirname, destDir),
        compress: true,
        port: 9999,
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between
    // builds.
    externals: [],

    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "src/*.html",
                    to: "[name].[ext]",
                    toType: "template",
                },
            ],
        }),
    ],
}
