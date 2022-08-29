//// [intersectionThisTypes.ts]
function f1(t) {
    t = t.self();
    t = t.me().self().me();
}
function f2(t) {
    t = t.self();
    t = t.me().self().me();
}
function test(label) {
    var extended = label.extend({
        id: 67
    }).extend({
        tag: "hello"
    });
    extended.id; // Ok
    extended.tag; // Ok
}
