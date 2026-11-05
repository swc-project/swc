
    const x = function*() {
        return Promise.all([[1], [2], [3]].map(
            function*([a]) {
                Promise.resolve().then(() => a * 2)
            })
        )
    }
    