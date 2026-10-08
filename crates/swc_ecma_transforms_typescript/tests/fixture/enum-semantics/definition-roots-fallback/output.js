function fromFunction() {
    return 11;
}
class Holder {
    read() {
        let Local = /*#__PURE__*/ function(Local) {
            Local[Local["A"] = 13] = "A";
            return Local;
        }({});
        return 13;
    }
}
const result = [
    fromFunction(),
    new Holder().read()
];
