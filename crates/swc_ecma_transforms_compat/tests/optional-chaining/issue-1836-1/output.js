function bug() {
    const arrowFn = (arg)=>{
        var _this_object_arg, _this_object;
        return (_this_object_arg = (_this_object = this.object)[arg]) === null || _this_object_arg === void 0 ? void 0 : _this_object_arg.call(_this_object);
    };
}
bug();
