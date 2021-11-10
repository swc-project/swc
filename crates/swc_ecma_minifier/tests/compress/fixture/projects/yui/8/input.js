export const E = {
    _onProgress: function (e) {
        var self = this, i;
        //set the internal cache to what just came in.
        if (e.data && e.data.length) {
            for (i = 0; i < e.data.length; i++) {
                e.data[i] = self.getModule(e.data[i].name);
            }
        }
        if (self.onProgress) {
            self.onProgress.call(self.context, {
                name: e.url,
                data: e.data
            });
        }
    },
}