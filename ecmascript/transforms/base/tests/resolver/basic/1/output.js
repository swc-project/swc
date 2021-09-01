{
    var foo = 1;
    {
        let foo1 = 2;
        use(foo1);
    }
    use(foo);
}
