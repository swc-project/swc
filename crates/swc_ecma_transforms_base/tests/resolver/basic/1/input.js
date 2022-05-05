{
    var foo = 1;
    {
        let foo = 2;
        use(foo);
    }
    use(foo);
}
