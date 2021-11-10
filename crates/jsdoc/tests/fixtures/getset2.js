/** Employee class. */
class Employee {
    /**
     * Location.
     * @type {string}
     */
    get location() {
        return this._location;
    }

    /** @type {string} */
    set location(loc) {
        this._location = loc;
    }
}
