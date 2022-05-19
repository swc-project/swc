// didn't work
/*#__PURE__*/ React.createElement("div", null, ()=>/*#__PURE__*/ React.createElement("div", {
        text: "wat"
    }));
// didn't work
/*#__PURE__*/ React.createElement("div", null, (x)=>/*#__PURE__*/ React.createElement("div", {
        text: "wat"
    }));
// worked
/*#__PURE__*/ React.createElement("div", null, ()=>/*#__PURE__*/ React.createElement("div", {
        text: "wat"
    }));
// worked (!)
/*#__PURE__*/ React.createElement("div", null, ()=>/*#__PURE__*/ React.createElement("div", {
        text: "wat"
    }));
