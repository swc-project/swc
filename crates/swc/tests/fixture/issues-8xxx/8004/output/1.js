const string1 = {
    errorCode: 'test'
};
const string2 = 'test';
function evaluateWithoutComment() {
    return string1.errorCode === string2;
}
function evaluateWithComment() {
    return(// This comment doesn't break return evaluation
    string1?.errorCode === string2);
}
function evaluateWithCast() {
    return string1?.errorCode === string2;
}
function evaluateWithCastAndComment() {
    return(// This comment seems to cause wrapping parantheses to get stripped, breaking the return evaluation
    string1?.errorCode === string2);
}
// Works, returns true
console.log(`evaluateWithoutComment: ${evaluateWithoutComment()}`);
// Works, returns true
console.log(`evaluateWithComment: ${evaluateWithComment()}`);
// Works, returns true
console.log(`evaluateWithCast: ${evaluateWithCast()}`);
// Breaks, returns undefined due to stripped parantheses
console.log(`evaluateWithCastAndComment: ${evaluateWithCastAndComment()}`);
