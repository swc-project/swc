const obj = {
  // A comment
  foo() {
    return _asyncToGenerator(function* () {
      console.log("Should work");
    })();
  }
};
