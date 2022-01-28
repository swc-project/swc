export const obj = {
    ready: function(wait) {
        if (!(!0 === wait ? --jQuery.readyWait : jQuery.isReady)) {
            if (!document.body) return setTimeout(jQuery.ready);
            jQuery.isReady = !0, !(!0 !== wait && --jQuery.readyWait > 0) && (readyList.resolveWith(document, [
                jQuery
            ]), jQuery.fn.trigger && jQuery(document).trigger("ready").off("ready"));
        }
    }
};
