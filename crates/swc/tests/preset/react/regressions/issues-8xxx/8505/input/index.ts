export default () => {
    class Rectangle {
        height: number = 0;
        constructor(height, width) {
            this.height = height;
            this.width = width;
        }
        incrementHeight() {
            this.height = this.height + 1;
        }
    }
};
