for (; condition;) {
    var bracedBody;
    {
        var nestedBlockBody;
        let blockLocal;
        consume(bracedBody, nestedBlockBody, blockLocal);
    }
    (() => {
        var functionLocal;
        consume(functionLocal);
    })();
}
