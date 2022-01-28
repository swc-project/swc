export const E = {
    _continue: function() {
        !_queue.running && _queue.size() > 0 && (_queue.running = !0, _queue.next()());
    }
};
