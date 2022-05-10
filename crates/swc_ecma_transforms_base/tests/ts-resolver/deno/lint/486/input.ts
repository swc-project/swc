function foo() {
    target++;
    {
        var target = 0;
    }
}
