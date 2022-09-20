export const obj = {
    navigate: function(fragment, options) {
        if (!History.started) return !1;
        options && !0 !== options || (options = {
            trigger: !!options
        });
        var url = this.root + (fragment = this.getFragment(fragment || ""));
        fragment = fragment.replace(pathStripper, "");
        if (this.fragment !== fragment) {
            this.fragment = fragment;
            "" === fragment && "/" !== url && (url = url.slice(0, -1));
            if (this._hasPushState) this.history[options.replace ? "replaceState" : "pushState"]({}, document.title, url);
            else {
                if (!this._wantsHashChange) return this.location.assign(url);
                this._updateHash(this.location, fragment, options.replace);
                if (this.iframe && fragment !== this.getFragment(this.getHash(this.iframe))) {
                    options.replace || this.iframe.document.open().close();
                    this._updateHash(this.iframe.location, fragment, options.replace);
                }
            }
            if (options.trigger) return this.loadUrl(fragment);
        }
    }
};
