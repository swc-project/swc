export const E = {
    _onProgress: function(e) {
        var i;
        //set the internal cache to what just came in.
        if (e.data && e.data.length) for(i = 0; i < e.data.length; i++)e.data[i] = this.getModule(e.data[i].name);
        this.onProgress && this.onProgress.call(this.context, {
            name: e.url,
            data: e.data
        });
    }
};
