export function outer(param) {
    var hoisted = param;
    let lexical = hoisted + 1;

    function inner(innerParam) {
        const nested = innerParam + lexical;

        if (nested > 0) {
            let blockVar = nested;
            return blockVar;
        }

        return hoisted;
    }

    return inner(lexical);
}
