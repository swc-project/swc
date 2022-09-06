while(foo){
    if (bar) break;
    console.log("foo");
}
out: while(foo){
    if (bar) break out;
    console.log("foo");
}
