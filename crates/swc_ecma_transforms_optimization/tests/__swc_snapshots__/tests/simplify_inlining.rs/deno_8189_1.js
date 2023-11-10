let A, I = null;
function g() {
    return null !== I && I.buffer === A.memory.buffer || (I = new Uint8Array(A.memory.buffer)), I;
}
