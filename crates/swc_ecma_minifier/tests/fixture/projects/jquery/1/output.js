export const obj = {
    init: function(selector, context, rootjQuery) {
        var match, elem;
        // HANDLE: $(""), $(null), $(undefined), $(false)
        if (!selector) return this;
        // Handle HTML strings
        if ("string" == typeof selector) {
            // Match html or make sure no context is specified for #id
            if ((// Assume that strings that start and end with <> are HTML and skip the regex check
            match = "<" === selector.charAt(0) && ">" === selector.charAt(selector.length - 1) && selector.length >= 3 ? [
                null,
                selector,
                null
            ] : rquickExpr.exec(selector)) && (match[1] || !context)) {
                // HANDLE: $(html) -> $(array)
                if (match[1]) {
                    // HANDLE: $(html, props)
                    if (context = context instanceof jQuery ? context[0] : context, // scripts is true for back-compat
                    jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, !0)), rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) for(match in context)// Properties of context are called as methods if possible
                    jQuery.isFunction(this[match]) ? this[match](context[match]) : this.attr(match, context[match]);
                    return this;
                // HANDLE: $(#id)
                }
                // Check parentNode to catch when Blackberry 4.6 returns
                // nodes that are no longer in the document #6963
                if ((elem = document.getElementById(match[2])) && elem.parentNode) {
                    // Handle the case where IE and Opera return items
                    // by name instead of ID
                    if (elem.id !== match[2]) return rootjQuery.find(selector);
                    // Otherwise, we inject the element directly into the jQuery object
                    this.length = 1, this[0] = elem;
                }
                return this.context = document, this.selector = selector, this;
            // HANDLE: $(expr, $(...))
            }
            return !context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
        // HANDLE: $(DOMElement)
        }
        return selector.nodeType ? (this.context = this[0] = selector, this.length = 1, this) : jQuery.isFunction(selector) ? rootjQuery.ready(selector) : (void 0 !== selector.selector && (this.selector = selector.selector, this.context = selector.context), jQuery.makeArray(selector, this));
    }
};
