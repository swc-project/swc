(void 0).a1, ({}).a2;
var tmp = {
    b21: "world"
};
function foo1() {
    return {
        prop1: 2
    };
}
(void 0 === tmp ? {
    b21: "string"
} : tmp).b21, foo1().prop1, foo1().prop2;
