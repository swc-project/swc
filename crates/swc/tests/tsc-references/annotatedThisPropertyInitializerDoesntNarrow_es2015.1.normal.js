// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: Compilation.js
// from webpack/lib/Compilation.js and filed at #26427
/** @param {{ [s: string]: number }} map */ function mappy(map) {
}
export class C {
    m() {
        mappy(this.assets);
    }
    constructor(){
        /** @type {{ [assetName: string]: number}} */ this.assets = {
        };
    }
}
