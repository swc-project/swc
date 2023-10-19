export function regexCheck(regex) {
    return check;
    function check(code) {
        return null !== code && regex.test(String.fromCharCode(code));
    }
}
