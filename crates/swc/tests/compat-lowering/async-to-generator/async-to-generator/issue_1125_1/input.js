
async function test() {
    try {
        await 1
    } finally {
        console.log(2)
    }
}
test()
