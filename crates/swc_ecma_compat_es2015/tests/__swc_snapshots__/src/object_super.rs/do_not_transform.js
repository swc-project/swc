let outer = {
    b: function b() {
        let inner = {
            d: function d() {
                super.d() // should not transform
                ;
            }
        };
    }
};
