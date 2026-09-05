function nested(obj) {
    console.log(obj.a[DEBUG]);
}

function optional(obj) {
    console.log(obj?.[DEBUG]);
}

nested({ a: { false: "nested" } });
optional({ false: "optional" });
