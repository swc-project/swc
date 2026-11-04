async function* foo() {
    yield 1
}

async function* bar(inputs, returnValues) {
    for await (const input of inputs) {
        if (!returnValues) {
            return
        }
        yield input
    }
}

async function run() {
    for await (const value of bar(foo(), false)) {
        console.log(value)
    }
}

run()