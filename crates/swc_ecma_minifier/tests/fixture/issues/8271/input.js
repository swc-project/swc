let $eb2fd35624c84372$var$A = (() => {
    let _classDecorators = [$eb2fd35624c84372$var$CustomElement("component-a")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = HTMLElement;
    var A = class extends _classSuper {
        static {
            _classThis = this;
        }
        static {
            console.log(123);
        }
        constructor() {
            super();
            this.innerHTML = "Component A is working";
        }
    };
    return (A = _classThis);
})();
console.log(new $eb2fd35624c84372$var$A().tagName);
