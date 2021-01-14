var a = {
    method: function() {
        var string = "\n  width: ".concat(Math.abs(this.currentX - this.startX - left), "px;\n  height: ").concat(Math.abs(this.currentY - this.realtimeStartY - top), "px;\n  top: ").concat(Math.min(this.currentY - top, this.realtimeStartY) + this.scrollTop, "px;\n  left: ").concat(Math.min(this.currentX - left, this.startX) + this.scrollLeft, "px\n  ");
    }
};
