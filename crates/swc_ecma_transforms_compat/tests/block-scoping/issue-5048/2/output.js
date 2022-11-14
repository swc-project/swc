class C__1 extends D {
    mount() {
        var _this__6 = this, _superprop_get_mount__5 = ()=>super.mount, _loop__7 = function(v__4) {
            setTimeout(()=>_superprop_get_mount__5().call(_this__6, v__4));
        };
        var overrideFucNames__3 = [
            "addChild",
            "addChildAt",
            "removeChild",
            "removeChildAt"
        ];
        for (var v__4 of overrideFucNames__3)_loop__7(v__4);
    }
}
