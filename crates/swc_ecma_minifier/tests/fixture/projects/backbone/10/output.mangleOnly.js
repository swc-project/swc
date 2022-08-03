const t = {
    _ensureElement: function() {
        if (!this.el) {
            var t = _.extend({}, _.result(this, "attributes"));
            if (this.id) t.id = _.result(this, "id");
            if (this.className) t["class"] = _.result(this, "className");
            var s = Backbone.$("<" + _.result(this, "tagName") + ">").attr(t);
            this.setElement(s, false);
        } else {
            this.setElement(_.result(this, "el"), false);
        }
    }
};
