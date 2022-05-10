var ConstructorScoping = function ConstructorScoping() {
    _classCallCheck(this, ConstructorScoping);
    var bar;
    {
        let bar;
        use(bar);
    }
};
