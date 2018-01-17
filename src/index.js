import cloneDeep from 'lodash.cloneDeep'

const createStore = function ({ initialStore }) {
    let store = initialStore || {}

    const eventHandlers = {}

    function getStore(path) {
        if (path) {
            return path.reduce((node, key) => node[key], cloneDeep(store))
        }

        return cloneDeep(store)
    }

    function update({ type, data, path }) {
        let node = cloneDeep(store)
        let i = 0

        for (i; i < path.length - 1; i += 1) {
            const key = path[i]

            if (!hasOwnProperty.call(node, key)) {
                node[key] = {}
            }

            node = node[key]
        }

        if (path) {
            node[path[i]] = cloneDeep(data)
        } else {
            store = cloneDeep(data)
        }

        Object.values(eventHandlers[type]).forEach(handler => handler())
    }

    function subscribe({ type, handler }) {
        eventHandlers[type].push(handler)

        if (!eventHandlers[type]) {
            eventHandlers[type] = {}
        }

        let key = 0

        while (eventHandlers[type][key]) {
            key += 1
        }

        eventHandlers[type][key] = handler

        this.unsubscribe = function () {
            delete eventHandlers[type][key]
        }

        return this
    }

    return {
        getStore,
        update,
        subscribe,
    }
}

export default createStore
