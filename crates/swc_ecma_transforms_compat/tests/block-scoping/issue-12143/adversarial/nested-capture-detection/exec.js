function throughBlocks() {
    for (let unused = 0; unused < 1; unused++) {
        {
            for (let i = 1, read = () => i;;) {
                i = 42;
                return read();
            }
        }
    }
}

function throughFunction(run = function () {
    for (let i = 2, read = () => i;;) {
        i = 42;
        return read();
    }
}) {
    return run();
}

class ThroughConstructor {
    constructor() {
        for (let i = 3, read = () => i;;) {
            i = 42;
            this.value = read();
            break;
        }
    }
}

console.log(throughBlocks(), throughFunction(), new ThroughConstructor().value);
