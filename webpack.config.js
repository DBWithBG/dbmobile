const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode: 'development',
    entry: './www/js/main.js',
    output: {
        path: __dirname + '/www/js',
        filename: 'bundle.js',
    },
    devServer: {
        publicPath: '/js/',
        contentBase: __dirname + '/www',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]

    },
    plugins: [
        new VueLoaderPlugin()
    ],
    resolve: {
        alias: { vue: 'vue/dist/vue.js' }
    }
};