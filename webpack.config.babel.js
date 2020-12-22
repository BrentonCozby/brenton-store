import path from 'path'

export const entry = {
  bundle: path.resolve(__dirname, 'src', 'index.js'),
}

export const output = {
  path: path.resolve(__dirname, 'dist'),
  filename: 'brenton-store.min.js',
}

export const module = {
  rules: [{
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: ['babel-loader'],
  }],
}

export const resolve = {
  alias: {
    src: path.resolve(__dirname, 'src'),
  },
}
