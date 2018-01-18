const { join } = require('path')

module.exports = {
    entry: {
        bundle: [`./${join('src', 'index.js')}`],
    },
    output: {
        filename: `./${join('dist', 'brenton-store.min.js')}`,
        publicPath: '/',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['env', { modules: false }],
                        'stage-0',
                    ],
                },
            }],
        }],
    },
}
