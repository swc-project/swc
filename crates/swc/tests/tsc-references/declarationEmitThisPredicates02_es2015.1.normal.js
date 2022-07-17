// @declaration: true
// @module: commonjs
export const obj = {
    m () {
        let dis = this;
        return dis.a != null && dis.b != null && dis.c != null;
    }
};
