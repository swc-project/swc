class C {
    mount() {
        var _this = this, _loop = function(v) {
            //when you put this inside the for...of loop, the 'this' inside function declare will lose
            var overrideTarget = _this.$cardsBox;
            var origiFuc = overrideTarget[v];
            overrideTarget[v] = function() {
                if (this.width > cardWidth) {
                    this.scaleX = this.scaleY = (cardWidth / this.width).toFixed(2);
                }
                origiFuc.apply(this, arguments);
            };
        };
        var overrideFucNames = [
            "addChild",
            "addChildAt",
            "removeChild",
            "removeChildAt", 
        ];
        var cardWidth = 1275;
        for (var v of overrideFucNames)_loop(v);
    }
}
