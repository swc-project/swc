class Class {
    method() {
        return _async_to_generator(function*() {
            this;
            ()=>this;
            ()=>{
                this;
                ()=>this;
                function x() {
                    this;
                    ()=>{
                        this;
                    };
                    ()=>_async_to_generator(function*() {
                            this;
                        }).call(this);
                }
            };
            function x() {
                this;
                ()=>{
                    this;
                };
                ()=>_async_to_generator(function*() {
                        this;
                    }).call(this);
            }
        }).call(this);
    }
}
