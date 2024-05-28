let hasV8BreakIterator;
try {
    hasV8BreakIterator = typeof Intl !== "undefined" && Intl.v8BreakIterator;
} catch {
    hasV8BreakIterator = false;
}
const isBrowser = () => typeof document === "object" && !!document;
const isEdge = () => isBrowser() && /(edge)/i.test(navigator.userAgent);
const isTrident = () => isBrowser() && /(msie|trident)/i.test(navigator.userAgent);
const isBlink = () => isBrowser() && !!(window.chrome || hasV8BreakIterator) && typeof CSS !== "undefined" && !isEdge() && !isTrident();
const isWebkit = () => isBrowser() && /AppleWebKit/i.test(navigator.userAgent) && !isBlink() && !isEdge() && !isTrident();
const isIOS = () => isBrowser() && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
const isFirefox = () => isBrowser() && /(firefox|minefield)/i.test(navigator.userAgent);
const isAndroid = () => isBrowser() && /android/i.test(navigator.userAgent) && !isTrident();
const isSafari = () => isBrowser() && /safari/i.test(navigator.userAgent) && isWebkit();
const isNextjs = () => !!globalThis.next;
const isChromium = () => {
    var _a, _b;
    return (_b = (_a = navigator.userAgentData) == null ? void 0 : _a.brands) == null ? void 0 : _b.some((data) => data.brand == "Chromium");
};
const breakpoints = ["zero", "micro", "small", "medium", "wide", "large", "ultra"];
function isBreakpoint(from, to, properties) {
    if (!isBrowser()) {
        return false;
    }
    const computedStyle = getComputedStyle(document.documentElement);
    const breakpointMin = from ? computedStyle.getPropertyValue(`--sbb-breakpoint-${from}-min`) : "";
    const breakpointMax = to ? `${parseFloat(
        computedStyle.getPropertyValue(
            `--sbb-breakpoint-${to}-${(properties == null ? void 0 : properties.includeMaxBreakpoint) ? "max" : "min"}`
        )
    ) - ((properties == null ? void 0 : properties.includeMaxBreakpoint) ? 0 : 0.0625)}rem` : "";
    const minWidth = breakpointMin && `(min-width: ${breakpointMin})`;
    const maxWidth = breakpointMax && `(max-width: ${breakpointMax})`;
    const and = breakpointMin && breakpointMax && " and ";
    return window.matchMedia(`${minWidth}${and}${maxWidth}`).matches;
}
function findReferencedElement(reference) {
    if (!isBrowser()) {
        return null;
    } else if (typeof reference === "string") {
        return document.getElementById(reference);
    } else if (reference instanceof window.Element) {
        return reference;
    }
    return null;
}
const getDocumentWritingMode = () => isBrowser() && document.documentElement.getAttribute("dir") || "ltr";
function hostContext(selector, element) {
    if (!isBrowser()) {
        return null;
    }
    element = element.parentElement ?? element.getRootNode().host;
    while (element && element !== document && element !== window) {
        const match = element.closest(selector);
        if (match) {
            return match;
        }
        element = element.getRootNode().host;
    }
    return null;
}
const ACTION_ELEMENTS = "a,button,sbb-teaser-hero,sbb-teaser";
function findInput(element, trigger) {
    var _a;
    if (!trigger) {
        const parent = (_a = element.closest) == null ? void 0 : _a.call(element, "sbb-form-field");
        return parent == null ? void 0 : parent.querySelector("input");
    }
    return findReferencedElement(trigger);
}
function setOrRemoveAttribute(element, attribute, value) {
    if (!value) {
        element.removeAttribute(attribute);
    } else {
        element.setAttribute(attribute, value);
    }
}
function pageScrollDisabled() {
    return document.body.hasAttribute("data-sbb-scroll-disabled");
}
class SbbScrollHandler {
    disableScroll() {
        if (pageScrollDisabled()) {
            return;
        }
        this._position = document.body.style.position;
        this._overflow = document.body.style.overflow;
        this._marginInlineEnd = document.body.style.marginInlineEnd;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        document.body.style.position = "relative";
        document.body.style.marginInlineEnd = `${scrollbarWidth}px`;
        document.body.style.setProperty("--sbb-scrollbar-width", `${scrollbarWidth}px`);
        document.body.toggleAttribute("data-sbb-scroll-disabled", true);
    }
    enableScroll() {
        if (!pageScrollDisabled()) {
            return;
        }
        document.body.style.position = this._position || "";
        document.body.style.overflow = this._overflow || "";
        document.body.style.marginInlineEnd = this._marginInlineEnd || "";
        document.body.style.setProperty("--sbb-scrollbar-width", "0");
        document.body.removeAttribute("data-sbb-scroll-disabled");
    }
}
const localNameCache = /* @__PURE__ */ new Map();
function getLocalName(element) {
    if (localNameCache.has(element.constructor)) {
        return localNameCache.get(element.constructor);
    }
    const definitions = (
        // eslint-disable-next-line @typescript-eslint/naming-convention
        customElements.__definitions
    );
    for (const [key, value] of definitions) {
        if (value.ctor === element.constructor) {
            localNameCache.set(element.constructor, key);
            return key;
        }
    }
    throw new Error(`Given element ${element.constructor.name} has not been registered yet.`);
}
export {
    ACTION_ELEMENTS,
    SbbScrollHandler,
    breakpoints,
    findInput,
    findReferencedElement,
    getDocumentWritingMode,
    getLocalName,
    hostContext,
    isAndroid,
    isBlink,
    isBreakpoint,
    isBrowser,
    isChromium,
    isEdge,
    isFirefox,
    isIOS,
    isNextjs,
    isSafari,
    isTrident,
    isWebkit,
    pageScrollDisabled,
    setOrRemoveAttribute
};