function createConstructor(callback) {
    let klass
    return (...args) => {
        if (klass === undefined) {
            klass = callback()
        }
        return new klass(...args)
    }
}

const constructor = createConstructor(() => class {
})

console.log(constructor())