module.exports = {
    mode: 'development',
    devtool: 'none',
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname + '/out',
        filename: 'bundle.js',
        publicPath: ''
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    // options: {
                    //     presets: ['@babel/preset-env']
                    // }
                }
            }
        ]
    }
}