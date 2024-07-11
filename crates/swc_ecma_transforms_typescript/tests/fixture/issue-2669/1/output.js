export let TEST;
(function(TEST) {
    TEST.VALUE = "value";
})(TEST || (TEST = {}));
export default TEST;
