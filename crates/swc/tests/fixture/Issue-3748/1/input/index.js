var candidateSelectors = [
    'input',
    'select',
    'textarea',
    'a[href]',
    'button',
    '[tabindex]',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
];
var candidateSelector = candidateSelectors.join(',');

var matches = typeof Element === 'undefined'
    ? function () { }
    : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

function tabbable(el, options) {
    options = options || {};

    var regularTabbables = [];
    var orderedTabbables = [];

    var candidates = el.querySelectorAll(candidateSelector);

    if (options.includeContainer) {
        if (matches.call(el, candidateSelector)) {
            candidates = Array.prototype.slice.apply(candidates);
            candidates.unshift(el);
        }
    }

    var i, candidate, candidateTabindex;
    for (i = 0; i < candidates.length; i++) {
        candidate = candidates[i];

        if (!isNodeMatchingSelectorTabbable(candidate)) continue;

        candidateTabindex = getTabindex(candidate);
        if (candidateTabindex === 0) {
            regularTabbables.push(candidate);
        } else {
            orderedTabbables.push({
                documentOrder: i,
                tabIndex: candidateTabindex,
                node: candidate,
            });
        }
    }

    var tabbableNodes = orderedTabbables
        .sort(sortOrderedTabbables)
        .map(function (a) { return a.node })
        .concat(regularTabbables);

    return tabbableNodes;
}

tabbable.isTabbable = isTabbable;
tabbable.isFocusable = isFocusable;

function isNodeMatchingSelectorTabbable(node) {
    if (
        !isNodeMatchingSelectorFocusable(node)
        || isNonTabbableRadio(node)
        || getTabindex(node) < 0
    ) {
        return false;
    }
    return true;
}

function isTabbable(node) {
    if (!node) throw new Error('No node provided');
    if (matches.call(node, candidateSelector) === false) return false;
    return isNodeMatchingSelectorTabbable(node);
}

function isNodeMatchingSelectorFocusable(node) {
    if (
        node.disabled
        || isHiddenInput(node)
        || isHidden(node)
    ) {
        return false;
    }
    return true;
}

var focusableCandidateSelector = candidateSelectors.concat('iframe').join(',');
function isFocusable(node) {
    if (!node) throw new Error('No node provided');
    if (matches.call(node, focusableCandidateSelector) === false) return false;
    return isNodeMatchingSelectorFocusable(node);
}

function getTabindex(node) {
    var tabindexAttr = parseInt(node.getAttribute('tabindex'), 10);
    if (!isNaN(tabindexAttr)) return tabindexAttr;
    // Browsers do not return `tabIndex` correctly for contentEditable nodes;
    // so if they don't have a tabindex attribute specifically set, assume it's 0.
    if (isContentEditable(node)) return 0;
    return node.tabIndex;
}

function sortOrderedTabbables(a, b) {
    return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
}

function isContentEditable(node) {
    return node.contentEditable === 'true';
}

function isInput(node) {
    return node.tagName === 'INPUT';
}

function isHiddenInput(node) {
    return isInput(node) && node.type === 'hidden';
}

function isRadio(node) {
    return isInput(node) && node.type === 'radio';
}

function isNonTabbableRadio(node) {
    return isRadio(node) && !isTabbableRadio(node);
}

function getCheckedRadio(nodes) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
            return nodes[i];
        }
    }
}

function isTabbableRadio(node) {
    if (!node.name) return true;
    // This won't account for the edge case where you have radio groups with the same
    // in separate forms on the same page.
    var radioSet = node.ownerDocument.querySelectorAll('input[type="radio"][name="' + node.name + '"]');
    var checked = getCheckedRadio(radioSet);
    return !checked || checked === node;
}

function isHidden(node) {
    // offsetParent being null will allow detecting cases where an element is invisible or inside an invisible element,
    // as long as the element does not use position: fixed. For them, their visibility has to be checked directly as well.
    return node.offsetParent === null || getComputedStyle(node).visibility === 'hidden';
}

module.exports = tabbable;
