function foo(arg) {
    return arg.cb(null);
}
var arg1 = {
    cb: (x)=>""
};
foo(arg1), foo({
    cb: (x, y)=>""
}), foo({
    cb: (x, y)=>""
}), foo(arg1), foo({
    cb: (x)=>""
}), foo({
    cb: (x)=>""
}), foo({
    cb: ()=>""
});
