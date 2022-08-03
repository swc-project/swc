export const obj = {
    ready: function(r) {
        if (r === true ? --jQuery.readyWait : jQuery.isReady) {
            return;
        }
        if (!document.body) {
            return setTimeout(jQuery.ready);
        }
        jQuery.isReady = true;
        if (r !== true && --jQuery.readyWait > 0) {
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
