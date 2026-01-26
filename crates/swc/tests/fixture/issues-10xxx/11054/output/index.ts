import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
export class A extends B {
    getFrame(ms) {
        var _superprop_get_getFrame = ()=>super.getFrame;
        return _async_to_generator(function*() {
            var result = yield new Promise((resolve)=>{
                lvSchedulerCallback(()=>{
                    var _this = this, _superprop_get_getFrame1 = ()=>_superprop_get_getFrame();
                    _async_to_generator(function*() {
                        var frame = yield _superprop_get_getFrame1().call(_this, ms);
                        resolve(frame);
                    })();
                });
            });
            return result;
        })();
    }
}
