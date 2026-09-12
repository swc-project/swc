function forIn(value, ...rest) {
    for (let arguments in eval("[1]")) {}
}

function forOf(value, ...rest) {
    for (let arguments of eval("[1]")) {}
}
