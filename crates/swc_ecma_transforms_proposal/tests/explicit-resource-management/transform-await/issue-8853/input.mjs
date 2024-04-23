
let i = 0
let err
try {
    await using _x1 = {
        async [Symbol.asyncDispose]() {
            throw [1, ++i]
        }
    }

    await using _x2 = {
        async [Symbol.asyncDispose]() {
            throw [2, ++i]
        }
    }

    await using _x3 = {
        async [Symbol.asyncDispose]() {
            throw [3, ++i]
        }
    }

    await using _x4 = {
        async [Symbol.asyncDispose]() {
            throw [4, ++i]
        }
    }

    throw [5, ++i]
} catch (e) {
    err = e
}