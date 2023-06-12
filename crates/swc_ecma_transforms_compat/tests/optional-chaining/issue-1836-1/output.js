function bug() {
    const arrowFn = (arg)=>{
        var _this_object_arg, _object;
        return (_this_object_arg = (_object = (_object = this.object)[arg]) === null || _object === void 0) === null || _this_object_arg === void 0 ? void 0 : _this_object_arg.call(_object);
    };
}
bug();
