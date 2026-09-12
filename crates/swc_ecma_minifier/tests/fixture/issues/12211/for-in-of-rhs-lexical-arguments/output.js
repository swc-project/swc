function forIn(value) {
    for(let arguments in eval("[1]"));
}
function forOf(value) {
    for (let arguments of eval("[1]"));
}
