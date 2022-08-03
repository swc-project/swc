var n = (function() {
    function n() {
        return "foo";
    }
    return function r() {
        return [
            1,
            n
        ];
    };
})();
console.log(n()[1] === n()[1]);
