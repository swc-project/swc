function expectA(a) {
    console.log(a.b === 1)
}

export function test() {
    // any loop
    for (let i = 0; i < 1; i++) {
        const a = {
            get b() {
                return 1
            }
        }
        const c = 2
            ; () => {
                // create any arrow function that references value in loop
                c
            }
        // We expect a.b to be 1
        expectA(a)
    }
}