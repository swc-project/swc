class Class {
    method() {
        var _this = this;
        return _async_to_generator(function*() {
            _this;
            ()=>_this;
            ()=>{
                _this;
                ()=>_this;
                function x() {
                    this;
                    ()=>{
                        this;
                    };
                    var _this = this;
                    /*#__PURE__*/ _async_to_generator(function*() {
                        _this;
                    });
                }
            };
            function x() {
                this;
                ()=>{
                    this;
                };
                var _this = this;
                /*#__PURE__*/ _async_to_generator(function*() {
                    _this;
                });
            }
        })();
    }
}
