function decorator() {}
(()=>{
    let { classValue = @decorator
    class {
    } } = {}, { memberValue = class {
        @decorator
        method() {}
    } } = {}, { parameterValue = class {
        method(
        @decorator
        parameter) {}
    } } = {};
})();
