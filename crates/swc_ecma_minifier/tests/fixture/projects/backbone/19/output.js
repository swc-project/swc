export const obj = {
    navigate: function(fragment, options) {
        if (!History.started) return !1;
        options && !0 !== options || (options = {
            trigger: !!options
        });
        var url = this.root + (fragment = this.getFragment(fragment || ""));
        if (// Strip the fragment of the query and hash for matching.
        fragment = fragment.replace(pathStripper, ""), this.fragment !== fragment) {
            // If pushState is available, we use it to set the fragment as a real URL.
            if (this.fragment = fragment, "" === fragment && "/" !== url && (url = url.slice(0, -1)), this._hasPushState) this.history[options.replace ? "replaceState" : "pushState"]({}, document.title, url);
            else {
                if (!this._wantsHashChange) return this.location.assign(url);
                this._updateHash(this.location, fragment, options.replace), this.iframe && fragment !== this.getFragment(this.getHash(this.iframe)) && (options.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, fragment, options.replace));
            }
            if (options.trigger) return this.loadUrl(fragment);
        }
    }
};
