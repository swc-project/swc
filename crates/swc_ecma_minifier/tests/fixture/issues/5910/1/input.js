export function fn1() {
    let walkingIndex = 0;

    function fn2() {
        const myIndex = walkingIndex;
        walkingIndex += 1;

        console.log(myIndex, walkingIndex);
    }

    return fn2;
}