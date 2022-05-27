var a = (function() {
    function a() {
        return "foo";
    }
    return function b() {
        return [
            1,
            a
        ];
    };
})();
console.log(a()[1] === a()[1]);
