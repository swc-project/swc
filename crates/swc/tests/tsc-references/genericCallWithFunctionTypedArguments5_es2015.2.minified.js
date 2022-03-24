function foo(arg1) {
    return arg1.cb(null);
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
