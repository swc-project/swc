!function() {
    let result = "FAIL";
    ({
        ...{
            get prop () {
                result = "PASS";
            }
        }
    }), console.log(result);
}();
