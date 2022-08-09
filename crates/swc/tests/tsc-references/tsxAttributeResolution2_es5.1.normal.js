//@filename: file.tsx
//@jsx: preserve
// OK
/*#__PURE__*/ React.createElement("test1", {
    c1: function(x) {
        return x.length;
    }
}); // OK
/*#__PURE__*/ React.createElement("test1", {
    "data-c1": function(x) {
        return x.leng;
    }
}); // OK
// Errors
/*#__PURE__*/ React.createElement("test1", {
    c1: function(x) {
        return x.leng;
    }
}); // Error, no leng on 'string'
