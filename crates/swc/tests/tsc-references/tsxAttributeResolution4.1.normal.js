//// [file.tsx]
// OK
/*#__PURE__*/ React.createElement("test1", {
    x: function(n) {
        return 0;
    }
});
// Error, no member 'len' on 'string'
/*#__PURE__*/ React.createElement("test1", {
    x: function(n) {
        return n.len;
    }
});
