class C extends D {
    mount() {
        var _this = this, _superprop_get_mount = ()=>super.mount, _loop = function(v) {
            setTimeout(()=>_superprop_get_mount().call(_this, v));
        };
        var overrideFucNames = [
            "addChild",
            "addChildAt",
            "removeChild",
            "removeChildAt", 
        ];
        for (var v of overrideFucNames)_loop(v);
    }
}
