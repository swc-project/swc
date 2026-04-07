import { _ as _apply_decs_2203_r } from "@swc/helpers/_/_apply_decs_2203_r";
import { _ as _identity } from "@swc/helpers/_/_identity";
var _initClass;
function Component(target) {
    return class subTarget extends target {
    };
}
let _ScrollView;
new class extends _identity {
    constructor(){
        super(_ScrollView), _initClass();
    }
    static [class ScrollView {
        static{
            ({ c: [_ScrollView, _initClass] } = _apply_decs_2203_r(this, [], [
                Component
            ]));
        }
        autoScroll() {
            console.log(ScrollView.scrollInterval);
        }
    }];
    scrollInterval = 100;
}();
new _ScrollView().autoScroll();
