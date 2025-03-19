let _classThis, _classSuper;
console.log(new ($eb2fd35624c84372$var$CustomElement("component-a"), _classSuper = HTMLElement, class extends _classSuper {
    static{
        _classThis = this;
    }
    static{
        console.log(123);
    }
    constructor(){
        super(), this.innerHTML = "Component A is working";
    }
}, _classThis)().tagName);
