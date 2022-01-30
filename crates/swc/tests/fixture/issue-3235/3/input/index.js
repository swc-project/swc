{
    let a = 2; // should rename
    use(a);
    let b = 1;
}

{
    var a = 2;
    let b = 3; // should rename
}
