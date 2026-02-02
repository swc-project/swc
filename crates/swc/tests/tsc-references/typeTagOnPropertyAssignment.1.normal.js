//// [typeTagOnPropertyAssignment.js]
var o = {
    /**
     * @type {"a"}
     */ a: "a",
    /** @type {() => 'b'} */ n: function n() {
        return 'b';
    }
};
o.a;
o.n;
