import cloneDeep from 'lodash.clonedeep'
import {
  validateParamString,
  validateParamFunction,
  validateParamArrayOfStrings,
} from './util/validation'

const createStore = function (initialState) {
  let state = initialState || {}

  const eventHandlers = {}

  const getState = () => cloneDeep(state)

  const emit = (type) => {
    validateParamString({ name: 'type', value: type })

    if (eventHandlers[type]) {
      Object.values(eventHandlers[type]).forEach(handler => handler(getState(), getState()))
    }
  }

  const setState = (type, payload) => {
    validateParamString({ name: 'type', value: type })

    const prevState = getState()
    const nextState = payload

    state = nextState

    if (eventHandlers[type]) {
      Object.values(eventHandlers[type]).forEach(handler => handler(nextState, prevState))
    }
  }

  const setStateAt = (path, type, payload) => {
    validateParamArrayOfStrings({ name: 'path', value: path })
    validateParamString({ name: 'type', value: type })

    const prevState = getState()
    const newState = getState()

    const lastPathKey = path[path.length - 1]
    const targetNode = path.reduce((nodePointer, pathKey, i) => {
      if (!hasOwnProperty.call(nodePointer, pathKey)) {
        nodePointer[pathKey] = {} // eslint-disable-line no-param-reassign
      }

      if (i === path.length - 1) {
        return nodePointer
      }

      return nodePointer[pathKey]
    }, newState)

    targetNode[lastPathKey] = cloneDeep(payload)

    state = newState

    if (eventHandlers[type]) {
      Object.values(eventHandlers[type]).forEach(handler => handler(getState(), prevState))
    }
  }

  const subscribe = function (type, handler) {
    validateParamString({ name: 'type', value: type })
    validateParamFunction({ name: 'handler', value: handler })

    if (!eventHandlers[type]) {
      eventHandlers[type] = {}
    }

    let key = 0

    while (eventHandlers[type][key]) {
      key += 1
    }

    eventHandlers[type][key] = handler

    this.unsubscribe = () => delete eventHandlers[type][key]

    return this
  }

  return {
    getState,
    emit,
    setState,
    setStateAt,
    subscribe,
  }
}

export default createStore
