let obj = {};
if ((obj.x ?? 0) > 0) {
    console.log("x");
} else if ((obj.y ?? 0) > 0) {
    console.log("y");
}