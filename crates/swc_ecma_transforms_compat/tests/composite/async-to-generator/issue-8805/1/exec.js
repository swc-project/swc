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
    for await (const number of bar(foo(), true)) {
        console.log(number)
    }
}

run()