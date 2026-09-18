import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
function CommonProp() {
    return (Base)=>{
        let _class = class _class extends Base {
            constructor(...args){
                super(...args), _define_property(this, "prop", 100);
            }
        };
        return _class;
    };
}
let _ClassX;
let ClassX = class ClassX {
    static checkX() {
        return new _ClassX().prop;
    }
};
_ClassX = ClassX;
ClassX = _ClassX = _ts_decorate([
    CommonProp()
], ClassX);
console.log(ClassX.checkX());
