export const obj = {
    navigate: function(t, e) {
        if (!History.started) return false;
        if (!e || e === true) e = {
            trigger: !!e
        };
        var i = this.root + (t = this.getFragment(t || ""));
        t = t.replace(pathStripper, "");
        if (this.fragment === t) return;
        this.fragment = t;
        if (t === "" && i !== "/") i = i.slice(0, -1);
        if (this._hasPushState) {
            this.history[e.replace ? "replaceState" : "pushState"]({}, document.title, i);
        } else if (this._wantsHashChange) {
            this._updateHash(this.location, t, e.replace);
            if (this.iframe && t !== this.getFragment(this.getHash(this.iframe))) {
                if (!e.replace) this.iframe.document.open().close();
                this._updateHash(this.iframe.location, t, e.replace);
            }
        } else {
            return this.location.assign(i);
        }
        if (e.trigger) return this.loadUrl(t);
    }
};
