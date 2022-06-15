function foo(arg) {
    return arg.cb(null);
}
var arg = {
    cb: (x)=>''
};
foo(arg), foo({
    cb: (x, y)=>''
}), foo({
    cb: (x, y)=>''
}), foo(arg), foo({
    cb: (x)=>''
}), foo({
    cb: (x)=>''
}), foo({
    cb: ()=>''
});
