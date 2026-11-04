class C__2 {
    mount() {
        var _this__8, _loop__9 = function(v__4) {
            //when you put this inside the for...of loop, the 'this' inside function declare will lose
            var overrideTarget__5 = _this__8.$cardsBox;
            var origiFuc__5 = overrideTarget__5[v__4];
            overrideTarget__5[v__4] = function() {
                if (this.width > cardWidth__3) {
                    this.scaleX = this.scaleY = (cardWidth__3 / this.width).toFixed(2);
                }
                origiFuc__5.apply(this, arguments);
            };
        };
        var overrideFucNames__3 = [
            "addChild",
            "addChildAt",
            "removeChild",
            "removeChildAt"
        ];
        var cardWidth__3 = 1275;
        for (var v__4 of overrideFucNames__3)_this__8 = this, _loop__9(v__4);
    }
}
