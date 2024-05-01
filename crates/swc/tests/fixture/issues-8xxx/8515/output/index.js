import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { addX, addY } from 'someLib';
var _class;
var C = (_class = class _class extends Component {
}, _class = _ts_decorate([
    addX,
    addY
], _class), _class);
let OtherClass = class OtherClass extends Component {
};
OtherClass = _ts_decorate([
    addX,
    addY
], OtherClass);
