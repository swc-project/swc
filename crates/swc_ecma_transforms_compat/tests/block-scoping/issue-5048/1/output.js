class C__1 {
    mount() {
        var _this__6 = this, _loop__7 = function(v__3) {
            //when you put this inside the for...of loop, the 'this' inside function declare will lose
            var overrideTarget__4 = _this__6.$cardsBox;
            var origiFuc__4 = overrideTarget__4[v__3];
            overrideTarget__4[v__3] = function() {
                if (this.width > cardWidth__2) {
                    this.scaleX = this.scaleY = (cardWidth__2 / this.width).toFixed(2);
                }
                origiFuc__4.apply(this, arguments);
            };
        };
        var overrideFucNames__2 = [
            "addChild",
            "addChildAt",
            "removeChild",
            "removeChildAt"
        ];
        var cardWidth__2 = 1275;
        for (var v__3 of overrideFucNames__2)_loop__7(v__3);
    }
}
