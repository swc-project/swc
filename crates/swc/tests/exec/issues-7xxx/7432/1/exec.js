(async () => {
    const array = [1, 2, 3]
    for (const el of array)
        setTimeout(() => {
            console.log(el)
        }, 1)
})()