const obj = {
    _ensureElement: function() {
        if (this.el) this.setElement(_.result(this, 'el'), !1);
        else {
            var attrs = _.extend({}, _.result(this, 'attributes'));
            this.id && (attrs.id = _.result(this, 'id')), this.className && (attrs.class = _.result(this, 'className'));
            var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
            this.setElement($el, !1);
        }
    }
};
