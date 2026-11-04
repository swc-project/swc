
(() => {
  var SomeError = class extends Error {
    constructor(issues) {
      super();
      const actualProto = new.target.prototype;
    }
  }
})();
