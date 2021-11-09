const x = {
    n: 123,
    t: 'text',
    int: '==INT=='
}

const { n, t, int = 5 } = x

console.log(n, t, int)
