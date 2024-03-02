console.log(new ((()=>{
    let _classThis;
    $eb2fd35624c84372$var$CustomElement("component-a");
    let _classSuper = HTMLElement;
    return class extends _classSuper {
        static{
            _classThis = this;
        }
        static{
            console.log(123);
        }
        constructor(){
            super(), this.innerHTML = "Component A is working";
        }
    }, _classThis;
})())().tagName);
