function bug() {
    const arrowFn = (arg)=>{
        var _this_object_arg, _object;
        return (_object = this.object) === null || _object === void 0 ? void 0 : (_this_object_arg = _object[arg]) === null || _this_object_arg === void 0 ? void 0 : _this_object_arg.call(_object);
    };
}
bug();
