function Multimap3() {
    this._map = {
    };
}
Multimap3.prototype = {
    get (key) {
        return this._map[key + ""];
    }
};
const map = new Multimap3();
map.get("hi");
