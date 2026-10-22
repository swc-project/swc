(function () {
    let result = "FAIL";
    const unused = { ...{ get prop() { result = "PASS"; } } };
    console.log(result);
})();
