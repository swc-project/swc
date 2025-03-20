export const obj = {
    ready: function(wait) {
        // Abort if there are pending holds or we're already ready
        if (!(!0 === wait ? --jQuery.readyWait : jQuery.isReady)) {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if (!document.body) return setTimeout(jQuery.ready);
            // If a normal DOM Ready event fired, decrement, and wait if need be
            // Remember that the DOM is ready
            jQuery.isReady = !0, !(!0 !== wait && --jQuery.readyWait > 0) && (// If there are functions bound, to execute
            readyList.resolveWith(document, [
                jQuery
            ]), jQuery.fn.trigger && jQuery(document).trigger("ready").off("ready"));
        }
    }
};
