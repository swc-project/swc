/**
 * Create a code check from a regex.
 *
 * @param {RegExp} regex
 * @returns {(code: Code) => code is number}
 */ export function regexCheck(regex) {
    return(/**
     * Check whether a code matches the bound regex.
     *
     * @param {Code} code Character code
     * @returns {code is number} Whether the character code matches the bound regex
     */ function(code) {
        return null !== code && regex.test(String.fromCharCode(code));
    });
}
