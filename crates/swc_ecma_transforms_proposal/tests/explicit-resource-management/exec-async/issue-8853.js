const { deepStrictEqual } = require('node:assert')

let i = 0
let err
try {
    await using _x1 = {
        async [Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")]() {
            throw [1, ++i]
        }
    }

    await using _x2 = {
        async [Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")]() {
            throw [2, ++i]
        }
    }

    await using _x3 = {
        async [Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")]() {
            throw [3, ++i]
        }
    }

    await using _x4 = {
        async [Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")]() {
            throw [4, ++i]
        }
    }

    throw [5, ++i]
} catch (e) {
    err = e
}

console.log(err)
deepStrictEqual(err.suppressed, [1, 5])
deepStrictEqual(err.error.suppressed, [2, 4])
deepStrictEqual(err.error.error.suppressed, [3, 3])
deepStrictEqual(err.error.error.error.suppressed, [4, 2])
deepStrictEqual(err.error.error.error.error, [5, 1])