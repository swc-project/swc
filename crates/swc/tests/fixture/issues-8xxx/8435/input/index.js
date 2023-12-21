const init = () => {
  var e = window.parcelRequire;
  e.register('module1', function () {
    class Hello {
      world() {}
    }
}), e.register('module2', function () {
      console.log('test')
    });
};

init();