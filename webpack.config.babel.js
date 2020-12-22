import { resolve } from 'path'

export const entry = {
  bundle: resolve(__dirname, 'src', 'index.js'),
}

export const output = {
  path: resolve(__dirname, 'dist'),
  filename: 'brenton-store.min.js',
}

export const module = {
  rules: [{
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: ['babel-loader'],
  }],
}
