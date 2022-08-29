const obj = {
    a: 'a',
    b: 'b',
    c: 'c',
    d: 'd',
}

const wait = n => new Promise(r => setTimeout(r, n))

const action = async () => {

    for (let i in obj) {

        // halt for a second
        await wait(1000)

        // this one is trouble
        wait(1000).then(() => console.log(i))

    }

    console.log('done')
}


await action()