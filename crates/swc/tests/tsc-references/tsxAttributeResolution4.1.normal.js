//// [file.tsx]
// OK
/*#__PURE__*/ React.createElement("test1", {
    x: function x(n) {
        return 0;
    }
});
// Error, no member 'len' on 'string'
/*#__PURE__*/ React.createElement("test1", {
    x: function x(n) {
        return n.len;
    }
});
