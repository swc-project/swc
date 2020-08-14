/** @module uid */

/** @protected */
var uidCounter = 1;

/** @protected */
var uidObjects = {
    /** Root object. */
    root: {}
};

/** Obtain a unique ID. */
exports.getUid = function getUid() {
    return uidCounter++;
};

/** Associate an object with a unique ID. */
exports.setObjectForUid = function setObjectForUid(obj, uid) {
    uidObjects[uid] = obj;
};
