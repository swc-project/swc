export function regexCheck(regex) {
    return function(code) {
        return null !== code && regex.test(String.fromCharCode(code));
    };
}
