function decorator() {}

(() => {
    const { classValue = @decorator class {} } = {};
    const { memberValue = class { @decorator method() {} } } = {};
    const { parameterValue = class { method(@decorator parameter) {} } } = {};
})();
