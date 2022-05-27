const a = {
    _ensureElement: function() {
        if (!this.el) {
            var a = _.extend({}, _.result(this, "attributes"));
            if (this.id) a.id = _.result(this, "id");
            if (this.className) a["class"] = _.result(this, "className");
            var b = Backbone.$("<" + _.result(this, "tagName") + ">").attr(a);
            this.setElement(b, false);
        } else {
            this.setElement(_.result(this, "el"), false);
        }
    }
};
