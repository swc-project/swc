function fn1() {
    let walkingIndex = 0;
    return function() {
        console.log(walkingIndex, walkingIndex += 1);
    };
}
export { fn1 };
