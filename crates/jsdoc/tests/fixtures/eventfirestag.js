/**
 * @class
 */
var Hurl = function () {
};

/**
 * Throw a snowball.
 *
 * @fires Hurl#snowball
 * @fires Hurl#event:brick
 */
Hurl.prototype.snowball = function () {
    /**
     * @event Hurl#snowball
     */
    this.emit('snowball', {});
};

/**
 * Throw a football match.
 *
 * @emits Hurl#footballMatch
 */
Hurl.prototype.footballMatch = function () {
    /**
     * @event Hurl#footballMatch
     */
    this.emit('footballMatch', {});
};
