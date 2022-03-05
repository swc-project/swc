export function Vec(len) {
    this.storage = new Array(len);
}
Vec.prototype = {
    dot (other) {
        if (other.storage.length !== this.storage.length) throw new Error("Dot product only applicable for vectors of equal length");
        let sum = 0;
        for(let i = 0; i < this.storage.length; i++)sum += this.storage[i] * other.storage[i];
        return sum;
    },
    magnitude () {
        let sum = 0;
        for(let i = 0; i < this.storage.length; i++)sum += Math.pow(this.storage[i], 2);
        return Math.sqrt(sum);
    }
};
export function Point2D(x, y) {
    if (!(this instanceof Point2D)) return new Point2D(x, y);
    Vec.call(this, 2), this.x = x, this.y = y;
}
Point2D.prototype = {
    __proto__: Vec,
    get x () {
        return this.storage[0];
    },
    set x (x){
        this.storage[0] = x;
    },
    get y () {
        return this.storage[1];
    },
    set y (y){
        this.storage[1] = y;
    }
};
export const origin = new Point2D(0, 0);
