(function () {
    function forwardRef() {
        return something();
    }

    function Test() {
        return 'Test';
    }
    const _Test = /*#__PURE__*/ (0, forwardRef)(Test);
    function Other() {
        return 'Other';
    }
    const _Other = /*#__PURE__*/ (0, forwardRef)(Other);


    console.log((0, _Test));

})();