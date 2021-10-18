// didn't work
/*#__PURE__*/ React.createElement("div", null, function() {
    /*#__PURE__*/ return React.createElement("div", {
        text: "wat"
    });
});
// didn't work
/*#__PURE__*/ React.createElement("div", null, function(x) {
    /*#__PURE__*/ return React.createElement("div", {
        text: "wat"
    });
});
// worked
/*#__PURE__*/ React.createElement("div", null, function() {
    /*#__PURE__*/ return React.createElement("div", {
        text: "wat"
    });
});
// worked (!)
/*#__PURE__*/ React.createElement("div", null, function() {
    /*#__PURE__*/ return React.createElement("div", {
        text: "wat"
    });
});
