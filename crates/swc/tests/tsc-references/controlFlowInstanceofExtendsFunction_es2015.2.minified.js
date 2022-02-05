Function.prototype.now = function() {
    return "now";
};
class X {
    static now() {
        return {};
    }
    why() {}
}
console.log(X.now()), console.log((class {
}).now());
export const x = Math.random() > 0.5 ? new X() : 1;
x instanceof X && x.why();
