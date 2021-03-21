const a = {
    method() {
        const string = `
  width: ${Math.abs(this.currentX - this.startX - left)}px;
  height: ${Math.abs(this.currentY - this.realtimeStartY - top)}px;
  top: ${Math.min(this.currentY - top, this.realtimeStartY) + this.scrollTop}px;
  left: ${Math.min(this.currentX - left, this.startX) + this.scrollLeft}px
  `;

    }
}