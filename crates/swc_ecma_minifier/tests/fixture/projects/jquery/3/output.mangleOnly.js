export const obj = {
    ready: function(a) {
        if (a === true ? --jQuery.readyWait : jQuery.isReady) {
            return;
        }
        if (!document.body) {
            return setTimeout(jQuery.ready);
        }
        jQuery.isReady = true;
        if (a !== true && --jQuery.readyWait > 0) {
            return;
        }
        readyList.resolveWith(document, [
            jQuery
        ]);
        if (jQuery.fn.trigger) {
            jQuery(document).trigger("ready").off("ready");
        }
    }
};
