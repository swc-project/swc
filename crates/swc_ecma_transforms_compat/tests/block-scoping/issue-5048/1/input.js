class C {
    mount() {
        let overrideFucNames = [
            "addChild",
            "addChildAt",
            "removeChild",
            "removeChildAt",
        ];
        let cardWidth = 1275;
        for (let v of overrideFucNames) {
            //when you put this inside the for...of loop, the 'this' inside function declare will lose
            let overrideTarget = this.$cardsBox;
            let origiFuc = overrideTarget[v];
            overrideTarget[v] = function () {
                if (this.width > cardWidth) {
                    this.scaleX = this.scaleY = (
                        cardWidth / this.width
                    ).toFixed(2);
                }
                origiFuc.apply(this, arguments);
            };
        }
    }
}
