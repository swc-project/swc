function withLog(methods) {
    const result = {}
    for (const methodName in methods) {
        result[methodName] = ((methodName) => function () {
            console.log(methodName + ' invoked')
            return methods[methodName].apply(this, arguments)
        })(methodName)
    }
    return result
}

function main() {
    const result = withLog({
        test() {
            console.log('method test executed')
        },
        another() {
            console.log('method another executed')
        }
    })

    result.test()
}
main()