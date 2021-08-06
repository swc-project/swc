export const obj = {
    ready: function (wait) {

        // Abort if there are pending holds or we're already ready
        if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
            return;
        }

        // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
        if (!document.body) {
            return setTimeout(jQuery.ready);
        }

        // Remember that the DOM is ready
        jQuery.isReady = true;

        // If a normal DOM Ready event fired, decrement, and wait if need be
        if (wait !== true && --jQuery.readyWait > 0) {
            return;
        }

        // If there are functions bound, to execute
        readyList.resolveWith(document, [jQuery]);

        // Trigger any bound ready events
        if (jQuery.fn.trigger) {
            jQuery(document).trigger("ready").off("ready");
        }
    },
}