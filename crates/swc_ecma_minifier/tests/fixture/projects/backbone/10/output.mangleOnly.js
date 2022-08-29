const s = {
    _ensureElement: function() {
        if (!this.el) {
            var s = _.extend({}, _.result(this, "attributes"));
            if (this.id) s.id = _.result(this, "id");
            if (this.className) s["class"] = _.result(this, "className");
            var t = Backbone.$("<" + _.result(this, "tagName") + ">").attr(s);
            this.setElement(t, false);
        } else {
            this.setElement(_.result(this, "el"), false);
        }
    }
};
