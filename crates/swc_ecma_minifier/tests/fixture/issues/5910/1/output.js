export function fn1() {
    let walkingIndex = 0;
    return function() {
        const myIndex = walkingIndex;
        console.log(myIndex, walkingIndex += 1);
    };
}
