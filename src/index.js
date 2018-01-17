import cloneDeep from 'lodash.cloneDeep'

const createStore = function (initialState) {
    let store = initialState || {}

    const eventHandlers = {}

    const getState = () => cloneDeep(store)
    
    const getStateAt = (path) => path.reduce((node, key) => node[key], getState())
    
    const trigger = (type) => {
        if (eventHandlers[type]) {
            Object.values(eventHandlers[type]).forEach(handler => handler({state: getState()))
        }
    }
    
    const update = (type, payload) => {
        const prevState = getState()
        const nextState = getState()
        
        store = nextState

        if (eventHandlers[type]) {
            Object.values(eventHandlers[type]).forEach(handler => handler({
                nextState,
                prevState,
            }))
        }
    }

    const updateAt = (path, type, payload) => {
        if (!Array.isArray(path) && path.some(key => typeof key !== 'string')) {
            throw Error('path must be an array of strings. Path received: ' + path)
        }

        let prevState = getState()
        let newStore = getState()
        let node = newStore
        let i = 0

        for (i; i < path.length - 1; i += 1) {
            if (!hasOwnProperty.call(node, path[i])) {
                node[path[i]] = {}
            }

            node = node[path[i]]
        }

        node[path[i]] = cloneDeep(payload)
        
        store = newStore

        if (eventHandlers[type]) {
            Object.values(eventHandlers[type]).forEach(handler => handler({
                nextState: getState(),
                prevState,
            }))
        }
    }

    const subscribe = function (type, handler) {
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
        getStateAt,
        trigger,
        update,
        updateAt,
        subscribe,
    }
}

export default createStore
