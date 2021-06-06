async function* generate() {
    const results = await Promise.all([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
    ])
    for (const result of results) {
        console.log(`yield ${result}`)
        yield result
    }
}

async function printValues() {
    const iterator = generate()
    for await (const value of iterator) {
        console.log(`iterator value: ${value}`)
    }
}

printValues()