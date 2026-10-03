const offset = 4;
(function(Container) {
    function fromFunction(value) {
        return 5 + value;
    }
    Container.fromFunction = fromFunction;
    class Holder {
        static fromMethod() {
            let Local = /*#__PURE__*/ function(Local) {
                Local[Local["A"] = 7] = "A";
                return Local;
            }({});
            return 7;
        }
        read() {
            return 3;
        }
        constructor(){
            this.field = function() {
                return 6;
            }();
        }
    }
    Container.Holder = Holder;
    function throughExpression() {
        const read = ()=>{
            return 9;
        };
        return read();
    }
    Container.throughExpression = throughExpression;
    function plain() {
        return 2;
    }
    Container.plain = plain;
    class Plain {
        constructor(){
            this.value = 3;
        }
    }
    Container.Plain = Plain;
})(Container || (Container = {}));
const result = [
    Container.fromFunction(1),
    Container.Holder.fromMethod(),
    new Container.Holder().read(),
    new Container.Holder().field,
    Container.throughExpression(),
    Container.plain(),
    new Container.Plain().value
];
var Container;
