jQuery.fn.offset = function (options) {
    const core_strundefined = "undefined";
    if (arguments.length) {
        return options === undefined
            ? this
            : this.each(function (i) {
                  jQuery.offset.setOffset(this, options, i);
              });
    }

    var docElem,
        win,
        box = { top: 0, left: 0 },
        elem = this[0],
        doc = elem && elem.ownerDocument;

    if (!doc) {
        return;
    }

    docElem = doc.documentElement;

    // Make sure it's not a disconnected DOM node
    if (!jQuery.contains(docElem, elem)) {
        return box;
    }

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if (typeof elem.getBoundingClientRect !== core_strundefined) {
        box = elem.getBoundingClientRect();
    }
    win = getWindow(doc);
    return {
        top:
            box.top +
            (win.pageYOffset || docElem.scrollTop) -
            (docElem.clientTop || 0),
        left:
            box.left +
            (win.pageXOffset || docElem.scrollLeft) -
            (docElem.clientLeft || 0),
    };
};
