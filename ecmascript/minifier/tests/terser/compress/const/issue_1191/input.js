function foo(rot) {
    const rotTol = 5;
    if (rot < -rotTol || rot > rotTol) bar();
    baz();
}
