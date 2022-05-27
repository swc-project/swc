export const obj = {
    navigate: function(a, b) {
        if (!History.started) return false;
        if (!b || b === true) b = {
            trigger: !!b
        };
        var c = this.root + (a = this.getFragment(a || ""));
        a = a.replace(pathStripper, "");
        if (this.fragment === a) return;
        this.fragment = a;
        if (a === "" && c !== "/") c = c.slice(0, -1);
        if (this._hasPushState) {
            this.history[b.replace ? "replaceState" : "pushState"]({}, document.title, c);
        } else if (this._wantsHashChange) {
            this._updateHash(this.location, a, b.replace);
            if (this.iframe && a !== this.getFragment(this.getHash(this.iframe))) {
                if (!b.replace) this.iframe.document.open().close();
                this._updateHash(this.iframe.location, a, b.replace);
            }
        } else {
            return this.location.assign(c);
        }
        if (b.trigger) return this.loadUrl(a);
    }
};
