console.log(function(a) {
    for (var a of [
        1
    ])break;
    return a;
}(2));
console.log(function(a) {
    for(var a in {
        x: 0
    })break;
    return a;
}(2));
console.log(function(a) {
    for (var { x: [a] } of [
        {
            x: [
                1
            ]
        }
    ])break;
    return a;
}(2));
console.log(function(a) {
    for (var a of [
        1
    ])break;
    for (var a of [
        3
    ])break;
    return a;
}(2));
console.log(function(a) {
    for (a of [
        1
    ])break;
    return a;
}(2));
console.log(function(a) {
    for(a in {
        x: 0
    })break;
    return a;
}(2));
