export const validateParamString = ({ name, value }) => {
  if (typeof value !== 'string') {
    throw new TypeError(`"${name}" must be a string. "${name}" received: ${String(value)}`)
  }
}

export const validateParamFunction = ({ name, value }) => {
  if (typeof value !== 'function') {
    throw new TypeError(`"${name}" must be a function. "${name}" received: ${String(value)}`)
  }
}

export const validateParamArrayOfStrings = ({ name, value }) => {
  if (
    typeof value !== 'object' ||
    Object.prototype.toString.call(value) !== '[object Array]' ||
    value.length === 0 ||
    value.some(key => typeof key !== 'string')
  ) {
    throw new TypeError(`"${name}" must be a non-empty array of strings. "${name}" received: ${String(value)}`)
  }
}

export default {
  validateParamString,
  validateParamFunction,
  validateParamArrayOfStrings,
}
