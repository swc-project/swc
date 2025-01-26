function *yield_trailing() {
    cont arr = [1, 2, 3]
    for (var i = 0; i < arr.length; i++) {
        yield arr[i] /* trailing yield val 1 */;
    }
}

function *yield_trailing() {
    cont arr = [1, 2, 3]
    for (var i = 0; i < arr.length; i++) {
        /* leading yield 1 */ yield arr[i] /* trailing yield val 2 */;
    }
}

function *yield_trailing() {
    cont arr = [1, 2, 3]
    for (var i = 0; i < arr.length; i++) {
        /* leading yield 2 */ yield arr[i];
    }
}

function *yield_trailing() {
    cont arr = [1, 2, 3]
    for (var i = 0; i < arr.length; i++) {
        yield /* leading yield val */ arr[i] /* trailing yield val 3 */;
    }
}

function *yield_trailing() {
    yield /* trailing no yield val */;
}
