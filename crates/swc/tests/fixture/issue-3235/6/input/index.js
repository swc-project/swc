function foo() {
    {
        const a = 1;
        let b = 2;
        var c = 3;
        function d() {}
        class e {}
    }

    {
        let a = 1;
        let b = 2;
        let c = 3;
        let d = 4;
        let e = 5;
    }
}
