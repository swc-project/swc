jQuery.fn.offset = function(options) {
    if (arguments.length) return void 0 === options ? this : this.each(function(i) {
        jQuery.offset.setOffset(this, options, i);
    });
    var docElem, win, box = {
        top: 0,
        left: 0
    }, elem = this[0], doc = elem && elem.ownerDocument;
    return doc ? (docElem = doc.documentElement, jQuery.contains(docElem, elem)) ? (void 0 !== elem.getBoundingClientRect && (box = elem.getBoundingClientRect()), win = getWindow(doc), {
        top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
        left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
    }) : box : void 0;
};
