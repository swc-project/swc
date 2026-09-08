function nested(obj) {
    console.log(obj.a[false]);
}
function optional(obj) {
    console.log(obj?.[false]);
}
nested({
    a: {
        false: "nested"
    }
});
optional({
    false: "optional"
});
