export function fn1() {
    let walkingIndex = 0;
    return function() {
        const myIndex = walkingIndex;
        walkingIndex += 1, console.log(myIndex, walkingIndex);
    };
}
