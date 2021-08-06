export const obj = {
    init: function(selector, context, rootjQuery) {
        var match, elem;
        if (!selector) return this;
        if ("string" == typeof selector) {
            if ((match = "<" === selector.charAt(0) && ">" === selector.charAt(selector.length - 1) && selector.length >= 3 ? [
                null,
                selector,
                null
            ] : rquickExpr.exec(selector)) && (match[1] || !context)) {
                if (match[1]) {
                    if (context = context instanceof jQuery ? context[0] : context, jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, !0)), rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) for(match in context)jQuery.isFunction(this[match]) ? this[match](context[match]) : this.attr(match, context[match]);
                    return this;
                }
                if ((elem = document.getElementById(match[2])) && elem.parentNode) {
                    if (elem.id !== match[2]) return rootjQuery.find(selector);
                    this.length = 1, this[0] = elem;
                }
                return this.context = document, this.selector = selector, this;
            }
            return !context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
        }
        return selector.nodeType ? (this.context = this[0] = selector, this.length = 1, this) : jQuery.isFunction(selector) ? rootjQuery.ready(selector) : (void 0 !== selector.selector && (this.selector = selector.selector, this.context = selector.context), jQuery.makeArray(selector, this));
    }
};
