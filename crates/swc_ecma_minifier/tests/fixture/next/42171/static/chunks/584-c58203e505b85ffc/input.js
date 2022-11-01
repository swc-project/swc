"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[584],{

/***/ 1694:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ZP": function() { return /* binding */ esm_button; }
});

// UNUSED EXPORTS: StyledButton, StyledButtonGroup, StyledButtonIcon

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(7294);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/node_modules/@react-aria/focus/node_modules/@react-aria/utils/dist/module.js







const $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c = typeof window !== 'undefined' ? react.useLayoutEffect : ()=>{
};




let $bdb11010cef70236$var$idsUpdaterMap = new Map();
function $bdb11010cef70236$export$f680877a34711e37(defaultId) {
    let [value, setValue] = $12uGp$useState(defaultId);
    let nextId = $12uGp$useRef(null);
    let res = $12uGp$useSSRSafeId(value);
    let updateValue = $12uGp$useCallback((val)=>{
        nextId.current = val;
    }, []);
    $bdb11010cef70236$var$idsUpdaterMap.set(res, updateValue);
    $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        let r = res;
        return ()=>{
            $bdb11010cef70236$var$idsUpdaterMap.delete(r);
        };
    }, [
        res
    ]);
    // This cannot cause an infinite loop because the ref is updated first.
    // eslint-disable-next-line
    $12uGp$useEffect(()=>{
        let newId = nextId.current;
        if (newId) {
            nextId.current = null;
            setValue(newId);
        }
    });
    return res;
}
function $bdb11010cef70236$export$cd8c9cb68f842629(idA, idB) {
    if (idA === idB) return idA;
    let setIdA = $bdb11010cef70236$var$idsUpdaterMap.get(idA);
    if (setIdA) {
        setIdA(idB);
        return idB;
    }
    let setIdB = $bdb11010cef70236$var$idsUpdaterMap.get(idB);
    if (setIdB) {
        setIdB(idA);
        return idA;
    }
    return idB;
}
function $bdb11010cef70236$export$b4cc09c592e8fdb8(depArray = []) {
    let id = $bdb11010cef70236$export$f680877a34711e37();
    let [resolvedId, setResolvedId] = $1dbecbe27a04f9af$export$14d238f342723f25(id);
    let updateId = $12uGp$useCallback(()=>{
        setResolvedId(function*() {
            yield id;
            yield document.getElementById(id) ? id : undefined;
        });
    }, [
        id,
        setResolvedId
    ]);
    $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(updateId, [
        id,
        updateId,
        ...depArray
    ]);
    return resolvedId;
}


function $ff5963eb1fccf552$export$e08e3b67e392101e(...callbacks) {
    return (...args)=>{
        for (let callback of callbacks)if (typeof callback === 'function') callback(...args);
    };
}





function $3ef42575df84b30b$export$9d1611c77c2fe928(...args) {
    // Start with a base clone of the first argument. This is a lot faster than starting
    // with an empty object and adding properties as we go.
    let result = {
        ...args[0]
    };
    for(let i = 1; i < args.length; i++){
        let props = args[i];
        for(let key in props){
            let a = result[key];
            let b = props[key];
            // Chain events
            if (typeof a === 'function' && typeof b === 'function' && // This is a lot faster than a regex.
            key[0] === 'o' && key[1] === 'n' && key.charCodeAt(2) >= /* 'A' */ 65 && key.charCodeAt(2) <= /* 'Z' */ 90) result[key] = $ff5963eb1fccf552$export$e08e3b67e392101e(a, b);
            else if ((key === 'className' || key === 'UNSAFE_className') && typeof a === 'string' && typeof b === 'string') result[key] = $12uGp$clsx(a, b);
            else if (key === 'id' && a && b) result.id = $bdb11010cef70236$export$cd8c9cb68f842629(a, b);
            else result[key] = b !== undefined ? b : a;
        }
    }
    return result;
}


function $5dc95899b306f630$export$c9058316764c140e(...refs) {
    return (value)=>{
        for (let ref of refs){
            if (typeof ref === 'function') ref(value);
            else if (ref != null) ref.current = value;
        }
    };
}


const $65484d02dcb7eb3e$var$DOMPropNames = new Set([
    'id'
]);
const $65484d02dcb7eb3e$var$labelablePropNames = new Set([
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-details'
]);
const $65484d02dcb7eb3e$var$propRe = /^(data-.*)$/;
function $65484d02dcb7eb3e$export$457c3d6518dd4c6f(props, opts = {
}) {
    let { labelable: labelable , propNames: propNames  } = opts;
    let filteredProps = {
    };
    for(const prop in props)if (Object.prototype.hasOwnProperty.call(props, prop) && ($65484d02dcb7eb3e$var$DOMPropNames.has(prop) || labelable && $65484d02dcb7eb3e$var$labelablePropNames.has(prop) || (propNames === null || propNames === void 0 ? void 0 : propNames.has(prop)) || $65484d02dcb7eb3e$var$propRe.test(prop))) filteredProps[prop] = props[prop];
    return filteredProps;
}


function $7215afc6de606d6b$export$de79e2c695e052f3(element) {
    if ($7215afc6de606d6b$var$supportsPreventScroll()) element.focus({
        preventScroll: true
    });
    else {
        let scrollableElements = $7215afc6de606d6b$var$getScrollableElements(element);
        element.focus();
        $7215afc6de606d6b$var$restoreScrollPosition(scrollableElements);
    }
}
let $7215afc6de606d6b$var$supportsPreventScrollCached = null;
function $7215afc6de606d6b$var$supportsPreventScroll() {
    if ($7215afc6de606d6b$var$supportsPreventScrollCached == null) {
        $7215afc6de606d6b$var$supportsPreventScrollCached = false;
        try {
            var focusElem = document.createElement('div');
            focusElem.focus({
                get preventScroll () {
                    $7215afc6de606d6b$var$supportsPreventScrollCached = true;
                    return true;
                }
            });
        } catch (e) {
        // Ignore
        }
    }
    return $7215afc6de606d6b$var$supportsPreventScrollCached;
}
function $7215afc6de606d6b$var$getScrollableElements(element) {
    var parent = element.parentNode;
    var scrollableElements = [];
    var rootScrollingElement = document.scrollingElement || document.documentElement;
    while(parent instanceof HTMLElement && parent !== rootScrollingElement){
        if (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) scrollableElements.push({
            element: parent,
            scrollTop: parent.scrollTop,
            scrollLeft: parent.scrollLeft
        });
        parent = parent.parentNode;
    }
    if (rootScrollingElement instanceof HTMLElement) scrollableElements.push({
        element: rootScrollingElement,
        scrollTop: rootScrollingElement.scrollTop,
        scrollLeft: rootScrollingElement.scrollLeft
    });
    return scrollableElements;
}
function $7215afc6de606d6b$var$restoreScrollPosition(scrollableElements) {
    for (let { element: element , scrollTop: scrollTop , scrollLeft: scrollLeft  } of scrollableElements){
        element.scrollTop = scrollTop;
        element.scrollLeft = scrollLeft;
    }
}


function $ab71dadb03a6fb2e$export$622cea445a1c5b7d(element, reverse, orientation = 'horizontal') {
    let rect = element.getBoundingClientRect();
    if (reverse) return orientation === 'horizontal' ? rect.right : rect.bottom;
    return orientation === 'horizontal' ? rect.left : rect.top;
}


/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ // We store a global list of elements that are currently transitioning,
// mapped to a set of CSS properties that are transitioning for that element.
// This is necessary rather than a simple count of transitions because of browser
// bugs, e.g. Chrome sometimes fires both transitionend and transitioncancel rather
// than one or the other. So we need to track what's actually transitioning so that
// we can ignore these duplicate events.
let $bbed8b41f857bcc0$var$transitionsByElement = new Map();
// A list of callbacks to call once there are no transitioning elements.
let $bbed8b41f857bcc0$var$transitionCallbacks = new Set();
function $bbed8b41f857bcc0$var$setupGlobalEvents() {
    if (typeof window === 'undefined') return;
    let onTransitionStart = (e)=>{
        // Add the transitioning property to the list for this element.
        let transitions = $bbed8b41f857bcc0$var$transitionsByElement.get(e.target);
        if (!transitions) {
            transitions = new Set();
            $bbed8b41f857bcc0$var$transitionsByElement.set(e.target, transitions);
            // The transitioncancel event must be registered on the element itself, rather than as a global
            // event. This enables us to handle when the node is deleted from the document while it is transitioning.
            // In that case, the cancel event would have nowhere to bubble to so we need to handle it directly.
            e.target.addEventListener('transitioncancel', onTransitionEnd);
        }
        transitions.add(e.propertyName);
    };
    let onTransitionEnd = (e)=>{
        // Remove property from list of transitioning properties.
        let properties = $bbed8b41f857bcc0$var$transitionsByElement.get(e.target);
        if (!properties) return;
        properties.delete(e.propertyName);
        // If empty, remove transitioncancel event, and remove the element from the list of transitioning elements.
        if (properties.size === 0) {
            e.target.removeEventListener('transitioncancel', onTransitionEnd);
            $bbed8b41f857bcc0$var$transitionsByElement.delete(e.target);
        }
        // If no transitioning elements, call all of the queued callbacks.
        if ($bbed8b41f857bcc0$var$transitionsByElement.size === 0) {
            for (let cb of $bbed8b41f857bcc0$var$transitionCallbacks)cb();
            $bbed8b41f857bcc0$var$transitionCallbacks.clear();
        }
    };
    document.body.addEventListener('transitionrun', onTransitionStart);
    document.body.addEventListener('transitionend', onTransitionEnd);
}
if (typeof document !== 'undefined') {
    if (document.readyState !== 'loading') $bbed8b41f857bcc0$var$setupGlobalEvents();
    else document.addEventListener('DOMContentLoaded', $bbed8b41f857bcc0$var$setupGlobalEvents);
}
function $bbed8b41f857bcc0$export$24490316f764c430(fn) {
    // Wait one frame to see if an animation starts, e.g. a transition on mount.
    requestAnimationFrame(()=>{
        // If no transitions are running, call the function immediately.
        // Otherwise, add it to a list of callbacks to run at the end of the animation.
        if ($bbed8b41f857bcc0$var$transitionsByElement.size === 0) fn();
        else $bbed8b41f857bcc0$var$transitionCallbacks.add(fn);
    });
}




// Keep track of elements that we are currently handling dragging for via useDrag1D.
// If there's an ancestor and a descendant both using useDrag1D(), and the user starts
// dragging the descendant, we don't want useDrag1D events to fire for the ancestor.
const $9cc09df9fd7676be$var$draggingElements = (/* unused pure expression or super */ null && ([]));
function $9cc09df9fd7676be$export$7bbed75feba39706(props) {
    console.warn('useDrag1D is deprecated, please use `useMove` instead https://react-spectrum.adobe.com/react-aria/useMove.html');
    let { containerRef: containerRef , reverse: reverse , orientation: orientation , onHover: onHover , onDrag: onDrag , onPositionChange: onPositionChange , onIncrement: onIncrement , onDecrement: onDecrement , onIncrementToMax: onIncrementToMax , onDecrementToMin: onDecrementToMin , onCollapseToggle: onCollapseToggle  } = props;
    let getPosition = (e)=>orientation === 'horizontal' ? e.clientX : e.clientY
    ;
    let getNextOffset = (e)=>{
        let containerOffset = $ab71dadb03a6fb2e$export$622cea445a1c5b7d(containerRef.current, reverse, orientation);
        let mouseOffset = getPosition(e);
        let nextOffset = reverse ? containerOffset - mouseOffset : mouseOffset - containerOffset;
        return nextOffset;
    };
    let dragging = $12uGp$useRef(false);
    let prevPosition = $12uGp$useRef(0);
    // Keep track of the current handlers in a ref so that the events can access them.
    let handlers = $12uGp$useRef({
        onPositionChange: onPositionChange,
        onDrag: onDrag
    });
    handlers.current.onDrag = onDrag;
    handlers.current.onPositionChange = onPositionChange;
    let onMouseDragged = (e)=>{
        e.preventDefault();
        let nextOffset = getNextOffset(e);
        if (!dragging.current) {
            dragging.current = true;
            if (handlers.current.onDrag) handlers.current.onDrag(true);
            if (handlers.current.onPositionChange) handlers.current.onPositionChange(nextOffset);
        }
        if (prevPosition.current === nextOffset) return;
        prevPosition.current = nextOffset;
        if (onPositionChange) onPositionChange(nextOffset);
    };
    let onMouseUp = (e)=>{
        const target = e.target;
        dragging.current = false;
        let nextOffset = getNextOffset(e);
        if (handlers.current.onDrag) handlers.current.onDrag(false);
        if (handlers.current.onPositionChange) handlers.current.onPositionChange(nextOffset);
        $9cc09df9fd7676be$var$draggingElements.splice($9cc09df9fd7676be$var$draggingElements.indexOf(target), 1);
        window.removeEventListener('mouseup', onMouseUp, false);
        window.removeEventListener('mousemove', onMouseDragged, false);
    };
    let onMouseDown = (e)=>{
        const target = e.currentTarget;
        // If we're already handling dragging on a descendant with useDrag1D, then
        // we don't want to handle the drag motion on this target as well.
        if ($9cc09df9fd7676be$var$draggingElements.some((elt)=>target.contains(elt)
        )) return;
        $9cc09df9fd7676be$var$draggingElements.push(target);
        window.addEventListener('mousemove', onMouseDragged, false);
        window.addEventListener('mouseup', onMouseUp, false);
    };
    let onMouseEnter = ()=>{
        if (onHover) onHover(true);
    };
    let onMouseOut = ()=>{
        if (onHover) onHover(false);
    };
    let onKeyDown = (e)=>{
        switch(e.key){
            case 'Left':
            case 'ArrowLeft':
                if (orientation === 'horizontal') {
                    e.preventDefault();
                    if (onDecrement && !reverse) onDecrement();
                    else if (onIncrement && reverse) onIncrement();
                }
                break;
            case 'Up':
            case 'ArrowUp':
                if (orientation === 'vertical') {
                    e.preventDefault();
                    if (onDecrement && !reverse) onDecrement();
                    else if (onIncrement && reverse) onIncrement();
                }
                break;
            case 'Right':
            case 'ArrowRight':
                if (orientation === 'horizontal') {
                    e.preventDefault();
                    if (onIncrement && !reverse) onIncrement();
                    else if (onDecrement && reverse) onDecrement();
                }
                break;
            case 'Down':
            case 'ArrowDown':
                if (orientation === 'vertical') {
                    e.preventDefault();
                    if (onIncrement && !reverse) onIncrement();
                    else if (onDecrement && reverse) onDecrement();
                }
                break;
            case 'Home':
                e.preventDefault();
                if (onDecrementToMin) onDecrementToMin();
                break;
            case 'End':
                e.preventDefault();
                if (onIncrementToMax) onIncrementToMax();
                break;
            case 'Enter':
                e.preventDefault();
                if (onCollapseToggle) onCollapseToggle();
                break;
        }
    };
    return {
        onMouseDown: onMouseDown,
        onMouseEnter: onMouseEnter,
        onMouseOut: onMouseOut,
        onKeyDown: onKeyDown
    };
}



function $03deb23ff14920c4$export$4eaf04e54aa8eed6() {
    let globalListeners = $12uGp$useRef(new Map());
    let addGlobalListener = $12uGp$useCallback((eventTarget, type, listener, options)=>{
        // Make sure we remove the listener after it is called with the `once` option.
        let fn = (options === null || options === void 0 ? void 0 : options.once) ? (...args)=>{
            globalListeners.current.delete(listener);
            listener(...args);
        } : listener;
        globalListeners.current.set(listener, {
            type: type,
            eventTarget: eventTarget,
            fn: fn,
            options: options
        });
        eventTarget.addEventListener(type, listener, options);
    }, []);
    let removeGlobalListener = $12uGp$useCallback((eventTarget, type, listener, options)=>{
        var ref;
        let fn = ((ref = globalListeners.current.get(listener)) === null || ref === void 0 ? void 0 : ref.fn) || listener;
        eventTarget.removeEventListener(type, fn, options);
        globalListeners.current.delete(listener);
    }, []);
    let removeAllGlobalListeners = $12uGp$useCallback(()=>{
        globalListeners.current.forEach((value, key)=>{
            removeGlobalListener(value.eventTarget, value.type, key, value.options);
        });
    }, [
        removeGlobalListener
    ]);
    // eslint-disable-next-line arrow-body-style
    $12uGp$useEffect(()=>{
        return removeAllGlobalListeners;
    }, [
        removeAllGlobalListeners
    ]);
    return {
        addGlobalListener: addGlobalListener,
        removeGlobalListener: removeGlobalListener,
        removeAllGlobalListeners: removeAllGlobalListeners
    };
}



function $313b98861ee5dd6c$export$d6875122194c7b44(props, defaultLabel) {
    let { id: id , 'aria-label': label , 'aria-labelledby': labelledBy  } = props;
    // If there is both an aria-label and aria-labelledby,
    // combine them by pointing to the element itself.
    id = $bdb11010cef70236$export$f680877a34711e37(id);
    if (labelledBy && label) {
        let ids = new Set([
            ...labelledBy.trim().split(/\s+/),
            id
        ]);
        labelledBy = [
            ...ids
        ].join(' ');
    } else if (labelledBy) labelledBy = labelledBy.trim().split(/\s+/).join(' ');
    // If no labels are provided, use the default
    if (!label && !labelledBy && defaultLabel) label = defaultLabel;
    return {
        id: id,
        'aria-label': label,
        'aria-labelledby': labelledBy
    };
}




function $df56164dff5785e2$export$4338b53315abf666(forwardedRef) {
    const objRef = $12uGp$useRef();
    /**
   * We're using `useLayoutEffect` here instead of `useEffect` because we want
   * to make sure that the `ref` value is up to date before other places in the
   * the execution cycle try to read it.
   */ $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        if (!forwardedRef) return;
        if (typeof forwardedRef === 'function') forwardedRef(objRef.current);
        else forwardedRef.current = objRef.current;
    }, [
        forwardedRef
    ]);
    return objRef;
}



function $4f58c5f72bcf79f7$export$496315a1608d9602(effect, dependencies) {
    const isInitialMount = $12uGp$useRef(true);
    $12uGp$useEffect(()=>{
        if (isInitialMount.current) isInitialMount.current = false;
        else effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
}




function $9daab02d461809db$var$hasResizeObserver() {
    return typeof window.ResizeObserver !== 'undefined';
}
function $9daab02d461809db$export$683480f191c0e3ea(options) {
    const { ref: ref , onResize: onResize  } = options;
    $12uGp$useEffect(()=>{
        let element = ref === null || ref === void 0 ? void 0 : ref.current;
        if (!element) return;
        if (!$9daab02d461809db$var$hasResizeObserver()) {
            window.addEventListener('resize', onResize, false);
            return ()=>{
                window.removeEventListener('resize', onResize, false);
            };
        } else {
            const resizeObserverInstance = new window.ResizeObserver((entries)=>{
                if (!entries.length) return;
                onResize();
            });
            resizeObserverInstance.observe(element);
            return ()=>{
                if (element) resizeObserverInstance.unobserve(element);
            };
        }
    }, [
        onResize,
        ref
    ]);
}



function $e7801be82b4b2a53$export$4debdb1a3f0fa79e(context, ref) {
    $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        if (context && context.ref && ref) {
            context.ref.current = ref.current;
            return ()=>{
                context.ref.current = null;
            };
        }
    }, [
        context,
        ref
    ]);
}


function $62d8ded9296f3872$export$cfa2225e87938781(node) {
    while(node && !$62d8ded9296f3872$var$isScrollable(node))node = node.parentElement;
    return node || document.scrollingElement || document.documentElement;
}
function $62d8ded9296f3872$var$isScrollable(node) {
    let style = window.getComputedStyle(node);
    return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}



// @ts-ignore
let $5df64b3807dc15ee$var$visualViewport = typeof window !== 'undefined' && window.visualViewport;
function $5df64b3807dc15ee$export$d699905dd57c73ca() {
    let [size1, setSize] = $12uGp$useState(()=>$5df64b3807dc15ee$var$getViewportSize()
    );
    $12uGp$useEffect(()=>{
        // Use visualViewport api to track available height even on iOS virtual keyboard opening
        let onResize = ()=>{
            setSize((size)=>{
                let newSize = $5df64b3807dc15ee$var$getViewportSize();
                if (newSize.width === size.width && newSize.height === size.height) return size;
                return newSize;
            });
        };
        if (!$5df64b3807dc15ee$var$visualViewport) window.addEventListener('resize', onResize);
        else $5df64b3807dc15ee$var$visualViewport.addEventListener('resize', onResize);
        return ()=>{
            if (!$5df64b3807dc15ee$var$visualViewport) window.removeEventListener('resize', onResize);
            else $5df64b3807dc15ee$var$visualViewport.removeEventListener('resize', onResize);
        };
    }, []);
    return size1;
}
function $5df64b3807dc15ee$var$getViewportSize() {
    return {
        width: ($5df64b3807dc15ee$var$visualViewport === null || $5df64b3807dc15ee$var$visualViewport === void 0 ? void 0 : $5df64b3807dc15ee$var$visualViewport.width) || window.innerWidth,
        height: ($5df64b3807dc15ee$var$visualViewport === null || $5df64b3807dc15ee$var$visualViewport === void 0 ? void 0 : $5df64b3807dc15ee$var$visualViewport.height) || window.innerHeight
    };
}




let $ef06256079686ba0$var$descriptionId = 0;
const $ef06256079686ba0$var$descriptionNodes = new Map();
function $ef06256079686ba0$export$f8aeda7b10753fa1(description) {
    let [id1, setId] = $12uGp$useState(undefined);
    $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        if (!description) return;
        let desc = $ef06256079686ba0$var$descriptionNodes.get(description);
        if (!desc) {
            let id = `react-aria-description-${$ef06256079686ba0$var$descriptionId++}`;
            setId(id);
            let node = document.createElement('div');
            node.id = id;
            node.style.display = 'none';
            node.textContent = description;
            document.body.appendChild(node);
            desc = {
                refCount: 0,
                element: node
            };
            $ef06256079686ba0$var$descriptionNodes.set(description, desc);
        } else setId(desc.element.id);
        desc.refCount++;
        return ()=>{
            if (--desc.refCount === 0) {
                desc.element.remove();
                $ef06256079686ba0$var$descriptionNodes.delete(description);
            }
        };
    }, [
        description
    ]);
    return {
        'aria-describedby': description ? id1 : undefined
    };
}


/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ function $c87311424ea30a05$var$testUserAgent(re) {
    var ref;
    if (typeof window === 'undefined' || window.navigator == null) return false;
    return ((ref = window.navigator['userAgentData']) === null || ref === void 0 ? void 0 : ref.brands.some((brand)=>re.test(brand.brand)
    )) || re.test(window.navigator.userAgent);
}
function $c87311424ea30a05$var$testPlatform(re) {
    var ref;
    return typeof window !== 'undefined' && window.navigator != null ? re.test(((ref = window.navigator['userAgentData']) === null || ref === void 0 ? void 0 : ref.platform) || window.navigator.platform) : false;
}
function $c87311424ea30a05$export$9ac100e40613ea10() {
    return $c87311424ea30a05$var$testPlatform(/^Mac/i);
}
function $c87311424ea30a05$export$186c6964ca17d99() {
    return $c87311424ea30a05$var$testPlatform(/^iPhone/i);
}
function $c87311424ea30a05$export$7bef049ce92e4224() {
    return $c87311424ea30a05$var$testPlatform(/^iPad/i) || $c87311424ea30a05$export$9ac100e40613ea10() && navigator.maxTouchPoints > 1;
}
function $c87311424ea30a05$export$fedb369cb70207f1() {
    return $c87311424ea30a05$export$186c6964ca17d99() || $c87311424ea30a05$export$7bef049ce92e4224();
}
function $c87311424ea30a05$export$e1865c3bedcd822b() {
    return $c87311424ea30a05$export$9ac100e40613ea10() || $c87311424ea30a05$export$fedb369cb70207f1();
}
function $c87311424ea30a05$export$78551043582a6a98() {
    return $c87311424ea30a05$var$testUserAgent(/AppleWebKit/i) && !$c87311424ea30a05$export$6446a186d09e379e();
}
function $c87311424ea30a05$export$6446a186d09e379e() {
    return $c87311424ea30a05$var$testUserAgent(/Chrome/i);
}
function $c87311424ea30a05$export$a11b0059900ceec8() {
    return $c87311424ea30a05$var$testUserAgent(/Android/i);
}



function $e9faafb641e167db$export$90fc3a17d93f704c(ref, event, handler1, options) {
    let handlerRef = $12uGp$useRef(handler1);
    handlerRef.current = handler1;
    let isDisabled = handler1 == null;
    $12uGp$useEffect(()=>{
        if (isDisabled) return;
        let element = ref.current;
        let handler = (e)=>handlerRef.current.call(this, e)
        ;
        element.addEventListener(event, handler, options);
        return ()=>{
            element.removeEventListener(event, handler, options);
        };
    }, [
        ref,
        event,
        options,
        isDisabled
    ]);
}




function $1dbecbe27a04f9af$export$14d238f342723f25(defaultValue) {
    let [value, setValue] = $12uGp$useState(defaultValue);
    let valueRef = $12uGp$useRef(value);
    let effect = $12uGp$useRef(null);
    valueRef.current = value;
    // Store the function in a ref so we can always access the current version
    // which has the proper `value` in scope.
    let nextRef = $12uGp$useRef(null);
    nextRef.current = ()=>{
        // Run the generator to the next yield.
        let newValue = effect.current.next();
        // If the generator is done, reset the effect.
        if (newValue.done) {
            effect.current = null;
            return;
        }
        // If the value is the same as the current value,
        // then continue to the next yield. Otherwise,
        // set the value in state and wait for the next layout effect.
        if (value === newValue.value) nextRef.current();
        else setValue(newValue.value);
    };
    $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        // If there is an effect currently running, continue to the next yield.
        if (effect.current) nextRef.current();
    });
    let queue = $12uGp$useCallback((fn)=>{
        effect.current = fn(valueRef.current);
        nextRef.current();
    }, [
        effect,
        nextRef
    ]);
    return [
        value,
        queue
    ];
}


function $2f04cbc44ee30ce0$export$53a0910f038337bd(scrollView, element) {
    let offsetX = $2f04cbc44ee30ce0$var$relativeOffset(scrollView, element, 'left');
    let offsetY = $2f04cbc44ee30ce0$var$relativeOffset(scrollView, element, 'top');
    let width = element.offsetWidth;
    let height = element.offsetHeight;
    let x = scrollView.scrollLeft;
    let y = scrollView.scrollTop;
    let maxX = x + scrollView.offsetWidth;
    let maxY = y + scrollView.offsetHeight;
    if (offsetX <= x) x = offsetX;
    else if (offsetX + width > maxX) x += offsetX + width - maxX;
    if (offsetY <= y) y = offsetY;
    else if (offsetY + height > maxY) y += offsetY + height - maxY;
    scrollView.scrollLeft = x;
    scrollView.scrollTop = y;
}
/**
 * Computes the offset left or top from child to ancestor by accumulating
 * offsetLeft or offsetTop through intervening offsetParents.
 */ function $2f04cbc44ee30ce0$var$relativeOffset(ancestor, child, axis) {
    const prop = axis === 'left' ? 'offsetLeft' : 'offsetTop';
    let sum = 0;
    while(child.offsetParent){
        sum += child[prop];
        if (child.offsetParent === ancestor) break;
        else if (child.offsetParent.contains(ancestor)) {
            // If the ancestor is not `position:relative`, then we stop at
            // _its_ offset parent, and we subtract off _its_ offset, so that
            // we end up with the proper offset from child to ancestor.
            sum -= ancestor[prop];
            break;
        }
        child = child.offsetParent;
    }
    return sum;
}




function $6a7db85432448f7f$export$60278871457622de(event) {
    // JAWS/NVDA with Firefox.
    if (event.mozInputSource === 0 && event.isTrusted) return true;
    // Android TalkBack's detail value varies depending on the event listener providing the event so we have specific logic here instead
    // If pointerType is defined, event is from a click listener. For events from mousedown listener, detail === 0 is a sufficient check
    // to detect TalkBack virtual clicks.
    if ($c87311424ea30a05$export$a11b0059900ceec8() && event.pointerType) return event.type === 'click' && event.buttons === 1;
    return event.detail === 0 && !event.pointerType;
}
function $6a7db85432448f7f$export$29bf1b5f2c56cf63(event) {
    // If the pointer size is zero, then we assume it's from a screen reader.
    // Android TalkBack double tap will sometimes return a event with width and height of 1
    // and pointerType === 'mouse' so we need to check for a specific combination of event attributes.
    // Cannot use "event.pressure === 0" as the sole check due to Safari pointer events always returning pressure === 0
    // instead of .5, see https://bugs.webkit.org/show_bug.cgi?id=206216. event.pointerType === 'mouse' is to distingush
    // Talkback double tap from Windows Firefox touch screen press
    return event.width === 0 && event.height === 0 || event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === 'mouse';
}





//# sourceMappingURL=module.js.map

;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/node_modules/@react-aria/focus/node_modules/@react-aria/interactions/dist/module.js





// Note that state only matters here for iOS. Non-iOS gets user-select: none applied to the target element
// rather than at the document level so we just need to apply/remove user-select: none for each pressed element individually
let $14c0b72509d70225$var$state = 'default';
let $14c0b72509d70225$var$savedUserSelect = '';
let $14c0b72509d70225$var$modifiedElementMap = new WeakMap();
function $14c0b72509d70225$export$16a4697467175487(target) {
    if ($bx7SL$isIOS()) {
        if ($14c0b72509d70225$var$state === 'default') {
            $14c0b72509d70225$var$savedUserSelect = document.documentElement.style.webkitUserSelect;
            document.documentElement.style.webkitUserSelect = 'none';
        }
        $14c0b72509d70225$var$state = 'disabled';
    } else if (target instanceof HTMLElement || target instanceof SVGElement) {
        // If not iOS, store the target's original user-select and change to user-select: none
        // Ignore state since it doesn't apply for non iOS
        $14c0b72509d70225$var$modifiedElementMap.set(target, target.style.userSelect);
        target.style.userSelect = 'none';
    }
}
function $14c0b72509d70225$export$b0d6fa1ab32e3295(target) {
    if ($bx7SL$isIOS()) {
        // If the state is already default, there's nothing to do.
        // If it is restoring, then there's no need to queue a second restore.
        if ($14c0b72509d70225$var$state !== 'disabled') return;
        $14c0b72509d70225$var$state = 'restoring';
        // There appears to be a delay on iOS where selection still might occur
        // after pointer up, so wait a bit before removing user-select.
        setTimeout(()=>{
            // Wait for any CSS transitions to complete so we don't recompute style
            // for the whole page in the middle of the animation and cause jank.
            $bx7SL$runAfterTransition(()=>{
                // Avoid race conditions
                if ($14c0b72509d70225$var$state === 'restoring') {
                    if (document.documentElement.style.webkitUserSelect === 'none') document.documentElement.style.webkitUserSelect = $14c0b72509d70225$var$savedUserSelect || '';
                    $14c0b72509d70225$var$savedUserSelect = '';
                    $14c0b72509d70225$var$state = 'default';
                }
            });
        }, 300);
    } else if (target instanceof HTMLElement || target instanceof SVGElement) // If not iOS, restore the target's original user-select if any
    // Ignore state since it doesn't apply for non iOS
    {
        if (target && $14c0b72509d70225$var$modifiedElementMap.has(target)) {
            let targetOldUserSelect = $14c0b72509d70225$var$modifiedElementMap.get(target);
            if (target.style.userSelect === 'none') target.style.userSelect = targetOldUserSelect;
            if (target.getAttribute('style') === '') target.removeAttribute('style');
            $14c0b72509d70225$var$modifiedElementMap.delete(target);
        }
    }
}




const $ae1eeba8b9eafd08$export$5165eccb35aaadb5 = react.createContext(null);
$ae1eeba8b9eafd08$export$5165eccb35aaadb5.displayName = 'PressResponderContext';



function $f6c31cce2adf654f$var$usePressResponderContext(props) {
    // Consume context from <PressResponder> and merge with props.
    let context = $bx7SL$useContext($ae1eeba8b9eafd08$export$5165eccb35aaadb5);
    if (context) {
        let { register: register , ...contextProps } = context;
        props = $bx7SL$mergeProps(contextProps, props);
        register();
    }
    $bx7SL$useSyncRef(context, props.ref);
    return props;
}
function $f6c31cce2adf654f$export$45712eceda6fad21(props) {
    let { onPress: onPress1 , onPressChange: onPressChange1 , onPressStart: onPressStart1 , onPressEnd: onPressEnd1 , onPressUp: onPressUp1 , isDisabled: isDisabled1 , isPressed: isPressedProp , preventFocusOnPress: preventFocusOnPress , shouldCancelOnPointerExit: shouldCancelOnPointerExit , allowTextSelectionOnPress: allowTextSelectionOnPress , // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref: _ , ...domProps } = $f6c31cce2adf654f$var$usePressResponderContext(props);
    let propsRef = $bx7SL$useRef(null);
    propsRef.current = {
        onPress: onPress1,
        onPressChange: onPressChange1,
        onPressStart: onPressStart1,
        onPressEnd: onPressEnd1,
        onPressUp: onPressUp1,
        isDisabled: isDisabled1,
        shouldCancelOnPointerExit: shouldCancelOnPointerExit
    };
    let [isPressed, setPressed] = $bx7SL$useState(false);
    let ref = $bx7SL$useRef({
        isPressed: false,
        ignoreEmulatedMouseEvents: false,
        ignoreClickAfterPress: false,
        didFirePressStart: false,
        activePointerId: null,
        target: null,
        isOverTarget: false,
        pointerType: null
    });
    let { addGlobalListener: addGlobalListener , removeAllGlobalListeners: removeAllGlobalListeners  } = $bx7SL$useGlobalListeners();
    let pressProps1 = $bx7SL$useMemo(()=>{
        let state = ref.current;
        let triggerPressStart = (originalEvent, pointerType)=>{
            let { onPressStart: onPressStart , onPressChange: onPressChange , isDisabled: isDisabled  } = propsRef.current;
            if (isDisabled || state.didFirePressStart) return;
            if (onPressStart) onPressStart({
                type: 'pressstart',
                pointerType: pointerType,
                target: originalEvent.currentTarget,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
            if (onPressChange) onPressChange(true);
            state.didFirePressStart = true;
            setPressed(true);
        };
        let triggerPressEnd = (originalEvent, pointerType, wasPressed = true)=>{
            let { onPressEnd: onPressEnd , onPressChange: onPressChange , onPress: onPress , isDisabled: isDisabled  } = propsRef.current;
            if (!state.didFirePressStart) return;
            state.ignoreClickAfterPress = true;
            state.didFirePressStart = false;
            if (onPressEnd) onPressEnd({
                type: 'pressend',
                pointerType: pointerType,
                target: originalEvent.currentTarget,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
            if (onPressChange) onPressChange(false);
            setPressed(false);
            if (onPress && wasPressed && !isDisabled) onPress({
                type: 'press',
                pointerType: pointerType,
                target: originalEvent.currentTarget,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
        };
        let triggerPressUp = (originalEvent, pointerType)=>{
            let { onPressUp: onPressUp , isDisabled: isDisabled  } = propsRef.current;
            if (isDisabled) return;
            if (onPressUp) onPressUp({
                type: 'pressup',
                pointerType: pointerType,
                target: originalEvent.currentTarget,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
        };
        let cancel = (e)=>{
            if (state.isPressed) {
                if (state.isOverTarget) triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
                state.isPressed = false;
                state.isOverTarget = false;
                state.activePointerId = null;
                state.pointerType = null;
                removeAllGlobalListeners();
                if (!allowTextSelectionOnPress) $14c0b72509d70225$export$b0d6fa1ab32e3295(state.target);
            }
        };
        let pressProps = {
            onKeyDown (e) {
                if ($f6c31cce2adf654f$var$isValidKeyboardEvent(e.nativeEvent, e.currentTarget) && e.currentTarget.contains(e.target)) {
                    if ($f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(e.target, e.key)) e.preventDefault();
                    e.stopPropagation();
                    // If the event is repeating, it may have started on a different element
                    // after which focus moved to the current element. Ignore these events and
                    // only handle the first key down event.
                    if (!state.isPressed && !e.repeat) {
                        state.target = e.currentTarget;
                        state.isPressed = true;
                        triggerPressStart(e, 'keyboard');
                        // Focus may move before the key up event, so register the event on the document
                        // instead of the same element where the key down event occurred.
                        addGlobalListener(document, 'keyup', onKeyUp, false);
                    }
                } else if (e.key === 'Enter' && $f6c31cce2adf654f$var$isHTMLAnchorLink(e.currentTarget)) // If the target is a link, we won't have handled this above because we want the default
                // browser behavior to open the link when pressing Enter. But we still need to prevent
                // default so that elements above do not also handle it (e.g. table row).
                e.stopPropagation();
            },
            onKeyUp (e) {
                if ($f6c31cce2adf654f$var$isValidKeyboardEvent(e.nativeEvent, e.currentTarget) && !e.repeat && e.currentTarget.contains(e.target)) triggerPressUp($f6c31cce2adf654f$var$createEvent(state.target, e), 'keyboard');
            },
            onClick (e) {
                if (e && !e.currentTarget.contains(e.target)) return;
                if (e && e.button === 0) {
                    e.stopPropagation();
                    if (isDisabled1) e.preventDefault();
                    // If triggered from a screen reader or by using element.click(),
                    // trigger as if it were a keyboard click.
                    if (!state.ignoreClickAfterPress && !state.ignoreEmulatedMouseEvents && (state.pointerType === 'virtual' || $bx7SL$isVirtualClick(e.nativeEvent))) {
                        // Ensure the element receives focus (VoiceOver on iOS does not do this)
                        if (!isDisabled1 && !preventFocusOnPress) $bx7SL$focusWithoutScrolling(e.currentTarget);
                        triggerPressStart(e, 'virtual');
                        triggerPressUp(e, 'virtual');
                        triggerPressEnd(e, 'virtual');
                    }
                    state.ignoreEmulatedMouseEvents = false;
                    state.ignoreClickAfterPress = false;
                }
            }
        };
        let onKeyUp = (e)=>{
            if (state.isPressed && $f6c31cce2adf654f$var$isValidKeyboardEvent(e, state.target)) {
                if ($f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(e.target, e.key)) e.preventDefault();
                e.stopPropagation();
                state.isPressed = false;
                let target = e.target;
                triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), 'keyboard', state.target.contains(target));
                removeAllGlobalListeners();
                // If the target is a link, trigger the click method to open the URL,
                // but defer triggering pressEnd until onClick event handler.
                if (state.target instanceof HTMLElement && state.target.contains(target) && ($f6c31cce2adf654f$var$isHTMLAnchorLink(state.target) || state.target.getAttribute('role') === 'link')) state.target.click();
            }
        };
        if (typeof PointerEvent !== 'undefined') {
            pressProps.onPointerDown = (e)=>{
                // Only handle left clicks, and ignore events that bubbled through portals.
                if (e.button !== 0 || !e.currentTarget.contains(e.target)) return;
                // iOS safari fires pointer events from VoiceOver with incorrect coordinates/target.
                // Ignore and let the onClick handler take care of it instead.
                // https://bugs.webkit.org/show_bug.cgi?id=222627
                // https://bugs.webkit.org/show_bug.cgi?id=223202
                if ($bx7SL$isVirtualPointerEvent(e.nativeEvent)) {
                    state.pointerType = 'virtual';
                    return;
                }
                // Due to browser inconsistencies, especially on mobile browsers, we prevent
                // default on pointer down and handle focusing the pressable element ourselves.
                if ($f6c31cce2adf654f$var$shouldPreventDefault(e.currentTarget)) e.preventDefault();
                state.pointerType = e.pointerType;
                e.stopPropagation();
                if (!state.isPressed) {
                    state.isPressed = true;
                    state.isOverTarget = true;
                    state.activePointerId = e.pointerId;
                    state.target = e.currentTarget;
                    if (!isDisabled1 && !preventFocusOnPress) $bx7SL$focusWithoutScrolling(e.currentTarget);
                    if (!allowTextSelectionOnPress) $14c0b72509d70225$export$16a4697467175487(state.target);
                    triggerPressStart(e, state.pointerType);
                    addGlobalListener(document, 'pointermove', onPointerMove, false);
                    addGlobalListener(document, 'pointerup', onPointerUp, false);
                    addGlobalListener(document, 'pointercancel', onPointerCancel, false);
                }
            };
            pressProps.onMouseDown = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                if (e.button === 0) {
                    // Chrome and Firefox on touch Windows devices require mouse down events
                    // to be canceled in addition to pointer events, or an extra asynchronous
                    // focus event will be fired.
                    if ($f6c31cce2adf654f$var$shouldPreventDefault(e.currentTarget)) e.preventDefault();
                    e.stopPropagation();
                }
            };
            pressProps.onPointerUp = (e)=>{
                // iOS fires pointerup with zero width and height, so check the pointerType recorded during pointerdown.
                if (!e.currentTarget.contains(e.target) || state.pointerType === 'virtual') return;
                // Only handle left clicks
                // Safari on iOS sometimes fires pointerup events, even
                // when the touch isn't over the target, so double check.
                if (e.button === 0 && $f6c31cce2adf654f$var$isOverTarget(e, e.currentTarget)) triggerPressUp(e, state.pointerType || e.pointerType);
            };
            // Safari on iOS < 13.2 does not implement pointerenter/pointerleave events correctly.
            // Use pointer move events instead to implement our own hit testing.
            // See https://bugs.webkit.org/show_bug.cgi?id=199803
            let onPointerMove = (e)=>{
                if (e.pointerId !== state.activePointerId) return;
                if ($f6c31cce2adf654f$var$isOverTarget(e, state.target)) {
                    if (!state.isOverTarget) {
                        state.isOverTarget = true;
                        triggerPressStart($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType);
                    }
                } else if (state.isOverTarget) {
                    state.isOverTarget = false;
                    triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
                    if (propsRef.current.shouldCancelOnPointerExit) cancel(e);
                }
            };
            let onPointerUp = (e)=>{
                if (e.pointerId === state.activePointerId && state.isPressed && e.button === 0) {
                    if ($f6c31cce2adf654f$var$isOverTarget(e, state.target)) triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType);
                    else if (state.isOverTarget) triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
                    state.isPressed = false;
                    state.isOverTarget = false;
                    state.activePointerId = null;
                    state.pointerType = null;
                    removeAllGlobalListeners();
                    if (!allowTextSelectionOnPress) $14c0b72509d70225$export$b0d6fa1ab32e3295(state.target);
                }
            };
            let onPointerCancel = (e)=>{
                cancel(e);
            };
            pressProps.onDragStart = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                // Safari does not call onPointerCancel when a drag starts, whereas Chrome and Firefox do.
                cancel(e);
            };
        } else {
            pressProps.onMouseDown = (e)=>{
                // Only handle left clicks
                if (e.button !== 0 || !e.currentTarget.contains(e.target)) return;
                // Due to browser inconsistencies, especially on mobile browsers, we prevent
                // default on mouse down and handle focusing the pressable element ourselves.
                if ($f6c31cce2adf654f$var$shouldPreventDefault(e.currentTarget)) e.preventDefault();
                e.stopPropagation();
                if (state.ignoreEmulatedMouseEvents) return;
                state.isPressed = true;
                state.isOverTarget = true;
                state.target = e.currentTarget;
                state.pointerType = $bx7SL$isVirtualClick(e.nativeEvent) ? 'virtual' : 'mouse';
                if (!isDisabled1 && !preventFocusOnPress) $bx7SL$focusWithoutScrolling(e.currentTarget);
                triggerPressStart(e, state.pointerType);
                addGlobalListener(document, 'mouseup', onMouseUp, false);
            };
            pressProps.onMouseEnter = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (state.isPressed && !state.ignoreEmulatedMouseEvents) {
                    state.isOverTarget = true;
                    triggerPressStart(e, state.pointerType);
                }
            };
            pressProps.onMouseLeave = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (state.isPressed && !state.ignoreEmulatedMouseEvents) {
                    state.isOverTarget = false;
                    triggerPressEnd(e, state.pointerType, false);
                    if (propsRef.current.shouldCancelOnPointerExit) cancel(e);
                }
            };
            pressProps.onMouseUp = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                if (!state.ignoreEmulatedMouseEvents && e.button === 0) triggerPressUp(e, state.pointerType);
            };
            let onMouseUp = (e)=>{
                // Only handle left clicks
                if (e.button !== 0) return;
                state.isPressed = false;
                removeAllGlobalListeners();
                if (state.ignoreEmulatedMouseEvents) {
                    state.ignoreEmulatedMouseEvents = false;
                    return;
                }
                if ($f6c31cce2adf654f$var$isOverTarget(e, state.target)) triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType);
                else if (state.isOverTarget) triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
                state.isOverTarget = false;
            };
            pressProps.onTouchStart = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                let touch = $f6c31cce2adf654f$var$getTouchFromEvent(e.nativeEvent);
                if (!touch) return;
                state.activePointerId = touch.identifier;
                state.ignoreEmulatedMouseEvents = true;
                state.isOverTarget = true;
                state.isPressed = true;
                state.target = e.currentTarget;
                state.pointerType = 'touch';
                // Due to browser inconsistencies, especially on mobile browsers, we prevent default
                // on the emulated mouse event and handle focusing the pressable element ourselves.
                if (!isDisabled1 && !preventFocusOnPress) $bx7SL$focusWithoutScrolling(e.currentTarget);
                if (!allowTextSelectionOnPress) $14c0b72509d70225$export$16a4697467175487(state.target);
                triggerPressStart(e, state.pointerType);
                addGlobalListener(window, 'scroll', onScroll, true);
            };
            pressProps.onTouchMove = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (!state.isPressed) return;
                let touch = $f6c31cce2adf654f$var$getTouchById(e.nativeEvent, state.activePointerId);
                if (touch && $f6c31cce2adf654f$var$isOverTarget(touch, e.currentTarget)) {
                    if (!state.isOverTarget) {
                        state.isOverTarget = true;
                        triggerPressStart(e, state.pointerType);
                    }
                } else if (state.isOverTarget) {
                    state.isOverTarget = false;
                    triggerPressEnd(e, state.pointerType, false);
                    if (propsRef.current.shouldCancelOnPointerExit) cancel(e);
                }
            };
            pressProps.onTouchEnd = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (!state.isPressed) return;
                let touch = $f6c31cce2adf654f$var$getTouchById(e.nativeEvent, state.activePointerId);
                if (touch && $f6c31cce2adf654f$var$isOverTarget(touch, e.currentTarget)) {
                    triggerPressUp(e, state.pointerType);
                    triggerPressEnd(e, state.pointerType);
                } else if (state.isOverTarget) triggerPressEnd(e, state.pointerType, false);
                state.isPressed = false;
                state.activePointerId = null;
                state.isOverTarget = false;
                state.ignoreEmulatedMouseEvents = true;
                if (!allowTextSelectionOnPress) $14c0b72509d70225$export$b0d6fa1ab32e3295(state.target);
                removeAllGlobalListeners();
            };
            pressProps.onTouchCancel = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (state.isPressed) cancel(e);
            };
            let onScroll = (e)=>{
                if (state.isPressed && e.target.contains(state.target)) cancel({
                    currentTarget: state.target,
                    shiftKey: false,
                    ctrlKey: false,
                    metaKey: false,
                    altKey: false
                });
            };
            pressProps.onDragStart = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                cancel(e);
            };
        }
        return pressProps;
    }, [
        addGlobalListener,
        isDisabled1,
        preventFocusOnPress,
        removeAllGlobalListeners,
        allowTextSelectionOnPress
    ]);
    // Remove user-select: none in case component unmounts immediately after pressStart
    // eslint-disable-next-line arrow-body-style
    $bx7SL$useEffect(()=>{
        return ()=>{
            if (!allowTextSelectionOnPress) $14c0b72509d70225$export$b0d6fa1ab32e3295(ref.current.target);
        };
    }, [
        allowTextSelectionOnPress
    ]);
    return {
        isPressed: isPressedProp || isPressed,
        pressProps: $bx7SL$mergeProps(domProps, pressProps1)
    };
}
function $f6c31cce2adf654f$var$isHTMLAnchorLink(target) {
    return target.tagName === 'A' && target.hasAttribute('href');
}
function $f6c31cce2adf654f$var$isValidKeyboardEvent(event, currentTarget) {
    const { key: key , code: code  } = event;
    const element = currentTarget;
    const role = element.getAttribute('role');
    // Accessibility for keyboards. Space and Enter only.
    // "Spacebar" is for IE 11
    return (key === 'Enter' || key === ' ' || key === 'Spacebar' || code === 'Space') && !(element instanceof HTMLInputElement && !$f6c31cce2adf654f$var$isValidInputKey(element, key) || element instanceof HTMLTextAreaElement || element.isContentEditable) && (!$f6c31cce2adf654f$var$isHTMLAnchorLink(element) || role === 'button' && key !== 'Enter') && // An element with role='link' should only trigger with Enter key
    !(role === 'link' && key !== 'Enter');
}
function $f6c31cce2adf654f$var$getTouchFromEvent(event) {
    const { targetTouches: targetTouches  } = event;
    if (targetTouches.length > 0) return targetTouches[0];
    return null;
}
function $f6c31cce2adf654f$var$getTouchById(event, pointerId) {
    const changedTouches = event.changedTouches;
    for(let i = 0; i < changedTouches.length; i++){
        const touch = changedTouches[i];
        if (touch.identifier === pointerId) return touch;
    }
    return null;
}
function $f6c31cce2adf654f$var$createEvent(target, e) {
    return {
        currentTarget: target,
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey
    };
}
function $f6c31cce2adf654f$var$getPointClientRect(point) {
    let offsetX = point.width / 2 || point.radiusX || 0;
    let offsetY = point.height / 2 || point.radiusY || 0;
    return {
        top: point.clientY - offsetY,
        right: point.clientX + offsetX,
        bottom: point.clientY + offsetY,
        left: point.clientX - offsetX
    };
}
function $f6c31cce2adf654f$var$areRectanglesOverlapping(a, b) {
    // check if they cannot overlap on x axis
    if (a.left > b.right || b.left > a.right) return false;
    // check if they cannot overlap on y axis
    if (a.top > b.bottom || b.top > a.bottom) return false;
    return true;
}
function $f6c31cce2adf654f$var$isOverTarget(point, target) {
    let rect = target.getBoundingClientRect();
    let pointRect = $f6c31cce2adf654f$var$getPointClientRect(point);
    return $f6c31cce2adf654f$var$areRectanglesOverlapping(rect, pointRect);
}
function $f6c31cce2adf654f$var$shouldPreventDefault(target) {
    // We cannot prevent default if the target is a draggable element.
    return !(target instanceof HTMLElement) || !target.draggable;
}
function $f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(target, key) {
    if (target instanceof HTMLInputElement) return !$f6c31cce2adf654f$var$isValidInputKey(target, key);
    if (target instanceof HTMLButtonElement) return target.type !== 'submit';
    return true;
}
const $f6c31cce2adf654f$var$nonTextInputTypes = new Set([
    'checkbox',
    'radio',
    'range',
    'color',
    'file',
    'image',
    'button',
    'submit',
    'reset'
]);
function $f6c31cce2adf654f$var$isValidInputKey(target, key) {
    // Only space should toggle checkboxes and radios, not enter.
    return target.type === 'checkbox' || target.type === 'radio' ? key === ' ' : $f6c31cce2adf654f$var$nonTextInputTypes.has(target.type);
}



const $3b117e43dc0ca95d$export$27c701ed9e449e99 = /*#__PURE__*/ (/* unused pure expression or super */ null && ($bx7SL$react.forwardRef(({ children: children , ...props }, ref)=>{
    let newRef = $bx7SL$useRef();
    ref = ref !== null && ref !== void 0 ? ref : newRef;
    let { pressProps: pressProps  } = $f6c31cce2adf654f$export$45712eceda6fad21({
        ...props,
        ref: ref
    });
    let child = $bx7SL$react.Children.only(children);
    return(/*#__PURE__*/ $bx7SL$react.cloneElement(child, // @ts-ignore
    {
        ref: ref,
        ...$bx7SL$mergeProps(child.props, pressProps)
    }));
})));





const $f1ab8c75478c6f73$export$3351871ee4b288b8 = /*#__PURE__*/ (/* unused pure expression or super */ null && ($bx7SL$react.forwardRef(({ children: children , ...props }, ref)=>{
    let isRegistered = $bx7SL$useRef(false);
    let prevContext = $bx7SL$useContext($ae1eeba8b9eafd08$export$5165eccb35aaadb5);
    let context = $bx7SL$mergeProps(prevContext || {
    }, {
        ...props,
        ref: ref || (prevContext === null || prevContext === void 0 ? void 0 : prevContext.ref),
        register () {
            isRegistered.current = true;
            if (prevContext) prevContext.register();
        }
    });
    $bx7SL$useSyncRef(prevContext, ref);
    $bx7SL$useEffect(()=>{
        if (!isRegistered.current) console.warn("A PressResponder was rendered without a pressable child. Either call the usePress hook, or wrap your DOM node with <Pressable> component.");
    }, []);
    return(/*#__PURE__*/ $bx7SL$react.createElement($ae1eeba8b9eafd08$export$5165eccb35aaadb5.Provider, {
        value: context
    }, children));
})));





class $8a9cb279dc87e130$export$905e7fc544a71f36 {
    isDefaultPrevented() {
        return this.nativeEvent.defaultPrevented;
    }
    preventDefault() {
        this.defaultPrevented = true;
        this.nativeEvent.preventDefault();
    }
    stopPropagation() {
        this.nativeEvent.stopPropagation();
        this.isPropagationStopped = ()=>true
        ;
    }
    isPropagationStopped() {
        return false;
    }
    persist() {
    }
    constructor(type, nativeEvent){
        this.nativeEvent = nativeEvent;
        this.target = nativeEvent.target;
        this.currentTarget = nativeEvent.currentTarget;
        this.relatedTarget = nativeEvent.relatedTarget;
        this.bubbles = nativeEvent.bubbles;
        this.cancelable = nativeEvent.cancelable;
        this.defaultPrevented = nativeEvent.defaultPrevented;
        this.eventPhase = nativeEvent.eventPhase;
        this.isTrusted = nativeEvent.isTrusted;
        this.timeStamp = nativeEvent.timeStamp;
        this.type = type;
    }
}
function $8a9cb279dc87e130$export$715c682d09d639cc(onBlur) {
    let stateRef = (0,react.useRef)({
        isFocused: false,
        onBlur: onBlur,
        observer: null
    });
    stateRef.current.onBlur = onBlur;
    // Clean up MutationObserver on unmount. See below.
    // eslint-disable-next-line arrow-body-style
    $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        const state = stateRef.current;
        return ()=>{
            if (state.observer) {
                state.observer.disconnect();
                state.observer = null;
            }
        };
    }, []);
    // This function is called during a React onFocus event.
    return (0,react.useCallback)((e1)=>{
        // React does not fire onBlur when an element is disabled. https://github.com/facebook/react/issues/9142
        // Most browsers fire a native focusout event in this case, except for Firefox. In that case, we use a
        // MutationObserver to watch for the disabled attribute, and dispatch these events ourselves.
        // For browsers that do, focusout fires before the MutationObserver, so onBlur should not fire twice.
        if (e1.target instanceof HTMLButtonElement || e1.target instanceof HTMLInputElement || e1.target instanceof HTMLTextAreaElement || e1.target instanceof HTMLSelectElement) {
            stateRef.current.isFocused = true;
            let target = e1.target;
            let onBlurHandler = (e)=>{
                var // For backward compatibility, dispatch a (fake) React synthetic event.
                _current, ref;
                stateRef.current.isFocused = false;
                if (target.disabled) (ref = (_current = stateRef.current).onBlur) === null || ref === void 0 ? void 0 : ref.call(_current, new $8a9cb279dc87e130$export$905e7fc544a71f36('blur', e));
                // We no longer need the MutationObserver once the target is blurred.
                if (stateRef.current.observer) {
                    stateRef.current.observer.disconnect();
                    stateRef.current.observer = null;
                }
            };
            target.addEventListener('focusout', onBlurHandler, {
                once: true
            });
            stateRef.current.observer = new MutationObserver(()=>{
                if (stateRef.current.isFocused && target.disabled) {
                    stateRef.current.observer.disconnect();
                    target.dispatchEvent(new FocusEvent('blur'));
                    target.dispatchEvent(new FocusEvent('focusout', {
                        bubbles: true
                    }));
                }
            });
            stateRef.current.observer.observe(target, {
                attributes: true,
                attributeFilter: [
                    'disabled'
                ]
            });
        }
    }, []);
}


function $a1ea59d68270f0dd$export$f8168d8dd8fd66e6(props) {
    let { isDisabled: isDisabled , onFocus: onFocusProp , onBlur: onBlurProp , onFocusChange: onFocusChange  } = props;
    const onBlur = (0,react.useCallback)((e)=>{
        if (e.target === e.currentTarget) {
            if (onBlurProp) onBlurProp(e);
            if (onFocusChange) onFocusChange(false);
            return true;
        }
    }, [
        onBlurProp,
        onFocusChange
    ]);
    const onSyntheticFocus = $8a9cb279dc87e130$export$715c682d09d639cc(onBlur);
    const onFocus = (0,react.useCallback)((e)=>{
        if (e.target === e.currentTarget) {
            if (onFocusProp) onFocusProp(e);
            if (onFocusChange) onFocusChange(true);
            onSyntheticFocus(e);
        }
    }, [
        onFocusChange,
        onFocusProp,
        onSyntheticFocus
    ]);
    return {
        focusProps: {
            onFocus: !isDisabled && (onFocusProp || onFocusChange || onBlurProp) ? onFocus : undefined,
            onBlur: !isDisabled && (onBlurProp || onFocusChange) ? onBlur : null
        }
    };
}




let $507fabe10e71c6fb$var$currentModality = null;
let $507fabe10e71c6fb$var$changeHandlers = new Set();
let $507fabe10e71c6fb$var$hasSetupGlobalListeners = false;
let $507fabe10e71c6fb$var$hasEventBeforeFocus = false;
let $507fabe10e71c6fb$var$hasBlurredWindowRecently = false;
// Only Tab or Esc keys will make focus visible on text input elements
const $507fabe10e71c6fb$var$FOCUS_VISIBLE_INPUT_KEYS = {
    Tab: true,
    Escape: true
};
function $507fabe10e71c6fb$var$triggerChangeHandlers(modality, e) {
    for (let handler of $507fabe10e71c6fb$var$changeHandlers)handler(modality, e);
}
/**
 * Helper function to determine if a KeyboardEvent is unmodified and could make keyboard focus styles visible.
 */ function $507fabe10e71c6fb$var$isValidKey(e) {
    // Control and Shift keys trigger when navigating back to the tab with keyboard.
    return !(e.metaKey || !$c87311424ea30a05$export$9ac100e40613ea10() && e.altKey || e.ctrlKey || e.key === 'Control' || e.key === 'Shift' || e.key === 'Meta');
}
function $507fabe10e71c6fb$var$handleKeyboardEvent(e) {
    $507fabe10e71c6fb$var$hasEventBeforeFocus = true;
    if ($507fabe10e71c6fb$var$isValidKey(e)) {
        $507fabe10e71c6fb$var$currentModality = 'keyboard';
        $507fabe10e71c6fb$var$triggerChangeHandlers('keyboard', e);
    }
}
function $507fabe10e71c6fb$var$handlePointerEvent(e) {
    $507fabe10e71c6fb$var$currentModality = 'pointer';
    if (e.type === 'mousedown' || e.type === 'pointerdown') {
        $507fabe10e71c6fb$var$hasEventBeforeFocus = true;
        $507fabe10e71c6fb$var$triggerChangeHandlers('pointer', e);
    }
}
function $507fabe10e71c6fb$var$handleClickEvent(e) {
    if ($6a7db85432448f7f$export$60278871457622de(e)) {
        $507fabe10e71c6fb$var$hasEventBeforeFocus = true;
        $507fabe10e71c6fb$var$currentModality = 'virtual';
    }
}
function $507fabe10e71c6fb$var$handleFocusEvent(e) {
    // Firefox fires two extra focus events when the user first clicks into an iframe:
    // first on the window, then on the document. We ignore these events so they don't
    // cause keyboard focus rings to appear.
    if (e.target === window || e.target === document) return;
    // If a focus event occurs without a preceding keyboard or pointer event, switch to virtual modality.
    // This occurs, for example, when navigating a form with the next/previous buttons on iOS.
    if (!$507fabe10e71c6fb$var$hasEventBeforeFocus && !$507fabe10e71c6fb$var$hasBlurredWindowRecently) {
        $507fabe10e71c6fb$var$currentModality = 'virtual';
        $507fabe10e71c6fb$var$triggerChangeHandlers('virtual', e);
    }
    $507fabe10e71c6fb$var$hasEventBeforeFocus = false;
    $507fabe10e71c6fb$var$hasBlurredWindowRecently = false;
}
function $507fabe10e71c6fb$var$handleWindowBlur() {
    // When the window is blurred, reset state. This is necessary when tabbing out of the window,
    // for example, since a subsequent focus event won't be fired.
    $507fabe10e71c6fb$var$hasEventBeforeFocus = false;
    $507fabe10e71c6fb$var$hasBlurredWindowRecently = true;
}
/**
 * Setup global event listeners to control when keyboard focus style should be visible.
 */ function $507fabe10e71c6fb$var$setupGlobalFocusEvents() {
    if (typeof window === 'undefined' || $507fabe10e71c6fb$var$hasSetupGlobalListeners) return;
    // Programmatic focus() calls shouldn't affect the current input modality.
    // However, we need to detect other cases when a focus event occurs without
    // a preceding user event (e.g. screen reader focus). Overriding the focus
    // method on HTMLElement.prototype is a bit hacky, but works.
    let focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function() {
        $507fabe10e71c6fb$var$hasEventBeforeFocus = true;
        focus.apply(this, arguments);
    };
    document.addEventListener('keydown', $507fabe10e71c6fb$var$handleKeyboardEvent, true);
    document.addEventListener('keyup', $507fabe10e71c6fb$var$handleKeyboardEvent, true);
    document.addEventListener('click', $507fabe10e71c6fb$var$handleClickEvent, true);
    // Register focus events on the window so they are sure to happen
    // before React's event listeners (registered on the document).
    window.addEventListener('focus', $507fabe10e71c6fb$var$handleFocusEvent, true);
    window.addEventListener('blur', $507fabe10e71c6fb$var$handleWindowBlur, false);
    if (typeof PointerEvent !== 'undefined') {
        document.addEventListener('pointerdown', $507fabe10e71c6fb$var$handlePointerEvent, true);
        document.addEventListener('pointermove', $507fabe10e71c6fb$var$handlePointerEvent, true);
        document.addEventListener('pointerup', $507fabe10e71c6fb$var$handlePointerEvent, true);
    } else {
        document.addEventListener('mousedown', $507fabe10e71c6fb$var$handlePointerEvent, true);
        document.addEventListener('mousemove', $507fabe10e71c6fb$var$handlePointerEvent, true);
        document.addEventListener('mouseup', $507fabe10e71c6fb$var$handlePointerEvent, true);
    }
    $507fabe10e71c6fb$var$hasSetupGlobalListeners = true;
}
if (typeof document !== 'undefined') {
    if (document.readyState !== 'loading') $507fabe10e71c6fb$var$setupGlobalFocusEvents();
    else document.addEventListener('DOMContentLoaded', $507fabe10e71c6fb$var$setupGlobalFocusEvents);
}
function $507fabe10e71c6fb$export$b9b3dfddab17db27() {
    return $507fabe10e71c6fb$var$currentModality !== 'pointer';
}
function $507fabe10e71c6fb$export$630ff653c5ada6a9() {
    return $507fabe10e71c6fb$var$currentModality;
}
function $507fabe10e71c6fb$export$8397ddfc504fdb9a(modality) {
    $507fabe10e71c6fb$var$currentModality = modality;
    $507fabe10e71c6fb$var$triggerChangeHandlers(modality, null);
}
function $507fabe10e71c6fb$export$98e20ec92f614cfe() {
    $507fabe10e71c6fb$var$setupGlobalFocusEvents();
    let [modality, setModality] = $bx7SL$useState($507fabe10e71c6fb$var$currentModality);
    $bx7SL$useEffect(()=>{
        let handler = ()=>{
            setModality($507fabe10e71c6fb$var$currentModality);
        };
        $507fabe10e71c6fb$var$changeHandlers.add(handler);
        return ()=>{
            $507fabe10e71c6fb$var$changeHandlers.delete(handler);
        };
    }, []);
    return modality;
}
/**
 * If this is attached to text input component, return if the event is a focus event (Tab/Escape keys pressed) so that
 * focus visible style can be properly set.
 */ function $507fabe10e71c6fb$var$isKeyboardFocusEvent(isTextInput, modality, e) {
    return !(isTextInput && modality === 'keyboard' && e instanceof KeyboardEvent && !$507fabe10e71c6fb$var$FOCUS_VISIBLE_INPUT_KEYS[e.key]);
}
function $507fabe10e71c6fb$export$ffd9e5021c1fb2d6(props = {
}) {
    let { isTextInput: isTextInput , autoFocus: autoFocus  } = props;
    let [isFocusVisibleState, setFocusVisible] = $bx7SL$useState(autoFocus || $507fabe10e71c6fb$export$b9b3dfddab17db27());
    $507fabe10e71c6fb$export$ec71b4b83ac08ec3(($507fabe10e71c6fb$export$b9b3dfddab17db27)=>{
        setFocusVisible($507fabe10e71c6fb$export$b9b3dfddab17db27);
    }, [
        isTextInput
    ], {
        isTextInput: isTextInput
    });
    return {
        isFocusVisible: isFocusVisibleState
    };
}
function $507fabe10e71c6fb$export$ec71b4b83ac08ec3(fn, deps, opts) {
    $507fabe10e71c6fb$var$setupGlobalFocusEvents();
    (0,react.useEffect)(()=>{
        let handler = (modality, e)=>{
            if (!$507fabe10e71c6fb$var$isKeyboardFocusEvent(opts === null || opts === void 0 ? void 0 : opts.isTextInput, modality, e)) return;
            fn($507fabe10e71c6fb$export$b9b3dfddab17db27());
        };
        $507fabe10e71c6fb$var$changeHandlers.add(handler);
        return ()=>{
            $507fabe10e71c6fb$var$changeHandlers.delete(handler);
        };
    }, deps);
}




function $9ab94262bd0047c7$export$420e68273165f4ec(props) {
    let { isDisabled: isDisabled , onBlurWithin: onBlurWithin , onFocusWithin: onFocusWithin , onFocusWithinChange: onFocusWithinChange  } = props;
    let state = (0,react.useRef)({
        isFocusWithin: false
    });
    let onBlur = (0,react.useCallback)((e)=>{
        // We don't want to trigger onBlurWithin and then immediately onFocusWithin again
        // when moving focus inside the element. Only trigger if the currentTarget doesn't
        // include the relatedTarget (where focus is moving).
        if (state.current.isFocusWithin && !e.currentTarget.contains(e.relatedTarget)) {
            state.current.isFocusWithin = false;
            if (onBlurWithin) onBlurWithin(e);
            if (onFocusWithinChange) onFocusWithinChange(false);
        }
    }, [
        onBlurWithin,
        onFocusWithinChange,
        state
    ]);
    let onSyntheticFocus = $8a9cb279dc87e130$export$715c682d09d639cc(onBlur);
    let onFocus = (0,react.useCallback)((e)=>{
        if (!state.current.isFocusWithin) {
            if (onFocusWithin) onFocusWithin(e);
            if (onFocusWithinChange) onFocusWithinChange(true);
            state.current.isFocusWithin = true;
            onSyntheticFocus(e);
        }
    }, [
        onFocusWithin,
        onFocusWithinChange,
        onSyntheticFocus
    ]);
    if (isDisabled) return {
        focusWithinProps: {
            onFocus: null,
            onBlur: null
        }
    };
    return {
        focusWithinProps: {
            onFocus: onFocus,
            onBlur: onBlur
        }
    };
}



// iOS fires onPointerEnter twice: once with pointerType="touch" and again with pointerType="mouse".
// We want to ignore these emulated events so they do not trigger hover behavior.
// See https://bugs.webkit.org/show_bug.cgi?id=214609.
let $6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = false;
let $6179b936705e76d3$var$hoverCount = 0;
function $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents() {
    $6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = true;
    // Clear globalIgnoreEmulatedMouseEvents after a short timeout. iOS fires onPointerEnter
    // with pointerType="mouse" immediately after onPointerUp and before onFocus. On other
    // devices that don't have this quirk, we don't want to ignore a mouse hover sometime in
    // the distant future because a user previously touched the element.
    setTimeout(()=>{
        $6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = false;
    }, 50);
}
function $6179b936705e76d3$var$handleGlobalPointerEvent(e) {
    if (e.pointerType === 'touch') $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents();
}
function $6179b936705e76d3$var$setupGlobalTouchEvents() {
    if (typeof document === 'undefined') return;
    if (typeof PointerEvent !== 'undefined') document.addEventListener('pointerup', $6179b936705e76d3$var$handleGlobalPointerEvent);
    else document.addEventListener('touchend', $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents);
    $6179b936705e76d3$var$hoverCount++;
    return ()=>{
        $6179b936705e76d3$var$hoverCount--;
        if ($6179b936705e76d3$var$hoverCount > 0) return;
        if (typeof PointerEvent !== 'undefined') document.removeEventListener('pointerup', $6179b936705e76d3$var$handleGlobalPointerEvent);
        else document.removeEventListener('touchend', $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents);
    };
}
function $6179b936705e76d3$export$ae780daf29e6d456(props) {
    let { onHoverStart: onHoverStart , onHoverChange: onHoverChange , onHoverEnd: onHoverEnd , isDisabled: isDisabled  } = props;
    let [isHovered, setHovered] = $bx7SL$useState(false);
    let state = $bx7SL$useRef({
        isHovered: false,
        ignoreEmulatedMouseEvents: false,
        pointerType: '',
        target: null
    }).current;
    $bx7SL$useEffect($6179b936705e76d3$var$setupGlobalTouchEvents, []);
    let { hoverProps: hoverProps1 , triggerHoverEnd: triggerHoverEnd1  } = $bx7SL$useMemo(()=>{
        let triggerHoverStart = (event, pointerType)=>{
            state.pointerType = pointerType;
            if (isDisabled || pointerType === 'touch' || state.isHovered || !event.currentTarget.contains(event.target)) return;
            state.isHovered = true;
            let target = event.currentTarget;
            state.target = target;
            if (onHoverStart) onHoverStart({
                type: 'hoverstart',
                target: target,
                pointerType: pointerType
            });
            if (onHoverChange) onHoverChange(true);
            setHovered(true);
        };
        let triggerHoverEnd = (event, pointerType)=>{
            state.pointerType = '';
            state.target = null;
            if (pointerType === 'touch' || !state.isHovered) return;
            state.isHovered = false;
            let target = event.currentTarget;
            if (onHoverEnd) onHoverEnd({
                type: 'hoverend',
                target: target,
                pointerType: pointerType
            });
            if (onHoverChange) onHoverChange(false);
            setHovered(false);
        };
        let hoverProps = {
        };
        if (typeof PointerEvent !== 'undefined') {
            hoverProps.onPointerEnter = (e)=>{
                if ($6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents && e.pointerType === 'mouse') return;
                triggerHoverStart(e, e.pointerType);
            };
            hoverProps.onPointerLeave = (e)=>{
                if (!isDisabled && e.currentTarget.contains(e.target)) triggerHoverEnd(e, e.pointerType);
            };
        } else {
            hoverProps.onTouchStart = ()=>{
                state.ignoreEmulatedMouseEvents = true;
            };
            hoverProps.onMouseEnter = (e)=>{
                if (!state.ignoreEmulatedMouseEvents && !$6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents) triggerHoverStart(e, 'mouse');
                state.ignoreEmulatedMouseEvents = false;
            };
            hoverProps.onMouseLeave = (e)=>{
                if (!isDisabled && e.currentTarget.contains(e.target)) triggerHoverEnd(e, 'mouse');
            };
        }
        return {
            hoverProps: hoverProps,
            triggerHoverEnd: triggerHoverEnd
        };
    }, [
        onHoverStart,
        onHoverChange,
        onHoverEnd,
        isDisabled,
        state
    ]);
    $bx7SL$useEffect(()=>{
        // Call the triggerHoverEnd as soon as isDisabled changes to true
        // Safe to call triggerHoverEnd, it will early return if we aren't currently hovering
        if (isDisabled) triggerHoverEnd1({
            currentTarget: state.target
        }, state.pointerType);
    }, [
        isDisabled
    ]);
    return {
        hoverProps: hoverProps1,
        isHovered: isHovered
    };
}



function $e0b6e0b68ec7f50f$export$872b660ac5a1ff98(props) {
    let { ref: ref , onInteractOutside: onInteractOutside , isDisabled: isDisabled , onInteractOutsideStart: onInteractOutsideStart  } = props;
    let stateRef = $bx7SL$useRef({
        isPointerDown: false,
        ignoreEmulatedMouseEvents: false,
        onInteractOutside: onInteractOutside,
        onInteractOutsideStart: onInteractOutsideStart
    });
    let state = stateRef.current;
    state.onInteractOutside = onInteractOutside;
    state.onInteractOutsideStart = onInteractOutsideStart;
    $bx7SL$useEffect(()=>{
        if (isDisabled) return;
        let onPointerDown = (e)=>{
            if ($e0b6e0b68ec7f50f$var$isValidEvent(e, ref) && state.onInteractOutside) {
                if (state.onInteractOutsideStart) state.onInteractOutsideStart(e);
                state.isPointerDown = true;
            }
        };
        // Use pointer events if available. Otherwise, fall back to mouse and touch events.
        if (typeof PointerEvent !== 'undefined') {
            let onPointerUp = (e)=>{
                if (state.isPointerDown && state.onInteractOutside && $e0b6e0b68ec7f50f$var$isValidEvent(e, ref)) {
                    state.isPointerDown = false;
                    state.onInteractOutside(e);
                }
            };
            // changing these to capture phase fixed combobox
            document.addEventListener('pointerdown', onPointerDown, true);
            document.addEventListener('pointerup', onPointerUp, true);
            return ()=>{
                document.removeEventListener('pointerdown', onPointerDown, true);
                document.removeEventListener('pointerup', onPointerUp, true);
            };
        } else {
            let onMouseUp = (e)=>{
                if (state.ignoreEmulatedMouseEvents) state.ignoreEmulatedMouseEvents = false;
                else if (state.isPointerDown && state.onInteractOutside && $e0b6e0b68ec7f50f$var$isValidEvent(e, ref)) {
                    state.isPointerDown = false;
                    state.onInteractOutside(e);
                }
            };
            let onTouchEnd = (e)=>{
                state.ignoreEmulatedMouseEvents = true;
                if (state.onInteractOutside && state.isPointerDown && $e0b6e0b68ec7f50f$var$isValidEvent(e, ref)) {
                    state.isPointerDown = false;
                    state.onInteractOutside(e);
                }
            };
            document.addEventListener('mousedown', onPointerDown, true);
            document.addEventListener('mouseup', onMouseUp, true);
            document.addEventListener('touchstart', onPointerDown, true);
            document.addEventListener('touchend', onTouchEnd, true);
            return ()=>{
                document.removeEventListener('mousedown', onPointerDown, true);
                document.removeEventListener('mouseup', onMouseUp, true);
                document.removeEventListener('touchstart', onPointerDown, true);
                document.removeEventListener('touchend', onTouchEnd, true);
            };
        }
    }, [
        ref,
        state,
        isDisabled
    ]);
}
function $e0b6e0b68ec7f50f$var$isValidEvent(event, ref) {
    if (event.button > 0) return false;
    // if the event target is no longer in the document
    if (event.target) {
        const ownerDocument = event.target.ownerDocument;
        if (!ownerDocument || !ownerDocument.documentElement.contains(event.target)) return false;
    }
    return ref.current && !ref.current.contains(event.target);
}


function $93925083ecbb358c$export$48d1ea6320830260(handler) {
    if (!handler) return;
    let shouldStopPropagation = true;
    return (e)=>{
        let event = {
            ...e,
            preventDefault () {
                e.preventDefault();
            },
            isDefaultPrevented () {
                return e.isDefaultPrevented();
            },
            stopPropagation () {
                console.error('stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.');
            },
            continuePropagation () {
                shouldStopPropagation = false;
            }
        };
        handler(event);
        if (shouldStopPropagation) e.stopPropagation();
    };
}


function $46d819fcbaf35654$export$8f71654801c2f7cd(props) {
    return {
        keyboardProps: props.isDisabled ? {
        } : {
            onKeyDown: $93925083ecbb358c$export$48d1ea6320830260(props.onKeyDown),
            onKeyUp: $93925083ecbb358c$export$48d1ea6320830260(props.onKeyUp)
        }
    };
}





function $e8a7022cf87cba2a$export$36da96379f79f245(props) {
    let { onMoveStart: onMoveStart , onMove: onMove , onMoveEnd: onMoveEnd  } = props;
    let state = $bx7SL$useRef({
        didMove: false,
        lastPosition: null,
        id: null
    });
    let { addGlobalListener: addGlobalListener , removeGlobalListener: removeGlobalListener  } = $bx7SL$useGlobalListeners();
    let moveProps1 = $bx7SL$useMemo(()=>{
        let moveProps = {
        };
        let start = ()=>{
            $14c0b72509d70225$export$16a4697467175487();
            state.current.didMove = false;
        };
        let move = (originalEvent, pointerType, deltaX, deltaY)=>{
            if (deltaX === 0 && deltaY === 0) return;
            if (!state.current.didMove) {
                state.current.didMove = true;
                onMoveStart === null || onMoveStart === void 0 ? void 0 : onMoveStart({
                    type: 'movestart',
                    pointerType: pointerType,
                    shiftKey: originalEvent.shiftKey,
                    metaKey: originalEvent.metaKey,
                    ctrlKey: originalEvent.ctrlKey,
                    altKey: originalEvent.altKey
                });
            }
            onMove({
                type: 'move',
                pointerType: pointerType,
                deltaX: deltaX,
                deltaY: deltaY,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
        };
        let end = (originalEvent, pointerType)=>{
            $14c0b72509d70225$export$b0d6fa1ab32e3295();
            if (state.current.didMove) onMoveEnd === null || onMoveEnd === void 0 ? void 0 : onMoveEnd({
                type: 'moveend',
                pointerType: pointerType,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
        };
        if (typeof PointerEvent === 'undefined') {
            let onMouseMove = (e)=>{
                if (e.button === 0) {
                    move(e, 'mouse', e.pageX - state.current.lastPosition.pageX, e.pageY - state.current.lastPosition.pageY);
                    state.current.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                }
            };
            let onMouseUp = (e)=>{
                if (e.button === 0) {
                    end(e, 'mouse');
                    removeGlobalListener(window, 'mousemove', onMouseMove, false);
                    removeGlobalListener(window, 'mouseup', onMouseUp, false);
                }
            };
            moveProps.onMouseDown = (e)=>{
                if (e.button === 0) {
                    start();
                    e.stopPropagation();
                    e.preventDefault();
                    state.current.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                    addGlobalListener(window, 'mousemove', onMouseMove, false);
                    addGlobalListener(window, 'mouseup', onMouseUp, false);
                }
            };
            let onTouchMove = (e)=>{
                let touch = [
                    ...e.changedTouches
                ].findIndex(({ identifier: identifier  })=>identifier === state.current.id
                );
                if (touch >= 0) {
                    let { pageX: pageX , pageY: pageY  } = e.changedTouches[touch];
                    move(e, 'touch', pageX - state.current.lastPosition.pageX, pageY - state.current.lastPosition.pageY);
                    state.current.lastPosition = {
                        pageX: pageX,
                        pageY: pageY
                    };
                }
            };
            let onTouchEnd = (e)=>{
                let touch = [
                    ...e.changedTouches
                ].findIndex(({ identifier: identifier  })=>identifier === state.current.id
                );
                if (touch >= 0) {
                    end(e, 'touch');
                    state.current.id = null;
                    removeGlobalListener(window, 'touchmove', onTouchMove);
                    removeGlobalListener(window, 'touchend', onTouchEnd);
                    removeGlobalListener(window, 'touchcancel', onTouchEnd);
                }
            };
            moveProps.onTouchStart = (e)=>{
                if (e.changedTouches.length === 0 || state.current.id != null) return;
                let { pageX: pageX , pageY: pageY , identifier: identifier  } = e.changedTouches[0];
                start();
                e.stopPropagation();
                e.preventDefault();
                state.current.lastPosition = {
                    pageX: pageX,
                    pageY: pageY
                };
                state.current.id = identifier;
                addGlobalListener(window, 'touchmove', onTouchMove, false);
                addGlobalListener(window, 'touchend', onTouchEnd, false);
                addGlobalListener(window, 'touchcancel', onTouchEnd, false);
            };
        } else {
            let onPointerMove = (e)=>{
                if (e.pointerId === state.current.id) {
                    let pointerType = e.pointerType || 'mouse';
                    // Problems with PointerEvent#movementX/movementY:
                    // 1. it is always 0 on macOS Safari.
                    // 2. On Chrome Android, it's scaled by devicePixelRatio, but not on Chrome macOS
                    move(e, pointerType, e.pageX - state.current.lastPosition.pageX, e.pageY - state.current.lastPosition.pageY);
                    state.current.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                }
            };
            let onPointerUp = (e)=>{
                if (e.pointerId === state.current.id) {
                    let pointerType = e.pointerType || 'mouse';
                    end(e, pointerType);
                    state.current.id = null;
                    removeGlobalListener(window, 'pointermove', onPointerMove, false);
                    removeGlobalListener(window, 'pointerup', onPointerUp, false);
                    removeGlobalListener(window, 'pointercancel', onPointerUp, false);
                }
            };
            moveProps.onPointerDown = (e)=>{
                if (e.button === 0 && state.current.id == null) {
                    start();
                    e.stopPropagation();
                    e.preventDefault();
                    state.current.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                    state.current.id = e.pointerId;
                    addGlobalListener(window, 'pointermove', onPointerMove, false);
                    addGlobalListener(window, 'pointerup', onPointerUp, false);
                    addGlobalListener(window, 'pointercancel', onPointerUp, false);
                }
            };
        }
        let triggerKeyboardMove = (e, deltaX, deltaY)=>{
            start();
            move(e, 'keyboard', deltaX, deltaY);
            end(e, 'keyboard');
        };
        moveProps.onKeyDown = (e)=>{
            switch(e.key){
                case 'Left':
                case 'ArrowLeft':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, -1, 0);
                    break;
                case 'Right':
                case 'ArrowRight':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, 1, 0);
                    break;
                case 'Up':
                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, 0, -1);
                    break;
                case 'Down':
                case 'ArrowDown':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, 0, 1);
                    break;
            }
        };
        return moveProps;
    }, [
        state,
        onMoveStart,
        onMove,
        onMoveEnd,
        addGlobalListener,
        removeGlobalListener
    ]);
    return {
        moveProps: moveProps1
    };
}





function $7d0a636d7a4dcefd$export$2123ff2b87c81ca(props, ref) {
    let { onScroll: onScroll , isDisabled: isDisabled  } = props;
    let onScrollHandler = $bx7SL$useCallback((e)=>{
        // If the ctrlKey is pressed, this is a zoom event, do nothing.
        if (e.ctrlKey) return;
        // stop scrolling the page
        e.preventDefault();
        e.stopPropagation();
        if (onScroll) onScroll({
            deltaX: e.deltaX,
            deltaY: e.deltaY
        });
    }, [
        onScroll
    ]);
    $bx7SL$useEvent(ref, 'wheel', isDisabled ? null : onScrollHandler);
}





const $8a26561d2877236e$var$DEFAULT_THRESHOLD = 500;
function $8a26561d2877236e$export$c24ed0104d07eab9(props) {
    let { isDisabled: isDisabled , onLongPressStart: onLongPressStart , onLongPressEnd: onLongPressEnd , onLongPress: onLongPress , threshold: threshold = $8a26561d2877236e$var$DEFAULT_THRESHOLD , accessibilityDescription: accessibilityDescription  } = props;
    const timeRef = $bx7SL$useRef(null);
    let { addGlobalListener: addGlobalListener , removeGlobalListener: removeGlobalListener  } = $bx7SL$useGlobalListeners();
    let { pressProps: pressProps  } = $f6c31cce2adf654f$export$45712eceda6fad21({
        isDisabled: isDisabled,
        onPressStart (e1) {
            if (e1.pointerType === 'mouse' || e1.pointerType === 'touch') {
                if (onLongPressStart) onLongPressStart({
                    ...e1,
                    type: 'longpressstart'
                });
                timeRef.current = setTimeout(()=>{
                    // Prevent other usePress handlers from also handling this event.
                    e1.target.dispatchEvent(new PointerEvent('pointercancel', {
                        bubbles: true
                    }));
                    if (onLongPress) onLongPress({
                        ...e1,
                        type: 'longpress'
                    });
                    timeRef.current = null;
                }, threshold);
                // Prevent context menu, which may be opened on long press on touch devices
                if (e1.pointerType === 'touch') {
                    let onContextMenu = (e)=>{
                        e.preventDefault();
                    };
                    addGlobalListener(e1.target, 'contextmenu', onContextMenu, {
                        once: true
                    });
                    addGlobalListener(window, 'pointerup', ()=>{
                        // If no contextmenu event is fired quickly after pointerup, remove the handler
                        // so future context menu events outside a long press are not prevented.
                        setTimeout(()=>{
                            removeGlobalListener(e1.target, 'contextmenu', onContextMenu);
                        }, 30);
                    }, {
                        once: true
                    });
                }
            }
        },
        onPressEnd (e) {
            if (timeRef.current) clearTimeout(timeRef.current);
            if (onLongPressEnd && (e.pointerType === 'mouse' || e.pointerType === 'touch')) onLongPressEnd({
                ...e,
                type: 'longpressend'
            });
        }
    });
    let descriptionProps = $bx7SL$useDescription(onLongPress && !isDisabled ? accessibilityDescription : null);
    return {
        longPressProps: $bx7SL$mergeProps(pressProps, descriptionProps)
    };
}





//# sourceMappingURL=module.js.map

;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/node_modules/@react-aria/focus/dist/module.js







function $6a99195332edec8b$export$80f3e147d781571c(element) {
    // If the user is interacting with a virtual cursor, e.g. screen reader, then
    // wait until after any animated transitions that are currently occurring on
    // the page before shifting focus. This avoids issues with VoiceOver on iOS
    // causing the page to scroll when moving focus if the element is transitioning
    // from off the screen.
    if ($6nfFC$getInteractionModality() === 'virtual') {
        let lastFocusedElement = document.activeElement;
        $6nfFC$runAfterTransition(()=>{
            // If focus did not move and the element is still in the document, focus it.
            if (document.activeElement === lastFocusedElement && document.contains(element)) $6nfFC$focusWithoutScrolling(element);
        });
    } else $6nfFC$focusWithoutScrolling(element);
}


/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ function $645f2e67b85a24c9$var$isStyleVisible(element) {
    if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) return false;
    let { display: display , visibility: visibility  } = element.style;
    let isVisible = display !== 'none' && visibility !== 'hidden' && visibility !== 'collapse';
    if (isVisible) {
        const { getComputedStyle: getComputedStyle  } = element.ownerDocument.defaultView;
        let { display: computedDisplay , visibility: computedVisibility  } = getComputedStyle(element);
        isVisible = computedDisplay !== 'none' && computedVisibility !== 'hidden' && computedVisibility !== 'collapse';
    }
    return isVisible;
}
function $645f2e67b85a24c9$var$isAttributeVisible(element, childElement) {
    return !element.hasAttribute('hidden') && (element.nodeName === 'DETAILS' && childElement && childElement.nodeName !== 'SUMMARY' ? element.hasAttribute('open') : true);
}
function $645f2e67b85a24c9$export$e989c0fffaa6b27a(element, childElement) {
    return element.nodeName !== '#comment' && $645f2e67b85a24c9$var$isStyleVisible(element) && $645f2e67b85a24c9$var$isAttributeVisible(element, childElement) && (!element.parentElement || $645f2e67b85a24c9$export$e989c0fffaa6b27a(element.parentElement, element));
}




const $9bf71ea28793e738$var$FocusContext = /*#__PURE__*/ (/* unused pure expression or super */ null && ($6nfFC$react.createContext(null)));
let $9bf71ea28793e738$var$activeScope = null;
let $9bf71ea28793e738$var$scopes = new Map();
function $9bf71ea28793e738$export$20e40289641fbbb6(props) {
    let { children: children , contain: contain , restoreFocus: restoreFocus , autoFocus: autoFocus  } = props;
    let startRef = $6nfFC$useRef();
    let endRef = $6nfFC$useRef();
    let scopeRef = $6nfFC$useRef([]);
    let ctx = $6nfFC$useContext($9bf71ea28793e738$var$FocusContext);
    let parentScope = ctx === null || ctx === void 0 ? void 0 : ctx.scopeRef;
    $6nfFC$useLayoutEffect(()=>{
        // Find all rendered nodes between the sentinels and add them to the scope.
        let node = startRef.current.nextSibling;
        let nodes = [];
        while(node && node !== endRef.current){
            nodes.push(node);
            node = node.nextSibling;
        }
        scopeRef.current = nodes;
    }, [
        children,
        parentScope
    ]);
    $6nfFC$useLayoutEffect(()=>{
        $9bf71ea28793e738$var$scopes.set(scopeRef, parentScope);
        return ()=>{
            // Restore the active scope on unmount if this scope or a descendant scope is active.
            // Parent effect cleanups run before children, so we need to check if the
            // parent scope actually still exists before restoring the active scope to it.
            if ((scopeRef === $9bf71ea28793e738$var$activeScope || $9bf71ea28793e738$var$isAncestorScope(scopeRef, $9bf71ea28793e738$var$activeScope)) && (!parentScope || $9bf71ea28793e738$var$scopes.has(parentScope))) $9bf71ea28793e738$var$activeScope = parentScope;
            $9bf71ea28793e738$var$scopes.delete(scopeRef);
        };
    }, [
        scopeRef,
        parentScope
    ]);
    $9bf71ea28793e738$var$useFocusContainment(scopeRef, contain);
    $9bf71ea28793e738$var$useRestoreFocus(scopeRef, restoreFocus, contain);
    $9bf71ea28793e738$var$useAutoFocus(scopeRef, autoFocus);
    let focusManager = $9bf71ea28793e738$var$createFocusManagerForScope(scopeRef);
    return(/*#__PURE__*/ $6nfFC$react.createElement($9bf71ea28793e738$var$FocusContext.Provider, {
        value: {
            scopeRef: scopeRef,
            focusManager: focusManager
        }
    }, /*#__PURE__*/ $6nfFC$react.createElement("span", {
        "data-focus-scope-start": true,
        hidden: true,
        ref: startRef
    }), children, /*#__PURE__*/ $6nfFC$react.createElement("span", {
        "data-focus-scope-end": true,
        hidden: true,
        ref: endRef
    })));
}
function $9bf71ea28793e738$export$10c5169755ce7bd7() {
    var ref;
    return (ref = $6nfFC$useContext($9bf71ea28793e738$var$FocusContext)) === null || ref === void 0 ? void 0 : ref.focusManager;
}
function $9bf71ea28793e738$var$createFocusManagerForScope(scopeRef) {
    return {
        focusNext (opts = {
        }) {
            let scope = scopeRef.current;
            let { from: from , tabbable: tabbable , wrap: wrap , accept: accept  } = opts;
            let node = from || document.activeElement;
            let sentinel = scope[0].previousElementSibling;
            let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
                tabbable: tabbable,
                accept: accept
            }, scope);
            walker.currentNode = $9bf71ea28793e738$var$isElementInScope(node, scope) ? node : sentinel;
            let nextNode = walker.nextNode();
            if (!nextNode && wrap) {
                walker.currentNode = sentinel;
                nextNode = walker.nextNode();
            }
            if (nextNode) $9bf71ea28793e738$var$focusElement(nextNode, true);
            return nextNode;
        },
        focusPrevious (opts = {
        }) {
            let scope = scopeRef.current;
            let { from: from , tabbable: tabbable , wrap: wrap , accept: accept  } = opts;
            let node = from || document.activeElement;
            let sentinel = scope[scope.length - 1].nextElementSibling;
            let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
                tabbable: tabbable,
                accept: accept
            }, scope);
            walker.currentNode = $9bf71ea28793e738$var$isElementInScope(node, scope) ? node : sentinel;
            let previousNode = walker.previousNode();
            if (!previousNode && wrap) {
                walker.currentNode = sentinel;
                previousNode = walker.previousNode();
            }
            if (previousNode) $9bf71ea28793e738$var$focusElement(previousNode, true);
            return previousNode;
        },
        focusFirst (opts = {
        }) {
            let scope = scopeRef.current;
            let { tabbable: tabbable , accept: accept  } = opts;
            let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
                tabbable: tabbable,
                accept: accept
            }, scope);
            walker.currentNode = scope[0].previousElementSibling;
            let nextNode = walker.nextNode();
            if (nextNode) $9bf71ea28793e738$var$focusElement(nextNode, true);
            return nextNode;
        },
        focusLast (opts = {
        }) {
            let scope = scopeRef.current;
            let { tabbable: tabbable , accept: accept  } = opts;
            let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
                tabbable: tabbable,
                accept: accept
            }, scope);
            walker.currentNode = scope[scope.length - 1].nextElementSibling;
            let previousNode = walker.previousNode();
            if (previousNode) $9bf71ea28793e738$var$focusElement(previousNode, true);
            return previousNode;
        }
    };
}
const $9bf71ea28793e738$var$focusableElements = [
    'input:not([disabled]):not([type=hidden])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'a[href]',
    'area[href]',
    'summary',
    'iframe',
    'object',
    'embed',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]'
];
const $9bf71ea28793e738$var$FOCUSABLE_ELEMENT_SELECTOR = $9bf71ea28793e738$var$focusableElements.join(':not([hidden]),') + ',[tabindex]:not([disabled]):not([hidden])';
$9bf71ea28793e738$var$focusableElements.push('[tabindex]:not([tabindex="-1"]):not([disabled])');
const $9bf71ea28793e738$var$TABBABLE_ELEMENT_SELECTOR = $9bf71ea28793e738$var$focusableElements.join(':not([hidden]):not([tabindex="-1"]),');
function $9bf71ea28793e738$var$getScopeRoot(scope) {
    return scope[0].parentElement;
}
function $9bf71ea28793e738$var$useFocusContainment(scopeRef, contain) {
    let focusedNode = $6nfFC$useRef();
    let raf = $6nfFC$useRef(null);
    $6nfFC$useLayoutEffect(()=>{
        let scope1 = scopeRef.current;
        if (!contain) {
            // if contain was changed, then we should cancel any ongoing waits to pull focus back into containment
            if (raf.current) {
                cancelAnimationFrame(raf.current);
                raf.current = null;
            }
            return;
        }
        // Handle the Tab key to contain focus within the scope
        let onKeyDown = (e)=>{
            if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey || scopeRef !== $9bf71ea28793e738$var$activeScope) return;
            let focusedElement = document.activeElement;
            let scope = scopeRef.current;
            if (!$9bf71ea28793e738$var$isElementInScope(focusedElement, scope)) return;
            let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
                tabbable: true
            }, scope);
            walker.currentNode = focusedElement;
            let nextElement = e.shiftKey ? walker.previousNode() : walker.nextNode();
            if (!nextElement) {
                walker.currentNode = e.shiftKey ? scope[scope.length - 1].nextElementSibling : scope[0].previousElementSibling;
                nextElement = e.shiftKey ? walker.previousNode() : walker.nextNode();
            }
            e.preventDefault();
            if (nextElement) $9bf71ea28793e738$var$focusElement(nextElement, true);
        };
        let onFocus = (e)=>{
            // If focusing an element in a child scope of the currently active scope, the child becomes active.
            // Moving out of the active scope to an ancestor is not allowed.
            if (!$9bf71ea28793e738$var$activeScope || $9bf71ea28793e738$var$isAncestorScope($9bf71ea28793e738$var$activeScope, scopeRef)) {
                $9bf71ea28793e738$var$activeScope = scopeRef;
                focusedNode.current = e.target;
            } else if (scopeRef === $9bf71ea28793e738$var$activeScope && !$9bf71ea28793e738$var$isElementInChildScope(e.target, scopeRef)) {
                // If a focus event occurs outside the active scope (e.g. user tabs from browser location bar),
                // restore focus to the previously focused node or the first tabbable element in the active scope.
                if (focusedNode.current) focusedNode.current.focus();
                else if ($9bf71ea28793e738$var$activeScope) $9bf71ea28793e738$var$focusFirstInScope($9bf71ea28793e738$var$activeScope.current);
            } else if (scopeRef === $9bf71ea28793e738$var$activeScope) focusedNode.current = e.target;
        };
        let onBlur = (e)=>{
            // Firefox doesn't shift focus back to the Dialog properly without this
            raf.current = requestAnimationFrame(()=>{
                // Use document.activeElement instead of e.relatedTarget so we can tell if user clicked into iframe
                if (scopeRef === $9bf71ea28793e738$var$activeScope && !$9bf71ea28793e738$var$isElementInChildScope(document.activeElement, scopeRef)) {
                    $9bf71ea28793e738$var$activeScope = scopeRef;
                    focusedNode.current = e.target;
                    focusedNode.current.focus();
                }
            });
        };
        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('focusin', onFocus, false);
        scope1.forEach((element)=>element.addEventListener('focusin', onFocus, false)
        );
        scope1.forEach((element)=>element.addEventListener('focusout', onBlur, false)
        );
        return ()=>{
            document.removeEventListener('keydown', onKeyDown, false);
            document.removeEventListener('focusin', onFocus, false);
            scope1.forEach((element)=>element.removeEventListener('focusin', onFocus, false)
            );
            scope1.forEach((element)=>element.removeEventListener('focusout', onBlur, false)
            );
        };
    }, [
        scopeRef,
        contain
    ]);
    // eslint-disable-next-line arrow-body-style
    $6nfFC$useEffect(()=>{
        return ()=>{
            if (raf.current) cancelAnimationFrame(raf.current);
        };
    }, [
        raf
    ]);
}
function $9bf71ea28793e738$var$isElementInAnyScope(element) {
    for (let scope of $9bf71ea28793e738$var$scopes.keys()){
        if ($9bf71ea28793e738$var$isElementInScope(element, scope.current)) return true;
    }
    return false;
}
function $9bf71ea28793e738$var$isElementInScope(element, scope) {
    return scope.some((node)=>node.contains(element)
    );
}
function $9bf71ea28793e738$var$isElementInChildScope(element, scope) {
    // node.contains in isElementInScope covers child scopes that are also DOM children,
    // but does not cover child scopes in portals.
    for (let s of $9bf71ea28793e738$var$scopes.keys()){
        if ((s === scope || $9bf71ea28793e738$var$isAncestorScope(scope, s)) && $9bf71ea28793e738$var$isElementInScope(element, s.current)) return true;
    }
    return false;
}
function $9bf71ea28793e738$var$isAncestorScope(ancestor, scope) {
    let parent = $9bf71ea28793e738$var$scopes.get(scope);
    if (!parent) return false;
    if (parent === ancestor) return true;
    return $9bf71ea28793e738$var$isAncestorScope(ancestor, parent);
}
function $9bf71ea28793e738$var$focusElement(element, scroll = false) {
    if (element != null && !scroll) try {
        $6a99195332edec8b$export$80f3e147d781571c(element);
    } catch (err) {
    // ignore
    }
    else if (element != null) try {
        element.focus();
    } catch (err1) {
    // ignore
    }
}
function $9bf71ea28793e738$var$focusFirstInScope(scope) {
    let sentinel = scope[0].previousElementSibling;
    let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
        tabbable: true
    }, scope);
    walker.currentNode = sentinel;
    $9bf71ea28793e738$var$focusElement(walker.nextNode());
}
function $9bf71ea28793e738$var$useAutoFocus(scopeRef, autoFocus) {
    const autoFocusRef = $6nfFC$react.useRef(autoFocus);
    $6nfFC$useEffect(()=>{
        if (autoFocusRef.current) {
            $9bf71ea28793e738$var$activeScope = scopeRef;
            if (!$9bf71ea28793e738$var$isElementInScope(document.activeElement, $9bf71ea28793e738$var$activeScope.current)) $9bf71ea28793e738$var$focusFirstInScope(scopeRef.current);
        }
        autoFocusRef.current = false;
    }, []);
}
function $9bf71ea28793e738$var$useRestoreFocus(scopeRef, restoreFocus, contain) {
    // create a ref during render instead of useLayoutEffect so the active element is saved before a child with autoFocus=true mounts.
    const nodeToRestoreRef = $6nfFC$useRef(typeof document !== 'undefined' ? document.activeElement : null);
    // useLayoutEffect instead of useEffect so the active element is saved synchronously instead of asynchronously.
    $6nfFC$useLayoutEffect(()=>{
        let nodeToRestore = nodeToRestoreRef.current;
        if (!restoreFocus) return;
        // Handle the Tab key so that tabbing out of the scope goes to the next element
        // after the node that had focus when the scope mounted. This is important when
        // using portals for overlays, so that focus goes to the expected element when
        // tabbing out of the overlay.
        let onKeyDown = (e)=>{
            if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return;
            let focusedElement = document.activeElement;
            if (!$9bf71ea28793e738$var$isElementInScope(focusedElement, scopeRef.current)) return;
            // Create a DOM tree walker that matches all tabbable elements
            let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(document.body, {
                tabbable: true
            });
            // Find the next tabbable element after the currently focused element
            walker.currentNode = focusedElement;
            let nextElement = e.shiftKey ? walker.previousNode() : walker.nextNode();
            if (!document.body.contains(nodeToRestore) || nodeToRestore === document.body) nodeToRestore = null;
            // If there is no next element, or it is outside the current scope, move focus to the
            // next element after the node to restore to instead.
            if ((!nextElement || !$9bf71ea28793e738$var$isElementInScope(nextElement, scopeRef.current)) && nodeToRestore) {
                walker.currentNode = nodeToRestore;
                // Skip over elements within the scope, in case the scope immediately follows the node to restore.
                do nextElement = e.shiftKey ? walker.previousNode() : walker.nextNode();
                while ($9bf71ea28793e738$var$isElementInScope(nextElement, scopeRef.current))
                e.preventDefault();
                e.stopPropagation();
                if (nextElement) $9bf71ea28793e738$var$focusElement(nextElement, true);
                else // If there is no next element and the nodeToRestore isn't within a FocusScope (i.e. we are leaving the top level focus scope)
                // then move focus to the body.
                // Otherwise restore focus to the nodeToRestore (e.g menu within a popover -> tabbing to close the menu should move focus to menu trigger)
                if (!$9bf71ea28793e738$var$isElementInAnyScope(nodeToRestore)) focusedElement.blur();
                else $9bf71ea28793e738$var$focusElement(nodeToRestore, true);
            }
        };
        if (!contain) document.addEventListener('keydown', onKeyDown, true);
        return ()=>{
            if (!contain) document.removeEventListener('keydown', onKeyDown, true);
            if (restoreFocus && nodeToRestore && $9bf71ea28793e738$var$isElementInScope(document.activeElement, scopeRef.current)) requestAnimationFrame(()=>{
                // Only restore focus if we've lost focus to the body, the alternative is that focus has been purposefully moved elsewhere
                if (document.body.contains(nodeToRestore) && document.activeElement === document.body) $9bf71ea28793e738$var$focusElement(nodeToRestore);
            });
        };
    }, [
        scopeRef,
        restoreFocus,
        contain
    ]);
}
function $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, opts, scope) {
    let selector = (opts === null || opts === void 0 ? void 0 : opts.tabbable) ? $9bf71ea28793e738$var$TABBABLE_ELEMENT_SELECTOR : $9bf71ea28793e738$var$FOCUSABLE_ELEMENT_SELECTOR;
    let walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
        acceptNode (node) {
            var ref;
            // Skip nodes inside the starting node.
            if (opts === null || opts === void 0 ? void 0 : (ref = opts.from) === null || ref === void 0 ? void 0 : ref.contains(node)) return NodeFilter.FILTER_REJECT;
            if (node.matches(selector) && $645f2e67b85a24c9$export$e989c0fffaa6b27a(node) && (!scope || $9bf71ea28793e738$var$isElementInScope(node, scope)) && (!(opts === null || opts === void 0 ? void 0 : opts.accept) || opts.accept(node))) return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_SKIP;
        }
    });
    if (opts === null || opts === void 0 ? void 0 : opts.from) walker.currentNode = opts.from;
    return walker;
}
function $9bf71ea28793e738$export$c5251b9e124bf29(ref, defaultOptions = {
}) {
    return {
        focusNext (opts = {
        }) {
            let root = ref.current;
            if (!root) return;
            let { from: from , tabbable: tabbable = defaultOptions.tabbable , wrap: wrap = defaultOptions.wrap , accept: accept = defaultOptions.accept  } = opts;
            let node = from || document.activeElement;
            let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
                tabbable: tabbable,
                accept: accept
            });
            if (root.contains(node)) walker.currentNode = node;
            let nextNode = walker.nextNode();
            if (!nextNode && wrap) {
                walker.currentNode = root;
                nextNode = walker.nextNode();
            }
            if (nextNode) $9bf71ea28793e738$var$focusElement(nextNode, true);
            return nextNode;
        },
        focusPrevious (opts = defaultOptions) {
            let root = ref.current;
            if (!root) return;
            let { from: from , tabbable: tabbable = defaultOptions.tabbable , wrap: wrap = defaultOptions.wrap , accept: accept = defaultOptions.accept  } = opts;
            let node = from || document.activeElement;
            let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
                tabbable: tabbable,
                accept: accept
            });
            if (root.contains(node)) walker.currentNode = node;
            else {
                let next = $9bf71ea28793e738$var$last(walker);
                if (next) $9bf71ea28793e738$var$focusElement(next, true);
                return next;
            }
            let previousNode = walker.previousNode();
            if (!previousNode && wrap) {
                walker.currentNode = root;
                previousNode = $9bf71ea28793e738$var$last(walker);
            }
            if (previousNode) $9bf71ea28793e738$var$focusElement(previousNode, true);
            return previousNode;
        },
        focusFirst (opts = defaultOptions) {
            let root = ref.current;
            if (!root) return;
            let { tabbable: tabbable = defaultOptions.tabbable , accept: accept = defaultOptions.accept  } = opts;
            let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
                tabbable: tabbable,
                accept: accept
            });
            let nextNode = walker.nextNode();
            if (nextNode) $9bf71ea28793e738$var$focusElement(nextNode, true);
            return nextNode;
        },
        focusLast (opts = defaultOptions) {
            let root = ref.current;
            if (!root) return;
            let { tabbable: tabbable = defaultOptions.tabbable , accept: accept = defaultOptions.accept  } = opts;
            let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
                tabbable: tabbable,
                accept: accept
            });
            let next = $9bf71ea28793e738$var$last(walker);
            if (next) $9bf71ea28793e738$var$focusElement(next, true);
            return next;
        }
    };
}
function $9bf71ea28793e738$var$last(walker) {
    let next;
    let last;
    do {
        last = walker.lastChild();
        if (last) next = last;
    }while (last)
    return next;
}








function $f7dceffc5ad7768b$export$4e328f61c538687f(props = {
}) {
    let { autoFocus: autoFocus = false , isTextInput: isTextInput , within: within  } = props;
    let state = (0,react.useRef)({
        isFocused: false,
        isFocusVisible: autoFocus || $507fabe10e71c6fb$export$b9b3dfddab17db27()
    });
    let [isFocused1, setFocused] = (0,react.useState)(false);
    let [isFocusVisibleState, setFocusVisible] = (0,react.useState)(()=>state.current.isFocused && state.current.isFocusVisible
    );
    let updateState = (0,react.useCallback)(()=>setFocusVisible(state.current.isFocused && state.current.isFocusVisible)
    , []);
    let onFocusChange = (0,react.useCallback)((isFocused)=>{
        state.current.isFocused = isFocused;
        setFocused(isFocused);
        updateState();
    }, [
        updateState
    ]);
    $507fabe10e71c6fb$export$ec71b4b83ac08ec3((isFocusVisible)=>{
        state.current.isFocusVisible = isFocusVisible;
        updateState();
    }, [], {
        isTextInput: isTextInput
    });
    let { focusProps: focusProps  } = $a1ea59d68270f0dd$export$f8168d8dd8fd66e6({
        isDisabled: within,
        onFocusChange: onFocusChange
    });
    let { focusWithinProps: focusWithinProps  } = $9ab94262bd0047c7$export$420e68273165f4ec({
        isDisabled: !within,
        onFocusWithinChange: onFocusChange
    });
    return {
        isFocused: isFocused1,
        isFocusVisible: state.current.isFocused && isFocusVisibleState,
        focusProps: within ? focusWithinProps : focusProps
    };
}


function $907718708eab68af$export$1a38b4ad7f578e1d(props) {
    let { children: children , focusClass: focusClass , focusRingClass: focusRingClass  } = props;
    let { isFocused: isFocused , isFocusVisible: isFocusVisible , focusProps: focusProps  } = $f7dceffc5ad7768b$export$4e328f61c538687f(props);
    let child = $6nfFC$react.Children.only(children);
    return(/*#__PURE__*/ $6nfFC$react.cloneElement(child, $6nfFC$mergeProps(child.props, {
        ...focusProps,
        className: $6nfFC$clsx({
            [focusClass || '']: isFocused,
            [focusRingClass || '']: isFocusVisible
        })
    })));
}






let $e6afbd83fe6ebbd2$var$FocusableContext = /*#__PURE__*/ (/* unused pure expression or super */ null && ($6nfFC$react.createContext(null)));
function $e6afbd83fe6ebbd2$var$useFocusableContext(ref) {
    let context = $6nfFC$useContext($e6afbd83fe6ebbd2$var$FocusableContext) || {
    };
    $6nfFC$useSyncRef(context, ref);
    // eslint-disable-next-line
    let { ref: _ , ...otherProps } = context;
    return otherProps;
}
/**
 * Provides DOM props to the nearest focusable child.
 */ function $e6afbd83fe6ebbd2$var$FocusableProvider(props, ref) {
    let { children: children , ...otherProps } = props;
    let context = {
        ...otherProps,
        ref: ref
    };
    return(/*#__PURE__*/ $6nfFC$react.createElement($e6afbd83fe6ebbd2$var$FocusableContext.Provider, {
        value: context
    }, children));
}
let $e6afbd83fe6ebbd2$export$13f3202a3e5ddd5 = /*#__PURE__*/ (/* unused pure expression or super */ null && ($6nfFC$react.forwardRef($e6afbd83fe6ebbd2$var$FocusableProvider)));
function $e6afbd83fe6ebbd2$export$4c014de7c8940b4c(props, domRef) {
    let { focusProps: focusProps  } = $6nfFC$useFocus(props);
    let { keyboardProps: keyboardProps  } = $6nfFC$useKeyboard(props);
    let interactions = $6nfFC$mergeProps(focusProps, keyboardProps);
    let domProps = $e6afbd83fe6ebbd2$var$useFocusableContext(domRef);
    let interactionProps = props.isDisabled ? {
    } : domProps;
    let autoFocusRef = $6nfFC$useRef(props.autoFocus);
    $6nfFC$useEffect(()=>{
        if (autoFocusRef.current && domRef.current) $6a99195332edec8b$export$80f3e147d781571c(domRef.current);
        autoFocusRef.current = false;
    }, [
        domRef
    ]);
    return {
        focusableProps: $6nfFC$mergeProps({
            ...interactions,
            tabIndex: props.excludeFromTabOrder && !props.isDisabled ? -1 : undefined
        }, interactionProps)
    };
}







//# sourceMappingURL=module.js.map

;// CONCATENATED MODULE: ./node_modules/clsx/dist/clsx.m.js
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);else for(t in e)e[t]&&(n&&(n+=" "),n+=t);return n}function clsx(){for(var e,t,f=0,n="";f<arguments.length;)(e=arguments[f++])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ var clsx_m = (clsx);
;// CONCATENATED MODULE: ./node_modules/@react-aria/utils/dist/module.js







const module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c = typeof window !== 'undefined' ? react.useLayoutEffect : ()=>{
};




let module_$bdb11010cef70236$var$idsUpdaterMap = new Map();
function module_$bdb11010cef70236$export$f680877a34711e37(defaultId) {
    let [value, setValue] = $12uGp$useState(defaultId);
    let nextId = $12uGp$useRef(null);
    let res = $12uGp$useSSRSafeId(value);
    let updateValue = $12uGp$useCallback((val)=>{
        nextId.current = val;
    }, []);
    module_$bdb11010cef70236$var$idsUpdaterMap.set(res, updateValue);
    module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        let r = res;
        return ()=>{
            module_$bdb11010cef70236$var$idsUpdaterMap.delete(r);
        };
    }, [
        res
    ]);
    // This cannot cause an infinite loop because the ref is updated first.
    // eslint-disable-next-line
    $12uGp$useEffect(()=>{
        let newId = nextId.current;
        if (newId) {
            nextId.current = null;
            setValue(newId);
        }
    });
    return res;
}
function module_$bdb11010cef70236$export$cd8c9cb68f842629(idA, idB) {
    if (idA === idB) return idA;
    let setIdA = module_$bdb11010cef70236$var$idsUpdaterMap.get(idA);
    if (setIdA) {
        setIdA(idB);
        return idB;
    }
    let setIdB = module_$bdb11010cef70236$var$idsUpdaterMap.get(idB);
    if (setIdB) {
        setIdB(idA);
        return idA;
    }
    return idB;
}
function module_$bdb11010cef70236$export$b4cc09c592e8fdb8(depArray = []) {
    let id = module_$bdb11010cef70236$export$f680877a34711e37();
    let [resolvedId, setResolvedId] = module_$1dbecbe27a04f9af$export$14d238f342723f25(id);
    let updateId = $12uGp$useCallback(()=>{
        setResolvedId(function*() {
            yield id;
            yield document.getElementById(id) ? id : undefined;
        });
    }, [
        id,
        setResolvedId
    ]);
    module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(updateId, [
        id,
        updateId,
        ...depArray
    ]);
    return resolvedId;
}


function module_$ff5963eb1fccf552$export$e08e3b67e392101e(...callbacks) {
    return (...args)=>{
        for (let callback of callbacks)if (typeof callback === 'function') callback(...args);
    };
}





function module_$3ef42575df84b30b$export$9d1611c77c2fe928(...args) {
    // Start with a base clone of the first argument. This is a lot faster than starting
    // with an empty object and adding properties as we go.
    let result = {
        ...args[0]
    };
    for(let i = 1; i < args.length; i++){
        let props = args[i];
        for(let key in props){
            let a = result[key];
            let b = props[key];
            // Chain events
            if (typeof a === 'function' && typeof b === 'function' && // This is a lot faster than a regex.
            key[0] === 'o' && key[1] === 'n' && key.charCodeAt(2) >= /* 'A' */ 65 && key.charCodeAt(2) <= /* 'Z' */ 90) result[key] = module_$ff5963eb1fccf552$export$e08e3b67e392101e(a, b);
            else if ((key === 'className' || key === 'UNSAFE_className') && typeof a === 'string' && typeof b === 'string') result[key] = clsx_m(a, b);
            else if (key === 'id' && a && b) result.id = module_$bdb11010cef70236$export$cd8c9cb68f842629(a, b);
            else result[key] = b !== undefined ? b : a;
        }
    }
    return result;
}


function module_$5dc95899b306f630$export$c9058316764c140e(...refs) {
    return (value)=>{
        for (let ref of refs){
            if (typeof ref === 'function') ref(value);
            else if (ref != null) ref.current = value;
        }
    };
}


const module_$65484d02dcb7eb3e$var$DOMPropNames = new Set([
    'id'
]);
const module_$65484d02dcb7eb3e$var$labelablePropNames = new Set([
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-details'
]);
const module_$65484d02dcb7eb3e$var$propRe = /^(data-.*)$/;
function module_$65484d02dcb7eb3e$export$457c3d6518dd4c6f(props, opts = {
}) {
    let { labelable: labelable , propNames: propNames  } = opts;
    let filteredProps = {
    };
    for(const prop in props)if (Object.prototype.hasOwnProperty.call(props, prop) && (module_$65484d02dcb7eb3e$var$DOMPropNames.has(prop) || labelable && module_$65484d02dcb7eb3e$var$labelablePropNames.has(prop) || (propNames === null || propNames === void 0 ? void 0 : propNames.has(prop)) || module_$65484d02dcb7eb3e$var$propRe.test(prop))) filteredProps[prop] = props[prop];
    return filteredProps;
}


function module_$7215afc6de606d6b$export$de79e2c695e052f3(element) {
    if (module_$7215afc6de606d6b$var$supportsPreventScroll()) element.focus({
        preventScroll: true
    });
    else {
        let scrollableElements = module_$7215afc6de606d6b$var$getScrollableElements(element);
        element.focus();
        module_$7215afc6de606d6b$var$restoreScrollPosition(scrollableElements);
    }
}
let module_$7215afc6de606d6b$var$supportsPreventScrollCached = null;
function module_$7215afc6de606d6b$var$supportsPreventScroll() {
    if (module_$7215afc6de606d6b$var$supportsPreventScrollCached == null) {
        module_$7215afc6de606d6b$var$supportsPreventScrollCached = false;
        try {
            var focusElem = document.createElement('div');
            focusElem.focus({
                get preventScroll () {
                    module_$7215afc6de606d6b$var$supportsPreventScrollCached = true;
                    return true;
                }
            });
        } catch (e) {
        // Ignore
        }
    }
    return module_$7215afc6de606d6b$var$supportsPreventScrollCached;
}
function module_$7215afc6de606d6b$var$getScrollableElements(element) {
    var parent = element.parentNode;
    var scrollableElements = [];
    var rootScrollingElement = document.scrollingElement || document.documentElement;
    while(parent instanceof HTMLElement && parent !== rootScrollingElement){
        if (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) scrollableElements.push({
            element: parent,
            scrollTop: parent.scrollTop,
            scrollLeft: parent.scrollLeft
        });
        parent = parent.parentNode;
    }
    if (rootScrollingElement instanceof HTMLElement) scrollableElements.push({
        element: rootScrollingElement,
        scrollTop: rootScrollingElement.scrollTop,
        scrollLeft: rootScrollingElement.scrollLeft
    });
    return scrollableElements;
}
function module_$7215afc6de606d6b$var$restoreScrollPosition(scrollableElements) {
    for (let { element: element , scrollTop: scrollTop , scrollLeft: scrollLeft  } of scrollableElements){
        element.scrollTop = scrollTop;
        element.scrollLeft = scrollLeft;
    }
}


function module_$ab71dadb03a6fb2e$export$622cea445a1c5b7d(element, reverse, orientation = 'horizontal') {
    let rect = element.getBoundingClientRect();
    if (reverse) return orientation === 'horizontal' ? rect.right : rect.bottom;
    return orientation === 'horizontal' ? rect.left : rect.top;
}


/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ // We store a global list of elements that are currently transitioning,
// mapped to a set of CSS properties that are transitioning for that element.
// This is necessary rather than a simple count of transitions because of browser
// bugs, e.g. Chrome sometimes fires both transitionend and transitioncancel rather
// than one or the other. So we need to track what's actually transitioning so that
// we can ignore these duplicate events.
let module_$bbed8b41f857bcc0$var$transitionsByElement = new Map();
// A list of callbacks to call once there are no transitioning elements.
let module_$bbed8b41f857bcc0$var$transitionCallbacks = new Set();
function module_$bbed8b41f857bcc0$var$setupGlobalEvents() {
    if (typeof window === 'undefined') return;
    let onTransitionStart = (e)=>{
        // Add the transitioning property to the list for this element.
        let transitions = module_$bbed8b41f857bcc0$var$transitionsByElement.get(e.target);
        if (!transitions) {
            transitions = new Set();
            module_$bbed8b41f857bcc0$var$transitionsByElement.set(e.target, transitions);
            // The transitioncancel event must be registered on the element itself, rather than as a global
            // event. This enables us to handle when the node is deleted from the document while it is transitioning.
            // In that case, the cancel event would have nowhere to bubble to so we need to handle it directly.
            e.target.addEventListener('transitioncancel', onTransitionEnd);
        }
        transitions.add(e.propertyName);
    };
    let onTransitionEnd = (e)=>{
        // Remove property from list of transitioning properties.
        let properties = module_$bbed8b41f857bcc0$var$transitionsByElement.get(e.target);
        if (!properties) return;
        properties.delete(e.propertyName);
        // If empty, remove transitioncancel event, and remove the element from the list of transitioning elements.
        if (properties.size === 0) {
            e.target.removeEventListener('transitioncancel', onTransitionEnd);
            module_$bbed8b41f857bcc0$var$transitionsByElement.delete(e.target);
        }
        // If no transitioning elements, call all of the queued callbacks.
        if (module_$bbed8b41f857bcc0$var$transitionsByElement.size === 0) {
            for (let cb of module_$bbed8b41f857bcc0$var$transitionCallbacks)cb();
            module_$bbed8b41f857bcc0$var$transitionCallbacks.clear();
        }
    };
    document.body.addEventListener('transitionrun', onTransitionStart);
    document.body.addEventListener('transitionend', onTransitionEnd);
}
if (typeof document !== 'undefined') {
    if (document.readyState !== 'loading') module_$bbed8b41f857bcc0$var$setupGlobalEvents();
    else document.addEventListener('DOMContentLoaded', module_$bbed8b41f857bcc0$var$setupGlobalEvents);
}
function module_$bbed8b41f857bcc0$export$24490316f764c430(fn) {
    // Wait one frame to see if an animation starts, e.g. a transition on mount.
    requestAnimationFrame(()=>{
        // If no transitions are running, call the function immediately.
        // Otherwise, add it to a list of callbacks to run at the end of the animation.
        if (module_$bbed8b41f857bcc0$var$transitionsByElement.size === 0) fn();
        else module_$bbed8b41f857bcc0$var$transitionCallbacks.add(fn);
    });
}




// Keep track of elements that we are currently handling dragging for via useDrag1D.
// If there's an ancestor and a descendant both using useDrag1D(), and the user starts
// dragging the descendant, we don't want useDrag1D events to fire for the ancestor.
const module_$9cc09df9fd7676be$var$draggingElements = (/* unused pure expression or super */ null && ([]));
function module_$9cc09df9fd7676be$export$7bbed75feba39706(props) {
    console.warn('useDrag1D is deprecated, please use `useMove` instead https://react-spectrum.adobe.com/react-aria/useMove.html');
    let { containerRef: containerRef , reverse: reverse , orientation: orientation , onHover: onHover , onDrag: onDrag , onPositionChange: onPositionChange , onIncrement: onIncrement , onDecrement: onDecrement , onIncrementToMax: onIncrementToMax , onDecrementToMin: onDecrementToMin , onCollapseToggle: onCollapseToggle  } = props;
    let getPosition = (e)=>orientation === 'horizontal' ? e.clientX : e.clientY
    ;
    let getNextOffset = (e)=>{
        let containerOffset = module_$ab71dadb03a6fb2e$export$622cea445a1c5b7d(containerRef.current, reverse, orientation);
        let mouseOffset = getPosition(e);
        let nextOffset = reverse ? containerOffset - mouseOffset : mouseOffset - containerOffset;
        return nextOffset;
    };
    let dragging = $12uGp$useRef(false);
    let prevPosition = $12uGp$useRef(0);
    // Keep track of the current handlers in a ref so that the events can access them.
    let handlers = $12uGp$useRef({
        onPositionChange: onPositionChange,
        onDrag: onDrag
    });
    handlers.current.onDrag = onDrag;
    handlers.current.onPositionChange = onPositionChange;
    let onMouseDragged = (e)=>{
        e.preventDefault();
        let nextOffset = getNextOffset(e);
        if (!dragging.current) {
            dragging.current = true;
            if (handlers.current.onDrag) handlers.current.onDrag(true);
            if (handlers.current.onPositionChange) handlers.current.onPositionChange(nextOffset);
        }
        if (prevPosition.current === nextOffset) return;
        prevPosition.current = nextOffset;
        if (onPositionChange) onPositionChange(nextOffset);
    };
    let onMouseUp = (e)=>{
        const target = e.target;
        dragging.current = false;
        let nextOffset = getNextOffset(e);
        if (handlers.current.onDrag) handlers.current.onDrag(false);
        if (handlers.current.onPositionChange) handlers.current.onPositionChange(nextOffset);
        module_$9cc09df9fd7676be$var$draggingElements.splice(module_$9cc09df9fd7676be$var$draggingElements.indexOf(target), 1);
        window.removeEventListener('mouseup', onMouseUp, false);
        window.removeEventListener('mousemove', onMouseDragged, false);
    };
    let onMouseDown = (e)=>{
        const target = e.currentTarget;
        // If we're already handling dragging on a descendant with useDrag1D, then
        // we don't want to handle the drag motion on this target as well.
        if (module_$9cc09df9fd7676be$var$draggingElements.some((elt)=>target.contains(elt)
        )) return;
        module_$9cc09df9fd7676be$var$draggingElements.push(target);
        window.addEventListener('mousemove', onMouseDragged, false);
        window.addEventListener('mouseup', onMouseUp, false);
    };
    let onMouseEnter = ()=>{
        if (onHover) onHover(true);
    };
    let onMouseOut = ()=>{
        if (onHover) onHover(false);
    };
    let onKeyDown = (e)=>{
        switch(e.key){
            case 'Left':
            case 'ArrowLeft':
                if (orientation === 'horizontal') {
                    e.preventDefault();
                    if (onDecrement && !reverse) onDecrement();
                    else if (onIncrement && reverse) onIncrement();
                }
                break;
            case 'Up':
            case 'ArrowUp':
                if (orientation === 'vertical') {
                    e.preventDefault();
                    if (onDecrement && !reverse) onDecrement();
                    else if (onIncrement && reverse) onIncrement();
                }
                break;
            case 'Right':
            case 'ArrowRight':
                if (orientation === 'horizontal') {
                    e.preventDefault();
                    if (onIncrement && !reverse) onIncrement();
                    else if (onDecrement && reverse) onDecrement();
                }
                break;
            case 'Down':
            case 'ArrowDown':
                if (orientation === 'vertical') {
                    e.preventDefault();
                    if (onIncrement && !reverse) onIncrement();
                    else if (onDecrement && reverse) onDecrement();
                }
                break;
            case 'Home':
                e.preventDefault();
                if (onDecrementToMin) onDecrementToMin();
                break;
            case 'End':
                e.preventDefault();
                if (onIncrementToMax) onIncrementToMax();
                break;
            case 'Enter':
                e.preventDefault();
                if (onCollapseToggle) onCollapseToggle();
                break;
        }
    };
    return {
        onMouseDown: onMouseDown,
        onMouseEnter: onMouseEnter,
        onMouseOut: onMouseOut,
        onKeyDown: onKeyDown
    };
}



function module_$03deb23ff14920c4$export$4eaf04e54aa8eed6() {
    let globalListeners = (0,react.useRef)(new Map());
    let addGlobalListener = (0,react.useCallback)((eventTarget, type, listener, options)=>{
        // Make sure we remove the listener after it is called with the `once` option.
        let fn = (options === null || options === void 0 ? void 0 : options.once) ? (...args)=>{
            globalListeners.current.delete(listener);
            listener(...args);
        } : listener;
        globalListeners.current.set(listener, {
            type: type,
            eventTarget: eventTarget,
            fn: fn,
            options: options
        });
        eventTarget.addEventListener(type, listener, options);
    }, []);
    let removeGlobalListener = (0,react.useCallback)((eventTarget, type, listener, options)=>{
        var ref;
        let fn = ((ref = globalListeners.current.get(listener)) === null || ref === void 0 ? void 0 : ref.fn) || listener;
        eventTarget.removeEventListener(type, fn, options);
        globalListeners.current.delete(listener);
    }, []);
    let removeAllGlobalListeners = (0,react.useCallback)(()=>{
        globalListeners.current.forEach((value, key)=>{
            removeGlobalListener(value.eventTarget, value.type, key, value.options);
        });
    }, [
        removeGlobalListener
    ]);
    // eslint-disable-next-line arrow-body-style
    (0,react.useEffect)(()=>{
        return removeAllGlobalListeners;
    }, [
        removeAllGlobalListeners
    ]);
    return {
        addGlobalListener: addGlobalListener,
        removeGlobalListener: removeGlobalListener,
        removeAllGlobalListeners: removeAllGlobalListeners
    };
}



function module_$313b98861ee5dd6c$export$d6875122194c7b44(props, defaultLabel) {
    let { id: id , 'aria-label': label , 'aria-labelledby': labelledBy  } = props;
    // If there is both an aria-label and aria-labelledby,
    // combine them by pointing to the element itself.
    id = module_$bdb11010cef70236$export$f680877a34711e37(id);
    if (labelledBy && label) {
        let ids = new Set([
            ...labelledBy.trim().split(/\s+/),
            id
        ]);
        labelledBy = [
            ...ids
        ].join(' ');
    } else if (labelledBy) labelledBy = labelledBy.trim().split(/\s+/).join(' ');
    // If no labels are provided, use the default
    if (!label && !labelledBy && defaultLabel) label = defaultLabel;
    return {
        id: id,
        'aria-label': label,
        'aria-labelledby': labelledBy
    };
}




function module_$df56164dff5785e2$export$4338b53315abf666(forwardedRef) {
    const objRef = $12uGp$useRef();
    /**
   * We're using `useLayoutEffect` here instead of `useEffect` because we want
   * to make sure that the `ref` value is up to date before other places in the
   * the execution cycle try to read it.
   */ module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        if (!forwardedRef) return;
        if (typeof forwardedRef === 'function') forwardedRef(objRef.current);
        else forwardedRef.current = objRef.current;
    }, [
        forwardedRef
    ]);
    return objRef;
}



function module_$4f58c5f72bcf79f7$export$496315a1608d9602(effect, dependencies) {
    const isInitialMount = $12uGp$useRef(true);
    $12uGp$useEffect(()=>{
        if (isInitialMount.current) isInitialMount.current = false;
        else effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
}




function module_$9daab02d461809db$var$hasResizeObserver() {
    return typeof window.ResizeObserver !== 'undefined';
}
function module_$9daab02d461809db$export$683480f191c0e3ea(options) {
    const { ref: ref , onResize: onResize  } = options;
    $12uGp$useEffect(()=>{
        let element = ref === null || ref === void 0 ? void 0 : ref.current;
        if (!element) return;
        if (!module_$9daab02d461809db$var$hasResizeObserver()) {
            window.addEventListener('resize', onResize, false);
            return ()=>{
                window.removeEventListener('resize', onResize, false);
            };
        } else {
            const resizeObserverInstance = new window.ResizeObserver((entries)=>{
                if (!entries.length) return;
                onResize();
            });
            resizeObserverInstance.observe(element);
            return ()=>{
                if (element) resizeObserverInstance.unobserve(element);
            };
        }
    }, [
        onResize,
        ref
    ]);
}



function module_$e7801be82b4b2a53$export$4debdb1a3f0fa79e(context, ref) {
    module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        if (context && context.ref && ref) {
            context.ref.current = ref.current;
            return ()=>{
                context.ref.current = null;
            };
        }
    }, [
        context,
        ref
    ]);
}


function module_$62d8ded9296f3872$export$cfa2225e87938781(node) {
    while(node && !module_$62d8ded9296f3872$var$isScrollable(node))node = node.parentElement;
    return node || document.scrollingElement || document.documentElement;
}
function module_$62d8ded9296f3872$var$isScrollable(node) {
    let style = window.getComputedStyle(node);
    return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}



// @ts-ignore
let module_$5df64b3807dc15ee$var$visualViewport = typeof window !== 'undefined' && window.visualViewport;
function module_$5df64b3807dc15ee$export$d699905dd57c73ca() {
    let [size1, setSize] = $12uGp$useState(()=>module_$5df64b3807dc15ee$var$getViewportSize()
    );
    $12uGp$useEffect(()=>{
        // Use visualViewport api to track available height even on iOS virtual keyboard opening
        let onResize = ()=>{
            setSize((size)=>{
                let newSize = module_$5df64b3807dc15ee$var$getViewportSize();
                if (newSize.width === size.width && newSize.height === size.height) return size;
                return newSize;
            });
        };
        if (!module_$5df64b3807dc15ee$var$visualViewport) window.addEventListener('resize', onResize);
        else module_$5df64b3807dc15ee$var$visualViewport.addEventListener('resize', onResize);
        return ()=>{
            if (!module_$5df64b3807dc15ee$var$visualViewport) window.removeEventListener('resize', onResize);
            else module_$5df64b3807dc15ee$var$visualViewport.removeEventListener('resize', onResize);
        };
    }, []);
    return size1;
}
function module_$5df64b3807dc15ee$var$getViewportSize() {
    return {
        width: (module_$5df64b3807dc15ee$var$visualViewport === null || module_$5df64b3807dc15ee$var$visualViewport === void 0 ? void 0 : module_$5df64b3807dc15ee$var$visualViewport.width) || window.innerWidth,
        height: (module_$5df64b3807dc15ee$var$visualViewport === null || module_$5df64b3807dc15ee$var$visualViewport === void 0 ? void 0 : module_$5df64b3807dc15ee$var$visualViewport.height) || window.innerHeight
    };
}




let module_$ef06256079686ba0$var$descriptionId = 0;
const module_$ef06256079686ba0$var$descriptionNodes = new Map();
function module_$ef06256079686ba0$export$f8aeda7b10753fa1(description) {
    let [id1, setId] = $12uGp$useState(undefined);
    module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        if (!description) return;
        let desc = module_$ef06256079686ba0$var$descriptionNodes.get(description);
        if (!desc) {
            let id = `react-aria-description-${module_$ef06256079686ba0$var$descriptionId++}`;
            setId(id);
            let node = document.createElement('div');
            node.id = id;
            node.style.display = 'none';
            node.textContent = description;
            document.body.appendChild(node);
            desc = {
                refCount: 0,
                element: node
            };
            module_$ef06256079686ba0$var$descriptionNodes.set(description, desc);
        } else setId(desc.element.id);
        desc.refCount++;
        return ()=>{
            if (--desc.refCount === 0) {
                desc.element.remove();
                module_$ef06256079686ba0$var$descriptionNodes.delete(description);
            }
        };
    }, [
        description
    ]);
    return {
        'aria-describedby': description ? id1 : undefined
    };
}


/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ function module_$c87311424ea30a05$var$testUserAgent(re) {
    var ref;
    if (typeof window === 'undefined' || window.navigator == null) return false;
    return ((ref = window.navigator['userAgentData']) === null || ref === void 0 ? void 0 : ref.brands.some((brand)=>re.test(brand.brand)
    )) || re.test(window.navigator.userAgent);
}
function module_$c87311424ea30a05$var$testPlatform(re) {
    var ref;
    return typeof window !== 'undefined' && window.navigator != null ? re.test(((ref = window.navigator['userAgentData']) === null || ref === void 0 ? void 0 : ref.platform) || window.navigator.platform) : false;
}
function module_$c87311424ea30a05$export$9ac100e40613ea10() {
    return module_$c87311424ea30a05$var$testPlatform(/^Mac/i);
}
function module_$c87311424ea30a05$export$186c6964ca17d99() {
    return module_$c87311424ea30a05$var$testPlatform(/^iPhone/i);
}
function module_$c87311424ea30a05$export$7bef049ce92e4224() {
    return module_$c87311424ea30a05$var$testPlatform(/^iPad/i) || module_$c87311424ea30a05$export$9ac100e40613ea10() && navigator.maxTouchPoints > 1;
}
function module_$c87311424ea30a05$export$fedb369cb70207f1() {
    return module_$c87311424ea30a05$export$186c6964ca17d99() || module_$c87311424ea30a05$export$7bef049ce92e4224();
}
function module_$c87311424ea30a05$export$e1865c3bedcd822b() {
    return module_$c87311424ea30a05$export$9ac100e40613ea10() || module_$c87311424ea30a05$export$fedb369cb70207f1();
}
function module_$c87311424ea30a05$export$78551043582a6a98() {
    return module_$c87311424ea30a05$var$testUserAgent(/AppleWebKit/i) && !module_$c87311424ea30a05$export$6446a186d09e379e();
}
function module_$c87311424ea30a05$export$6446a186d09e379e() {
    return module_$c87311424ea30a05$var$testUserAgent(/Chrome/i);
}
function module_$c87311424ea30a05$export$a11b0059900ceec8() {
    return module_$c87311424ea30a05$var$testUserAgent(/Android/i);
}



function module_$e9faafb641e167db$export$90fc3a17d93f704c(ref, event, handler1, options) {
    let handlerRef = $12uGp$useRef(handler1);
    handlerRef.current = handler1;
    let isDisabled = handler1 == null;
    $12uGp$useEffect(()=>{
        if (isDisabled) return;
        let element = ref.current;
        let handler = (e)=>handlerRef.current.call(this, e)
        ;
        element.addEventListener(event, handler, options);
        return ()=>{
            element.removeEventListener(event, handler, options);
        };
    }, [
        ref,
        event,
        options,
        isDisabled
    ]);
}




function module_$1dbecbe27a04f9af$export$14d238f342723f25(defaultValue) {
    let [value, setValue] = $12uGp$useState(defaultValue);
    let valueRef = $12uGp$useRef(value);
    let effect = $12uGp$useRef(null);
    valueRef.current = value;
    // Store the function in a ref so we can always access the current version
    // which has the proper `value` in scope.
    let nextRef = $12uGp$useRef(null);
    nextRef.current = ()=>{
        // Run the generator to the next yield.
        let newValue = effect.current.next();
        // If the generator is done, reset the effect.
        if (newValue.done) {
            effect.current = null;
            return;
        }
        // If the value is the same as the current value,
        // then continue to the next yield. Otherwise,
        // set the value in state and wait for the next layout effect.
        if (value === newValue.value) nextRef.current();
        else setValue(newValue.value);
    };
    module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        // If there is an effect currently running, continue to the next yield.
        if (effect.current) nextRef.current();
    });
    let queue = $12uGp$useCallback((fn)=>{
        effect.current = fn(valueRef.current);
        nextRef.current();
    }, [
        effect,
        nextRef
    ]);
    return [
        value,
        queue
    ];
}


function module_$2f04cbc44ee30ce0$export$53a0910f038337bd(scrollView, element) {
    let offsetX = module_$2f04cbc44ee30ce0$var$relativeOffset(scrollView, element, 'left');
    let offsetY = module_$2f04cbc44ee30ce0$var$relativeOffset(scrollView, element, 'top');
    let width = element.offsetWidth;
    let height = element.offsetHeight;
    let x = scrollView.scrollLeft;
    let y = scrollView.scrollTop;
    let maxX = x + scrollView.offsetWidth;
    let maxY = y + scrollView.offsetHeight;
    if (offsetX <= x) x = offsetX;
    else if (offsetX + width > maxX) x += offsetX + width - maxX;
    if (offsetY <= y) y = offsetY;
    else if (offsetY + height > maxY) y += offsetY + height - maxY;
    scrollView.scrollLeft = x;
    scrollView.scrollTop = y;
}
/**
 * Computes the offset left or top from child to ancestor by accumulating
 * offsetLeft or offsetTop through intervening offsetParents.
 */ function module_$2f04cbc44ee30ce0$var$relativeOffset(ancestor, child, axis) {
    const prop = axis === 'left' ? 'offsetLeft' : 'offsetTop';
    let sum = 0;
    while(child.offsetParent){
        sum += child[prop];
        if (child.offsetParent === ancestor) break;
        else if (child.offsetParent.contains(ancestor)) {
            // If the ancestor is not `position:relative`, then we stop at
            // _its_ offset parent, and we subtract off _its_ offset, so that
            // we end up with the proper offset from child to ancestor.
            sum -= ancestor[prop];
            break;
        }
        child = child.offsetParent;
    }
    return sum;
}




function module_$6a7db85432448f7f$export$60278871457622de(event) {
    // JAWS/NVDA with Firefox.
    if (event.mozInputSource === 0 && event.isTrusted) return true;
    // Android TalkBack's detail value varies depending on the event listener providing the event so we have specific logic here instead
    // If pointerType is defined, event is from a click listener. For events from mousedown listener, detail === 0 is a sufficient check
    // to detect TalkBack virtual clicks.
    if (module_$c87311424ea30a05$export$a11b0059900ceec8() && event.pointerType) return event.type === 'click' && event.buttons === 1;
    return event.detail === 0 && !event.pointerType;
}
function module_$6a7db85432448f7f$export$29bf1b5f2c56cf63(event) {
    // If the pointer size is zero, then we assume it's from a screen reader.
    // Android TalkBack double tap will sometimes return a event with width and height of 1
    // and pointerType === 'mouse' so we need to check for a specific combination of event attributes.
    // Cannot use "event.pressure === 0" as the sole check due to Safari pointer events always returning pressure === 0
    // instead of .5, see https://bugs.webkit.org/show_bug.cgi?id=206216. event.pointerType === 'mouse' is to distingush
    // Talkback double tap from Windows Firefox touch screen press
    return event.width === 0 && event.height === 0 || event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === 'mouse';
}





//# sourceMappingURL=module.js.map

;// CONCATENATED MODULE: ./node_modules/@react-aria/interactions/dist/module.js





// Note that state only matters here for iOS. Non-iOS gets user-select: none applied to the target element
// rather than at the document level so we just need to apply/remove user-select: none for each pressed element individually
let module_$14c0b72509d70225$var$state = 'default';
let module_$14c0b72509d70225$var$savedUserSelect = '';
let module_$14c0b72509d70225$var$modifiedElementMap = new WeakMap();
function module_$14c0b72509d70225$export$16a4697467175487(target) {
    if (module_$c87311424ea30a05$export$fedb369cb70207f1()) {
        if (module_$14c0b72509d70225$var$state === 'default') {
            module_$14c0b72509d70225$var$savedUserSelect = document.documentElement.style.webkitUserSelect;
            document.documentElement.style.webkitUserSelect = 'none';
        }
        module_$14c0b72509d70225$var$state = 'disabled';
    } else if (target instanceof HTMLElement || target instanceof SVGElement) {
        // If not iOS, store the target's original user-select and change to user-select: none
        // Ignore state since it doesn't apply for non iOS
        module_$14c0b72509d70225$var$modifiedElementMap.set(target, target.style.userSelect);
        target.style.userSelect = 'none';
    }
}
function module_$14c0b72509d70225$export$b0d6fa1ab32e3295(target) {
    if (module_$c87311424ea30a05$export$fedb369cb70207f1()) {
        // If the state is already default, there's nothing to do.
        // If it is restoring, then there's no need to queue a second restore.
        if (module_$14c0b72509d70225$var$state !== 'disabled') return;
        module_$14c0b72509d70225$var$state = 'restoring';
        // There appears to be a delay on iOS where selection still might occur
        // after pointer up, so wait a bit before removing user-select.
        setTimeout(()=>{
            // Wait for any CSS transitions to complete so we don't recompute style
            // for the whole page in the middle of the animation and cause jank.
            module_$bbed8b41f857bcc0$export$24490316f764c430(()=>{
                // Avoid race conditions
                if (module_$14c0b72509d70225$var$state === 'restoring') {
                    if (document.documentElement.style.webkitUserSelect === 'none') document.documentElement.style.webkitUserSelect = module_$14c0b72509d70225$var$savedUserSelect || '';
                    module_$14c0b72509d70225$var$savedUserSelect = '';
                    module_$14c0b72509d70225$var$state = 'default';
                }
            });
        }, 300);
    } else if (target instanceof HTMLElement || target instanceof SVGElement) // If not iOS, restore the target's original user-select if any
    // Ignore state since it doesn't apply for non iOS
    {
        if (target && module_$14c0b72509d70225$var$modifiedElementMap.has(target)) {
            let targetOldUserSelect = module_$14c0b72509d70225$var$modifiedElementMap.get(target);
            if (target.style.userSelect === 'none') target.style.userSelect = targetOldUserSelect;
            if (target.getAttribute('style') === '') target.removeAttribute('style');
            module_$14c0b72509d70225$var$modifiedElementMap.delete(target);
        }
    }
}




const module_$ae1eeba8b9eafd08$export$5165eccb35aaadb5 = react.createContext(null);
module_$ae1eeba8b9eafd08$export$5165eccb35aaadb5.displayName = 'PressResponderContext';



function module_$f6c31cce2adf654f$var$usePressResponderContext(props) {
    // Consume context from <PressResponder> and merge with props.
    let context = (0,react.useContext)(module_$ae1eeba8b9eafd08$export$5165eccb35aaadb5);
    if (context) {
        let { register: register , ...contextProps } = context;
        props = module_$3ef42575df84b30b$export$9d1611c77c2fe928(contextProps, props);
        register();
    }
    module_$e7801be82b4b2a53$export$4debdb1a3f0fa79e(context, props.ref);
    return props;
}
function module_$f6c31cce2adf654f$export$45712eceda6fad21(props) {
    let { onPress: onPress1 , onPressChange: onPressChange1 , onPressStart: onPressStart1 , onPressEnd: onPressEnd1 , onPressUp: onPressUp1 , isDisabled: isDisabled1 , isPressed: isPressedProp , preventFocusOnPress: preventFocusOnPress , shouldCancelOnPointerExit: shouldCancelOnPointerExit , allowTextSelectionOnPress: allowTextSelectionOnPress , // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref: _ , ...domProps } = module_$f6c31cce2adf654f$var$usePressResponderContext(props);
    let propsRef = (0,react.useRef)(null);
    propsRef.current = {
        onPress: onPress1,
        onPressChange: onPressChange1,
        onPressStart: onPressStart1,
        onPressEnd: onPressEnd1,
        onPressUp: onPressUp1,
        isDisabled: isDisabled1,
        shouldCancelOnPointerExit: shouldCancelOnPointerExit
    };
    let [isPressed, setPressed] = (0,react.useState)(false);
    let ref = (0,react.useRef)({
        isPressed: false,
        ignoreEmulatedMouseEvents: false,
        ignoreClickAfterPress: false,
        didFirePressStart: false,
        activePointerId: null,
        target: null,
        isOverTarget: false,
        pointerType: null
    });
    let { addGlobalListener: addGlobalListener , removeAllGlobalListeners: removeAllGlobalListeners  } = module_$03deb23ff14920c4$export$4eaf04e54aa8eed6();
    let pressProps1 = (0,react.useMemo)(()=>{
        let state = ref.current;
        let triggerPressStart = (originalEvent, pointerType)=>{
            let { onPressStart: onPressStart , onPressChange: onPressChange , isDisabled: isDisabled  } = propsRef.current;
            if (isDisabled || state.didFirePressStart) return;
            if (onPressStart) onPressStart({
                type: 'pressstart',
                pointerType: pointerType,
                target: originalEvent.currentTarget,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
            if (onPressChange) onPressChange(true);
            state.didFirePressStart = true;
            setPressed(true);
        };
        let triggerPressEnd = (originalEvent, pointerType, wasPressed = true)=>{
            let { onPressEnd: onPressEnd , onPressChange: onPressChange , onPress: onPress , isDisabled: isDisabled  } = propsRef.current;
            if (!state.didFirePressStart) return;
            state.ignoreClickAfterPress = true;
            state.didFirePressStart = false;
            if (onPressEnd) onPressEnd({
                type: 'pressend',
                pointerType: pointerType,
                target: originalEvent.currentTarget,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
            if (onPressChange) onPressChange(false);
            setPressed(false);
            if (onPress && wasPressed && !isDisabled) onPress({
                type: 'press',
                pointerType: pointerType,
                target: originalEvent.currentTarget,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
        };
        let triggerPressUp = (originalEvent, pointerType)=>{
            let { onPressUp: onPressUp , isDisabled: isDisabled  } = propsRef.current;
            if (isDisabled) return;
            if (onPressUp) onPressUp({
                type: 'pressup',
                pointerType: pointerType,
                target: originalEvent.currentTarget,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
        };
        let cancel = (e)=>{
            if (state.isPressed) {
                if (state.isOverTarget) triggerPressEnd(module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
                state.isPressed = false;
                state.isOverTarget = false;
                state.activePointerId = null;
                state.pointerType = null;
                removeAllGlobalListeners();
                if (!allowTextSelectionOnPress) module_$14c0b72509d70225$export$b0d6fa1ab32e3295(state.target);
            }
        };
        let pressProps = {
            onKeyDown (e) {
                if (module_$f6c31cce2adf654f$var$isValidKeyboardEvent(e.nativeEvent, e.currentTarget) && e.currentTarget.contains(e.target)) {
                    if (module_$f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(e.target, e.key)) e.preventDefault();
                    e.stopPropagation();
                    // If the event is repeating, it may have started on a different element
                    // after which focus moved to the current element. Ignore these events and
                    // only handle the first key down event.
                    if (!state.isPressed && !e.repeat) {
                        state.target = e.currentTarget;
                        state.isPressed = true;
                        triggerPressStart(e, 'keyboard');
                        // Focus may move before the key up event, so register the event on the document
                        // instead of the same element where the key down event occurred.
                        addGlobalListener(document, 'keyup', onKeyUp, false);
                    }
                } else if (e.key === 'Enter' && module_$f6c31cce2adf654f$var$isHTMLAnchorLink(e.currentTarget)) // If the target is a link, we won't have handled this above because we want the default
                // browser behavior to open the link when pressing Enter. But we still need to prevent
                // default so that elements above do not also handle it (e.g. table row).
                e.stopPropagation();
            },
            onKeyUp (e) {
                if (module_$f6c31cce2adf654f$var$isValidKeyboardEvent(e.nativeEvent, e.currentTarget) && !e.repeat && e.currentTarget.contains(e.target)) triggerPressUp(module_$f6c31cce2adf654f$var$createEvent(state.target, e), 'keyboard');
            },
            onClick (e) {
                if (e && !e.currentTarget.contains(e.target)) return;
                if (e && e.button === 0) {
                    e.stopPropagation();
                    if (isDisabled1) e.preventDefault();
                    // If triggered from a screen reader or by using element.click(),
                    // trigger as if it were a keyboard click.
                    if (!state.ignoreClickAfterPress && !state.ignoreEmulatedMouseEvents && (state.pointerType === 'virtual' || module_$6a7db85432448f7f$export$60278871457622de(e.nativeEvent))) {
                        // Ensure the element receives focus (VoiceOver on iOS does not do this)
                        if (!isDisabled1 && !preventFocusOnPress) module_$7215afc6de606d6b$export$de79e2c695e052f3(e.currentTarget);
                        triggerPressStart(e, 'virtual');
                        triggerPressUp(e, 'virtual');
                        triggerPressEnd(e, 'virtual');
                    }
                    state.ignoreEmulatedMouseEvents = false;
                    state.ignoreClickAfterPress = false;
                }
            }
        };
        let onKeyUp = (e)=>{
            if (state.isPressed && module_$f6c31cce2adf654f$var$isValidKeyboardEvent(e, state.target)) {
                if (module_$f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(e.target, e.key)) e.preventDefault();
                e.stopPropagation();
                state.isPressed = false;
                let target = e.target;
                triggerPressEnd(module_$f6c31cce2adf654f$var$createEvent(state.target, e), 'keyboard', state.target.contains(target));
                removeAllGlobalListeners();
                // If the target is a link, trigger the click method to open the URL,
                // but defer triggering pressEnd until onClick event handler.
                if (state.target instanceof HTMLElement && state.target.contains(target) && (module_$f6c31cce2adf654f$var$isHTMLAnchorLink(state.target) || state.target.getAttribute('role') === 'link')) state.target.click();
            }
        };
        if (typeof PointerEvent !== 'undefined') {
            pressProps.onPointerDown = (e)=>{
                // Only handle left clicks, and ignore events that bubbled through portals.
                if (e.button !== 0 || !e.currentTarget.contains(e.target)) return;
                // iOS safari fires pointer events from VoiceOver with incorrect coordinates/target.
                // Ignore and let the onClick handler take care of it instead.
                // https://bugs.webkit.org/show_bug.cgi?id=222627
                // https://bugs.webkit.org/show_bug.cgi?id=223202
                if (module_$6a7db85432448f7f$export$29bf1b5f2c56cf63(e.nativeEvent)) {
                    state.pointerType = 'virtual';
                    return;
                }
                // Due to browser inconsistencies, especially on mobile browsers, we prevent
                // default on pointer down and handle focusing the pressable element ourselves.
                if (module_$f6c31cce2adf654f$var$shouldPreventDefault(e.currentTarget)) e.preventDefault();
                state.pointerType = e.pointerType;
                e.stopPropagation();
                if (!state.isPressed) {
                    state.isPressed = true;
                    state.isOverTarget = true;
                    state.activePointerId = e.pointerId;
                    state.target = e.currentTarget;
                    if (!isDisabled1 && !preventFocusOnPress) module_$7215afc6de606d6b$export$de79e2c695e052f3(e.currentTarget);
                    if (!allowTextSelectionOnPress) module_$14c0b72509d70225$export$16a4697467175487(state.target);
                    triggerPressStart(e, state.pointerType);
                    addGlobalListener(document, 'pointermove', onPointerMove, false);
                    addGlobalListener(document, 'pointerup', onPointerUp, false);
                    addGlobalListener(document, 'pointercancel', onPointerCancel, false);
                }
            };
            pressProps.onMouseDown = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                if (e.button === 0) {
                    // Chrome and Firefox on touch Windows devices require mouse down events
                    // to be canceled in addition to pointer events, or an extra asynchronous
                    // focus event will be fired.
                    if (module_$f6c31cce2adf654f$var$shouldPreventDefault(e.currentTarget)) e.preventDefault();
                    e.stopPropagation();
                }
            };
            pressProps.onPointerUp = (e)=>{
                // iOS fires pointerup with zero width and height, so check the pointerType recorded during pointerdown.
                if (!e.currentTarget.contains(e.target) || state.pointerType === 'virtual') return;
                // Only handle left clicks
                // Safari on iOS sometimes fires pointerup events, even
                // when the touch isn't over the target, so double check.
                if (e.button === 0 && module_$f6c31cce2adf654f$var$isOverTarget(e, e.currentTarget)) triggerPressUp(e, state.pointerType || e.pointerType);
            };
            // Safari on iOS < 13.2 does not implement pointerenter/pointerleave events correctly.
            // Use pointer move events instead to implement our own hit testing.
            // See https://bugs.webkit.org/show_bug.cgi?id=199803
            let onPointerMove = (e)=>{
                if (e.pointerId !== state.activePointerId) return;
                if (module_$f6c31cce2adf654f$var$isOverTarget(e, state.target)) {
                    if (!state.isOverTarget) {
                        state.isOverTarget = true;
                        triggerPressStart(module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType);
                    }
                } else if (state.isOverTarget) {
                    state.isOverTarget = false;
                    triggerPressEnd(module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
                    if (propsRef.current.shouldCancelOnPointerExit) cancel(e);
                }
            };
            let onPointerUp = (e)=>{
                if (e.pointerId === state.activePointerId && state.isPressed && e.button === 0) {
                    if (module_$f6c31cce2adf654f$var$isOverTarget(e, state.target)) triggerPressEnd(module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType);
                    else if (state.isOverTarget) triggerPressEnd(module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
                    state.isPressed = false;
                    state.isOverTarget = false;
                    state.activePointerId = null;
                    state.pointerType = null;
                    removeAllGlobalListeners();
                    if (!allowTextSelectionOnPress) module_$14c0b72509d70225$export$b0d6fa1ab32e3295(state.target);
                }
            };
            let onPointerCancel = (e)=>{
                cancel(e);
            };
            pressProps.onDragStart = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                // Safari does not call onPointerCancel when a drag starts, whereas Chrome and Firefox do.
                cancel(e);
            };
        } else {
            pressProps.onMouseDown = (e)=>{
                // Only handle left clicks
                if (e.button !== 0 || !e.currentTarget.contains(e.target)) return;
                // Due to browser inconsistencies, especially on mobile browsers, we prevent
                // default on mouse down and handle focusing the pressable element ourselves.
                if (module_$f6c31cce2adf654f$var$shouldPreventDefault(e.currentTarget)) e.preventDefault();
                e.stopPropagation();
                if (state.ignoreEmulatedMouseEvents) return;
                state.isPressed = true;
                state.isOverTarget = true;
                state.target = e.currentTarget;
                state.pointerType = module_$6a7db85432448f7f$export$60278871457622de(e.nativeEvent) ? 'virtual' : 'mouse';
                if (!isDisabled1 && !preventFocusOnPress) module_$7215afc6de606d6b$export$de79e2c695e052f3(e.currentTarget);
                triggerPressStart(e, state.pointerType);
                addGlobalListener(document, 'mouseup', onMouseUp, false);
            };
            pressProps.onMouseEnter = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (state.isPressed && !state.ignoreEmulatedMouseEvents) {
                    state.isOverTarget = true;
                    triggerPressStart(e, state.pointerType);
                }
            };
            pressProps.onMouseLeave = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (state.isPressed && !state.ignoreEmulatedMouseEvents) {
                    state.isOverTarget = false;
                    triggerPressEnd(e, state.pointerType, false);
                    if (propsRef.current.shouldCancelOnPointerExit) cancel(e);
                }
            };
            pressProps.onMouseUp = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                if (!state.ignoreEmulatedMouseEvents && e.button === 0) triggerPressUp(e, state.pointerType);
            };
            let onMouseUp = (e)=>{
                // Only handle left clicks
                if (e.button !== 0) return;
                state.isPressed = false;
                removeAllGlobalListeners();
                if (state.ignoreEmulatedMouseEvents) {
                    state.ignoreEmulatedMouseEvents = false;
                    return;
                }
                if (module_$f6c31cce2adf654f$var$isOverTarget(e, state.target)) triggerPressEnd(module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType);
                else if (state.isOverTarget) triggerPressEnd(module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
                state.isOverTarget = false;
            };
            pressProps.onTouchStart = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                let touch = module_$f6c31cce2adf654f$var$getTouchFromEvent(e.nativeEvent);
                if (!touch) return;
                state.activePointerId = touch.identifier;
                state.ignoreEmulatedMouseEvents = true;
                state.isOverTarget = true;
                state.isPressed = true;
                state.target = e.currentTarget;
                state.pointerType = 'touch';
                // Due to browser inconsistencies, especially on mobile browsers, we prevent default
                // on the emulated mouse event and handle focusing the pressable element ourselves.
                if (!isDisabled1 && !preventFocusOnPress) module_$7215afc6de606d6b$export$de79e2c695e052f3(e.currentTarget);
                if (!allowTextSelectionOnPress) module_$14c0b72509d70225$export$16a4697467175487(state.target);
                triggerPressStart(e, state.pointerType);
                addGlobalListener(window, 'scroll', onScroll, true);
            };
            pressProps.onTouchMove = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (!state.isPressed) return;
                let touch = module_$f6c31cce2adf654f$var$getTouchById(e.nativeEvent, state.activePointerId);
                if (touch && module_$f6c31cce2adf654f$var$isOverTarget(touch, e.currentTarget)) {
                    if (!state.isOverTarget) {
                        state.isOverTarget = true;
                        triggerPressStart(e, state.pointerType);
                    }
                } else if (state.isOverTarget) {
                    state.isOverTarget = false;
                    triggerPressEnd(e, state.pointerType, false);
                    if (propsRef.current.shouldCancelOnPointerExit) cancel(e);
                }
            };
            pressProps.onTouchEnd = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (!state.isPressed) return;
                let touch = module_$f6c31cce2adf654f$var$getTouchById(e.nativeEvent, state.activePointerId);
                if (touch && module_$f6c31cce2adf654f$var$isOverTarget(touch, e.currentTarget)) {
                    triggerPressUp(e, state.pointerType);
                    triggerPressEnd(e, state.pointerType);
                } else if (state.isOverTarget) triggerPressEnd(e, state.pointerType, false);
                state.isPressed = false;
                state.activePointerId = null;
                state.isOverTarget = false;
                state.ignoreEmulatedMouseEvents = true;
                if (!allowTextSelectionOnPress) module_$14c0b72509d70225$export$b0d6fa1ab32e3295(state.target);
                removeAllGlobalListeners();
            };
            pressProps.onTouchCancel = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (state.isPressed) cancel(e);
            };
            let onScroll = (e)=>{
                if (state.isPressed && e.target.contains(state.target)) cancel({
                    currentTarget: state.target,
                    shiftKey: false,
                    ctrlKey: false,
                    metaKey: false,
                    altKey: false
                });
            };
            pressProps.onDragStart = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                cancel(e);
            };
        }
        return pressProps;
    }, [
        addGlobalListener,
        isDisabled1,
        preventFocusOnPress,
        removeAllGlobalListeners,
        allowTextSelectionOnPress
    ]);
    // Remove user-select: none in case component unmounts immediately after pressStart
    // eslint-disable-next-line arrow-body-style
    (0,react.useEffect)(()=>{
        return ()=>{
            if (!allowTextSelectionOnPress) module_$14c0b72509d70225$export$b0d6fa1ab32e3295(ref.current.target);
        };
    }, [
        allowTextSelectionOnPress
    ]);
    return {
        isPressed: isPressedProp || isPressed,
        pressProps: module_$3ef42575df84b30b$export$9d1611c77c2fe928(domProps, pressProps1)
    };
}
function module_$f6c31cce2adf654f$var$isHTMLAnchorLink(target) {
    return target.tagName === 'A' && target.hasAttribute('href');
}
function module_$f6c31cce2adf654f$var$isValidKeyboardEvent(event, currentTarget) {
    const { key: key , code: code  } = event;
    const element = currentTarget;
    const role = element.getAttribute('role');
    // Accessibility for keyboards. Space and Enter only.
    // "Spacebar" is for IE 11
    return (key === 'Enter' || key === ' ' || key === 'Spacebar' || code === 'Space') && !(element instanceof HTMLInputElement && !module_$f6c31cce2adf654f$var$isValidInputKey(element, key) || element instanceof HTMLTextAreaElement || element.isContentEditable) && (!module_$f6c31cce2adf654f$var$isHTMLAnchorLink(element) || role === 'button' && key !== 'Enter') && // An element with role='link' should only trigger with Enter key
    !(role === 'link' && key !== 'Enter');
}
function module_$f6c31cce2adf654f$var$getTouchFromEvent(event) {
    const { targetTouches: targetTouches  } = event;
    if (targetTouches.length > 0) return targetTouches[0];
    return null;
}
function module_$f6c31cce2adf654f$var$getTouchById(event, pointerId) {
    const changedTouches = event.changedTouches;
    for(let i = 0; i < changedTouches.length; i++){
        const touch = changedTouches[i];
        if (touch.identifier === pointerId) return touch;
    }
    return null;
}
function module_$f6c31cce2adf654f$var$createEvent(target, e) {
    return {
        currentTarget: target,
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey
    };
}
function module_$f6c31cce2adf654f$var$getPointClientRect(point) {
    let offsetX = point.width / 2 || point.radiusX || 0;
    let offsetY = point.height / 2 || point.radiusY || 0;
    return {
        top: point.clientY - offsetY,
        right: point.clientX + offsetX,
        bottom: point.clientY + offsetY,
        left: point.clientX - offsetX
    };
}
function module_$f6c31cce2adf654f$var$areRectanglesOverlapping(a, b) {
    // check if they cannot overlap on x axis
    if (a.left > b.right || b.left > a.right) return false;
    // check if they cannot overlap on y axis
    if (a.top > b.bottom || b.top > a.bottom) return false;
    return true;
}
function module_$f6c31cce2adf654f$var$isOverTarget(point, target) {
    let rect = target.getBoundingClientRect();
    let pointRect = module_$f6c31cce2adf654f$var$getPointClientRect(point);
    return module_$f6c31cce2adf654f$var$areRectanglesOverlapping(rect, pointRect);
}
function module_$f6c31cce2adf654f$var$shouldPreventDefault(target) {
    // We cannot prevent default if the target is a draggable element.
    return !(target instanceof HTMLElement) || !target.draggable;
}
function module_$f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(target, key) {
    if (target instanceof HTMLInputElement) return !module_$f6c31cce2adf654f$var$isValidInputKey(target, key);
    if (target instanceof HTMLButtonElement) return target.type !== 'submit';
    return true;
}
const module_$f6c31cce2adf654f$var$nonTextInputTypes = new Set([
    'checkbox',
    'radio',
    'range',
    'color',
    'file',
    'image',
    'button',
    'submit',
    'reset'
]);
function module_$f6c31cce2adf654f$var$isValidInputKey(target, key) {
    // Only space should toggle checkboxes and radios, not enter.
    return target.type === 'checkbox' || target.type === 'radio' ? key === ' ' : module_$f6c31cce2adf654f$var$nonTextInputTypes.has(target.type);
}



const module_$3b117e43dc0ca95d$export$27c701ed9e449e99 = /*#__PURE__*/ (/* unused pure expression or super */ null && ($bx7SL$react.forwardRef(({ children: children , ...props }, ref)=>{
    let newRef = $bx7SL$useRef();
    ref = ref !== null && ref !== void 0 ? ref : newRef;
    let { pressProps: pressProps  } = module_$f6c31cce2adf654f$export$45712eceda6fad21({
        ...props,
        ref: ref
    });
    let child = $bx7SL$react.Children.only(children);
    return(/*#__PURE__*/ $bx7SL$react.cloneElement(child, // @ts-ignore
    {
        ref: ref,
        ...$bx7SL$mergeProps(child.props, pressProps)
    }));
})));





const module_$f1ab8c75478c6f73$export$3351871ee4b288b8 = /*#__PURE__*/ (/* unused pure expression or super */ null && ($bx7SL$react.forwardRef(({ children: children , ...props }, ref)=>{
    let isRegistered = $bx7SL$useRef(false);
    let prevContext = $bx7SL$useContext(module_$ae1eeba8b9eafd08$export$5165eccb35aaadb5);
    let context = $bx7SL$mergeProps(prevContext || {
    }, {
        ...props,
        ref: ref || (prevContext === null || prevContext === void 0 ? void 0 : prevContext.ref),
        register () {
            isRegistered.current = true;
            if (prevContext) prevContext.register();
        }
    });
    $bx7SL$useSyncRef(prevContext, ref);
    $bx7SL$useEffect(()=>{
        if (!isRegistered.current) console.warn("A PressResponder was rendered without a pressable child. Either call the usePress hook, or wrap your DOM node with <Pressable> component.");
    }, []);
    return(/*#__PURE__*/ $bx7SL$react.createElement(module_$ae1eeba8b9eafd08$export$5165eccb35aaadb5.Provider, {
        value: context
    }, children));
})));





class module_$8a9cb279dc87e130$export$905e7fc544a71f36 {
    isDefaultPrevented() {
        return this.nativeEvent.defaultPrevented;
    }
    preventDefault() {
        this.defaultPrevented = true;
        this.nativeEvent.preventDefault();
    }
    stopPropagation() {
        this.nativeEvent.stopPropagation();
        this.isPropagationStopped = ()=>true
        ;
    }
    isPropagationStopped() {
        return false;
    }
    persist() {
    }
    constructor(type, nativeEvent){
        this.nativeEvent = nativeEvent;
        this.target = nativeEvent.target;
        this.currentTarget = nativeEvent.currentTarget;
        this.relatedTarget = nativeEvent.relatedTarget;
        this.bubbles = nativeEvent.bubbles;
        this.cancelable = nativeEvent.cancelable;
        this.defaultPrevented = nativeEvent.defaultPrevented;
        this.eventPhase = nativeEvent.eventPhase;
        this.isTrusted = nativeEvent.isTrusted;
        this.timeStamp = nativeEvent.timeStamp;
        this.type = type;
    }
}
function module_$8a9cb279dc87e130$export$715c682d09d639cc(onBlur) {
    let stateRef = (0,react.useRef)({
        isFocused: false,
        onBlur: onBlur,
        observer: null
    });
    stateRef.current.onBlur = onBlur;
    // Clean up MutationObserver on unmount. See below.
    // eslint-disable-next-line arrow-body-style
    module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        const state = stateRef.current;
        return ()=>{
            if (state.observer) {
                state.observer.disconnect();
                state.observer = null;
            }
        };
    }, []);
    // This function is called during a React onFocus event.
    return (0,react.useCallback)((e1)=>{
        // React does not fire onBlur when an element is disabled. https://github.com/facebook/react/issues/9142
        // Most browsers fire a native focusout event in this case, except for Firefox. In that case, we use a
        // MutationObserver to watch for the disabled attribute, and dispatch these events ourselves.
        // For browsers that do, focusout fires before the MutationObserver, so onBlur should not fire twice.
        if (e1.target instanceof HTMLButtonElement || e1.target instanceof HTMLInputElement || e1.target instanceof HTMLTextAreaElement || e1.target instanceof HTMLSelectElement) {
            stateRef.current.isFocused = true;
            let target = e1.target;
            let onBlurHandler = (e)=>{
                var // For backward compatibility, dispatch a (fake) React synthetic event.
                _current, ref;
                stateRef.current.isFocused = false;
                if (target.disabled) (ref = (_current = stateRef.current).onBlur) === null || ref === void 0 ? void 0 : ref.call(_current, new module_$8a9cb279dc87e130$export$905e7fc544a71f36('blur', e));
                // We no longer need the MutationObserver once the target is blurred.
                if (stateRef.current.observer) {
                    stateRef.current.observer.disconnect();
                    stateRef.current.observer = null;
                }
            };
            target.addEventListener('focusout', onBlurHandler, {
                once: true
            });
            stateRef.current.observer = new MutationObserver(()=>{
                if (stateRef.current.isFocused && target.disabled) {
                    stateRef.current.observer.disconnect();
                    target.dispatchEvent(new FocusEvent('blur'));
                    target.dispatchEvent(new FocusEvent('focusout', {
                        bubbles: true
                    }));
                }
            });
            stateRef.current.observer.observe(target, {
                attributes: true,
                attributeFilter: [
                    'disabled'
                ]
            });
        }
    }, []);
}


function module_$a1ea59d68270f0dd$export$f8168d8dd8fd66e6(props) {
    let { isDisabled: isDisabled , onFocus: onFocusProp , onBlur: onBlurProp , onFocusChange: onFocusChange  } = props;
    const onBlur = (0,react.useCallback)((e)=>{
        if (e.target === e.currentTarget) {
            if (onBlurProp) onBlurProp(e);
            if (onFocusChange) onFocusChange(false);
            return true;
        }
    }, [
        onBlurProp,
        onFocusChange
    ]);
    const onSyntheticFocus = module_$8a9cb279dc87e130$export$715c682d09d639cc(onBlur);
    const onFocus = (0,react.useCallback)((e)=>{
        if (e.target === e.currentTarget) {
            if (onFocusProp) onFocusProp(e);
            if (onFocusChange) onFocusChange(true);
            onSyntheticFocus(e);
        }
    }, [
        onFocusChange,
        onFocusProp,
        onSyntheticFocus
    ]);
    return {
        focusProps: {
            onFocus: !isDisabled && (onFocusProp || onFocusChange || onBlurProp) ? onFocus : undefined,
            onBlur: !isDisabled && (onBlurProp || onFocusChange) ? onBlur : null
        }
    };
}




let module_$507fabe10e71c6fb$var$currentModality = null;
let module_$507fabe10e71c6fb$var$changeHandlers = new Set();
let module_$507fabe10e71c6fb$var$hasSetupGlobalListeners = false;
let module_$507fabe10e71c6fb$var$hasEventBeforeFocus = false;
let module_$507fabe10e71c6fb$var$hasBlurredWindowRecently = false;
// Only Tab or Esc keys will make focus visible on text input elements
const module_$507fabe10e71c6fb$var$FOCUS_VISIBLE_INPUT_KEYS = {
    Tab: true,
    Escape: true
};
function module_$507fabe10e71c6fb$var$triggerChangeHandlers(modality, e) {
    for (let handler of module_$507fabe10e71c6fb$var$changeHandlers)handler(modality, e);
}
/**
 * Helper function to determine if a KeyboardEvent is unmodified and could make keyboard focus styles visible.
 */ function module_$507fabe10e71c6fb$var$isValidKey(e) {
    // Control and Shift keys trigger when navigating back to the tab with keyboard.
    return !(e.metaKey || !module_$c87311424ea30a05$export$9ac100e40613ea10() && e.altKey || e.ctrlKey || e.key === 'Control' || e.key === 'Shift' || e.key === 'Meta');
}
function module_$507fabe10e71c6fb$var$handleKeyboardEvent(e) {
    module_$507fabe10e71c6fb$var$hasEventBeforeFocus = true;
    if (module_$507fabe10e71c6fb$var$isValidKey(e)) {
        module_$507fabe10e71c6fb$var$currentModality = 'keyboard';
        module_$507fabe10e71c6fb$var$triggerChangeHandlers('keyboard', e);
    }
}
function module_$507fabe10e71c6fb$var$handlePointerEvent(e) {
    module_$507fabe10e71c6fb$var$currentModality = 'pointer';
    if (e.type === 'mousedown' || e.type === 'pointerdown') {
        module_$507fabe10e71c6fb$var$hasEventBeforeFocus = true;
        module_$507fabe10e71c6fb$var$triggerChangeHandlers('pointer', e);
    }
}
function module_$507fabe10e71c6fb$var$handleClickEvent(e) {
    if (module_$6a7db85432448f7f$export$60278871457622de(e)) {
        module_$507fabe10e71c6fb$var$hasEventBeforeFocus = true;
        module_$507fabe10e71c6fb$var$currentModality = 'virtual';
    }
}
function module_$507fabe10e71c6fb$var$handleFocusEvent(e) {
    // Firefox fires two extra focus events when the user first clicks into an iframe:
    // first on the window, then on the document. We ignore these events so they don't
    // cause keyboard focus rings to appear.
    if (e.target === window || e.target === document) return;
    // If a focus event occurs without a preceding keyboard or pointer event, switch to virtual modality.
    // This occurs, for example, when navigating a form with the next/previous buttons on iOS.
    if (!module_$507fabe10e71c6fb$var$hasEventBeforeFocus && !module_$507fabe10e71c6fb$var$hasBlurredWindowRecently) {
        module_$507fabe10e71c6fb$var$currentModality = 'virtual';
        module_$507fabe10e71c6fb$var$triggerChangeHandlers('virtual', e);
    }
    module_$507fabe10e71c6fb$var$hasEventBeforeFocus = false;
    module_$507fabe10e71c6fb$var$hasBlurredWindowRecently = false;
}
function module_$507fabe10e71c6fb$var$handleWindowBlur() {
    // When the window is blurred, reset state. This is necessary when tabbing out of the window,
    // for example, since a subsequent focus event won't be fired.
    module_$507fabe10e71c6fb$var$hasEventBeforeFocus = false;
    module_$507fabe10e71c6fb$var$hasBlurredWindowRecently = true;
}
/**
 * Setup global event listeners to control when keyboard focus style should be visible.
 */ function module_$507fabe10e71c6fb$var$setupGlobalFocusEvents() {
    if (typeof window === 'undefined' || module_$507fabe10e71c6fb$var$hasSetupGlobalListeners) return;
    // Programmatic focus() calls shouldn't affect the current input modality.
    // However, we need to detect other cases when a focus event occurs without
    // a preceding user event (e.g. screen reader focus). Overriding the focus
    // method on HTMLElement.prototype is a bit hacky, but works.
    let focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function() {
        module_$507fabe10e71c6fb$var$hasEventBeforeFocus = true;
        focus.apply(this, arguments);
    };
    document.addEventListener('keydown', module_$507fabe10e71c6fb$var$handleKeyboardEvent, true);
    document.addEventListener('keyup', module_$507fabe10e71c6fb$var$handleKeyboardEvent, true);
    document.addEventListener('click', module_$507fabe10e71c6fb$var$handleClickEvent, true);
    // Register focus events on the window so they are sure to happen
    // before React's event listeners (registered on the document).
    window.addEventListener('focus', module_$507fabe10e71c6fb$var$handleFocusEvent, true);
    window.addEventListener('blur', module_$507fabe10e71c6fb$var$handleWindowBlur, false);
    if (typeof PointerEvent !== 'undefined') {
        document.addEventListener('pointerdown', module_$507fabe10e71c6fb$var$handlePointerEvent, true);
        document.addEventListener('pointermove', module_$507fabe10e71c6fb$var$handlePointerEvent, true);
        document.addEventListener('pointerup', module_$507fabe10e71c6fb$var$handlePointerEvent, true);
    } else {
        document.addEventListener('mousedown', module_$507fabe10e71c6fb$var$handlePointerEvent, true);
        document.addEventListener('mousemove', module_$507fabe10e71c6fb$var$handlePointerEvent, true);
        document.addEventListener('mouseup', module_$507fabe10e71c6fb$var$handlePointerEvent, true);
    }
    module_$507fabe10e71c6fb$var$hasSetupGlobalListeners = true;
}
if (typeof document !== 'undefined') {
    if (document.readyState !== 'loading') module_$507fabe10e71c6fb$var$setupGlobalFocusEvents();
    else document.addEventListener('DOMContentLoaded', module_$507fabe10e71c6fb$var$setupGlobalFocusEvents);
}
function module_$507fabe10e71c6fb$export$b9b3dfddab17db27() {
    return module_$507fabe10e71c6fb$var$currentModality !== 'pointer';
}
function module_$507fabe10e71c6fb$export$630ff653c5ada6a9() {
    return module_$507fabe10e71c6fb$var$currentModality;
}
function module_$507fabe10e71c6fb$export$8397ddfc504fdb9a(modality) {
    module_$507fabe10e71c6fb$var$currentModality = modality;
    module_$507fabe10e71c6fb$var$triggerChangeHandlers(modality, null);
}
function module_$507fabe10e71c6fb$export$98e20ec92f614cfe() {
    module_$507fabe10e71c6fb$var$setupGlobalFocusEvents();
    let [modality, setModality] = $bx7SL$useState(module_$507fabe10e71c6fb$var$currentModality);
    $bx7SL$useEffect(()=>{
        let handler = ()=>{
            setModality(module_$507fabe10e71c6fb$var$currentModality);
        };
        module_$507fabe10e71c6fb$var$changeHandlers.add(handler);
        return ()=>{
            module_$507fabe10e71c6fb$var$changeHandlers.delete(handler);
        };
    }, []);
    return modality;
}
/**
 * If this is attached to text input component, return if the event is a focus event (Tab/Escape keys pressed) so that
 * focus visible style can be properly set.
 */ function module_$507fabe10e71c6fb$var$isKeyboardFocusEvent(isTextInput, modality, e) {
    return !(isTextInput && modality === 'keyboard' && e instanceof KeyboardEvent && !module_$507fabe10e71c6fb$var$FOCUS_VISIBLE_INPUT_KEYS[e.key]);
}
function module_$507fabe10e71c6fb$export$ffd9e5021c1fb2d6(props = {
}) {
    let { isTextInput: isTextInput , autoFocus: autoFocus  } = props;
    let [isFocusVisibleState, setFocusVisible] = $bx7SL$useState(autoFocus || module_$507fabe10e71c6fb$export$b9b3dfddab17db27());
    module_$507fabe10e71c6fb$export$ec71b4b83ac08ec3(($507fabe10e71c6fb$export$b9b3dfddab17db27)=>{
        setFocusVisible($507fabe10e71c6fb$export$b9b3dfddab17db27);
    }, [
        isTextInput
    ], {
        isTextInput: isTextInput
    });
    return {
        isFocusVisible: isFocusVisibleState
    };
}
function module_$507fabe10e71c6fb$export$ec71b4b83ac08ec3(fn, deps, opts) {
    module_$507fabe10e71c6fb$var$setupGlobalFocusEvents();
    $bx7SL$useEffect(()=>{
        let handler = (modality, e)=>{
            if (!module_$507fabe10e71c6fb$var$isKeyboardFocusEvent(opts === null || opts === void 0 ? void 0 : opts.isTextInput, modality, e)) return;
            fn(module_$507fabe10e71c6fb$export$b9b3dfddab17db27());
        };
        module_$507fabe10e71c6fb$var$changeHandlers.add(handler);
        return ()=>{
            module_$507fabe10e71c6fb$var$changeHandlers.delete(handler);
        };
    }, deps);
}




function module_$9ab94262bd0047c7$export$420e68273165f4ec(props) {
    let { isDisabled: isDisabled , onBlurWithin: onBlurWithin , onFocusWithin: onFocusWithin , onFocusWithinChange: onFocusWithinChange  } = props;
    let state = $bx7SL$useRef({
        isFocusWithin: false
    });
    let onBlur = $bx7SL$useCallback((e)=>{
        // We don't want to trigger onBlurWithin and then immediately onFocusWithin again
        // when moving focus inside the element. Only trigger if the currentTarget doesn't
        // include the relatedTarget (where focus is moving).
        if (state.current.isFocusWithin && !e.currentTarget.contains(e.relatedTarget)) {
            state.current.isFocusWithin = false;
            if (onBlurWithin) onBlurWithin(e);
            if (onFocusWithinChange) onFocusWithinChange(false);
        }
    }, [
        onBlurWithin,
        onFocusWithinChange,
        state
    ]);
    let onSyntheticFocus = module_$8a9cb279dc87e130$export$715c682d09d639cc(onBlur);
    let onFocus = $bx7SL$useCallback((e)=>{
        if (!state.current.isFocusWithin) {
            if (onFocusWithin) onFocusWithin(e);
            if (onFocusWithinChange) onFocusWithinChange(true);
            state.current.isFocusWithin = true;
            onSyntheticFocus(e);
        }
    }, [
        onFocusWithin,
        onFocusWithinChange,
        onSyntheticFocus
    ]);
    if (isDisabled) return {
        focusWithinProps: {
            onFocus: null,
            onBlur: null
        }
    };
    return {
        focusWithinProps: {
            onFocus: onFocus,
            onBlur: onBlur
        }
    };
}



// iOS fires onPointerEnter twice: once with pointerType="touch" and again with pointerType="mouse".
// We want to ignore these emulated events so they do not trigger hover behavior.
// See https://bugs.webkit.org/show_bug.cgi?id=214609.
let module_$6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = false;
let module_$6179b936705e76d3$var$hoverCount = 0;
function module_$6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents() {
    module_$6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = true;
    // Clear globalIgnoreEmulatedMouseEvents after a short timeout. iOS fires onPointerEnter
    // with pointerType="mouse" immediately after onPointerUp and before onFocus. On other
    // devices that don't have this quirk, we don't want to ignore a mouse hover sometime in
    // the distant future because a user previously touched the element.
    setTimeout(()=>{
        module_$6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = false;
    }, 50);
}
function module_$6179b936705e76d3$var$handleGlobalPointerEvent(e) {
    if (e.pointerType === 'touch') module_$6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents();
}
function module_$6179b936705e76d3$var$setupGlobalTouchEvents() {
    if (typeof document === 'undefined') return;
    if (typeof PointerEvent !== 'undefined') document.addEventListener('pointerup', module_$6179b936705e76d3$var$handleGlobalPointerEvent);
    else document.addEventListener('touchend', module_$6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents);
    module_$6179b936705e76d3$var$hoverCount++;
    return ()=>{
        module_$6179b936705e76d3$var$hoverCount--;
        if (module_$6179b936705e76d3$var$hoverCount > 0) return;
        if (typeof PointerEvent !== 'undefined') document.removeEventListener('pointerup', module_$6179b936705e76d3$var$handleGlobalPointerEvent);
        else document.removeEventListener('touchend', module_$6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents);
    };
}
function module_$6179b936705e76d3$export$ae780daf29e6d456(props) {
    let { onHoverStart: onHoverStart , onHoverChange: onHoverChange , onHoverEnd: onHoverEnd , isDisabled: isDisabled  } = props;
    let [isHovered, setHovered] = $bx7SL$useState(false);
    let state = $bx7SL$useRef({
        isHovered: false,
        ignoreEmulatedMouseEvents: false,
        pointerType: '',
        target: null
    }).current;
    $bx7SL$useEffect(module_$6179b936705e76d3$var$setupGlobalTouchEvents, []);
    let { hoverProps: hoverProps1 , triggerHoverEnd: triggerHoverEnd1  } = $bx7SL$useMemo(()=>{
        let triggerHoverStart = (event, pointerType)=>{
            state.pointerType = pointerType;
            if (isDisabled || pointerType === 'touch' || state.isHovered || !event.currentTarget.contains(event.target)) return;
            state.isHovered = true;
            let target = event.currentTarget;
            state.target = target;
            if (onHoverStart) onHoverStart({
                type: 'hoverstart',
                target: target,
                pointerType: pointerType
            });
            if (onHoverChange) onHoverChange(true);
            setHovered(true);
        };
        let triggerHoverEnd = (event, pointerType)=>{
            state.pointerType = '';
            state.target = null;
            if (pointerType === 'touch' || !state.isHovered) return;
            state.isHovered = false;
            let target = event.currentTarget;
            if (onHoverEnd) onHoverEnd({
                type: 'hoverend',
                target: target,
                pointerType: pointerType
            });
            if (onHoverChange) onHoverChange(false);
            setHovered(false);
        };
        let hoverProps = {
        };
        if (typeof PointerEvent !== 'undefined') {
            hoverProps.onPointerEnter = (e)=>{
                if (module_$6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents && e.pointerType === 'mouse') return;
                triggerHoverStart(e, e.pointerType);
            };
            hoverProps.onPointerLeave = (e)=>{
                if (!isDisabled && e.currentTarget.contains(e.target)) triggerHoverEnd(e, e.pointerType);
            };
        } else {
            hoverProps.onTouchStart = ()=>{
                state.ignoreEmulatedMouseEvents = true;
            };
            hoverProps.onMouseEnter = (e)=>{
                if (!state.ignoreEmulatedMouseEvents && !module_$6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents) triggerHoverStart(e, 'mouse');
                state.ignoreEmulatedMouseEvents = false;
            };
            hoverProps.onMouseLeave = (e)=>{
                if (!isDisabled && e.currentTarget.contains(e.target)) triggerHoverEnd(e, 'mouse');
            };
        }
        return {
            hoverProps: hoverProps,
            triggerHoverEnd: triggerHoverEnd
        };
    }, [
        onHoverStart,
        onHoverChange,
        onHoverEnd,
        isDisabled,
        state
    ]);
    $bx7SL$useEffect(()=>{
        // Call the triggerHoverEnd as soon as isDisabled changes to true
        // Safe to call triggerHoverEnd, it will early return if we aren't currently hovering
        if (isDisabled) triggerHoverEnd1({
            currentTarget: state.target
        }, state.pointerType);
    }, [
        isDisabled
    ]);
    return {
        hoverProps: hoverProps1,
        isHovered: isHovered
    };
}



function module_$e0b6e0b68ec7f50f$export$872b660ac5a1ff98(props) {
    let { ref: ref , onInteractOutside: onInteractOutside , isDisabled: isDisabled , onInteractOutsideStart: onInteractOutsideStart  } = props;
    let stateRef = $bx7SL$useRef({
        isPointerDown: false,
        ignoreEmulatedMouseEvents: false,
        onInteractOutside: onInteractOutside,
        onInteractOutsideStart: onInteractOutsideStart
    });
    let state = stateRef.current;
    state.onInteractOutside = onInteractOutside;
    state.onInteractOutsideStart = onInteractOutsideStart;
    $bx7SL$useEffect(()=>{
        if (isDisabled) return;
        let onPointerDown = (e)=>{
            if (module_$e0b6e0b68ec7f50f$var$isValidEvent(e, ref) && state.onInteractOutside) {
                if (state.onInteractOutsideStart) state.onInteractOutsideStart(e);
                state.isPointerDown = true;
            }
        };
        // Use pointer events if available. Otherwise, fall back to mouse and touch events.
        if (typeof PointerEvent !== 'undefined') {
            let onPointerUp = (e)=>{
                if (state.isPointerDown && state.onInteractOutside && module_$e0b6e0b68ec7f50f$var$isValidEvent(e, ref)) {
                    state.isPointerDown = false;
                    state.onInteractOutside(e);
                }
            };
            // changing these to capture phase fixed combobox
            document.addEventListener('pointerdown', onPointerDown, true);
            document.addEventListener('pointerup', onPointerUp, true);
            return ()=>{
                document.removeEventListener('pointerdown', onPointerDown, true);
                document.removeEventListener('pointerup', onPointerUp, true);
            };
        } else {
            let onMouseUp = (e)=>{
                if (state.ignoreEmulatedMouseEvents) state.ignoreEmulatedMouseEvents = false;
                else if (state.isPointerDown && state.onInteractOutside && module_$e0b6e0b68ec7f50f$var$isValidEvent(e, ref)) {
                    state.isPointerDown = false;
                    state.onInteractOutside(e);
                }
            };
            let onTouchEnd = (e)=>{
                state.ignoreEmulatedMouseEvents = true;
                if (state.onInteractOutside && state.isPointerDown && module_$e0b6e0b68ec7f50f$var$isValidEvent(e, ref)) {
                    state.isPointerDown = false;
                    state.onInteractOutside(e);
                }
            };
            document.addEventListener('mousedown', onPointerDown, true);
            document.addEventListener('mouseup', onMouseUp, true);
            document.addEventListener('touchstart', onPointerDown, true);
            document.addEventListener('touchend', onTouchEnd, true);
            return ()=>{
                document.removeEventListener('mousedown', onPointerDown, true);
                document.removeEventListener('mouseup', onMouseUp, true);
                document.removeEventListener('touchstart', onPointerDown, true);
                document.removeEventListener('touchend', onTouchEnd, true);
            };
        }
    }, [
        ref,
        state,
        isDisabled
    ]);
}
function module_$e0b6e0b68ec7f50f$var$isValidEvent(event, ref) {
    if (event.button > 0) return false;
    // if the event target is no longer in the document
    if (event.target) {
        const ownerDocument = event.target.ownerDocument;
        if (!ownerDocument || !ownerDocument.documentElement.contains(event.target)) return false;
    }
    return ref.current && !ref.current.contains(event.target);
}


function module_$93925083ecbb358c$export$48d1ea6320830260(handler) {
    if (!handler) return;
    let shouldStopPropagation = true;
    return (e)=>{
        let event = {
            ...e,
            preventDefault () {
                e.preventDefault();
            },
            isDefaultPrevented () {
                return e.isDefaultPrevented();
            },
            stopPropagation () {
                console.error('stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.');
            },
            continuePropagation () {
                shouldStopPropagation = false;
            }
        };
        handler(event);
        if (shouldStopPropagation) e.stopPropagation();
    };
}


function module_$46d819fcbaf35654$export$8f71654801c2f7cd(props) {
    return {
        keyboardProps: props.isDisabled ? {
        } : {
            onKeyDown: module_$93925083ecbb358c$export$48d1ea6320830260(props.onKeyDown),
            onKeyUp: module_$93925083ecbb358c$export$48d1ea6320830260(props.onKeyUp)
        }
    };
}





function module_$e8a7022cf87cba2a$export$36da96379f79f245(props) {
    let { onMoveStart: onMoveStart , onMove: onMove , onMoveEnd: onMoveEnd  } = props;
    let state = $bx7SL$useRef({
        didMove: false,
        lastPosition: null,
        id: null
    });
    let { addGlobalListener: addGlobalListener , removeGlobalListener: removeGlobalListener  } = $bx7SL$useGlobalListeners();
    let moveProps1 = $bx7SL$useMemo(()=>{
        let moveProps = {
        };
        let start = ()=>{
            module_$14c0b72509d70225$export$16a4697467175487();
            state.current.didMove = false;
        };
        let move = (originalEvent, pointerType, deltaX, deltaY)=>{
            if (deltaX === 0 && deltaY === 0) return;
            if (!state.current.didMove) {
                state.current.didMove = true;
                onMoveStart === null || onMoveStart === void 0 ? void 0 : onMoveStart({
                    type: 'movestart',
                    pointerType: pointerType,
                    shiftKey: originalEvent.shiftKey,
                    metaKey: originalEvent.metaKey,
                    ctrlKey: originalEvent.ctrlKey,
                    altKey: originalEvent.altKey
                });
            }
            onMove({
                type: 'move',
                pointerType: pointerType,
                deltaX: deltaX,
                deltaY: deltaY,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
        };
        let end = (originalEvent, pointerType)=>{
            module_$14c0b72509d70225$export$b0d6fa1ab32e3295();
            if (state.current.didMove) onMoveEnd === null || onMoveEnd === void 0 ? void 0 : onMoveEnd({
                type: 'moveend',
                pointerType: pointerType,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
        };
        if (typeof PointerEvent === 'undefined') {
            let onMouseMove = (e)=>{
                if (e.button === 0) {
                    move(e, 'mouse', e.pageX - state.current.lastPosition.pageX, e.pageY - state.current.lastPosition.pageY);
                    state.current.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                }
            };
            let onMouseUp = (e)=>{
                if (e.button === 0) {
                    end(e, 'mouse');
                    removeGlobalListener(window, 'mousemove', onMouseMove, false);
                    removeGlobalListener(window, 'mouseup', onMouseUp, false);
                }
            };
            moveProps.onMouseDown = (e)=>{
                if (e.button === 0) {
                    start();
                    e.stopPropagation();
                    e.preventDefault();
                    state.current.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                    addGlobalListener(window, 'mousemove', onMouseMove, false);
                    addGlobalListener(window, 'mouseup', onMouseUp, false);
                }
            };
            let onTouchMove = (e)=>{
                let touch = [
                    ...e.changedTouches
                ].findIndex(({ identifier: identifier  })=>identifier === state.current.id
                );
                if (touch >= 0) {
                    let { pageX: pageX , pageY: pageY  } = e.changedTouches[touch];
                    move(e, 'touch', pageX - state.current.lastPosition.pageX, pageY - state.current.lastPosition.pageY);
                    state.current.lastPosition = {
                        pageX: pageX,
                        pageY: pageY
                    };
                }
            };
            let onTouchEnd = (e)=>{
                let touch = [
                    ...e.changedTouches
                ].findIndex(({ identifier: identifier  })=>identifier === state.current.id
                );
                if (touch >= 0) {
                    end(e, 'touch');
                    state.current.id = null;
                    removeGlobalListener(window, 'touchmove', onTouchMove);
                    removeGlobalListener(window, 'touchend', onTouchEnd);
                    removeGlobalListener(window, 'touchcancel', onTouchEnd);
                }
            };
            moveProps.onTouchStart = (e)=>{
                if (e.changedTouches.length === 0 || state.current.id != null) return;
                let { pageX: pageX , pageY: pageY , identifier: identifier  } = e.changedTouches[0];
                start();
                e.stopPropagation();
                e.preventDefault();
                state.current.lastPosition = {
                    pageX: pageX,
                    pageY: pageY
                };
                state.current.id = identifier;
                addGlobalListener(window, 'touchmove', onTouchMove, false);
                addGlobalListener(window, 'touchend', onTouchEnd, false);
                addGlobalListener(window, 'touchcancel', onTouchEnd, false);
            };
        } else {
            let onPointerMove = (e)=>{
                if (e.pointerId === state.current.id) {
                    let pointerType = e.pointerType || 'mouse';
                    // Problems with PointerEvent#movementX/movementY:
                    // 1. it is always 0 on macOS Safari.
                    // 2. On Chrome Android, it's scaled by devicePixelRatio, but not on Chrome macOS
                    move(e, pointerType, e.pageX - state.current.lastPosition.pageX, e.pageY - state.current.lastPosition.pageY);
                    state.current.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                }
            };
            let onPointerUp = (e)=>{
                if (e.pointerId === state.current.id) {
                    let pointerType = e.pointerType || 'mouse';
                    end(e, pointerType);
                    state.current.id = null;
                    removeGlobalListener(window, 'pointermove', onPointerMove, false);
                    removeGlobalListener(window, 'pointerup', onPointerUp, false);
                    removeGlobalListener(window, 'pointercancel', onPointerUp, false);
                }
            };
            moveProps.onPointerDown = (e)=>{
                if (e.button === 0 && state.current.id == null) {
                    start();
                    e.stopPropagation();
                    e.preventDefault();
                    state.current.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                    state.current.id = e.pointerId;
                    addGlobalListener(window, 'pointermove', onPointerMove, false);
                    addGlobalListener(window, 'pointerup', onPointerUp, false);
                    addGlobalListener(window, 'pointercancel', onPointerUp, false);
                }
            };
        }
        let triggerKeyboardMove = (e, deltaX, deltaY)=>{
            start();
            move(e, 'keyboard', deltaX, deltaY);
            end(e, 'keyboard');
        };
        moveProps.onKeyDown = (e)=>{
            switch(e.key){
                case 'Left':
                case 'ArrowLeft':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, -1, 0);
                    break;
                case 'Right':
                case 'ArrowRight':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, 1, 0);
                    break;
                case 'Up':
                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, 0, -1);
                    break;
                case 'Down':
                case 'ArrowDown':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, 0, 1);
                    break;
            }
        };
        return moveProps;
    }, [
        state,
        onMoveStart,
        onMove,
        onMoveEnd,
        addGlobalListener,
        removeGlobalListener
    ]);
    return {
        moveProps: moveProps1
    };
}





function module_$7d0a636d7a4dcefd$export$2123ff2b87c81ca(props, ref) {
    let { onScroll: onScroll , isDisabled: isDisabled  } = props;
    let onScrollHandler = $bx7SL$useCallback((e)=>{
        // If the ctrlKey is pressed, this is a zoom event, do nothing.
        if (e.ctrlKey) return;
        // stop scrolling the page
        e.preventDefault();
        e.stopPropagation();
        if (onScroll) onScroll({
            deltaX: e.deltaX,
            deltaY: e.deltaY
        });
    }, [
        onScroll
    ]);
    $bx7SL$useEvent(ref, 'wheel', isDisabled ? null : onScrollHandler);
}





const module_$8a26561d2877236e$var$DEFAULT_THRESHOLD = 500;
function module_$8a26561d2877236e$export$c24ed0104d07eab9(props) {
    let { isDisabled: isDisabled , onLongPressStart: onLongPressStart , onLongPressEnd: onLongPressEnd , onLongPress: onLongPress , threshold: threshold = module_$8a26561d2877236e$var$DEFAULT_THRESHOLD , accessibilityDescription: accessibilityDescription  } = props;
    const timeRef = $bx7SL$useRef(null);
    let { addGlobalListener: addGlobalListener , removeGlobalListener: removeGlobalListener  } = $bx7SL$useGlobalListeners();
    let { pressProps: pressProps  } = module_$f6c31cce2adf654f$export$45712eceda6fad21({
        isDisabled: isDisabled,
        onPressStart (e1) {
            if (e1.pointerType === 'mouse' || e1.pointerType === 'touch') {
                if (onLongPressStart) onLongPressStart({
                    ...e1,
                    type: 'longpressstart'
                });
                timeRef.current = setTimeout(()=>{
                    // Prevent other usePress handlers from also handling this event.
                    e1.target.dispatchEvent(new PointerEvent('pointercancel', {
                        bubbles: true
                    }));
                    if (onLongPress) onLongPress({
                        ...e1,
                        type: 'longpress'
                    });
                    timeRef.current = null;
                }, threshold);
                // Prevent context menu, which may be opened on long press on touch devices
                if (e1.pointerType === 'touch') {
                    let onContextMenu = (e)=>{
                        e.preventDefault();
                    };
                    addGlobalListener(e1.target, 'contextmenu', onContextMenu, {
                        once: true
                    });
                    addGlobalListener(window, 'pointerup', ()=>{
                        // If no contextmenu event is fired quickly after pointerup, remove the handler
                        // so future context menu events outside a long press are not prevented.
                        setTimeout(()=>{
                            removeGlobalListener(e1.target, 'contextmenu', onContextMenu);
                        }, 30);
                    }, {
                        once: true
                    });
                }
            }
        },
        onPressEnd (e) {
            if (timeRef.current) clearTimeout(timeRef.current);
            if (onLongPressEnd && (e.pointerType === 'mouse' || e.pointerType === 'touch')) onLongPressEnd({
                ...e,
                type: 'longpressend'
            });
        }
    });
    let descriptionProps = $bx7SL$useDescription(onLongPress && !isDisabled ? accessibilityDescription : null);
    return {
        longPressProps: $bx7SL$mergeProps(pressProps, descriptionProps)
    };
}





//# sourceMappingURL=module.js.map

;// CONCATENATED MODULE: ./node_modules/@react-aria/focus/dist/module.js







function module_$6a99195332edec8b$export$80f3e147d781571c(element) {
    // If the user is interacting with a virtual cursor, e.g. screen reader, then
    // wait until after any animated transitions that are currently occurring on
    // the page before shifting focus. This avoids issues with VoiceOver on iOS
    // causing the page to scroll when moving focus if the element is transitioning
    // from off the screen.
    if (module_$507fabe10e71c6fb$export$630ff653c5ada6a9() === 'virtual') {
        let lastFocusedElement = document.activeElement;
        module_$bbed8b41f857bcc0$export$24490316f764c430(()=>{
            // If focus did not move and the element is still in the document, focus it.
            if (document.activeElement === lastFocusedElement && document.contains(element)) module_$7215afc6de606d6b$export$de79e2c695e052f3(element);
        });
    } else module_$7215afc6de606d6b$export$de79e2c695e052f3(element);
}


/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ function module_$645f2e67b85a24c9$var$isStyleVisible(element) {
    if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) return false;
    let { display: display , visibility: visibility  } = element.style;
    let isVisible = display !== 'none' && visibility !== 'hidden' && visibility !== 'collapse';
    if (isVisible) {
        const { getComputedStyle: getComputedStyle  } = element.ownerDocument.defaultView;
        let { display: computedDisplay , visibility: computedVisibility  } = getComputedStyle(element);
        isVisible = computedDisplay !== 'none' && computedVisibility !== 'hidden' && computedVisibility !== 'collapse';
    }
    return isVisible;
}
function module_$645f2e67b85a24c9$var$isAttributeVisible(element, childElement) {
    return !element.hasAttribute('hidden') && (element.nodeName === 'DETAILS' && childElement && childElement.nodeName !== 'SUMMARY' ? element.hasAttribute('open') : true);
}
function module_$645f2e67b85a24c9$export$e989c0fffaa6b27a(element, childElement) {
    return element.nodeName !== '#comment' && module_$645f2e67b85a24c9$var$isStyleVisible(element) && module_$645f2e67b85a24c9$var$isAttributeVisible(element, childElement) && (!element.parentElement || module_$645f2e67b85a24c9$export$e989c0fffaa6b27a(element.parentElement, element));
}




const module_$9bf71ea28793e738$var$FocusContext = /*#__PURE__*/ (/* unused pure expression or super */ null && ($6nfFC$react.createContext(null)));
let module_$9bf71ea28793e738$var$activeScope = null;
function module_$9bf71ea28793e738$export$20e40289641fbbb6(props) {
    let { children: children , contain: contain , restoreFocus: restoreFocus , autoFocus: autoFocus  } = props;
    let startRef = $6nfFC$useRef();
    let endRef = $6nfFC$useRef();
    let scopeRef = $6nfFC$useRef([]);
    let ctx = $6nfFC$useContext(module_$9bf71ea28793e738$var$FocusContext);
    var ref;
    // The parent scope is based on the JSX tree, using context.
    // However, if a new scope mounts outside the active scope (e.g. DialogContainer launched from a menu),
    // we want the parent scope to be the active scope instead.
    let ctxParent = (ref = ctx === null || ctx === void 0 ? void 0 : ctx.scopeRef) !== null && ref !== void 0 ? ref : null;
    let parentScope1 = $6nfFC$useMemo(()=>module_$9bf71ea28793e738$var$activeScope && $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(module_$9bf71ea28793e738$var$activeScope) && !module_$9bf71ea28793e738$var$isAncestorScope(module_$9bf71ea28793e738$var$activeScope, ctxParent) ? module_$9bf71ea28793e738$var$activeScope : ctxParent
    , [
        ctxParent
    ]);
    $6nfFC$useLayoutEffect(()=>{
        // Find all rendered nodes between the sentinels and add them to the scope.
        let node = startRef.current.nextSibling;
        let nodes = [];
        while(node && node !== endRef.current){
            nodes.push(node);
            node = node.nextSibling;
        }
        scopeRef.current = nodes;
    }, [
        children,
        parentScope1
    ]);
    // add to the focus scope tree in render order because useEffects/useLayoutEffects run children first whereas render runs parent first
    // which matters when constructing a tree
    if ($9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(parentScope1) && !$9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scopeRef)) $9bf71ea28793e738$export$d06fae2ee68b101e.addTreeNode(scopeRef, parentScope1);
    let node1 = $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scopeRef);
    node1.contain = contain;
    $9bf71ea28793e738$var$useActiveScopeTracker(scopeRef, restoreFocus, contain);
    module_$9bf71ea28793e738$var$useFocusContainment(scopeRef, contain);
    module_$9bf71ea28793e738$var$useRestoreFocus(scopeRef, restoreFocus, contain);
    module_$9bf71ea28793e738$var$useAutoFocus(scopeRef, autoFocus);
    // this layout effect needs to run last so that focusScopeTree cleanup happens at the last moment possible
    $6nfFC$useLayoutEffect(()=>{
        if (scopeRef) return ()=>{
            // Scope may have been re-parented.
            let parentScope = $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scopeRef).parent.scopeRef;
            // Restore the active scope on unmount if this scope or a descendant scope is active.
            // Parent effect cleanups run before children, so we need to check if the
            // parent scope actually still exists before restoring the active scope to it.
            if ((scopeRef === module_$9bf71ea28793e738$var$activeScope || module_$9bf71ea28793e738$var$isAncestorScope(scopeRef, module_$9bf71ea28793e738$var$activeScope)) && (!parentScope || $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(parentScope))) module_$9bf71ea28793e738$var$activeScope = parentScope;
            $9bf71ea28793e738$export$d06fae2ee68b101e.removeTreeNode(scopeRef);
        };
    }, [
        scopeRef,
        parentScope1
    ]);
    let focusManager = module_$9bf71ea28793e738$var$createFocusManagerForScope(scopeRef);
    return(/*#__PURE__*/ $6nfFC$react.createElement(module_$9bf71ea28793e738$var$FocusContext.Provider, {
        value: {
            scopeRef: scopeRef,
            focusManager: focusManager
        }
    }, /*#__PURE__*/ $6nfFC$react.createElement("span", {
        "data-focus-scope-start": true,
        hidden: true,
        ref: startRef
    }), children, /*#__PURE__*/ $6nfFC$react.createElement("span", {
        "data-focus-scope-end": true,
        hidden: true,
        ref: endRef
    })));
}
function module_$9bf71ea28793e738$export$10c5169755ce7bd7() {
    var ref;
    return (ref = $6nfFC$useContext(module_$9bf71ea28793e738$var$FocusContext)) === null || ref === void 0 ? void 0 : ref.focusManager;
}
function module_$9bf71ea28793e738$var$createFocusManagerForScope(scopeRef) {
    return {
        focusNext (opts = {
        }) {
            let scope = scopeRef.current;
            let { from: from , tabbable: tabbable , wrap: wrap , accept: accept  } = opts;
            let node = from || document.activeElement;
            let sentinel = scope[0].previousElementSibling;
            let walker = module_$9bf71ea28793e738$export$2d6ec8fc375ceafa(module_$9bf71ea28793e738$var$getScopeRoot(scope), {
                tabbable: tabbable,
                accept: accept
            }, scope);
            walker.currentNode = module_$9bf71ea28793e738$var$isElementInScope(node, scope) ? node : sentinel;
            let nextNode = walker.nextNode();
            if (!nextNode && wrap) {
                walker.currentNode = sentinel;
                nextNode = walker.nextNode();
            }
            if (nextNode) module_$9bf71ea28793e738$var$focusElement(nextNode, true);
            return nextNode;
        },
        focusPrevious (opts = {
        }) {
            let scope = scopeRef.current;
            let { from: from , tabbable: tabbable , wrap: wrap , accept: accept  } = opts;
            let node = from || document.activeElement;
            let sentinel = scope[scope.length - 1].nextElementSibling;
            let walker = module_$9bf71ea28793e738$export$2d6ec8fc375ceafa(module_$9bf71ea28793e738$var$getScopeRoot(scope), {
                tabbable: tabbable,
                accept: accept
            }, scope);
            walker.currentNode = module_$9bf71ea28793e738$var$isElementInScope(node, scope) ? node : sentinel;
            let previousNode = walker.previousNode();
            if (!previousNode && wrap) {
                walker.currentNode = sentinel;
                previousNode = walker.previousNode();
            }
            if (previousNode) module_$9bf71ea28793e738$var$focusElement(previousNode, true);
            return previousNode;
        },
        focusFirst (opts = {
        }) {
            let scope = scopeRef.current;
            let { tabbable: tabbable , accept: accept  } = opts;
            let walker = module_$9bf71ea28793e738$export$2d6ec8fc375ceafa(module_$9bf71ea28793e738$var$getScopeRoot(scope), {
                tabbable: tabbable,
                accept: accept
            }, scope);
            walker.currentNode = scope[0].previousElementSibling;
            let nextNode = walker.nextNode();
            if (nextNode) module_$9bf71ea28793e738$var$focusElement(nextNode, true);
            return nextNode;
        },
        focusLast (opts = {
        }) {
            let scope = scopeRef.current;
            let { tabbable: tabbable , accept: accept  } = opts;
            let walker = module_$9bf71ea28793e738$export$2d6ec8fc375ceafa(module_$9bf71ea28793e738$var$getScopeRoot(scope), {
                tabbable: tabbable,
                accept: accept
            }, scope);
            walker.currentNode = scope[scope.length - 1].nextElementSibling;
            let previousNode = walker.previousNode();
            if (previousNode) module_$9bf71ea28793e738$var$focusElement(previousNode, true);
            return previousNode;
        }
    };
}
const module_$9bf71ea28793e738$var$focusableElements = [
    'input:not([disabled]):not([type=hidden])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'a[href]',
    'area[href]',
    'summary',
    'iframe',
    'object',
    'embed',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]'
];
const module_$9bf71ea28793e738$var$FOCUSABLE_ELEMENT_SELECTOR = module_$9bf71ea28793e738$var$focusableElements.join(':not([hidden]),') + ',[tabindex]:not([disabled]):not([hidden])';
module_$9bf71ea28793e738$var$focusableElements.push('[tabindex]:not([tabindex="-1"]):not([disabled])');
const module_$9bf71ea28793e738$var$TABBABLE_ELEMENT_SELECTOR = module_$9bf71ea28793e738$var$focusableElements.join(':not([hidden]):not([tabindex="-1"]),');
function module_$9bf71ea28793e738$var$getScopeRoot(scope) {
    return scope[0].parentElement;
}
function $9bf71ea28793e738$var$shouldContainFocus(scopeRef) {
    let scope = $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(module_$9bf71ea28793e738$var$activeScope);
    while(scope && scope.scopeRef !== scopeRef){
        if (scope.contain) return false;
        scope = scope.parent;
    }
    return true;
}
function module_$9bf71ea28793e738$var$useFocusContainment(scopeRef, contain) {
    let focusedNode = $6nfFC$useRef();
    let raf = $6nfFC$useRef(null);
    $6nfFC$useLayoutEffect(()=>{
        let scope1 = scopeRef.current;
        if (!contain) {
            // if contain was changed, then we should cancel any ongoing waits to pull focus back into containment
            if (raf.current) {
                cancelAnimationFrame(raf.current);
                raf.current = null;
            }
            return;
        }
        // Handle the Tab key to contain focus within the scope
        let onKeyDown = (e)=>{
            if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey || !$9bf71ea28793e738$var$shouldContainFocus(scopeRef)) return;
            let focusedElement = document.activeElement;
            let scope = scopeRef.current;
            if (!module_$9bf71ea28793e738$var$isElementInScope(focusedElement, scope)) return;
            let walker = module_$9bf71ea28793e738$export$2d6ec8fc375ceafa(module_$9bf71ea28793e738$var$getScopeRoot(scope), {
                tabbable: true
            }, scope);
            walker.currentNode = focusedElement;
            let nextElement = e.shiftKey ? walker.previousNode() : walker.nextNode();
            if (!nextElement) {
                walker.currentNode = e.shiftKey ? scope[scope.length - 1].nextElementSibling : scope[0].previousElementSibling;
                nextElement = e.shiftKey ? walker.previousNode() : walker.nextNode();
            }
            e.preventDefault();
            if (nextElement) module_$9bf71ea28793e738$var$focusElement(nextElement, true);
        };
        let onFocus = (e)=>{
            // If focusing an element in a child scope of the currently active scope, the child becomes active.
            // Moving out of the active scope to an ancestor is not allowed.
            if ((!module_$9bf71ea28793e738$var$activeScope || module_$9bf71ea28793e738$var$isAncestorScope(module_$9bf71ea28793e738$var$activeScope, scopeRef)) && module_$9bf71ea28793e738$var$isElementInScope(e.target, scopeRef.current)) {
                module_$9bf71ea28793e738$var$activeScope = scopeRef;
                focusedNode.current = e.target;
            } else if ($9bf71ea28793e738$var$shouldContainFocus(scopeRef) && !module_$9bf71ea28793e738$var$isElementInChildScope(e.target, scopeRef)) {
                // If a focus event occurs outside the active scope (e.g. user tabs from browser location bar),
                // restore focus to the previously focused node or the first tabbable element in the active scope.
                if (focusedNode.current) focusedNode.current.focus();
                else if (module_$9bf71ea28793e738$var$activeScope) module_$9bf71ea28793e738$var$focusFirstInScope(module_$9bf71ea28793e738$var$activeScope.current);
            } else if ($9bf71ea28793e738$var$shouldContainFocus(scopeRef)) focusedNode.current = e.target;
        };
        let onBlur = (e)=>{
            // Firefox doesn't shift focus back to the Dialog properly without this
            raf.current = requestAnimationFrame(()=>{
                // Use document.activeElement instead of e.relatedTarget so we can tell if user clicked into iframe
                if ($9bf71ea28793e738$var$shouldContainFocus(scopeRef) && !module_$9bf71ea28793e738$var$isElementInChildScope(document.activeElement, scopeRef)) {
                    module_$9bf71ea28793e738$var$activeScope = scopeRef;
                    if (document.body.contains(e.target)) {
                        focusedNode.current = e.target;
                        focusedNode.current.focus();
                    } else if (module_$9bf71ea28793e738$var$activeScope) module_$9bf71ea28793e738$var$focusFirstInScope(module_$9bf71ea28793e738$var$activeScope.current);
                }
            });
        };
        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('focusin', onFocus, false);
        scope1.forEach((element)=>element.addEventListener('focusin', onFocus, false)
        );
        scope1.forEach((element)=>element.addEventListener('focusout', onBlur, false)
        );
        return ()=>{
            document.removeEventListener('keydown', onKeyDown, false);
            document.removeEventListener('focusin', onFocus, false);
            scope1.forEach((element)=>element.removeEventListener('focusin', onFocus, false)
            );
            scope1.forEach((element)=>element.removeEventListener('focusout', onBlur, false)
            );
        };
    }, [
        scopeRef,
        contain
    ]);
    // eslint-disable-next-line arrow-body-style
    $6nfFC$useEffect(()=>{
        return ()=>{
            if (raf.current) cancelAnimationFrame(raf.current);
        };
    }, [
        raf
    ]);
}
function module_$9bf71ea28793e738$var$isElementInAnyScope(element) {
    return module_$9bf71ea28793e738$var$isElementInChildScope(element);
}
function module_$9bf71ea28793e738$var$isElementInScope(element, scope) {
    return scope.some((node)=>node.contains(element)
    );
}
function module_$9bf71ea28793e738$var$isElementInChildScope(element, scope = null) {
    // node.contains in isElementInScope covers child scopes that are also DOM children,
    // but does not cover child scopes in portals.
    for (let { scopeRef: s  } of $9bf71ea28793e738$export$d06fae2ee68b101e.traverse($9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scope))){
        if (module_$9bf71ea28793e738$var$isElementInScope(element, s.current)) return true;
    }
    return false;
}
function module_$9bf71ea28793e738$var$isAncestorScope(ancestor, scope) {
    var ref;
    let parent = (ref = $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scope)) === null || ref === void 0 ? void 0 : ref.parent;
    while(parent){
        if (parent.scopeRef === ancestor) return true;
        parent = parent.parent;
    }
    return false;
}
function module_$9bf71ea28793e738$var$focusElement(element, scroll = false) {
    if (element != null && !scroll) try {
        module_$6a99195332edec8b$export$80f3e147d781571c(element);
    } catch (err) {
    // ignore
    }
    else if (element != null) try {
        element.focus();
    } catch (err1) {
    // ignore
    }
}
function module_$9bf71ea28793e738$var$focusFirstInScope(scope, tabbable = true) {
    let sentinel = scope[0].previousElementSibling;
    let walker = module_$9bf71ea28793e738$export$2d6ec8fc375ceafa(module_$9bf71ea28793e738$var$getScopeRoot(scope), {
        tabbable: tabbable
    }, scope);
    walker.currentNode = sentinel;
    let nextNode = walker.nextNode();
    // If the scope does not contain a tabbable element, use the first focusable element.
    if (tabbable && !nextNode) {
        walker = module_$9bf71ea28793e738$export$2d6ec8fc375ceafa(module_$9bf71ea28793e738$var$getScopeRoot(scope), {
            tabbable: false
        }, scope);
        walker.currentNode = sentinel;
        nextNode = walker.nextNode();
    }
    module_$9bf71ea28793e738$var$focusElement(nextNode);
}
function module_$9bf71ea28793e738$var$useAutoFocus(scopeRef, autoFocus) {
    const autoFocusRef = $6nfFC$react.useRef(autoFocus);
    $6nfFC$useEffect(()=>{
        if (autoFocusRef.current) {
            module_$9bf71ea28793e738$var$activeScope = scopeRef;
            if (!module_$9bf71ea28793e738$var$isElementInScope(document.activeElement, module_$9bf71ea28793e738$var$activeScope.current)) module_$9bf71ea28793e738$var$focusFirstInScope(scopeRef.current);
        }
        autoFocusRef.current = false;
    }, [
        scopeRef
    ]);
}
function $9bf71ea28793e738$var$useActiveScopeTracker(scopeRef, restore, contain) {
    // tracks the active scope, in case restore and contain are both false.
    // if either are true, this is tracked in useRestoreFocus or useFocusContainment.
    $6nfFC$useLayoutEffect(()=>{
        if (restore || contain) return;
        let scope = scopeRef.current;
        let onFocus = (e)=>{
            let target = e.target;
            if (module_$9bf71ea28793e738$var$isElementInScope(target, scopeRef.current)) module_$9bf71ea28793e738$var$activeScope = scopeRef;
            else if (!module_$9bf71ea28793e738$var$isElementInAnyScope(target)) module_$9bf71ea28793e738$var$activeScope = null;
        };
        document.addEventListener('focusin', onFocus, false);
        scope.forEach((element)=>element.addEventListener('focusin', onFocus, false)
        );
        return ()=>{
            document.removeEventListener('focusin', onFocus, false);
            scope.forEach((element)=>element.removeEventListener('focusin', onFocus, false)
            );
        };
    }, [
        scopeRef,
        restore,
        contain
    ]);
}
function $9bf71ea28793e738$var$shouldRestoreFocus(scopeRef) {
    let scope = $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(module_$9bf71ea28793e738$var$activeScope);
    while(scope && scope.scopeRef !== scopeRef){
        if (scope.nodeToRestore) return false;
        scope = scope.parent;
    }
    return true;
}
function module_$9bf71ea28793e738$var$useRestoreFocus(scopeRef, restoreFocus, contain) {
    // create a ref during render instead of useLayoutEffect so the active element is saved before a child with autoFocus=true mounts.
    const nodeToRestoreRef = $6nfFC$useRef(typeof document !== 'undefined' ? document.activeElement : null);
    // restoring scopes should all track if they are active regardless of contain, but contain already tracks it plus logic to contain the focus
    // restoring-non-containing scopes should only care if they become active so they can perform the restore
    $6nfFC$useLayoutEffect(()=>{
        let scope = scopeRef.current;
        if (!restoreFocus || contain) return;
        let onFocus = ()=>{
            // If focusing an element in a child scope of the currently active scope, the child becomes active.
            // Moving out of the active scope to an ancestor is not allowed.
            if (!module_$9bf71ea28793e738$var$activeScope || module_$9bf71ea28793e738$var$isAncestorScope(module_$9bf71ea28793e738$var$activeScope, scopeRef)) module_$9bf71ea28793e738$var$activeScope = scopeRef;
        };
        document.addEventListener('focusin', onFocus, false);
        scope.forEach((element)=>element.addEventListener('focusin', onFocus, false)
        );
        return ()=>{
            document.removeEventListener('focusin', onFocus, false);
            scope.forEach((element)=>element.removeEventListener('focusin', onFocus, false)
            );
        };
    }, [
        scopeRef,
        contain
    ]);
    // useLayoutEffect instead of useEffect so the active element is saved synchronously instead of asynchronously.
    $6nfFC$useLayoutEffect(()=>{
        if (!restoreFocus) return;
        $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scopeRef).nodeToRestore = nodeToRestoreRef.current;
        // Handle the Tab key so that tabbing out of the scope goes to the next element
        // after the node that had focus when the scope mounted. This is important when
        // using portals for overlays, so that focus goes to the expected element when
        // tabbing out of the overlay.
        let onKeyDown = (e)=>{
            if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return;
            let focusedElement = document.activeElement;
            if (!module_$9bf71ea28793e738$var$isElementInScope(focusedElement, scopeRef.current)) return;
            let nodeToRestore = $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scopeRef).nodeToRestore;
            // Create a DOM tree walker that matches all tabbable elements
            let walker = module_$9bf71ea28793e738$export$2d6ec8fc375ceafa(document.body, {
                tabbable: true
            });
            // Find the next tabbable element after the currently focused element
            walker.currentNode = focusedElement;
            let nextElement = e.shiftKey ? walker.previousNode() : walker.nextNode();
            if (!document.body.contains(nodeToRestore) || nodeToRestore === document.body) {
                nodeToRestore = null;
                $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scopeRef).nodeToRestore = null;
            }
            // If there is no next element, or it is outside the current scope, move focus to the
            // next element after the node to restore to instead.
            if ((!nextElement || !module_$9bf71ea28793e738$var$isElementInScope(nextElement, scopeRef.current)) && nodeToRestore) {
                walker.currentNode = nodeToRestore;
                // Skip over elements within the scope, in case the scope immediately follows the node to restore.
                do nextElement = e.shiftKey ? walker.previousNode() : walker.nextNode();
                while (module_$9bf71ea28793e738$var$isElementInScope(nextElement, scopeRef.current))
                e.preventDefault();
                e.stopPropagation();
                if (nextElement) module_$9bf71ea28793e738$var$focusElement(nextElement, true);
                else // If there is no next element and the nodeToRestore isn't within a FocusScope (i.e. we are leaving the top level focus scope)
                // then move focus to the body.
                // Otherwise restore focus to the nodeToRestore (e.g menu within a popover -> tabbing to close the menu should move focus to menu trigger)
                if (!module_$9bf71ea28793e738$var$isElementInAnyScope(nodeToRestore)) focusedElement.blur();
                else module_$9bf71ea28793e738$var$focusElement(nodeToRestore, true);
            }
        };
        if (!contain) document.addEventListener('keydown', onKeyDown, true);
        return ()=>{
            if (!contain) document.removeEventListener('keydown', onKeyDown, true);
            let nodeToRestore = $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scopeRef).nodeToRestore;
            // if we already lost focus to the body and this was the active scope, then we should attempt to restore
            if (restoreFocus && nodeToRestore && (module_$9bf71ea28793e738$var$isElementInScope(document.activeElement, scopeRef.current) || document.activeElement === document.body && $9bf71ea28793e738$var$shouldRestoreFocus(scopeRef))) {
                // freeze the focusScopeTree so it persists after the raf, otherwise during unmount nodes are removed from it
                let clonedTree = $9bf71ea28793e738$export$d06fae2ee68b101e.clone();
                requestAnimationFrame(()=>{
                    // Only restore focus if we've lost focus to the body, the alternative is that focus has been purposefully moved elsewhere
                    if (document.activeElement === document.body) {
                        // look up the tree starting with our scope to find a nodeToRestore still in the DOM
                        let treeNode = clonedTree.getTreeNode(scopeRef);
                        while(treeNode){
                            if (treeNode.nodeToRestore && document.body.contains(treeNode.nodeToRestore)) {
                                module_$9bf71ea28793e738$var$focusElement(treeNode.nodeToRestore);
                                return;
                            }
                            treeNode = treeNode.parent;
                        }
                        // If no nodeToRestore was found, focus the first element in the nearest
                        // ancestor scope that is still in the tree.
                        treeNode = clonedTree.getTreeNode(scopeRef);
                        while(treeNode){
                            if (treeNode.scopeRef && $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(treeNode.scopeRef)) {
                                module_$9bf71ea28793e738$var$focusFirstInScope(treeNode.scopeRef.current, true);
                                return;
                            }
                            treeNode = treeNode.parent;
                        }
                    }
                });
            }
        };
    }, [
        scopeRef,
        restoreFocus,
        contain
    ]);
}
function module_$9bf71ea28793e738$export$2d6ec8fc375ceafa(root, opts, scope) {
    let selector = (opts === null || opts === void 0 ? void 0 : opts.tabbable) ? module_$9bf71ea28793e738$var$TABBABLE_ELEMENT_SELECTOR : module_$9bf71ea28793e738$var$FOCUSABLE_ELEMENT_SELECTOR;
    let walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
        acceptNode (node) {
            var ref;
            // Skip nodes inside the starting node.
            if (opts === null || opts === void 0 ? void 0 : (ref = opts.from) === null || ref === void 0 ? void 0 : ref.contains(node)) return NodeFilter.FILTER_REJECT;
            if (node.matches(selector) && module_$645f2e67b85a24c9$export$e989c0fffaa6b27a(node) && (!scope || module_$9bf71ea28793e738$var$isElementInScope(node, scope)) && (!(opts === null || opts === void 0 ? void 0 : opts.accept) || opts.accept(node))) return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_SKIP;
        }
    });
    if (opts === null || opts === void 0 ? void 0 : opts.from) walker.currentNode = opts.from;
    return walker;
}
function module_$9bf71ea28793e738$export$c5251b9e124bf29(ref, defaultOptions = {
}) {
    return {
        focusNext (opts = {
        }) {
            let root = ref.current;
            if (!root) return;
            let { from: from , tabbable: tabbable = defaultOptions.tabbable , wrap: wrap = defaultOptions.wrap , accept: accept = defaultOptions.accept  } = opts;
            let node = from || document.activeElement;
            let walker = module_$9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
                tabbable: tabbable,
                accept: accept
            });
            if (root.contains(node)) walker.currentNode = node;
            let nextNode = walker.nextNode();
            if (!nextNode && wrap) {
                walker.currentNode = root;
                nextNode = walker.nextNode();
            }
            if (nextNode) module_$9bf71ea28793e738$var$focusElement(nextNode, true);
            return nextNode;
        },
        focusPrevious (opts = defaultOptions) {
            let root = ref.current;
            if (!root) return;
            let { from: from , tabbable: tabbable = defaultOptions.tabbable , wrap: wrap = defaultOptions.wrap , accept: accept = defaultOptions.accept  } = opts;
            let node = from || document.activeElement;
            let walker = module_$9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
                tabbable: tabbable,
                accept: accept
            });
            if (root.contains(node)) walker.currentNode = node;
            else {
                let next = module_$9bf71ea28793e738$var$last(walker);
                if (next) module_$9bf71ea28793e738$var$focusElement(next, true);
                return next;
            }
            let previousNode = walker.previousNode();
            if (!previousNode && wrap) {
                walker.currentNode = root;
                previousNode = module_$9bf71ea28793e738$var$last(walker);
            }
            if (previousNode) module_$9bf71ea28793e738$var$focusElement(previousNode, true);
            return previousNode;
        },
        focusFirst (opts = defaultOptions) {
            let root = ref.current;
            if (!root) return;
            let { tabbable: tabbable = defaultOptions.tabbable , accept: accept = defaultOptions.accept  } = opts;
            let walker = module_$9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
                tabbable: tabbable,
                accept: accept
            });
            let nextNode = walker.nextNode();
            if (nextNode) module_$9bf71ea28793e738$var$focusElement(nextNode, true);
            return nextNode;
        },
        focusLast (opts = defaultOptions) {
            let root = ref.current;
            if (!root) return;
            let { tabbable: tabbable = defaultOptions.tabbable , accept: accept = defaultOptions.accept  } = opts;
            let walker = module_$9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
                tabbable: tabbable,
                accept: accept
            });
            let next = module_$9bf71ea28793e738$var$last(walker);
            if (next) module_$9bf71ea28793e738$var$focusElement(next, true);
            return next;
        }
    };
}
function module_$9bf71ea28793e738$var$last(walker) {
    let next;
    let last;
    do {
        last = walker.lastChild();
        if (last) next = last;
    }while (last)
    return next;
}
class $9bf71ea28793e738$var$Tree {
    get size() {
        return this.fastMap.size;
    }
    getTreeNode(data) {
        return this.fastMap.get(data);
    }
    addTreeNode(scopeRef, parent, nodeToRestore) {
        let parentNode = this.fastMap.get(parent !== null && parent !== void 0 ? parent : null);
        let node = new $9bf71ea28793e738$var$TreeNode({
            scopeRef: scopeRef
        });
        parentNode.addChild(node);
        node.parent = parentNode;
        this.fastMap.set(scopeRef, node);
        if (nodeToRestore) node.nodeToRestore = nodeToRestore;
    }
    removeTreeNode(scopeRef) {
        // never remove the root
        if (scopeRef === null) return;
        let node = this.fastMap.get(scopeRef);
        let parentNode = node.parent;
        // when we remove a scope, check if any sibling scopes are trying to restore focus to something inside the scope we're removing
        // if we are, then replace the siblings restore with the restore from the scope we're removing
        for (let current of this.traverse())if (current !== node && node.nodeToRestore && current.nodeToRestore && node.scopeRef.current && module_$9bf71ea28793e738$var$isElementInScope(current.nodeToRestore, node.scopeRef.current)) current.nodeToRestore = node.nodeToRestore;
        let children = node.children;
        parentNode.removeChild(node);
        if (children.length > 0) children.forEach((child)=>parentNode.addChild(child)
        );
        this.fastMap.delete(node.scopeRef);
    }
    // Pre Order Depth First
    *traverse(node = this.root) {
        if (node.scopeRef != null) yield node;
        if (node.children.length > 0) for (let child of node.children)yield* this.traverse(child);
    }
    clone() {
        let newTree = new $9bf71ea28793e738$var$Tree();
        for (let node of this.traverse())newTree.addTreeNode(node.scopeRef, node.parent.scopeRef, node.nodeToRestore);
        return newTree;
    }
    constructor(){
        this.fastMap = new Map();
        this.root = new $9bf71ea28793e738$var$TreeNode({
            scopeRef: null
        });
        this.fastMap.set(null, this.root);
    }
}
class $9bf71ea28793e738$var$TreeNode {
    addChild(node) {
        this.children.push(node);
        node.parent = this;
    }
    removeChild(node) {
        this.children.splice(this.children.indexOf(node), 1);
        node.parent = undefined;
    }
    constructor(props){
        this.children = [];
        this.contain = false;
        this.scopeRef = props.scopeRef;
    }
}
let $9bf71ea28793e738$export$d06fae2ee68b101e = new $9bf71ea28793e738$var$Tree();








function module_$f7dceffc5ad7768b$export$4e328f61c538687f(props = {
}) {
    let { autoFocus: autoFocus = false , isTextInput: isTextInput , within: within  } = props;
    let state = $6nfFC$useRef({
        isFocused: false,
        isFocusVisible: autoFocus || $6nfFC$isFocusVisible()
    });
    let [isFocused1, setFocused] = $6nfFC$useState(false);
    let [isFocusVisibleState, setFocusVisible] = $6nfFC$useState(()=>state.current.isFocused && state.current.isFocusVisible
    );
    let updateState = $6nfFC$useCallback(()=>setFocusVisible(state.current.isFocused && state.current.isFocusVisible)
    , []);
    let onFocusChange = $6nfFC$useCallback((isFocused)=>{
        state.current.isFocused = isFocused;
        setFocused(isFocused);
        updateState();
    }, [
        updateState
    ]);
    $6nfFC$useFocusVisibleListener((isFocusVisible)=>{
        state.current.isFocusVisible = isFocusVisible;
        updateState();
    }, [], {
        isTextInput: isTextInput
    });
    let { focusProps: focusProps  } = $6nfFC$useFocus({
        isDisabled: within,
        onFocusChange: onFocusChange
    });
    let { focusWithinProps: focusWithinProps  } = $6nfFC$useFocusWithin({
        isDisabled: !within,
        onFocusWithinChange: onFocusChange
    });
    return {
        isFocused: isFocused1,
        isFocusVisible: state.current.isFocused && isFocusVisibleState,
        focusProps: within ? focusWithinProps : focusProps
    };
}


function module_$907718708eab68af$export$1a38b4ad7f578e1d(props) {
    let { children: children , focusClass: focusClass , focusRingClass: focusRingClass  } = props;
    let { isFocused: isFocused , isFocusVisible: isFocusVisible , focusProps: focusProps  } = module_$f7dceffc5ad7768b$export$4e328f61c538687f(props);
    let child = $6nfFC$react.Children.only(children);
    return(/*#__PURE__*/ $6nfFC$react.cloneElement(child, $6nfFC$mergeProps(child.props, {
        ...focusProps,
        className: $6nfFC$clsx({
            [focusClass || '']: isFocused,
            [focusRingClass || '']: isFocusVisible
        })
    })));
}






let module_$e6afbd83fe6ebbd2$var$FocusableContext = /*#__PURE__*/ react.createContext(null);
function module_$e6afbd83fe6ebbd2$var$useFocusableContext(ref) {
    let context = (0,react.useContext)(module_$e6afbd83fe6ebbd2$var$FocusableContext) || {
    };
    module_$e7801be82b4b2a53$export$4debdb1a3f0fa79e(context, ref);
    // eslint-disable-next-line
    let { ref: _ , ...otherProps } = context;
    return otherProps;
}
/**
 * Provides DOM props to the nearest focusable child.
 */ function module_$e6afbd83fe6ebbd2$var$FocusableProvider(props, ref) {
    let { children: children , ...otherProps } = props;
    let context = {
        ...otherProps,
        ref: ref
    };
    return(/*#__PURE__*/ $6nfFC$react.createElement(module_$e6afbd83fe6ebbd2$var$FocusableContext.Provider, {
        value: context
    }, children));
}
let module_$e6afbd83fe6ebbd2$export$13f3202a3e5ddd5 = /*#__PURE__*/ (/* unused pure expression or super */ null && ($6nfFC$react.forwardRef(module_$e6afbd83fe6ebbd2$var$FocusableProvider)));
function module_$e6afbd83fe6ebbd2$export$4c014de7c8940b4c(props, domRef) {
    let { focusProps: focusProps  } = module_$a1ea59d68270f0dd$export$f8168d8dd8fd66e6(props);
    let { keyboardProps: keyboardProps  } = module_$46d819fcbaf35654$export$8f71654801c2f7cd(props);
    let interactions = module_$3ef42575df84b30b$export$9d1611c77c2fe928(focusProps, keyboardProps);
    let domProps = module_$e6afbd83fe6ebbd2$var$useFocusableContext(domRef);
    let interactionProps = props.isDisabled ? {
    } : domProps;
    let autoFocusRef = (0,react.useRef)(props.autoFocus);
    (0,react.useEffect)(()=>{
        if (autoFocusRef.current && domRef.current) module_$6a99195332edec8b$export$80f3e147d781571c(domRef.current);
        autoFocusRef.current = false;
    }, [
        domRef
    ]);
    return {
        focusableProps: module_$3ef42575df84b30b$export$9d1611c77c2fe928({
            ...interactions,
            tabIndex: props.excludeFromTabOrder && !props.isDisabled ? -1 : undefined
        }, interactionProps)
    };
}







//# sourceMappingURL=module.js.map

;// CONCATENATED MODULE: ./node_modules/@react-aria/button/dist/module.js








function $701a24aa0da5b062$export$ea18c227d4417cc3(props, ref) {
    let { elementType: elementType = 'button' , isDisabled: isDisabled , onPress: onPress , onPressStart: onPressStart , onPressEnd: onPressEnd , onPressChange: onPressChange , preventFocusOnPress: // @ts-ignore - undocumented
    preventFocusOnPress , allowFocusWhenDisabled: // @ts-ignore - undocumented
    allowFocusWhenDisabled , // @ts-ignore
    onClick: deprecatedOnClick , href: href , target: target , rel: rel , type: type = 'button'  } = props;
    let additionalProps;
    if (elementType === 'button') additionalProps = {
        type: type,
        disabled: isDisabled
    };
    else additionalProps = {
        role: 'button',
        tabIndex: isDisabled ? undefined : 0,
        href: elementType === 'a' && isDisabled ? undefined : href,
        target: elementType === 'a' ? target : undefined,
        type: elementType === 'input' ? type : undefined,
        disabled: elementType === 'input' ? isDisabled : undefined,
        'aria-disabled': !isDisabled || elementType === 'input' ? undefined : isDisabled,
        rel: elementType === 'a' ? rel : undefined
    };
    let { pressProps: pressProps , isPressed: isPressed  } = module_$f6c31cce2adf654f$export$45712eceda6fad21({
        onPressStart: onPressStart,
        onPressEnd: onPressEnd,
        onPressChange: onPressChange,
        onPress: onPress,
        isDisabled: isDisabled,
        preventFocusOnPress: preventFocusOnPress,
        ref: ref
    });
    let { focusableProps: focusableProps  } = module_$e6afbd83fe6ebbd2$export$4c014de7c8940b4c(props, ref);
    if (allowFocusWhenDisabled) focusableProps.tabIndex = isDisabled ? -1 : focusableProps.tabIndex;
    let buttonProps = module_$3ef42575df84b30b$export$9d1611c77c2fe928(focusableProps, pressProps, module_$65484d02dcb7eb3e$export$457c3d6518dd4c6f(props, {
        labelable: true
    }));
    return {
        isPressed: isPressed,
        buttonProps: module_$3ef42575df84b30b$export$9d1611c77c2fe928(additionalProps, buttonProps, {
            'aria-haspopup': props['aria-haspopup'],
            'aria-expanded': props['aria-expanded'],
            'aria-controls': props['aria-controls'],
            'aria-pressed': props['aria-pressed'],
            onClick: (e)=>{
                if (deprecatedOnClick) {
                    deprecatedOnClick(e);
                    console.warn('onClick is deprecated, please use onPress');
                }
            }
        })
    };
}





function $55f54f7887471b58$export$51e84d46ca0bc451(props, state, ref) {
    const { isSelected: isSelected  } = state;
    const { isPressed: isPressed , buttonProps: buttonProps  } = $701a24aa0da5b062$export$ea18c227d4417cc3({
        ...props,
        onPress: $cE0pI$chain(state.toggle, props.onPress)
    }, ref);
    return {
        isPressed: isPressed,
        buttonProps: $cE0pI$mergeProps(buttonProps, {
            'aria-pressed': isSelected
        })
    };
}





//# sourceMappingURL=module.js.map

;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/node_modules/@react-aria/interactions/node_modules/@react-aria/utils/dist/module.js







const dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c = typeof window !== 'undefined' ? react.useLayoutEffect : ()=>{
};




let dist_module_$bdb11010cef70236$var$idsUpdaterMap = new Map();
function dist_module_$bdb11010cef70236$export$f680877a34711e37(defaultId) {
    let [value, setValue] = $12uGp$useState(defaultId);
    let nextId = $12uGp$useRef(null);
    let res = $12uGp$useSSRSafeId(value);
    let updateValue = $12uGp$useCallback((val)=>{
        nextId.current = val;
    }, []);
    dist_module_$bdb11010cef70236$var$idsUpdaterMap.set(res, updateValue);
    dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        let r = res;
        return ()=>{
            dist_module_$bdb11010cef70236$var$idsUpdaterMap.delete(r);
        };
    }, [
        res
    ]);
    // This cannot cause an infinite loop because the ref is updated first.
    // eslint-disable-next-line
    $12uGp$useEffect(()=>{
        let newId = nextId.current;
        if (newId) {
            nextId.current = null;
            setValue(newId);
        }
    });
    return res;
}
function dist_module_$bdb11010cef70236$export$cd8c9cb68f842629(idA, idB) {
    if (idA === idB) return idA;
    let setIdA = dist_module_$bdb11010cef70236$var$idsUpdaterMap.get(idA);
    if (setIdA) {
        setIdA(idB);
        return idB;
    }
    let setIdB = dist_module_$bdb11010cef70236$var$idsUpdaterMap.get(idB);
    if (setIdB) {
        setIdB(idA);
        return idA;
    }
    return idB;
}
function dist_module_$bdb11010cef70236$export$b4cc09c592e8fdb8(depArray = []) {
    let id = dist_module_$bdb11010cef70236$export$f680877a34711e37();
    let [resolvedId, setResolvedId] = dist_module_$1dbecbe27a04f9af$export$14d238f342723f25(id);
    let updateId = $12uGp$useCallback(()=>{
        setResolvedId(function*() {
            yield id;
            yield document.getElementById(id) ? id : undefined;
        });
    }, [
        id,
        setResolvedId
    ]);
    dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(updateId, [
        id,
        updateId,
        ...depArray
    ]);
    return resolvedId;
}


function dist_module_$ff5963eb1fccf552$export$e08e3b67e392101e(...callbacks) {
    return (...args)=>{
        for (let callback of callbacks)if (typeof callback === 'function') callback(...args);
    };
}





function dist_module_$3ef42575df84b30b$export$9d1611c77c2fe928(...args) {
    // Start with a base clone of the first argument. This is a lot faster than starting
    // with an empty object and adding properties as we go.
    let result = {
        ...args[0]
    };
    for(let i = 1; i < args.length; i++){
        let props = args[i];
        for(let key in props){
            let a = result[key];
            let b = props[key];
            // Chain events
            if (typeof a === 'function' && typeof b === 'function' && // This is a lot faster than a regex.
            key[0] === 'o' && key[1] === 'n' && key.charCodeAt(2) >= /* 'A' */ 65 && key.charCodeAt(2) <= /* 'Z' */ 90) result[key] = dist_module_$ff5963eb1fccf552$export$e08e3b67e392101e(a, b);
            else if ((key === 'className' || key === 'UNSAFE_className') && typeof a === 'string' && typeof b === 'string') result[key] = $12uGp$clsx(a, b);
            else if (key === 'id' && a && b) result.id = dist_module_$bdb11010cef70236$export$cd8c9cb68f842629(a, b);
            else result[key] = b !== undefined ? b : a;
        }
    }
    return result;
}


function dist_module_$5dc95899b306f630$export$c9058316764c140e(...refs) {
    return (value)=>{
        for (let ref of refs){
            if (typeof ref === 'function') ref(value);
            else if (ref != null) ref.current = value;
        }
    };
}


const dist_module_$65484d02dcb7eb3e$var$DOMPropNames = new Set([
    'id'
]);
const dist_module_$65484d02dcb7eb3e$var$labelablePropNames = new Set([
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-details'
]);
const dist_module_$65484d02dcb7eb3e$var$propRe = /^(data-.*)$/;
function dist_module_$65484d02dcb7eb3e$export$457c3d6518dd4c6f(props, opts = {
}) {
    let { labelable: labelable , propNames: propNames  } = opts;
    let filteredProps = {
    };
    for(const prop in props)if (Object.prototype.hasOwnProperty.call(props, prop) && (dist_module_$65484d02dcb7eb3e$var$DOMPropNames.has(prop) || labelable && dist_module_$65484d02dcb7eb3e$var$labelablePropNames.has(prop) || (propNames === null || propNames === void 0 ? void 0 : propNames.has(prop)) || dist_module_$65484d02dcb7eb3e$var$propRe.test(prop))) filteredProps[prop] = props[prop];
    return filteredProps;
}


function dist_module_$7215afc6de606d6b$export$de79e2c695e052f3(element) {
    if (dist_module_$7215afc6de606d6b$var$supportsPreventScroll()) element.focus({
        preventScroll: true
    });
    else {
        let scrollableElements = dist_module_$7215afc6de606d6b$var$getScrollableElements(element);
        element.focus();
        dist_module_$7215afc6de606d6b$var$restoreScrollPosition(scrollableElements);
    }
}
let dist_module_$7215afc6de606d6b$var$supportsPreventScrollCached = null;
function dist_module_$7215afc6de606d6b$var$supportsPreventScroll() {
    if (dist_module_$7215afc6de606d6b$var$supportsPreventScrollCached == null) {
        dist_module_$7215afc6de606d6b$var$supportsPreventScrollCached = false;
        try {
            var focusElem = document.createElement('div');
            focusElem.focus({
                get preventScroll () {
                    dist_module_$7215afc6de606d6b$var$supportsPreventScrollCached = true;
                    return true;
                }
            });
        } catch (e) {
        // Ignore
        }
    }
    return dist_module_$7215afc6de606d6b$var$supportsPreventScrollCached;
}
function dist_module_$7215afc6de606d6b$var$getScrollableElements(element) {
    var parent = element.parentNode;
    var scrollableElements = [];
    var rootScrollingElement = document.scrollingElement || document.documentElement;
    while(parent instanceof HTMLElement && parent !== rootScrollingElement){
        if (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) scrollableElements.push({
            element: parent,
            scrollTop: parent.scrollTop,
            scrollLeft: parent.scrollLeft
        });
        parent = parent.parentNode;
    }
    if (rootScrollingElement instanceof HTMLElement) scrollableElements.push({
        element: rootScrollingElement,
        scrollTop: rootScrollingElement.scrollTop,
        scrollLeft: rootScrollingElement.scrollLeft
    });
    return scrollableElements;
}
function dist_module_$7215afc6de606d6b$var$restoreScrollPosition(scrollableElements) {
    for (let { element: element , scrollTop: scrollTop , scrollLeft: scrollLeft  } of scrollableElements){
        element.scrollTop = scrollTop;
        element.scrollLeft = scrollLeft;
    }
}


function dist_module_$ab71dadb03a6fb2e$export$622cea445a1c5b7d(element, reverse, orientation = 'horizontal') {
    let rect = element.getBoundingClientRect();
    if (reverse) return orientation === 'horizontal' ? rect.right : rect.bottom;
    return orientation === 'horizontal' ? rect.left : rect.top;
}


/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ // We store a global list of elements that are currently transitioning,
// mapped to a set of CSS properties that are transitioning for that element.
// This is necessary rather than a simple count of transitions because of browser
// bugs, e.g. Chrome sometimes fires both transitionend and transitioncancel rather
// than one or the other. So we need to track what's actually transitioning so that
// we can ignore these duplicate events.
let dist_module_$bbed8b41f857bcc0$var$transitionsByElement = new Map();
// A list of callbacks to call once there are no transitioning elements.
let dist_module_$bbed8b41f857bcc0$var$transitionCallbacks = new Set();
function dist_module_$bbed8b41f857bcc0$var$setupGlobalEvents() {
    if (typeof window === 'undefined') return;
    let onTransitionStart = (e)=>{
        // Add the transitioning property to the list for this element.
        let transitions = dist_module_$bbed8b41f857bcc0$var$transitionsByElement.get(e.target);
        if (!transitions) {
            transitions = new Set();
            dist_module_$bbed8b41f857bcc0$var$transitionsByElement.set(e.target, transitions);
            // The transitioncancel event must be registered on the element itself, rather than as a global
            // event. This enables us to handle when the node is deleted from the document while it is transitioning.
            // In that case, the cancel event would have nowhere to bubble to so we need to handle it directly.
            e.target.addEventListener('transitioncancel', onTransitionEnd);
        }
        transitions.add(e.propertyName);
    };
    let onTransitionEnd = (e)=>{
        // Remove property from list of transitioning properties.
        let properties = dist_module_$bbed8b41f857bcc0$var$transitionsByElement.get(e.target);
        if (!properties) return;
        properties.delete(e.propertyName);
        // If empty, remove transitioncancel event, and remove the element from the list of transitioning elements.
        if (properties.size === 0) {
            e.target.removeEventListener('transitioncancel', onTransitionEnd);
            dist_module_$bbed8b41f857bcc0$var$transitionsByElement.delete(e.target);
        }
        // If no transitioning elements, call all of the queued callbacks.
        if (dist_module_$bbed8b41f857bcc0$var$transitionsByElement.size === 0) {
            for (let cb of dist_module_$bbed8b41f857bcc0$var$transitionCallbacks)cb();
            dist_module_$bbed8b41f857bcc0$var$transitionCallbacks.clear();
        }
    };
    document.body.addEventListener('transitionrun', onTransitionStart);
    document.body.addEventListener('transitionend', onTransitionEnd);
}
if (typeof document !== 'undefined') {
    if (document.readyState !== 'loading') dist_module_$bbed8b41f857bcc0$var$setupGlobalEvents();
    else document.addEventListener('DOMContentLoaded', dist_module_$bbed8b41f857bcc0$var$setupGlobalEvents);
}
function dist_module_$bbed8b41f857bcc0$export$24490316f764c430(fn) {
    // Wait one frame to see if an animation starts, e.g. a transition on mount.
    requestAnimationFrame(()=>{
        // If no transitions are running, call the function immediately.
        // Otherwise, add it to a list of callbacks to run at the end of the animation.
        if (dist_module_$bbed8b41f857bcc0$var$transitionsByElement.size === 0) fn();
        else dist_module_$bbed8b41f857bcc0$var$transitionCallbacks.add(fn);
    });
}




// Keep track of elements that we are currently handling dragging for via useDrag1D.
// If there's an ancestor and a descendant both using useDrag1D(), and the user starts
// dragging the descendant, we don't want useDrag1D events to fire for the ancestor.
const dist_module_$9cc09df9fd7676be$var$draggingElements = (/* unused pure expression or super */ null && ([]));
function dist_module_$9cc09df9fd7676be$export$7bbed75feba39706(props) {
    console.warn('useDrag1D is deprecated, please use `useMove` instead https://react-spectrum.adobe.com/react-aria/useMove.html');
    let { containerRef: containerRef , reverse: reverse , orientation: orientation , onHover: onHover , onDrag: onDrag , onPositionChange: onPositionChange , onIncrement: onIncrement , onDecrement: onDecrement , onIncrementToMax: onIncrementToMax , onDecrementToMin: onDecrementToMin , onCollapseToggle: onCollapseToggle  } = props;
    let getPosition = (e)=>orientation === 'horizontal' ? e.clientX : e.clientY
    ;
    let getNextOffset = (e)=>{
        let containerOffset = dist_module_$ab71dadb03a6fb2e$export$622cea445a1c5b7d(containerRef.current, reverse, orientation);
        let mouseOffset = getPosition(e);
        let nextOffset = reverse ? containerOffset - mouseOffset : mouseOffset - containerOffset;
        return nextOffset;
    };
    let dragging = $12uGp$useRef(false);
    let prevPosition = $12uGp$useRef(0);
    // Keep track of the current handlers in a ref so that the events can access them.
    let handlers = $12uGp$useRef({
        onPositionChange: onPositionChange,
        onDrag: onDrag
    });
    handlers.current.onDrag = onDrag;
    handlers.current.onPositionChange = onPositionChange;
    let onMouseDragged = (e)=>{
        e.preventDefault();
        let nextOffset = getNextOffset(e);
        if (!dragging.current) {
            dragging.current = true;
            if (handlers.current.onDrag) handlers.current.onDrag(true);
            if (handlers.current.onPositionChange) handlers.current.onPositionChange(nextOffset);
        }
        if (prevPosition.current === nextOffset) return;
        prevPosition.current = nextOffset;
        if (onPositionChange) onPositionChange(nextOffset);
    };
    let onMouseUp = (e)=>{
        const target = e.target;
        dragging.current = false;
        let nextOffset = getNextOffset(e);
        if (handlers.current.onDrag) handlers.current.onDrag(false);
        if (handlers.current.onPositionChange) handlers.current.onPositionChange(nextOffset);
        dist_module_$9cc09df9fd7676be$var$draggingElements.splice(dist_module_$9cc09df9fd7676be$var$draggingElements.indexOf(target), 1);
        window.removeEventListener('mouseup', onMouseUp, false);
        window.removeEventListener('mousemove', onMouseDragged, false);
    };
    let onMouseDown = (e)=>{
        const target = e.currentTarget;
        // If we're already handling dragging on a descendant with useDrag1D, then
        // we don't want to handle the drag motion on this target as well.
        if (dist_module_$9cc09df9fd7676be$var$draggingElements.some((elt)=>target.contains(elt)
        )) return;
        dist_module_$9cc09df9fd7676be$var$draggingElements.push(target);
        window.addEventListener('mousemove', onMouseDragged, false);
        window.addEventListener('mouseup', onMouseUp, false);
    };
    let onMouseEnter = ()=>{
        if (onHover) onHover(true);
    };
    let onMouseOut = ()=>{
        if (onHover) onHover(false);
    };
    let onKeyDown = (e)=>{
        switch(e.key){
            case 'Left':
            case 'ArrowLeft':
                if (orientation === 'horizontal') {
                    e.preventDefault();
                    if (onDecrement && !reverse) onDecrement();
                    else if (onIncrement && reverse) onIncrement();
                }
                break;
            case 'Up':
            case 'ArrowUp':
                if (orientation === 'vertical') {
                    e.preventDefault();
                    if (onDecrement && !reverse) onDecrement();
                    else if (onIncrement && reverse) onIncrement();
                }
                break;
            case 'Right':
            case 'ArrowRight':
                if (orientation === 'horizontal') {
                    e.preventDefault();
                    if (onIncrement && !reverse) onIncrement();
                    else if (onDecrement && reverse) onDecrement();
                }
                break;
            case 'Down':
            case 'ArrowDown':
                if (orientation === 'vertical') {
                    e.preventDefault();
                    if (onIncrement && !reverse) onIncrement();
                    else if (onDecrement && reverse) onDecrement();
                }
                break;
            case 'Home':
                e.preventDefault();
                if (onDecrementToMin) onDecrementToMin();
                break;
            case 'End':
                e.preventDefault();
                if (onIncrementToMax) onIncrementToMax();
                break;
            case 'Enter':
                e.preventDefault();
                if (onCollapseToggle) onCollapseToggle();
                break;
        }
    };
    return {
        onMouseDown: onMouseDown,
        onMouseEnter: onMouseEnter,
        onMouseOut: onMouseOut,
        onKeyDown: onKeyDown
    };
}



function dist_module_$03deb23ff14920c4$export$4eaf04e54aa8eed6() {
    let globalListeners = $12uGp$useRef(new Map());
    let addGlobalListener = $12uGp$useCallback((eventTarget, type, listener, options)=>{
        // Make sure we remove the listener after it is called with the `once` option.
        let fn = (options === null || options === void 0 ? void 0 : options.once) ? (...args)=>{
            globalListeners.current.delete(listener);
            listener(...args);
        } : listener;
        globalListeners.current.set(listener, {
            type: type,
            eventTarget: eventTarget,
            fn: fn,
            options: options
        });
        eventTarget.addEventListener(type, listener, options);
    }, []);
    let removeGlobalListener = $12uGp$useCallback((eventTarget, type, listener, options)=>{
        var ref;
        let fn = ((ref = globalListeners.current.get(listener)) === null || ref === void 0 ? void 0 : ref.fn) || listener;
        eventTarget.removeEventListener(type, fn, options);
        globalListeners.current.delete(listener);
    }, []);
    let removeAllGlobalListeners = $12uGp$useCallback(()=>{
        globalListeners.current.forEach((value, key)=>{
            removeGlobalListener(value.eventTarget, value.type, key, value.options);
        });
    }, [
        removeGlobalListener
    ]);
    // eslint-disable-next-line arrow-body-style
    $12uGp$useEffect(()=>{
        return removeAllGlobalListeners;
    }, [
        removeAllGlobalListeners
    ]);
    return {
        addGlobalListener: addGlobalListener,
        removeGlobalListener: removeGlobalListener,
        removeAllGlobalListeners: removeAllGlobalListeners
    };
}



function dist_module_$313b98861ee5dd6c$export$d6875122194c7b44(props, defaultLabel) {
    let { id: id , 'aria-label': label , 'aria-labelledby': labelledBy  } = props;
    // If there is both an aria-label and aria-labelledby,
    // combine them by pointing to the element itself.
    id = dist_module_$bdb11010cef70236$export$f680877a34711e37(id);
    if (labelledBy && label) {
        let ids = new Set([
            ...labelledBy.trim().split(/\s+/),
            id
        ]);
        labelledBy = [
            ...ids
        ].join(' ');
    } else if (labelledBy) labelledBy = labelledBy.trim().split(/\s+/).join(' ');
    // If no labels are provided, use the default
    if (!label && !labelledBy && defaultLabel) label = defaultLabel;
    return {
        id: id,
        'aria-label': label,
        'aria-labelledby': labelledBy
    };
}




function dist_module_$df56164dff5785e2$export$4338b53315abf666(forwardedRef) {
    const objRef = $12uGp$useRef();
    /**
   * We're using `useLayoutEffect` here instead of `useEffect` because we want
   * to make sure that the `ref` value is up to date before other places in the
   * the execution cycle try to read it.
   */ dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        if (!forwardedRef) return;
        if (typeof forwardedRef === 'function') forwardedRef(objRef.current);
        else forwardedRef.current = objRef.current;
    }, [
        forwardedRef
    ]);
    return objRef;
}



function dist_module_$4f58c5f72bcf79f7$export$496315a1608d9602(effect, dependencies) {
    const isInitialMount = $12uGp$useRef(true);
    $12uGp$useEffect(()=>{
        if (isInitialMount.current) isInitialMount.current = false;
        else effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
}




function dist_module_$9daab02d461809db$var$hasResizeObserver() {
    return typeof window.ResizeObserver !== 'undefined';
}
function dist_module_$9daab02d461809db$export$683480f191c0e3ea(options) {
    const { ref: ref , onResize: onResize  } = options;
    $12uGp$useEffect(()=>{
        let element = ref === null || ref === void 0 ? void 0 : ref.current;
        if (!element) return;
        if (!dist_module_$9daab02d461809db$var$hasResizeObserver()) {
            window.addEventListener('resize', onResize, false);
            return ()=>{
                window.removeEventListener('resize', onResize, false);
            };
        } else {
            const resizeObserverInstance = new window.ResizeObserver((entries)=>{
                if (!entries.length) return;
                onResize();
            });
            resizeObserverInstance.observe(element);
            return ()=>{
                if (element) resizeObserverInstance.unobserve(element);
            };
        }
    }, [
        onResize,
        ref
    ]);
}



function dist_module_$e7801be82b4b2a53$export$4debdb1a3f0fa79e(context, ref) {
    dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        if (context && context.ref && ref) {
            context.ref.current = ref.current;
            return ()=>{
                context.ref.current = null;
            };
        }
    }, [
        context,
        ref
    ]);
}


function dist_module_$62d8ded9296f3872$export$cfa2225e87938781(node) {
    while(node && !dist_module_$62d8ded9296f3872$var$isScrollable(node))node = node.parentElement;
    return node || document.scrollingElement || document.documentElement;
}
function dist_module_$62d8ded9296f3872$var$isScrollable(node) {
    let style = window.getComputedStyle(node);
    return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}



// @ts-ignore
let dist_module_$5df64b3807dc15ee$var$visualViewport = typeof window !== 'undefined' && window.visualViewport;
function dist_module_$5df64b3807dc15ee$export$d699905dd57c73ca() {
    let [size1, setSize] = $12uGp$useState(()=>dist_module_$5df64b3807dc15ee$var$getViewportSize()
    );
    $12uGp$useEffect(()=>{
        // Use visualViewport api to track available height even on iOS virtual keyboard opening
        let onResize = ()=>{
            setSize((size)=>{
                let newSize = dist_module_$5df64b3807dc15ee$var$getViewportSize();
                if (newSize.width === size.width && newSize.height === size.height) return size;
                return newSize;
            });
        };
        if (!dist_module_$5df64b3807dc15ee$var$visualViewport) window.addEventListener('resize', onResize);
        else dist_module_$5df64b3807dc15ee$var$visualViewport.addEventListener('resize', onResize);
        return ()=>{
            if (!dist_module_$5df64b3807dc15ee$var$visualViewport) window.removeEventListener('resize', onResize);
            else dist_module_$5df64b3807dc15ee$var$visualViewport.removeEventListener('resize', onResize);
        };
    }, []);
    return size1;
}
function dist_module_$5df64b3807dc15ee$var$getViewportSize() {
    return {
        width: (dist_module_$5df64b3807dc15ee$var$visualViewport === null || dist_module_$5df64b3807dc15ee$var$visualViewport === void 0 ? void 0 : dist_module_$5df64b3807dc15ee$var$visualViewport.width) || window.innerWidth,
        height: (dist_module_$5df64b3807dc15ee$var$visualViewport === null || dist_module_$5df64b3807dc15ee$var$visualViewport === void 0 ? void 0 : dist_module_$5df64b3807dc15ee$var$visualViewport.height) || window.innerHeight
    };
}




let dist_module_$ef06256079686ba0$var$descriptionId = 0;
const dist_module_$ef06256079686ba0$var$descriptionNodes = new Map();
function dist_module_$ef06256079686ba0$export$f8aeda7b10753fa1(description) {
    let [id1, setId] = $12uGp$useState(undefined);
    dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        if (!description) return;
        let desc = dist_module_$ef06256079686ba0$var$descriptionNodes.get(description);
        if (!desc) {
            let id = `react-aria-description-${dist_module_$ef06256079686ba0$var$descriptionId++}`;
            setId(id);
            let node = document.createElement('div');
            node.id = id;
            node.style.display = 'none';
            node.textContent = description;
            document.body.appendChild(node);
            desc = {
                refCount: 0,
                element: node
            };
            dist_module_$ef06256079686ba0$var$descriptionNodes.set(description, desc);
        } else setId(desc.element.id);
        desc.refCount++;
        return ()=>{
            if (--desc.refCount === 0) {
                desc.element.remove();
                dist_module_$ef06256079686ba0$var$descriptionNodes.delete(description);
            }
        };
    }, [
        description
    ]);
    return {
        'aria-describedby': description ? id1 : undefined
    };
}


/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ function dist_module_$c87311424ea30a05$var$testUserAgent(re) {
    var ref;
    if (typeof window === 'undefined' || window.navigator == null) return false;
    return ((ref = window.navigator['userAgentData']) === null || ref === void 0 ? void 0 : ref.brands.some((brand)=>re.test(brand.brand)
    )) || re.test(window.navigator.userAgent);
}
function dist_module_$c87311424ea30a05$var$testPlatform(re) {
    var ref;
    return typeof window !== 'undefined' && window.navigator != null ? re.test(((ref = window.navigator['userAgentData']) === null || ref === void 0 ? void 0 : ref.platform) || window.navigator.platform) : false;
}
function dist_module_$c87311424ea30a05$export$9ac100e40613ea10() {
    return dist_module_$c87311424ea30a05$var$testPlatform(/^Mac/i);
}
function dist_module_$c87311424ea30a05$export$186c6964ca17d99() {
    return dist_module_$c87311424ea30a05$var$testPlatform(/^iPhone/i);
}
function dist_module_$c87311424ea30a05$export$7bef049ce92e4224() {
    return dist_module_$c87311424ea30a05$var$testPlatform(/^iPad/i) || dist_module_$c87311424ea30a05$export$9ac100e40613ea10() && navigator.maxTouchPoints > 1;
}
function dist_module_$c87311424ea30a05$export$fedb369cb70207f1() {
    return dist_module_$c87311424ea30a05$export$186c6964ca17d99() || dist_module_$c87311424ea30a05$export$7bef049ce92e4224();
}
function dist_module_$c87311424ea30a05$export$e1865c3bedcd822b() {
    return dist_module_$c87311424ea30a05$export$9ac100e40613ea10() || dist_module_$c87311424ea30a05$export$fedb369cb70207f1();
}
function dist_module_$c87311424ea30a05$export$78551043582a6a98() {
    return dist_module_$c87311424ea30a05$var$testUserAgent(/AppleWebKit/i) && !dist_module_$c87311424ea30a05$export$6446a186d09e379e();
}
function dist_module_$c87311424ea30a05$export$6446a186d09e379e() {
    return dist_module_$c87311424ea30a05$var$testUserAgent(/Chrome/i);
}
function dist_module_$c87311424ea30a05$export$a11b0059900ceec8() {
    return dist_module_$c87311424ea30a05$var$testUserAgent(/Android/i);
}



function dist_module_$e9faafb641e167db$export$90fc3a17d93f704c(ref, event, handler1, options) {
    let handlerRef = $12uGp$useRef(handler1);
    handlerRef.current = handler1;
    let isDisabled = handler1 == null;
    $12uGp$useEffect(()=>{
        if (isDisabled) return;
        let element = ref.current;
        let handler = (e)=>handlerRef.current.call(this, e)
        ;
        element.addEventListener(event, handler, options);
        return ()=>{
            element.removeEventListener(event, handler, options);
        };
    }, [
        ref,
        event,
        options,
        isDisabled
    ]);
}




function dist_module_$1dbecbe27a04f9af$export$14d238f342723f25(defaultValue) {
    let [value, setValue] = $12uGp$useState(defaultValue);
    let valueRef = $12uGp$useRef(value);
    let effect = $12uGp$useRef(null);
    valueRef.current = value;
    // Store the function in a ref so we can always access the current version
    // which has the proper `value` in scope.
    let nextRef = $12uGp$useRef(null);
    nextRef.current = ()=>{
        // Run the generator to the next yield.
        let newValue = effect.current.next();
        // If the generator is done, reset the effect.
        if (newValue.done) {
            effect.current = null;
            return;
        }
        // If the value is the same as the current value,
        // then continue to the next yield. Otherwise,
        // set the value in state and wait for the next layout effect.
        if (value === newValue.value) nextRef.current();
        else setValue(newValue.value);
    };
    dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        // If there is an effect currently running, continue to the next yield.
        if (effect.current) nextRef.current();
    });
    let queue = $12uGp$useCallback((fn)=>{
        effect.current = fn(valueRef.current);
        nextRef.current();
    }, [
        effect,
        nextRef
    ]);
    return [
        value,
        queue
    ];
}


function dist_module_$2f04cbc44ee30ce0$export$53a0910f038337bd(scrollView, element) {
    let offsetX = dist_module_$2f04cbc44ee30ce0$var$relativeOffset(scrollView, element, 'left');
    let offsetY = dist_module_$2f04cbc44ee30ce0$var$relativeOffset(scrollView, element, 'top');
    let width = element.offsetWidth;
    let height = element.offsetHeight;
    let x = scrollView.scrollLeft;
    let y = scrollView.scrollTop;
    let maxX = x + scrollView.offsetWidth;
    let maxY = y + scrollView.offsetHeight;
    if (offsetX <= x) x = offsetX;
    else if (offsetX + width > maxX) x += offsetX + width - maxX;
    if (offsetY <= y) y = offsetY;
    else if (offsetY + height > maxY) y += offsetY + height - maxY;
    scrollView.scrollLeft = x;
    scrollView.scrollTop = y;
}
/**
 * Computes the offset left or top from child to ancestor by accumulating
 * offsetLeft or offsetTop through intervening offsetParents.
 */ function dist_module_$2f04cbc44ee30ce0$var$relativeOffset(ancestor, child, axis) {
    const prop = axis === 'left' ? 'offsetLeft' : 'offsetTop';
    let sum = 0;
    while(child.offsetParent){
        sum += child[prop];
        if (child.offsetParent === ancestor) break;
        else if (child.offsetParent.contains(ancestor)) {
            // If the ancestor is not `position:relative`, then we stop at
            // _its_ offset parent, and we subtract off _its_ offset, so that
            // we end up with the proper offset from child to ancestor.
            sum -= ancestor[prop];
            break;
        }
        child = child.offsetParent;
    }
    return sum;
}




function dist_module_$6a7db85432448f7f$export$60278871457622de(event) {
    // JAWS/NVDA with Firefox.
    if (event.mozInputSource === 0 && event.isTrusted) return true;
    // Android TalkBack's detail value varies depending on the event listener providing the event so we have specific logic here instead
    // If pointerType is defined, event is from a click listener. For events from mousedown listener, detail === 0 is a sufficient check
    // to detect TalkBack virtual clicks.
    if (dist_module_$c87311424ea30a05$export$a11b0059900ceec8() && event.pointerType) return event.type === 'click' && event.buttons === 1;
    return event.detail === 0 && !event.pointerType;
}
function dist_module_$6a7db85432448f7f$export$29bf1b5f2c56cf63(event) {
    // If the pointer size is zero, then we assume it's from a screen reader.
    // Android TalkBack double tap will sometimes return a event with width and height of 1
    // and pointerType === 'mouse' so we need to check for a specific combination of event attributes.
    // Cannot use "event.pressure === 0" as the sole check due to Safari pointer events always returning pressure === 0
    // instead of .5, see https://bugs.webkit.org/show_bug.cgi?id=206216. event.pointerType === 'mouse' is to distingush
    // Talkback double tap from Windows Firefox touch screen press
    return event.width === 0 && event.height === 0 || event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === 'mouse';
}





//# sourceMappingURL=module.js.map

;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/node_modules/@react-aria/interactions/dist/module.js





// Note that state only matters here for iOS. Non-iOS gets user-select: none applied to the target element
// rather than at the document level so we just need to apply/remove user-select: none for each pressed element individually
let dist_module_$14c0b72509d70225$var$state = 'default';
let dist_module_$14c0b72509d70225$var$savedUserSelect = '';
let dist_module_$14c0b72509d70225$var$modifiedElementMap = new WeakMap();
function dist_module_$14c0b72509d70225$export$16a4697467175487(target) {
    if ($bx7SL$isIOS()) {
        if (dist_module_$14c0b72509d70225$var$state === 'default') {
            dist_module_$14c0b72509d70225$var$savedUserSelect = document.documentElement.style.webkitUserSelect;
            document.documentElement.style.webkitUserSelect = 'none';
        }
        dist_module_$14c0b72509d70225$var$state = 'disabled';
    } else if (target instanceof HTMLElement || target instanceof SVGElement) {
        // If not iOS, store the target's original user-select and change to user-select: none
        // Ignore state since it doesn't apply for non iOS
        dist_module_$14c0b72509d70225$var$modifiedElementMap.set(target, target.style.userSelect);
        target.style.userSelect = 'none';
    }
}
function dist_module_$14c0b72509d70225$export$b0d6fa1ab32e3295(target) {
    if ($bx7SL$isIOS()) {
        // If the state is already default, there's nothing to do.
        // If it is restoring, then there's no need to queue a second restore.
        if (dist_module_$14c0b72509d70225$var$state !== 'disabled') return;
        dist_module_$14c0b72509d70225$var$state = 'restoring';
        // There appears to be a delay on iOS where selection still might occur
        // after pointer up, so wait a bit before removing user-select.
        setTimeout(()=>{
            // Wait for any CSS transitions to complete so we don't recompute style
            // for the whole page in the middle of the animation and cause jank.
            $bx7SL$runAfterTransition(()=>{
                // Avoid race conditions
                if (dist_module_$14c0b72509d70225$var$state === 'restoring') {
                    if (document.documentElement.style.webkitUserSelect === 'none') document.documentElement.style.webkitUserSelect = dist_module_$14c0b72509d70225$var$savedUserSelect || '';
                    dist_module_$14c0b72509d70225$var$savedUserSelect = '';
                    dist_module_$14c0b72509d70225$var$state = 'default';
                }
            });
        }, 300);
    } else if (target instanceof HTMLElement || target instanceof SVGElement) // If not iOS, restore the target's original user-select if any
    // Ignore state since it doesn't apply for non iOS
    {
        if (target && dist_module_$14c0b72509d70225$var$modifiedElementMap.has(target)) {
            let targetOldUserSelect = dist_module_$14c0b72509d70225$var$modifiedElementMap.get(target);
            if (target.style.userSelect === 'none') target.style.userSelect = targetOldUserSelect;
            if (target.getAttribute('style') === '') target.removeAttribute('style');
            dist_module_$14c0b72509d70225$var$modifiedElementMap.delete(target);
        }
    }
}





function $8a9cb279dc87e130$export$60278871457622de(event) {
    // JAWS/NVDA with Firefox.
    if (event.mozInputSource === 0 && event.isTrusted) return true;
    return event.detail === 0 && !event.pointerType;
}
class dist_module_$8a9cb279dc87e130$export$905e7fc544a71f36 {
    isDefaultPrevented() {
        return this.nativeEvent.defaultPrevented;
    }
    preventDefault() {
        this.defaultPrevented = true;
        this.nativeEvent.preventDefault();
    }
    stopPropagation() {
        this.nativeEvent.stopPropagation();
        this.isPropagationStopped = ()=>true
        ;
    }
    isPropagationStopped() {
        return false;
    }
    persist() {
    }
    constructor(type, nativeEvent){
        this.nativeEvent = nativeEvent;
        this.target = nativeEvent.target;
        this.currentTarget = nativeEvent.currentTarget;
        this.relatedTarget = nativeEvent.relatedTarget;
        this.bubbles = nativeEvent.bubbles;
        this.cancelable = nativeEvent.cancelable;
        this.defaultPrevented = nativeEvent.defaultPrevented;
        this.eventPhase = nativeEvent.eventPhase;
        this.isTrusted = nativeEvent.isTrusted;
        this.timeStamp = nativeEvent.timeStamp;
        this.type = type;
    }
}
function dist_module_$8a9cb279dc87e130$export$715c682d09d639cc(onBlur) {
    let stateRef = $bx7SL$useRef({
        isFocused: false,
        onBlur: onBlur,
        observer: null
    });
    stateRef.current.onBlur = onBlur;
    // Clean up MutationObserver on unmount. See below.
    // eslint-disable-next-line arrow-body-style
    $bx7SL$useLayoutEffect(()=>{
        const state = stateRef.current;
        return ()=>{
            if (state.observer) {
                state.observer.disconnect();
                state.observer = null;
            }
        };
    }, []);
    // This function is called during a React onFocus event.
    return $bx7SL$useCallback((e1)=>{
        // React does not fire onBlur when an element is disabled. https://github.com/facebook/react/issues/9142
        // Most browsers fire a native focusout event in this case, except for Firefox. In that case, we use a
        // MutationObserver to watch for the disabled attribute, and dispatch these events ourselves.
        // For browsers that do, focusout fires before the MutationObserver, so onBlur should not fire twice.
        if (e1.target instanceof HTMLButtonElement || e1.target instanceof HTMLInputElement || e1.target instanceof HTMLTextAreaElement || e1.target instanceof HTMLSelectElement) {
            stateRef.current.isFocused = true;
            let target = e1.target;
            let onBlurHandler = (e)=>{
                var // For backward compatibility, dispatch a (fake) React synthetic event.
                _current, ref;
                stateRef.current.isFocused = false;
                if (target.disabled) (ref = (_current = stateRef.current).onBlur) === null || ref === void 0 ? void 0 : ref.call(_current, new dist_module_$8a9cb279dc87e130$export$905e7fc544a71f36('blur', e));
                // We no longer need the MutationObserver once the target is blurred.
                if (stateRef.current.observer) {
                    stateRef.current.observer.disconnect();
                    stateRef.current.observer = null;
                }
            };
            target.addEventListener('focusout', onBlurHandler, {
                once: true
            });
            stateRef.current.observer = new MutationObserver(()=>{
                if (stateRef.current.isFocused && target.disabled) {
                    stateRef.current.observer.disconnect();
                    target.dispatchEvent(new FocusEvent('blur'));
                    target.dispatchEvent(new FocusEvent('focusout', {
                        bubbles: true
                    }));
                }
            });
            stateRef.current.observer.observe(target, {
                attributes: true,
                attributeFilter: [
                    'disabled'
                ]
            });
        }
    }, []);
}



const dist_module_$ae1eeba8b9eafd08$export$5165eccb35aaadb5 = react.createContext(null);
dist_module_$ae1eeba8b9eafd08$export$5165eccb35aaadb5.displayName = 'PressResponderContext';



function dist_module_$f6c31cce2adf654f$var$usePressResponderContext(props) {
    // Consume context from <PressResponder> and merge with props.
    let context = $bx7SL$useContext(dist_module_$ae1eeba8b9eafd08$export$5165eccb35aaadb5);
    if (context) {
        let { register: register , ...contextProps } = context;
        props = $bx7SL$mergeProps(contextProps, props);
        register();
    }
    $bx7SL$useSyncRef(context, props.ref);
    return props;
}
function dist_module_$f6c31cce2adf654f$export$45712eceda6fad21(props) {
    let { onPress: onPress1 , onPressChange: onPressChange1 , onPressStart: onPressStart1 , onPressEnd: onPressEnd1 , onPressUp: onPressUp1 , isDisabled: isDisabled1 , isPressed: isPressedProp , preventFocusOnPress: preventFocusOnPress , shouldCancelOnPointerExit: shouldCancelOnPointerExit , allowTextSelectionOnPress: allowTextSelectionOnPress , // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref: _ , ...domProps } = dist_module_$f6c31cce2adf654f$var$usePressResponderContext(props);
    let propsRef = $bx7SL$useRef(null);
    propsRef.current = {
        onPress: onPress1,
        onPressChange: onPressChange1,
        onPressStart: onPressStart1,
        onPressEnd: onPressEnd1,
        onPressUp: onPressUp1,
        isDisabled: isDisabled1,
        shouldCancelOnPointerExit: shouldCancelOnPointerExit
    };
    let [isPressed, setPressed] = $bx7SL$useState(false);
    let ref = $bx7SL$useRef({
        isPressed: false,
        ignoreEmulatedMouseEvents: false,
        ignoreClickAfterPress: false,
        didFirePressStart: false,
        activePointerId: null,
        target: null,
        isOverTarget: false,
        pointerType: null
    });
    let { addGlobalListener: addGlobalListener , removeAllGlobalListeners: removeAllGlobalListeners  } = $bx7SL$useGlobalListeners();
    let pressProps1 = $bx7SL$useMemo(()=>{
        let state = ref.current;
        let triggerPressStart = (originalEvent, pointerType)=>{
            let { onPressStart: onPressStart , onPressChange: onPressChange , isDisabled: isDisabled  } = propsRef.current;
            if (isDisabled || state.didFirePressStart) return;
            if (onPressStart) onPressStart({
                type: 'pressstart',
                pointerType: pointerType,
                target: originalEvent.currentTarget,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
            if (onPressChange) onPressChange(true);
            state.didFirePressStart = true;
            setPressed(true);
        };
        let triggerPressEnd = (originalEvent, pointerType, wasPressed = true)=>{
            let { onPressEnd: onPressEnd , onPressChange: onPressChange , onPress: onPress , isDisabled: isDisabled  } = propsRef.current;
            if (!state.didFirePressStart) return;
            state.ignoreClickAfterPress = true;
            state.didFirePressStart = false;
            if (onPressEnd) onPressEnd({
                type: 'pressend',
                pointerType: pointerType,
                target: originalEvent.currentTarget,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
            if (onPressChange) onPressChange(false);
            setPressed(false);
            if (onPress && wasPressed && !isDisabled) onPress({
                type: 'press',
                pointerType: pointerType,
                target: originalEvent.currentTarget,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
        };
        let triggerPressUp = (originalEvent, pointerType)=>{
            let { onPressUp: onPressUp , isDisabled: isDisabled  } = propsRef.current;
            if (isDisabled) return;
            if (onPressUp) onPressUp({
                type: 'pressup',
                pointerType: pointerType,
                target: originalEvent.currentTarget,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
        };
        let cancel = (e)=>{
            if (state.isPressed) {
                if (state.isOverTarget) triggerPressEnd(dist_module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
                state.isPressed = false;
                state.isOverTarget = false;
                state.activePointerId = null;
                state.pointerType = null;
                removeAllGlobalListeners();
                if (!allowTextSelectionOnPress) dist_module_$14c0b72509d70225$export$b0d6fa1ab32e3295(state.target);
            }
        };
        let pressProps = {
            onKeyDown (e) {
                if (dist_module_$f6c31cce2adf654f$var$isValidKeyboardEvent(e.nativeEvent) && e.currentTarget.contains(e.target)) {
                    if (dist_module_$f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(e.target)) e.preventDefault();
                    e.stopPropagation();
                    // If the event is repeating, it may have started on a different element
                    // after which focus moved to the current element. Ignore these events and
                    // only handle the first key down event.
                    if (!state.isPressed && !e.repeat) {
                        state.target = e.currentTarget;
                        state.isPressed = true;
                        triggerPressStart(e, 'keyboard');
                        // Focus may move before the key up event, so register the event on the document
                        // instead of the same element where the key down event occurred.
                        addGlobalListener(document, 'keyup', onKeyUp, false);
                    }
                }
            },
            onKeyUp (e) {
                if (dist_module_$f6c31cce2adf654f$var$isValidKeyboardEvent(e.nativeEvent) && !e.repeat && e.currentTarget.contains(e.target)) triggerPressUp(dist_module_$f6c31cce2adf654f$var$createEvent(state.target, e), 'keyboard');
            },
            onClick (e) {
                if (e && !e.currentTarget.contains(e.target)) return;
                if (e && e.button === 0) {
                    e.stopPropagation();
                    if (isDisabled1) e.preventDefault();
                    // If triggered from a screen reader or by using element.click(),
                    // trigger as if it were a keyboard click.
                    if (!state.ignoreClickAfterPress && !state.ignoreEmulatedMouseEvents && (state.pointerType === 'virtual' || $8a9cb279dc87e130$export$60278871457622de(e.nativeEvent))) {
                        // Ensure the element receives focus (VoiceOver on iOS does not do this)
                        if (!isDisabled1 && !preventFocusOnPress) $bx7SL$focusWithoutScrolling(e.currentTarget);
                        triggerPressStart(e, 'virtual');
                        triggerPressUp(e, 'virtual');
                        triggerPressEnd(e, 'virtual');
                    }
                    state.ignoreEmulatedMouseEvents = false;
                    state.ignoreClickAfterPress = false;
                }
            }
        };
        let onKeyUp = (e)=>{
            if (state.isPressed && dist_module_$f6c31cce2adf654f$var$isValidKeyboardEvent(e)) {
                if (dist_module_$f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(e.target)) e.preventDefault();
                e.stopPropagation();
                state.isPressed = false;
                let target = e.target;
                triggerPressEnd(dist_module_$f6c31cce2adf654f$var$createEvent(state.target, e), 'keyboard', state.target.contains(target));
                removeAllGlobalListeners();
                // If the target is a link, trigger the click method to open the URL,
                // but defer triggering pressEnd until onClick event handler.
                if (state.target instanceof HTMLElement && (state.target.contains(target) && dist_module_$f6c31cce2adf654f$var$isHTMLAnchorLink(state.target) || state.target.getAttribute('role') === 'link')) state.target.click();
            }
        };
        if (typeof PointerEvent !== 'undefined') {
            pressProps.onPointerDown = (e)=>{
                // Only handle left clicks, and ignore events that bubbled through portals.
                if (e.button !== 0 || !e.currentTarget.contains(e.target)) return;
                // iOS safari fires pointer events from VoiceOver with incorrect coordinates/target.
                // Ignore and let the onClick handler take care of it instead.
                // https://bugs.webkit.org/show_bug.cgi?id=222627
                // https://bugs.webkit.org/show_bug.cgi?id=223202
                if ($f6c31cce2adf654f$var$isVirtualPointerEvent(e.nativeEvent)) {
                    state.pointerType = 'virtual';
                    return;
                }
                // Due to browser inconsistencies, especially on mobile browsers, we prevent
                // default on pointer down and handle focusing the pressable element ourselves.
                if (dist_module_$f6c31cce2adf654f$var$shouldPreventDefault(e.currentTarget)) e.preventDefault();
                state.pointerType = e.pointerType;
                e.stopPropagation();
                if (!state.isPressed) {
                    state.isPressed = true;
                    state.isOverTarget = true;
                    state.activePointerId = e.pointerId;
                    state.target = e.currentTarget;
                    if (!isDisabled1 && !preventFocusOnPress) $bx7SL$focusWithoutScrolling(e.currentTarget);
                    if (!allowTextSelectionOnPress) dist_module_$14c0b72509d70225$export$16a4697467175487(state.target);
                    triggerPressStart(e, state.pointerType);
                    addGlobalListener(document, 'pointermove', onPointerMove, false);
                    addGlobalListener(document, 'pointerup', onPointerUp, false);
                    addGlobalListener(document, 'pointercancel', onPointerCancel, false);
                }
            };
            pressProps.onMouseDown = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                if (e.button === 0) {
                    // Chrome and Firefox on touch Windows devices require mouse down events
                    // to be canceled in addition to pointer events, or an extra asynchronous
                    // focus event will be fired.
                    if (dist_module_$f6c31cce2adf654f$var$shouldPreventDefault(e.currentTarget)) e.preventDefault();
                    e.stopPropagation();
                }
            };
            pressProps.onPointerUp = (e)=>{
                // iOS fires pointerup with zero width and height, so check the pointerType recorded during pointerdown.
                if (!e.currentTarget.contains(e.target) || state.pointerType === 'virtual') return;
                // Only handle left clicks
                // Safari on iOS sometimes fires pointerup events, even
                // when the touch isn't over the target, so double check.
                if (e.button === 0 && dist_module_$f6c31cce2adf654f$var$isOverTarget(e, e.currentTarget)) triggerPressUp(e, state.pointerType || e.pointerType);
            };
            // Safari on iOS < 13.2 does not implement pointerenter/pointerleave events correctly.
            // Use pointer move events instead to implement our own hit testing.
            // See https://bugs.webkit.org/show_bug.cgi?id=199803
            let onPointerMove = (e)=>{
                if (e.pointerId !== state.activePointerId) return;
                if (dist_module_$f6c31cce2adf654f$var$isOverTarget(e, state.target)) {
                    if (!state.isOverTarget) {
                        state.isOverTarget = true;
                        triggerPressStart(dist_module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType);
                    }
                } else if (state.isOverTarget) {
                    state.isOverTarget = false;
                    triggerPressEnd(dist_module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
                    if (propsRef.current.shouldCancelOnPointerExit) cancel(e);
                }
            };
            let onPointerUp = (e)=>{
                if (e.pointerId === state.activePointerId && state.isPressed && e.button === 0) {
                    if (dist_module_$f6c31cce2adf654f$var$isOverTarget(e, state.target)) triggerPressEnd(dist_module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType);
                    else if (state.isOverTarget) triggerPressEnd(dist_module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
                    state.isPressed = false;
                    state.isOverTarget = false;
                    state.activePointerId = null;
                    state.pointerType = null;
                    removeAllGlobalListeners();
                    if (!allowTextSelectionOnPress) dist_module_$14c0b72509d70225$export$b0d6fa1ab32e3295(state.target);
                }
            };
            let onPointerCancel = (e)=>{
                cancel(e);
            };
            pressProps.onDragStart = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                // Safari does not call onPointerCancel when a drag starts, whereas Chrome and Firefox do.
                cancel(e);
            };
        } else {
            pressProps.onMouseDown = (e)=>{
                // Only handle left clicks
                if (e.button !== 0 || !e.currentTarget.contains(e.target)) return;
                // Due to browser inconsistencies, especially on mobile browsers, we prevent
                // default on mouse down and handle focusing the pressable element ourselves.
                if (dist_module_$f6c31cce2adf654f$var$shouldPreventDefault(e.currentTarget)) e.preventDefault();
                e.stopPropagation();
                if (state.ignoreEmulatedMouseEvents) return;
                state.isPressed = true;
                state.isOverTarget = true;
                state.target = e.currentTarget;
                state.pointerType = $8a9cb279dc87e130$export$60278871457622de(e.nativeEvent) ? 'virtual' : 'mouse';
                if (!isDisabled1 && !preventFocusOnPress) $bx7SL$focusWithoutScrolling(e.currentTarget);
                triggerPressStart(e, state.pointerType);
                addGlobalListener(document, 'mouseup', onMouseUp, false);
            };
            pressProps.onMouseEnter = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (state.isPressed && !state.ignoreEmulatedMouseEvents) {
                    state.isOverTarget = true;
                    triggerPressStart(e, state.pointerType);
                }
            };
            pressProps.onMouseLeave = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (state.isPressed && !state.ignoreEmulatedMouseEvents) {
                    state.isOverTarget = false;
                    triggerPressEnd(e, state.pointerType, false);
                    if (propsRef.current.shouldCancelOnPointerExit) cancel(e);
                }
            };
            pressProps.onMouseUp = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                if (!state.ignoreEmulatedMouseEvents && e.button === 0) triggerPressUp(e, state.pointerType);
            };
            let onMouseUp = (e)=>{
                // Only handle left clicks
                if (e.button !== 0) return;
                state.isPressed = false;
                removeAllGlobalListeners();
                if (state.ignoreEmulatedMouseEvents) {
                    state.ignoreEmulatedMouseEvents = false;
                    return;
                }
                if (dist_module_$f6c31cce2adf654f$var$isOverTarget(e, state.target)) triggerPressEnd(dist_module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType);
                else if (state.isOverTarget) triggerPressEnd(dist_module_$f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
                state.isOverTarget = false;
            };
            pressProps.onTouchStart = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                let touch = dist_module_$f6c31cce2adf654f$var$getTouchFromEvent(e.nativeEvent);
                if (!touch) return;
                state.activePointerId = touch.identifier;
                state.ignoreEmulatedMouseEvents = true;
                state.isOverTarget = true;
                state.isPressed = true;
                state.target = e.currentTarget;
                state.pointerType = 'touch';
                // Due to browser inconsistencies, especially on mobile browsers, we prevent default
                // on the emulated mouse event and handle focusing the pressable element ourselves.
                if (!isDisabled1 && !preventFocusOnPress) $bx7SL$focusWithoutScrolling(e.currentTarget);
                if (!allowTextSelectionOnPress) dist_module_$14c0b72509d70225$export$16a4697467175487(state.target);
                triggerPressStart(e, state.pointerType);
                addGlobalListener(window, 'scroll', onScroll, true);
            };
            pressProps.onTouchMove = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (!state.isPressed) return;
                let touch = dist_module_$f6c31cce2adf654f$var$getTouchById(e.nativeEvent, state.activePointerId);
                if (touch && dist_module_$f6c31cce2adf654f$var$isOverTarget(touch, e.currentTarget)) {
                    if (!state.isOverTarget) {
                        state.isOverTarget = true;
                        triggerPressStart(e, state.pointerType);
                    }
                } else if (state.isOverTarget) {
                    state.isOverTarget = false;
                    triggerPressEnd(e, state.pointerType, false);
                    if (propsRef.current.shouldCancelOnPointerExit) cancel(e);
                }
            };
            pressProps.onTouchEnd = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (!state.isPressed) return;
                let touch = dist_module_$f6c31cce2adf654f$var$getTouchById(e.nativeEvent, state.activePointerId);
                if (touch && dist_module_$f6c31cce2adf654f$var$isOverTarget(touch, e.currentTarget)) {
                    triggerPressUp(e, state.pointerType);
                    triggerPressEnd(e, state.pointerType);
                } else if (state.isOverTarget) triggerPressEnd(e, state.pointerType, false);
                state.isPressed = false;
                state.activePointerId = null;
                state.isOverTarget = false;
                state.ignoreEmulatedMouseEvents = true;
                if (!allowTextSelectionOnPress) dist_module_$14c0b72509d70225$export$b0d6fa1ab32e3295(state.target);
                removeAllGlobalListeners();
            };
            pressProps.onTouchCancel = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                e.stopPropagation();
                if (state.isPressed) cancel(e);
            };
            let onScroll = (e)=>{
                if (state.isPressed && e.target.contains(state.target)) cancel({
                    currentTarget: state.target,
                    shiftKey: false,
                    ctrlKey: false,
                    metaKey: false,
                    altKey: false
                });
            };
            pressProps.onDragStart = (e)=>{
                if (!e.currentTarget.contains(e.target)) return;
                cancel(e);
            };
        }
        return pressProps;
    }, [
        addGlobalListener,
        isDisabled1,
        preventFocusOnPress,
        removeAllGlobalListeners,
        allowTextSelectionOnPress
    ]);
    // Remove user-select: none in case component unmounts immediately after pressStart
    // eslint-disable-next-line arrow-body-style
    $bx7SL$useEffect(()=>{
        return ()=>{
            if (!allowTextSelectionOnPress) dist_module_$14c0b72509d70225$export$b0d6fa1ab32e3295(ref.current.target);
        };
    }, [
        allowTextSelectionOnPress
    ]);
    return {
        isPressed: isPressedProp || isPressed,
        pressProps: $bx7SL$mergeProps(domProps, pressProps1)
    };
}
function dist_module_$f6c31cce2adf654f$var$isHTMLAnchorLink(target) {
    return target.tagName === 'A' && target.hasAttribute('href');
}
function dist_module_$f6c31cce2adf654f$var$isValidKeyboardEvent(event) {
    const { key: key , code: code , target: target  } = event;
    const element = target;
    const { tagName: tagName , isContentEditable: isContentEditable  } = element;
    const role = element.getAttribute('role');
    // Accessibility for keyboards. Space and Enter only.
    // "Spacebar" is for IE 11
    return (key === 'Enter' || key === ' ' || key === 'Spacebar' || code === 'Space') && tagName !== 'INPUT' && tagName !== 'TEXTAREA' && isContentEditable !== true && (!dist_module_$f6c31cce2adf654f$var$isHTMLAnchorLink(element) || role === 'button' && key !== 'Enter') && // An element with role='link' should only trigger with Enter key
    !(role === 'link' && key !== 'Enter');
}
function dist_module_$f6c31cce2adf654f$var$getTouchFromEvent(event) {
    const { targetTouches: targetTouches  } = event;
    if (targetTouches.length > 0) return targetTouches[0];
    return null;
}
function dist_module_$f6c31cce2adf654f$var$getTouchById(event, pointerId) {
    const changedTouches = event.changedTouches;
    for(let i = 0; i < changedTouches.length; i++){
        const touch = changedTouches[i];
        if (touch.identifier === pointerId) return touch;
    }
    return null;
}
function dist_module_$f6c31cce2adf654f$var$createEvent(target, e) {
    return {
        currentTarget: target,
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey
    };
}
function dist_module_$f6c31cce2adf654f$var$getPointClientRect(point) {
    let offsetX = point.width / 2 || point.radiusX || 0;
    let offsetY = point.height / 2 || point.radiusY || 0;
    return {
        top: point.clientY - offsetY,
        right: point.clientX + offsetX,
        bottom: point.clientY + offsetY,
        left: point.clientX - offsetX
    };
}
function dist_module_$f6c31cce2adf654f$var$areRectanglesOverlapping(a, b) {
    // check if they cannot overlap on x axis
    if (a.left > b.right || b.left > a.right) return false;
    // check if they cannot overlap on y axis
    if (a.top > b.bottom || b.top > a.bottom) return false;
    return true;
}
function dist_module_$f6c31cce2adf654f$var$isOverTarget(point, target) {
    let rect = target.getBoundingClientRect();
    let pointRect = dist_module_$f6c31cce2adf654f$var$getPointClientRect(point);
    return dist_module_$f6c31cce2adf654f$var$areRectanglesOverlapping(rect, pointRect);
}
function dist_module_$f6c31cce2adf654f$var$shouldPreventDefault(target) {
    // We cannot prevent default if the target is a draggable element.
    return !(target instanceof HTMLElement) || !target.draggable;
}
function dist_module_$f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(target) {
    return !((target.tagName === 'INPUT' || target.tagName === 'BUTTON') && target.type === 'submit');
}
function $f6c31cce2adf654f$var$isVirtualPointerEvent(event) {
    // If the pointer size is zero, then we assume it's from a screen reader.
    // Android TalkBack double tap will sometimes return a event with width and height of 1
    // and pointerType === 'mouse' so we need to check for a specific combination of event attributes.
    // Cannot use "event.pressure === 0" as the sole check due to Safari pointer events always returning pressure === 0
    // instead of .5, see https://bugs.webkit.org/show_bug.cgi?id=206216. event.pointerType === 'mouse' is to distingush
    // Talkback double tap from Windows Firefox touch screen press
    return event.width === 0 && event.height === 0 || event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === 'mouse';
}



const dist_module_$3b117e43dc0ca95d$export$27c701ed9e449e99 = /*#__PURE__*/ (/* unused pure expression or super */ null && ($bx7SL$react.forwardRef(({ children: children , ...props }, ref)=>{
    let newRef = $bx7SL$useRef();
    ref = ref !== null && ref !== void 0 ? ref : newRef;
    let { pressProps: pressProps  } = dist_module_$f6c31cce2adf654f$export$45712eceda6fad21({
        ...props,
        ref: ref
    });
    let child = $bx7SL$react.Children.only(children);
    return(/*#__PURE__*/ $bx7SL$react.cloneElement(child, // @ts-ignore
    {
        ref: ref,
        ...$bx7SL$mergeProps(child.props, pressProps)
    }));
})));





const dist_module_$f1ab8c75478c6f73$export$3351871ee4b288b8 = /*#__PURE__*/ (/* unused pure expression or super */ null && ($bx7SL$react.forwardRef(({ children: children , ...props }, ref)=>{
    let isRegistered = $bx7SL$useRef(false);
    let prevContext = $bx7SL$useContext(dist_module_$ae1eeba8b9eafd08$export$5165eccb35aaadb5);
    let context = $bx7SL$mergeProps(prevContext || {
    }, {
        ...props,
        ref: ref || (prevContext === null || prevContext === void 0 ? void 0 : prevContext.ref),
        register () {
            isRegistered.current = true;
            if (prevContext) prevContext.register();
        }
    });
    $bx7SL$useSyncRef(prevContext, ref);
    $bx7SL$useEffect(()=>{
        if (!isRegistered.current) console.warn("A PressResponder was rendered without a pressable child. Either call the usePress hook, or wrap your DOM node with <Pressable> component.");
    }, []);
    return(/*#__PURE__*/ $bx7SL$react.createElement(dist_module_$ae1eeba8b9eafd08$export$5165eccb35aaadb5.Provider, {
        value: context
    }, children));
})));




function dist_module_$a1ea59d68270f0dd$export$f8168d8dd8fd66e6(props) {
    let { isDisabled: isDisabled , onFocus: onFocusProp , onBlur: onBlurProp , onFocusChange: onFocusChange  } = props;
    const onBlur = $bx7SL$useCallback((e)=>{
        if (e.target === e.currentTarget) {
            if (onBlurProp) onBlurProp(e);
            if (onFocusChange) onFocusChange(false);
            return true;
        }
    }, [
        onBlurProp,
        onFocusChange
    ]);
    const onSyntheticFocus = dist_module_$8a9cb279dc87e130$export$715c682d09d639cc(onBlur);
    const onFocus = $bx7SL$useCallback((e)=>{
        if (e.target === e.currentTarget) {
            if (onFocusProp) onFocusProp(e);
            if (onFocusChange) onFocusChange(true);
            onSyntheticFocus(e);
        }
    }, [
        onFocusChange,
        onFocusProp,
        onSyntheticFocus
    ]);
    return {
        focusProps: {
            onFocus: !isDisabled && (onFocusProp || onFocusChange || onBlurProp) ? onFocus : undefined,
            onBlur: !isDisabled && (onBlurProp || onFocusChange) ? onBlur : null
        }
    };
}





let dist_module_$507fabe10e71c6fb$var$currentModality = null;
let dist_module_$507fabe10e71c6fb$var$changeHandlers = new Set();
let dist_module_$507fabe10e71c6fb$var$hasSetupGlobalListeners = false;
let dist_module_$507fabe10e71c6fb$var$hasEventBeforeFocus = false;
let dist_module_$507fabe10e71c6fb$var$hasBlurredWindowRecently = false;
// Only Tab or Esc keys will make focus visible on text input elements
const dist_module_$507fabe10e71c6fb$var$FOCUS_VISIBLE_INPUT_KEYS = {
    Tab: true,
    Escape: true
};
function dist_module_$507fabe10e71c6fb$var$triggerChangeHandlers(modality, e) {
    for (let handler of dist_module_$507fabe10e71c6fb$var$changeHandlers)handler(modality, e);
}
/**
 * Helper function to determine if a KeyboardEvent is unmodified and could make keyboard focus styles visible.
 */ function dist_module_$507fabe10e71c6fb$var$isValidKey(e) {
    // Control and Shift keys trigger when navigating back to the tab with keyboard.
    return !(e.metaKey || !dist_module_$c87311424ea30a05$export$9ac100e40613ea10() && e.altKey || e.ctrlKey || e.key === 'Control' || e.key === 'Shift' || e.key === 'Meta');
}
function dist_module_$507fabe10e71c6fb$var$handleKeyboardEvent(e) {
    dist_module_$507fabe10e71c6fb$var$hasEventBeforeFocus = true;
    if (dist_module_$507fabe10e71c6fb$var$isValidKey(e)) {
        dist_module_$507fabe10e71c6fb$var$currentModality = 'keyboard';
        dist_module_$507fabe10e71c6fb$var$triggerChangeHandlers('keyboard', e);
    }
}
function dist_module_$507fabe10e71c6fb$var$handlePointerEvent(e) {
    dist_module_$507fabe10e71c6fb$var$currentModality = 'pointer';
    if (e.type === 'mousedown' || e.type === 'pointerdown') {
        dist_module_$507fabe10e71c6fb$var$hasEventBeforeFocus = true;
        dist_module_$507fabe10e71c6fb$var$triggerChangeHandlers('pointer', e);
    }
}
function dist_module_$507fabe10e71c6fb$var$handleClickEvent(e) {
    if ($8a9cb279dc87e130$export$60278871457622de(e)) {
        dist_module_$507fabe10e71c6fb$var$hasEventBeforeFocus = true;
        dist_module_$507fabe10e71c6fb$var$currentModality = 'virtual';
    }
}
function dist_module_$507fabe10e71c6fb$var$handleFocusEvent(e) {
    // Firefox fires two extra focus events when the user first clicks into an iframe:
    // first on the window, then on the document. We ignore these events so they don't
    // cause keyboard focus rings to appear.
    if (e.target === window || e.target === document) return;
    // If a focus event occurs without a preceding keyboard or pointer event, switch to virtual modality.
    // This occurs, for example, when navigating a form with the next/previous buttons on iOS.
    if (!dist_module_$507fabe10e71c6fb$var$hasEventBeforeFocus && !dist_module_$507fabe10e71c6fb$var$hasBlurredWindowRecently) {
        dist_module_$507fabe10e71c6fb$var$currentModality = 'virtual';
        dist_module_$507fabe10e71c6fb$var$triggerChangeHandlers('virtual', e);
    }
    dist_module_$507fabe10e71c6fb$var$hasEventBeforeFocus = false;
    dist_module_$507fabe10e71c6fb$var$hasBlurredWindowRecently = false;
}
function dist_module_$507fabe10e71c6fb$var$handleWindowBlur() {
    // When the window is blurred, reset state. This is necessary when tabbing out of the window,
    // for example, since a subsequent focus event won't be fired.
    dist_module_$507fabe10e71c6fb$var$hasEventBeforeFocus = false;
    dist_module_$507fabe10e71c6fb$var$hasBlurredWindowRecently = true;
}
/**
 * Setup global event listeners to control when keyboard focus style should be visible.
 */ function dist_module_$507fabe10e71c6fb$var$setupGlobalFocusEvents() {
    if (typeof window === 'undefined' || dist_module_$507fabe10e71c6fb$var$hasSetupGlobalListeners) return;
    // Programmatic focus() calls shouldn't affect the current input modality.
    // However, we need to detect other cases when a focus event occurs without
    // a preceding user event (e.g. screen reader focus). Overriding the focus
    // method on HTMLElement.prototype is a bit hacky, but works.
    let focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function() {
        dist_module_$507fabe10e71c6fb$var$hasEventBeforeFocus = true;
        focus.apply(this, arguments);
    };
    document.addEventListener('keydown', dist_module_$507fabe10e71c6fb$var$handleKeyboardEvent, true);
    document.addEventListener('keyup', dist_module_$507fabe10e71c6fb$var$handleKeyboardEvent, true);
    document.addEventListener('click', dist_module_$507fabe10e71c6fb$var$handleClickEvent, true);
    // Register focus events on the window so they are sure to happen
    // before React's event listeners (registered on the document).
    window.addEventListener('focus', dist_module_$507fabe10e71c6fb$var$handleFocusEvent, true);
    window.addEventListener('blur', dist_module_$507fabe10e71c6fb$var$handleWindowBlur, false);
    if (typeof PointerEvent !== 'undefined') {
        document.addEventListener('pointerdown', dist_module_$507fabe10e71c6fb$var$handlePointerEvent, true);
        document.addEventListener('pointermove', dist_module_$507fabe10e71c6fb$var$handlePointerEvent, true);
        document.addEventListener('pointerup', dist_module_$507fabe10e71c6fb$var$handlePointerEvent, true);
    } else {
        document.addEventListener('mousedown', dist_module_$507fabe10e71c6fb$var$handlePointerEvent, true);
        document.addEventListener('mousemove', dist_module_$507fabe10e71c6fb$var$handlePointerEvent, true);
        document.addEventListener('mouseup', dist_module_$507fabe10e71c6fb$var$handlePointerEvent, true);
    }
    dist_module_$507fabe10e71c6fb$var$hasSetupGlobalListeners = true;
}
if (typeof document !== 'undefined') {
    if (document.readyState !== 'loading') dist_module_$507fabe10e71c6fb$var$setupGlobalFocusEvents();
    else document.addEventListener('DOMContentLoaded', dist_module_$507fabe10e71c6fb$var$setupGlobalFocusEvents);
}
function dist_module_$507fabe10e71c6fb$export$b9b3dfddab17db27() {
    return dist_module_$507fabe10e71c6fb$var$currentModality !== 'pointer';
}
function dist_module_$507fabe10e71c6fb$export$630ff653c5ada6a9() {
    return dist_module_$507fabe10e71c6fb$var$currentModality;
}
function dist_module_$507fabe10e71c6fb$export$8397ddfc504fdb9a(modality) {
    dist_module_$507fabe10e71c6fb$var$currentModality = modality;
    dist_module_$507fabe10e71c6fb$var$triggerChangeHandlers(modality, null);
}
function dist_module_$507fabe10e71c6fb$export$98e20ec92f614cfe() {
    dist_module_$507fabe10e71c6fb$var$setupGlobalFocusEvents();
    let [modality, setModality] = $bx7SL$useState(dist_module_$507fabe10e71c6fb$var$currentModality);
    $bx7SL$useEffect(()=>{
        let handler = ()=>{
            setModality(dist_module_$507fabe10e71c6fb$var$currentModality);
        };
        dist_module_$507fabe10e71c6fb$var$changeHandlers.add(handler);
        return ()=>{
            dist_module_$507fabe10e71c6fb$var$changeHandlers.delete(handler);
        };
    }, []);
    return modality;
}
/**
 * If this is attached to text input component, return if the event is a focus event (Tab/Escape keys pressed) so that
 * focus visible style can be properly set.
 */ function dist_module_$507fabe10e71c6fb$var$isKeyboardFocusEvent(isTextInput, modality, e) {
    return !(isTextInput && modality === 'keyboard' && e instanceof KeyboardEvent && !dist_module_$507fabe10e71c6fb$var$FOCUS_VISIBLE_INPUT_KEYS[e.key]);
}
function dist_module_$507fabe10e71c6fb$export$ffd9e5021c1fb2d6(props = {
}) {
    let { isTextInput: isTextInput , autoFocus: autoFocus  } = props;
    let [isFocusVisibleState, setFocusVisible] = $bx7SL$useState(autoFocus || dist_module_$507fabe10e71c6fb$export$b9b3dfddab17db27());
    dist_module_$507fabe10e71c6fb$export$ec71b4b83ac08ec3(($507fabe10e71c6fb$export$b9b3dfddab17db27)=>{
        setFocusVisible($507fabe10e71c6fb$export$b9b3dfddab17db27);
    }, [
        isTextInput
    ], {
        isTextInput: isTextInput
    });
    return {
        isFocusVisible: isFocusVisibleState
    };
}
function dist_module_$507fabe10e71c6fb$export$ec71b4b83ac08ec3(fn, deps, opts) {
    dist_module_$507fabe10e71c6fb$var$setupGlobalFocusEvents();
    $bx7SL$useEffect(()=>{
        let handler = (modality, e)=>{
            if (!dist_module_$507fabe10e71c6fb$var$isKeyboardFocusEvent(opts === null || opts === void 0 ? void 0 : opts.isTextInput, modality, e)) return;
            fn(dist_module_$507fabe10e71c6fb$export$b9b3dfddab17db27());
        };
        dist_module_$507fabe10e71c6fb$var$changeHandlers.add(handler);
        return ()=>{
            dist_module_$507fabe10e71c6fb$var$changeHandlers.delete(handler);
        };
    }, deps);
}




function dist_module_$9ab94262bd0047c7$export$420e68273165f4ec(props) {
    let { isDisabled: isDisabled , onBlurWithin: onBlurWithin , onFocusWithin: onFocusWithin , onFocusWithinChange: onFocusWithinChange  } = props;
    let state = $bx7SL$useRef({
        isFocusWithin: false
    });
    let onBlur = $bx7SL$useCallback((e)=>{
        // We don't want to trigger onBlurWithin and then immediately onFocusWithin again
        // when moving focus inside the element. Only trigger if the currentTarget doesn't
        // include the relatedTarget (where focus is moving).
        if (state.current.isFocusWithin && !e.currentTarget.contains(e.relatedTarget)) {
            state.current.isFocusWithin = false;
            if (onBlurWithin) onBlurWithin(e);
            if (onFocusWithinChange) onFocusWithinChange(false);
        }
    }, [
        onBlurWithin,
        onFocusWithinChange,
        state
    ]);
    let onSyntheticFocus = dist_module_$8a9cb279dc87e130$export$715c682d09d639cc(onBlur);
    let onFocus = $bx7SL$useCallback((e)=>{
        if (!state.current.isFocusWithin) {
            if (onFocusWithin) onFocusWithin(e);
            if (onFocusWithinChange) onFocusWithinChange(true);
            state.current.isFocusWithin = true;
            onSyntheticFocus(e);
        }
    }, [
        onFocusWithin,
        onFocusWithinChange,
        onSyntheticFocus
    ]);
    if (isDisabled) return {
        focusWithinProps: {
            onFocus: null,
            onBlur: null
        }
    };
    return {
        focusWithinProps: {
            onFocus: onFocus,
            onBlur: onBlur
        }
    };
}



// iOS fires onPointerEnter twice: once with pointerType="touch" and again with pointerType="mouse".
// We want to ignore these emulated events so they do not trigger hover behavior.
// See https://bugs.webkit.org/show_bug.cgi?id=214609.
let dist_module_$6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = false;
let dist_module_$6179b936705e76d3$var$hoverCount = 0;
function dist_module_$6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents() {
    dist_module_$6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = true;
    // Clear globalIgnoreEmulatedMouseEvents after a short timeout. iOS fires onPointerEnter
    // with pointerType="mouse" immediately after onPointerUp and before onFocus. On other
    // devices that don't have this quirk, we don't want to ignore a mouse hover sometime in
    // the distant future because a user previously touched the element.
    setTimeout(()=>{
        dist_module_$6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = false;
    }, 50);
}
function dist_module_$6179b936705e76d3$var$handleGlobalPointerEvent(e) {
    if (e.pointerType === 'touch') dist_module_$6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents();
}
function dist_module_$6179b936705e76d3$var$setupGlobalTouchEvents() {
    if (typeof document === 'undefined') return;
    if (typeof PointerEvent !== 'undefined') document.addEventListener('pointerup', dist_module_$6179b936705e76d3$var$handleGlobalPointerEvent);
    else document.addEventListener('touchend', dist_module_$6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents);
    dist_module_$6179b936705e76d3$var$hoverCount++;
    return ()=>{
        dist_module_$6179b936705e76d3$var$hoverCount--;
        if (dist_module_$6179b936705e76d3$var$hoverCount > 0) return;
        if (typeof PointerEvent !== 'undefined') document.removeEventListener('pointerup', dist_module_$6179b936705e76d3$var$handleGlobalPointerEvent);
        else document.removeEventListener('touchend', dist_module_$6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents);
    };
}
function dist_module_$6179b936705e76d3$export$ae780daf29e6d456(props) {
    let { onHoverStart: onHoverStart , onHoverChange: onHoverChange , onHoverEnd: onHoverEnd , isDisabled: isDisabled  } = props;
    let [isHovered, setHovered] = (0,react.useState)(false);
    let state = (0,react.useRef)({
        isHovered: false,
        ignoreEmulatedMouseEvents: false,
        pointerType: '',
        target: null
    }).current;
    (0,react.useEffect)(dist_module_$6179b936705e76d3$var$setupGlobalTouchEvents, []);
    let { hoverProps: hoverProps1 , triggerHoverEnd: triggerHoverEnd1  } = (0,react.useMemo)(()=>{
        let triggerHoverStart = (event, pointerType)=>{
            state.pointerType = pointerType;
            if (isDisabled || pointerType === 'touch' || state.isHovered || !event.currentTarget.contains(event.target)) return;
            state.isHovered = true;
            let target = event.currentTarget;
            state.target = target;
            if (onHoverStart) onHoverStart({
                type: 'hoverstart',
                target: target,
                pointerType: pointerType
            });
            if (onHoverChange) onHoverChange(true);
            setHovered(true);
        };
        let triggerHoverEnd = (event, pointerType)=>{
            state.pointerType = '';
            state.target = null;
            if (pointerType === 'touch' || !state.isHovered) return;
            state.isHovered = false;
            let target = event.currentTarget;
            if (onHoverEnd) onHoverEnd({
                type: 'hoverend',
                target: target,
                pointerType: pointerType
            });
            if (onHoverChange) onHoverChange(false);
            setHovered(false);
        };
        let hoverProps = {
        };
        if (typeof PointerEvent !== 'undefined') {
            hoverProps.onPointerEnter = (e)=>{
                if (dist_module_$6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents && e.pointerType === 'mouse') return;
                triggerHoverStart(e, e.pointerType);
            };
            hoverProps.onPointerLeave = (e)=>{
                if (!isDisabled && e.currentTarget.contains(e.target)) triggerHoverEnd(e, e.pointerType);
            };
        } else {
            hoverProps.onTouchStart = ()=>{
                state.ignoreEmulatedMouseEvents = true;
            };
            hoverProps.onMouseEnter = (e)=>{
                if (!state.ignoreEmulatedMouseEvents && !dist_module_$6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents) triggerHoverStart(e, 'mouse');
                state.ignoreEmulatedMouseEvents = false;
            };
            hoverProps.onMouseLeave = (e)=>{
                if (!isDisabled && e.currentTarget.contains(e.target)) triggerHoverEnd(e, 'mouse');
            };
        }
        return {
            hoverProps: hoverProps,
            triggerHoverEnd: triggerHoverEnd
        };
    }, [
        onHoverStart,
        onHoverChange,
        onHoverEnd,
        isDisabled,
        state
    ]);
    (0,react.useEffect)(()=>{
        // Call the triggerHoverEnd as soon as isDisabled changes to true
        // Safe to call triggerHoverEnd, it will early return if we aren't currently hovering
        if (isDisabled) triggerHoverEnd1({
            currentTarget: state.target
        }, state.pointerType);
    }, [
        isDisabled
    ]);
    return {
        hoverProps: hoverProps1,
        isHovered: isHovered
    };
}



function dist_module_$e0b6e0b68ec7f50f$export$872b660ac5a1ff98(props) {
    let { ref: ref , onInteractOutside: onInteractOutside , isDisabled: isDisabled , onInteractOutsideStart: onInteractOutsideStart  } = props;
    let stateRef = $bx7SL$useRef({
        isPointerDown: false,
        ignoreEmulatedMouseEvents: false,
        onInteractOutside: onInteractOutside,
        onInteractOutsideStart: onInteractOutsideStart
    });
    let state = stateRef.current;
    state.onInteractOutside = onInteractOutside;
    state.onInteractOutsideStart = onInteractOutsideStart;
    $bx7SL$useEffect(()=>{
        if (isDisabled) return;
        let onPointerDown = (e)=>{
            if (dist_module_$e0b6e0b68ec7f50f$var$isValidEvent(e, ref) && state.onInteractOutside) {
                if (state.onInteractOutsideStart) state.onInteractOutsideStart(e);
                state.isPointerDown = true;
            }
        };
        // Use pointer events if available. Otherwise, fall back to mouse and touch events.
        if (typeof PointerEvent !== 'undefined') {
            let onPointerUp = (e)=>{
                if (state.isPointerDown && state.onInteractOutside && dist_module_$e0b6e0b68ec7f50f$var$isValidEvent(e, ref)) {
                    state.isPointerDown = false;
                    state.onInteractOutside(e);
                }
            };
            // changing these to capture phase fixed combobox
            document.addEventListener('pointerdown', onPointerDown, true);
            document.addEventListener('pointerup', onPointerUp, true);
            return ()=>{
                document.removeEventListener('pointerdown', onPointerDown, true);
                document.removeEventListener('pointerup', onPointerUp, true);
            };
        } else {
            let onMouseUp = (e)=>{
                if (state.ignoreEmulatedMouseEvents) state.ignoreEmulatedMouseEvents = false;
                else if (state.isPointerDown && state.onInteractOutside && dist_module_$e0b6e0b68ec7f50f$var$isValidEvent(e, ref)) {
                    state.isPointerDown = false;
                    state.onInteractOutside(e);
                }
            };
            let onTouchEnd = (e)=>{
                state.ignoreEmulatedMouseEvents = true;
                if (state.onInteractOutside && state.isPointerDown && dist_module_$e0b6e0b68ec7f50f$var$isValidEvent(e, ref)) {
                    state.isPointerDown = false;
                    state.onInteractOutside(e);
                }
            };
            document.addEventListener('mousedown', onPointerDown, true);
            document.addEventListener('mouseup', onMouseUp, true);
            document.addEventListener('touchstart', onPointerDown, true);
            document.addEventListener('touchend', onTouchEnd, true);
            return ()=>{
                document.removeEventListener('mousedown', onPointerDown, true);
                document.removeEventListener('mouseup', onMouseUp, true);
                document.removeEventListener('touchstart', onPointerDown, true);
                document.removeEventListener('touchend', onTouchEnd, true);
            };
        }
    }, [
        ref,
        state,
        isDisabled
    ]);
}
function dist_module_$e0b6e0b68ec7f50f$var$isValidEvent(event, ref) {
    if (event.button > 0) return false;
    // if the event target is no longer in the document
    if (event.target) {
        const ownerDocument = event.target.ownerDocument;
        if (!ownerDocument || !ownerDocument.documentElement.contains(event.target)) return false;
    }
    return ref.current && !ref.current.contains(event.target);
}


function dist_module_$93925083ecbb358c$export$48d1ea6320830260(handler) {
    if (!handler) return;
    let shouldStopPropagation = true;
    return (e)=>{
        let event = {
            ...e,
            preventDefault () {
                e.preventDefault();
            },
            isDefaultPrevented () {
                return e.isDefaultPrevented();
            },
            stopPropagation () {
                console.error('stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.');
            },
            continuePropagation () {
                shouldStopPropagation = false;
            }
        };
        handler(event);
        if (shouldStopPropagation) e.stopPropagation();
    };
}


function dist_module_$46d819fcbaf35654$export$8f71654801c2f7cd(props) {
    return {
        keyboardProps: props.isDisabled ? {
        } : {
            onKeyDown: dist_module_$93925083ecbb358c$export$48d1ea6320830260(props.onKeyDown),
            onKeyUp: dist_module_$93925083ecbb358c$export$48d1ea6320830260(props.onKeyUp)
        }
    };
}





function dist_module_$e8a7022cf87cba2a$export$36da96379f79f245(props) {
    let { onMoveStart: onMoveStart , onMove: onMove , onMoveEnd: onMoveEnd  } = props;
    let state = $bx7SL$useRef({
        didMove: false,
        lastPosition: null,
        id: null
    });
    let { addGlobalListener: addGlobalListener , removeGlobalListener: removeGlobalListener  } = $bx7SL$useGlobalListeners();
    let moveProps1 = $bx7SL$useMemo(()=>{
        let moveProps = {
        };
        let start = ()=>{
            dist_module_$14c0b72509d70225$export$16a4697467175487();
            state.current.didMove = false;
        };
        let move = (originalEvent, pointerType, deltaX, deltaY)=>{
            if (deltaX === 0 && deltaY === 0) return;
            if (!state.current.didMove) {
                state.current.didMove = true;
                onMoveStart === null || onMoveStart === void 0 ? void 0 : onMoveStart({
                    type: 'movestart',
                    pointerType: pointerType,
                    shiftKey: originalEvent.shiftKey,
                    metaKey: originalEvent.metaKey,
                    ctrlKey: originalEvent.ctrlKey,
                    altKey: originalEvent.altKey
                });
            }
            onMove({
                type: 'move',
                pointerType: pointerType,
                deltaX: deltaX,
                deltaY: deltaY,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
        };
        let end = (originalEvent, pointerType)=>{
            dist_module_$14c0b72509d70225$export$b0d6fa1ab32e3295();
            if (state.current.didMove) onMoveEnd === null || onMoveEnd === void 0 ? void 0 : onMoveEnd({
                type: 'moveend',
                pointerType: pointerType,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
        };
        if (typeof PointerEvent === 'undefined') {
            let onMouseMove = (e)=>{
                if (e.button === 0) {
                    move(e, 'mouse', e.pageX - state.current.lastPosition.pageX, e.pageY - state.current.lastPosition.pageY);
                    state.current.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                }
            };
            let onMouseUp = (e)=>{
                if (e.button === 0) {
                    end(e, 'mouse');
                    removeGlobalListener(window, 'mousemove', onMouseMove, false);
                    removeGlobalListener(window, 'mouseup', onMouseUp, false);
                }
            };
            moveProps.onMouseDown = (e)=>{
                if (e.button === 0) {
                    start();
                    e.stopPropagation();
                    e.preventDefault();
                    state.current.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                    addGlobalListener(window, 'mousemove', onMouseMove, false);
                    addGlobalListener(window, 'mouseup', onMouseUp, false);
                }
            };
            let onTouchMove = (e)=>{
                let touch = [
                    ...e.changedTouches
                ].findIndex(({ identifier: identifier  })=>identifier === state.current.id
                );
                if (touch >= 0) {
                    let { pageX: pageX , pageY: pageY  } = e.changedTouches[touch];
                    move(e, 'touch', pageX - state.current.lastPosition.pageX, pageY - state.current.lastPosition.pageY);
                    state.current.lastPosition = {
                        pageX: pageX,
                        pageY: pageY
                    };
                }
            };
            let onTouchEnd = (e)=>{
                let touch = [
                    ...e.changedTouches
                ].findIndex(({ identifier: identifier  })=>identifier === state.current.id
                );
                if (touch >= 0) {
                    end(e, 'touch');
                    state.current.id = null;
                    removeGlobalListener(window, 'touchmove', onTouchMove);
                    removeGlobalListener(window, 'touchend', onTouchEnd);
                    removeGlobalListener(window, 'touchcancel', onTouchEnd);
                }
            };
            moveProps.onTouchStart = (e)=>{
                if (e.changedTouches.length === 0 || state.current.id != null) return;
                let { pageX: pageX , pageY: pageY , identifier: identifier  } = e.changedTouches[0];
                start();
                e.stopPropagation();
                e.preventDefault();
                state.current.lastPosition = {
                    pageX: pageX,
                    pageY: pageY
                };
                state.current.id = identifier;
                addGlobalListener(window, 'touchmove', onTouchMove, false);
                addGlobalListener(window, 'touchend', onTouchEnd, false);
                addGlobalListener(window, 'touchcancel', onTouchEnd, false);
            };
        } else {
            let onPointerMove = (e)=>{
                if (e.pointerId === state.current.id) {
                    let pointerType = e.pointerType || 'mouse';
                    // Problems with PointerEvent#movementX/movementY:
                    // 1. it is always 0 on macOS Safari.
                    // 2. On Chrome Android, it's scaled by devicePixelRatio, but not on Chrome macOS
                    move(e, pointerType, e.pageX - state.current.lastPosition.pageX, e.pageY - state.current.lastPosition.pageY);
                    state.current.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                }
            };
            let onPointerUp = (e)=>{
                if (e.pointerId === state.current.id) {
                    let pointerType = e.pointerType || 'mouse';
                    end(e, pointerType);
                    state.current.id = null;
                    removeGlobalListener(window, 'pointermove', onPointerMove, false);
                    removeGlobalListener(window, 'pointerup', onPointerUp, false);
                    removeGlobalListener(window, 'pointercancel', onPointerUp, false);
                }
            };
            moveProps.onPointerDown = (e)=>{
                if (e.button === 0 && state.current.id == null) {
                    start();
                    e.stopPropagation();
                    e.preventDefault();
                    state.current.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                    state.current.id = e.pointerId;
                    addGlobalListener(window, 'pointermove', onPointerMove, false);
                    addGlobalListener(window, 'pointerup', onPointerUp, false);
                    addGlobalListener(window, 'pointercancel', onPointerUp, false);
                }
            };
        }
        let triggerKeyboardMove = (e, deltaX, deltaY)=>{
            start();
            move(e, 'keyboard', deltaX, deltaY);
            end(e, 'keyboard');
        };
        moveProps.onKeyDown = (e)=>{
            switch(e.key){
                case 'Left':
                case 'ArrowLeft':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, -1, 0);
                    break;
                case 'Right':
                case 'ArrowRight':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, 1, 0);
                    break;
                case 'Up':
                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, 0, -1);
                    break;
                case 'Down':
                case 'ArrowDown':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, 0, 1);
                    break;
            }
        };
        return moveProps;
    }, [
        state,
        onMoveStart,
        onMove,
        onMoveEnd,
        addGlobalListener,
        removeGlobalListener
    ]);
    return {
        moveProps: moveProps1
    };
}





function dist_module_$7d0a636d7a4dcefd$export$2123ff2b87c81ca(props, ref) {
    let { onScroll: onScroll , isDisabled: isDisabled  } = props;
    let onScrollHandler = $bx7SL$useCallback((e)=>{
        // If the ctrlKey is pressed, this is a zoom event, do nothing.
        if (e.ctrlKey) return;
        // stop scrolling the page
        e.preventDefault();
        e.stopPropagation();
        if (onScroll) onScroll({
            deltaX: e.deltaX,
            deltaY: e.deltaY
        });
    }, [
        onScroll
    ]);
    $bx7SL$useEvent(ref, 'wheel', isDisabled ? null : onScrollHandler);
}





const dist_module_$8a26561d2877236e$var$DEFAULT_THRESHOLD = 500;
function dist_module_$8a26561d2877236e$export$c24ed0104d07eab9(props) {
    let { isDisabled: isDisabled , onLongPressStart: onLongPressStart , onLongPressEnd: onLongPressEnd , onLongPress: onLongPress , threshold: threshold = dist_module_$8a26561d2877236e$var$DEFAULT_THRESHOLD , accessibilityDescription: accessibilityDescription  } = props;
    const timeRef = $bx7SL$useRef(null);
    let { addGlobalListener: addGlobalListener , removeGlobalListener: removeGlobalListener  } = $bx7SL$useGlobalListeners();
    let { pressProps: pressProps  } = dist_module_$f6c31cce2adf654f$export$45712eceda6fad21({
        isDisabled: isDisabled,
        onPressStart (e1) {
            if (e1.pointerType === 'mouse' || e1.pointerType === 'touch') {
                if (onLongPressStart) onLongPressStart({
                    ...e1,
                    type: 'longpressstart'
                });
                timeRef.current = setTimeout(()=>{
                    // Prevent other usePress handlers from also handling this event.
                    e1.target.dispatchEvent(new PointerEvent('pointercancel', {
                        bubbles: true
                    }));
                    if (onLongPress) onLongPress({
                        ...e1,
                        type: 'longpress'
                    });
                    timeRef.current = null;
                }, threshold);
                // Prevent context menu, which may be opened on long press on touch devices
                if (e1.pointerType === 'touch') {
                    let onContextMenu = (e)=>{
                        e.preventDefault();
                    };
                    addGlobalListener(e1.target, 'contextmenu', onContextMenu, {
                        once: true
                    });
                    addGlobalListener(window, 'pointerup', ()=>{
                        // If no contextmenu event is fired quickly after pointerup, remove the handler
                        // so future context menu events outside a long press are not prevented.
                        setTimeout(()=>{
                            removeGlobalListener(e1.target, 'contextmenu', onContextMenu);
                        }, 30);
                    }, {
                        once: true
                    });
                }
            }
        },
        onPressEnd (e) {
            if (timeRef.current) clearTimeout(timeRef.current);
            if (onLongPressEnd && (e.pointerType === 'mouse' || e.pointerType === 'touch')) onLongPressEnd({
                ...e,
                type: 'longpressend'
            });
        }
    });
    let descriptionProps = $bx7SL$useDescription(onLongPress && !isDisabled ? accessibilityDescription : null);
    return {
        longPressProps: $bx7SL$mergeProps(pressProps, descriptionProps)
    };
}





//# sourceMappingURL=module.js.map

;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/node_modules/@react-aria/utils/dist/module.js







const utils_dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c = typeof window !== 'undefined' ? react.useLayoutEffect : ()=>{
};




let utils_dist_module_$bdb11010cef70236$var$idsUpdaterMap = new Map();
function utils_dist_module_$bdb11010cef70236$export$f680877a34711e37(defaultId) {
    let [value, setValue] = $12uGp$useState(defaultId);
    let nextId = $12uGp$useRef(null);
    let res = $12uGp$useSSRSafeId(value);
    let updateValue = $12uGp$useCallback((val)=>{
        nextId.current = val;
    }, []);
    utils_dist_module_$bdb11010cef70236$var$idsUpdaterMap.set(res, updateValue);
    utils_dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        let r = res;
        return ()=>{
            utils_dist_module_$bdb11010cef70236$var$idsUpdaterMap.delete(r);
        };
    }, [
        res
    ]);
    // This cannot cause an infinite loop because the ref is updated first.
    // eslint-disable-next-line
    $12uGp$useEffect(()=>{
        let newId = nextId.current;
        if (newId) {
            nextId.current = null;
            setValue(newId);
        }
    });
    return res;
}
function utils_dist_module_$bdb11010cef70236$export$cd8c9cb68f842629(idA, idB) {
    if (idA === idB) return idA;
    let setIdA = utils_dist_module_$bdb11010cef70236$var$idsUpdaterMap.get(idA);
    if (setIdA) {
        setIdA(idB);
        return idB;
    }
    let setIdB = utils_dist_module_$bdb11010cef70236$var$idsUpdaterMap.get(idB);
    if (setIdB) {
        setIdB(idA);
        return idA;
    }
    return idB;
}
function utils_dist_module_$bdb11010cef70236$export$b4cc09c592e8fdb8(depArray = []) {
    let id = utils_dist_module_$bdb11010cef70236$export$f680877a34711e37();
    let [resolvedId, setResolvedId] = utils_dist_module_$1dbecbe27a04f9af$export$14d238f342723f25(id);
    let updateId = $12uGp$useCallback(()=>{
        setResolvedId(function*() {
            yield id;
            yield document.getElementById(id) ? id : null;
        });
    }, [
        id,
        setResolvedId
    ]);
    utils_dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(updateId, [
        id,
        updateId,
        ...depArray
    ]);
    return resolvedId;
}


function utils_dist_module_$ff5963eb1fccf552$export$e08e3b67e392101e(...callbacks) {
    return (...args)=>{
        for (let callback of callbacks)if (typeof callback === 'function') callback(...args);
    };
}





function utils_dist_module_$3ef42575df84b30b$export$9d1611c77c2fe928(...args) {
    // Start with a base clone of the first argument. This is a lot faster than starting
    // with an empty object and adding properties as we go.
    let result = {
        ...args[0]
    };
    for(let i = 1; i < args.length; i++){
        let props = args[i];
        for(let key in props){
            let a = result[key];
            let b = props[key];
            // Chain events
            if (typeof a === 'function' && typeof b === 'function' && // This is a lot faster than a regex.
            key[0] === 'o' && key[1] === 'n' && key.charCodeAt(2) >= /* 'A' */ 65 && key.charCodeAt(2) <= /* 'Z' */ 90) result[key] = utils_dist_module_$ff5963eb1fccf552$export$e08e3b67e392101e(a, b);
            else if ((key === 'className' || key === 'UNSAFE_className') && typeof a === 'string' && typeof b === 'string') result[key] = clsx_m(a, b);
            else if (key === 'id' && a && b) result.id = utils_dist_module_$bdb11010cef70236$export$cd8c9cb68f842629(a, b);
            else result[key] = b !== undefined ? b : a;
        }
    }
    return result;
}


function utils_dist_module_$5dc95899b306f630$export$c9058316764c140e(...refs) {
    return (value)=>{
        for (let ref of refs){
            if (typeof ref === 'function') ref(value);
            else if (ref != null) ref.current = value;
        }
    };
}


const utils_dist_module_$65484d02dcb7eb3e$var$DOMPropNames = new Set([
    'id'
]);
const utils_dist_module_$65484d02dcb7eb3e$var$labelablePropNames = new Set([
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-details'
]);
const utils_dist_module_$65484d02dcb7eb3e$var$propRe = /^(data-.*)$/;
function utils_dist_module_$65484d02dcb7eb3e$export$457c3d6518dd4c6f(props, opts = {
}) {
    let { labelable: labelable , propNames: propNames  } = opts;
    let filteredProps = {
    };
    for(const prop in props)if (Object.prototype.hasOwnProperty.call(props, prop) && (utils_dist_module_$65484d02dcb7eb3e$var$DOMPropNames.has(prop) || labelable && utils_dist_module_$65484d02dcb7eb3e$var$labelablePropNames.has(prop) || (propNames === null || propNames === void 0 ? void 0 : propNames.has(prop)) || utils_dist_module_$65484d02dcb7eb3e$var$propRe.test(prop))) filteredProps[prop] = props[prop];
    return filteredProps;
}


function utils_dist_module_$7215afc6de606d6b$export$de79e2c695e052f3(element) {
    if (utils_dist_module_$7215afc6de606d6b$var$supportsPreventScroll()) element.focus({
        preventScroll: true
    });
    else {
        let scrollableElements = utils_dist_module_$7215afc6de606d6b$var$getScrollableElements(element);
        element.focus();
        utils_dist_module_$7215afc6de606d6b$var$restoreScrollPosition(scrollableElements);
    }
}
let utils_dist_module_$7215afc6de606d6b$var$supportsPreventScrollCached = null;
function utils_dist_module_$7215afc6de606d6b$var$supportsPreventScroll() {
    if (utils_dist_module_$7215afc6de606d6b$var$supportsPreventScrollCached == null) {
        utils_dist_module_$7215afc6de606d6b$var$supportsPreventScrollCached = false;
        try {
            var focusElem = document.createElement('div');
            focusElem.focus({
                get preventScroll () {
                    utils_dist_module_$7215afc6de606d6b$var$supportsPreventScrollCached = true;
                    return true;
                }
            });
        } catch (e) {
        // Ignore
        }
    }
    return utils_dist_module_$7215afc6de606d6b$var$supportsPreventScrollCached;
}
function utils_dist_module_$7215afc6de606d6b$var$getScrollableElements(element) {
    var parent = element.parentNode;
    var scrollableElements = [];
    var rootScrollingElement = document.scrollingElement || document.documentElement;
    while(parent instanceof HTMLElement && parent !== rootScrollingElement){
        if (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) scrollableElements.push({
            element: parent,
            scrollTop: parent.scrollTop,
            scrollLeft: parent.scrollLeft
        });
        parent = parent.parentNode;
    }
    if (rootScrollingElement instanceof HTMLElement) scrollableElements.push({
        element: rootScrollingElement,
        scrollTop: rootScrollingElement.scrollTop,
        scrollLeft: rootScrollingElement.scrollLeft
    });
    return scrollableElements;
}
function utils_dist_module_$7215afc6de606d6b$var$restoreScrollPosition(scrollableElements) {
    for (let { element: element , scrollTop: scrollTop , scrollLeft: scrollLeft  } of scrollableElements){
        element.scrollTop = scrollTop;
        element.scrollLeft = scrollLeft;
    }
}


function utils_dist_module_$ab71dadb03a6fb2e$export$622cea445a1c5b7d(element, reverse, orientation = 'horizontal') {
    let rect = element.getBoundingClientRect();
    if (reverse) return orientation === 'horizontal' ? rect.right : rect.bottom;
    return orientation === 'horizontal' ? rect.left : rect.top;
}


/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ // We store a global list of elements that are currently transitioning,
// mapped to a set of CSS properties that are transitioning for that element.
// This is necessary rather than a simple count of transitions because of browser
// bugs, e.g. Chrome sometimes fires both transitionend and transitioncancel rather
// than one or the other. So we need to track what's actually transitioning so that
// we can ignore these duplicate events.
let utils_dist_module_$bbed8b41f857bcc0$var$transitionsByElement = new Map();
// A list of callbacks to call once there are no transitioning elements.
let utils_dist_module_$bbed8b41f857bcc0$var$transitionCallbacks = new Set();
function utils_dist_module_$bbed8b41f857bcc0$var$setupGlobalEvents() {
    if (typeof window === 'undefined') return;
    let onTransitionStart = (e)=>{
        // Add the transitioning property to the list for this element.
        let transitions = utils_dist_module_$bbed8b41f857bcc0$var$transitionsByElement.get(e.target);
        if (!transitions) {
            transitions = new Set();
            utils_dist_module_$bbed8b41f857bcc0$var$transitionsByElement.set(e.target, transitions);
            // The transitioncancel event must be registered on the element itself, rather than as a global
            // event. This enables us to handle when the node is deleted from the document while it is transitioning.
            // In that case, the cancel event would have nowhere to bubble to so we need to handle it directly.
            e.target.addEventListener('transitioncancel', onTransitionEnd);
        }
        transitions.add(e.propertyName);
    };
    let onTransitionEnd = (e)=>{
        // Remove property from list of transitioning properties.
        let properties = utils_dist_module_$bbed8b41f857bcc0$var$transitionsByElement.get(e.target);
        if (!properties) return;
        properties.delete(e.propertyName);
        // If empty, remove transitioncancel event, and remove the element from the list of transitioning elements.
        if (properties.size === 0) {
            e.target.removeEventListener('transitioncancel', onTransitionEnd);
            utils_dist_module_$bbed8b41f857bcc0$var$transitionsByElement.delete(e.target);
        }
        // If no transitioning elements, call all of the queued callbacks.
        if (utils_dist_module_$bbed8b41f857bcc0$var$transitionsByElement.size === 0) {
            for (let cb of utils_dist_module_$bbed8b41f857bcc0$var$transitionCallbacks)cb();
            utils_dist_module_$bbed8b41f857bcc0$var$transitionCallbacks.clear();
        }
    };
    document.body.addEventListener('transitionrun', onTransitionStart);
    document.body.addEventListener('transitionend', onTransitionEnd);
}
if (typeof document !== 'undefined') {
    if (document.readyState !== 'loading') utils_dist_module_$bbed8b41f857bcc0$var$setupGlobalEvents();
    else document.addEventListener('DOMContentLoaded', utils_dist_module_$bbed8b41f857bcc0$var$setupGlobalEvents);
}
function utils_dist_module_$bbed8b41f857bcc0$export$24490316f764c430(fn) {
    // Wait one frame to see if an animation starts, e.g. a transition on mount.
    requestAnimationFrame(()=>{
        // If no transitions are running, call the function immediately.
        // Otherwise, add it to a list of callbacks to run at the end of the animation.
        if (utils_dist_module_$bbed8b41f857bcc0$var$transitionsByElement.size === 0) fn();
        else utils_dist_module_$bbed8b41f857bcc0$var$transitionCallbacks.add(fn);
    });
}




// Keep track of elements that we are currently handling dragging for via useDrag1D.
// If there's an ancestor and a descendant both using useDrag1D(), and the user starts
// dragging the descendant, we don't want useDrag1D events to fire for the ancestor.
const utils_dist_module_$9cc09df9fd7676be$var$draggingElements = (/* unused pure expression or super */ null && ([]));
function utils_dist_module_$9cc09df9fd7676be$export$7bbed75feba39706(props) {
    console.warn('useDrag1D is deprecated, please use `useMove` instead https://react-spectrum.adobe.com/react-aria/useMove.html');
    let { containerRef: containerRef , reverse: reverse , orientation: orientation , onHover: onHover , onDrag: onDrag , onPositionChange: onPositionChange , onIncrement: onIncrement , onDecrement: onDecrement , onIncrementToMax: onIncrementToMax , onDecrementToMin: onDecrementToMin , onCollapseToggle: onCollapseToggle  } = props;
    let getPosition = (e)=>orientation === 'horizontal' ? e.clientX : e.clientY
    ;
    let getNextOffset = (e)=>{
        let containerOffset = utils_dist_module_$ab71dadb03a6fb2e$export$622cea445a1c5b7d(containerRef.current, reverse, orientation);
        let mouseOffset = getPosition(e);
        let nextOffset = reverse ? containerOffset - mouseOffset : mouseOffset - containerOffset;
        return nextOffset;
    };
    let dragging = $12uGp$useRef(false);
    let prevPosition = $12uGp$useRef(0);
    // Keep track of the current handlers in a ref so that the events can access them.
    let handlers = $12uGp$useRef({
        onPositionChange: onPositionChange,
        onDrag: onDrag
    });
    handlers.current.onDrag = onDrag;
    handlers.current.onPositionChange = onPositionChange;
    let onMouseDragged = (e)=>{
        e.preventDefault();
        let nextOffset = getNextOffset(e);
        if (!dragging.current) {
            dragging.current = true;
            if (handlers.current.onDrag) handlers.current.onDrag(true);
            if (handlers.current.onPositionChange) handlers.current.onPositionChange(nextOffset);
        }
        if (prevPosition.current === nextOffset) return;
        prevPosition.current = nextOffset;
        if (onPositionChange) onPositionChange(nextOffset);
    };
    let onMouseUp = (e)=>{
        const target = e.target;
        dragging.current = false;
        let nextOffset = getNextOffset(e);
        if (handlers.current.onDrag) handlers.current.onDrag(false);
        if (handlers.current.onPositionChange) handlers.current.onPositionChange(nextOffset);
        utils_dist_module_$9cc09df9fd7676be$var$draggingElements.splice(utils_dist_module_$9cc09df9fd7676be$var$draggingElements.indexOf(target), 1);
        window.removeEventListener('mouseup', onMouseUp, false);
        window.removeEventListener('mousemove', onMouseDragged, false);
    };
    let onMouseDown = (e)=>{
        const target = e.currentTarget;
        // If we're already handling dragging on a descendant with useDrag1D, then
        // we don't want to handle the drag motion on this target as well.
        if (utils_dist_module_$9cc09df9fd7676be$var$draggingElements.some((elt)=>target.contains(elt)
        )) return;
        utils_dist_module_$9cc09df9fd7676be$var$draggingElements.push(target);
        window.addEventListener('mousemove', onMouseDragged, false);
        window.addEventListener('mouseup', onMouseUp, false);
    };
    let onMouseEnter = ()=>{
        if (onHover) onHover(true);
    };
    let onMouseOut = ()=>{
        if (onHover) onHover(false);
    };
    let onKeyDown = (e)=>{
        switch(e.key){
            case 'Left':
            case 'ArrowLeft':
                if (orientation === 'horizontal') {
                    e.preventDefault();
                    if (onDecrement && !reverse) onDecrement();
                    else if (onIncrement && reverse) onIncrement();
                }
                break;
            case 'Up':
            case 'ArrowUp':
                if (orientation === 'vertical') {
                    e.preventDefault();
                    if (onDecrement && !reverse) onDecrement();
                    else if (onIncrement && reverse) onIncrement();
                }
                break;
            case 'Right':
            case 'ArrowRight':
                if (orientation === 'horizontal') {
                    e.preventDefault();
                    if (onIncrement && !reverse) onIncrement();
                    else if (onDecrement && reverse) onDecrement();
                }
                break;
            case 'Down':
            case 'ArrowDown':
                if (orientation === 'vertical') {
                    e.preventDefault();
                    if (onIncrement && !reverse) onIncrement();
                    else if (onDecrement && reverse) onDecrement();
                }
                break;
            case 'Home':
                e.preventDefault();
                if (onDecrementToMin) onDecrementToMin();
                break;
            case 'End':
                e.preventDefault();
                if (onIncrementToMax) onIncrementToMax();
                break;
            case 'Enter':
                e.preventDefault();
                if (onCollapseToggle) onCollapseToggle();
                break;
        }
    };
    return {
        onMouseDown: onMouseDown,
        onMouseEnter: onMouseEnter,
        onMouseOut: onMouseOut,
        onKeyDown: onKeyDown
    };
}



function utils_dist_module_$03deb23ff14920c4$export$4eaf04e54aa8eed6() {
    let globalListeners = $12uGp$useRef(new Map());
    let addGlobalListener = $12uGp$useCallback((eventTarget, type, listener, options)=>{
        // Make sure we remove the listener after it is called with the `once` option.
        let fn = (options === null || options === void 0 ? void 0 : options.once) ? (...args)=>{
            globalListeners.current.delete(listener);
            listener(...args);
        } : listener;
        globalListeners.current.set(listener, {
            type: type,
            eventTarget: eventTarget,
            fn: fn,
            options: options
        });
        eventTarget.addEventListener(type, listener, options);
    }, []);
    let removeGlobalListener = $12uGp$useCallback((eventTarget, type, listener, options)=>{
        var ref;
        let fn = ((ref = globalListeners.current.get(listener)) === null || ref === void 0 ? void 0 : ref.fn) || listener;
        eventTarget.removeEventListener(type, fn, options);
        globalListeners.current.delete(listener);
    }, []);
    let removeAllGlobalListeners = $12uGp$useCallback(()=>{
        globalListeners.current.forEach((value, key)=>{
            removeGlobalListener(value.eventTarget, value.type, key, value.options);
        });
    }, [
        removeGlobalListener
    ]);
    // eslint-disable-next-line arrow-body-style
    $12uGp$useEffect(()=>{
        return removeAllGlobalListeners;
    }, [
        removeAllGlobalListeners
    ]);
    return {
        addGlobalListener: addGlobalListener,
        removeGlobalListener: removeGlobalListener,
        removeAllGlobalListeners: removeAllGlobalListeners
    };
}



function utils_dist_module_$313b98861ee5dd6c$export$d6875122194c7b44(props, defaultLabel) {
    let { id: id , 'aria-label': label , 'aria-labelledby': labelledBy  } = props;
    // If there is both an aria-label and aria-labelledby,
    // combine them by pointing to the element itself.
    id = utils_dist_module_$bdb11010cef70236$export$f680877a34711e37(id);
    if (labelledBy && label) {
        let ids = new Set([
            ...labelledBy.trim().split(/\s+/),
            id
        ]);
        labelledBy = [
            ...ids
        ].join(' ');
    } else if (labelledBy) labelledBy = labelledBy.trim().split(/\s+/).join(' ');
    // If no labels are provided, use the default
    if (!label && !labelledBy && defaultLabel) label = defaultLabel;
    return {
        id: id,
        'aria-label': label,
        'aria-labelledby': labelledBy
    };
}




function utils_dist_module_$df56164dff5785e2$export$4338b53315abf666(forwardedRef) {
    const objRef = $12uGp$useRef();
    /**
   * We're using `useLayoutEffect` here instead of `useEffect` because we want
   * to make sure that the `ref` value is up to date before other places in the
   * the execution cycle try to read it.
   */ utils_dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        if (!forwardedRef) return;
        if (typeof forwardedRef === 'function') forwardedRef(objRef.current);
        else forwardedRef.current = objRef.current;
    }, [
        forwardedRef
    ]);
    return objRef;
}



function utils_dist_module_$4f58c5f72bcf79f7$export$496315a1608d9602(effect, dependencies) {
    const isInitialMount = $12uGp$useRef(true);
    $12uGp$useEffect(()=>{
        if (isInitialMount.current) isInitialMount.current = false;
        else effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
}




function utils_dist_module_$9daab02d461809db$var$hasResizeObserver() {
    return typeof window.ResizeObserver !== 'undefined';
}
function utils_dist_module_$9daab02d461809db$export$683480f191c0e3ea(options) {
    const { ref: ref , onResize: onResize  } = options;
    $12uGp$useEffect(()=>{
        let element = ref === null || ref === void 0 ? void 0 : ref.current;
        if (!element) return;
        if (!utils_dist_module_$9daab02d461809db$var$hasResizeObserver()) {
            window.addEventListener('resize', onResize, false);
            return ()=>{
                window.removeEventListener('resize', onResize, false);
            };
        } else {
            const resizeObserverInstance = new window.ResizeObserver((entries)=>{
                if (!entries.length) return;
                onResize();
            });
            resizeObserverInstance.observe(element);
            return ()=>{
                if (element) resizeObserverInstance.unobserve(element);
            };
        }
    }, [
        onResize,
        ref
    ]);
}



function utils_dist_module_$e7801be82b4b2a53$export$4debdb1a3f0fa79e(context, ref) {
    utils_dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        if (context && context.ref && ref) {
            context.ref.current = ref.current;
            return ()=>{
                context.ref.current = null;
            };
        }
    }, [
        context,
        ref
    ]);
}


function utils_dist_module_$62d8ded9296f3872$export$cfa2225e87938781(node) {
    while(node && !utils_dist_module_$62d8ded9296f3872$var$isScrollable(node))node = node.parentElement;
    return node || document.scrollingElement || document.documentElement;
}
function utils_dist_module_$62d8ded9296f3872$var$isScrollable(node) {
    let style = window.getComputedStyle(node);
    return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}



// @ts-ignore
let utils_dist_module_$5df64b3807dc15ee$var$visualViewport = typeof window !== 'undefined' && window.visualViewport;
function utils_dist_module_$5df64b3807dc15ee$export$d699905dd57c73ca() {
    let [size1, setSize] = $12uGp$useState(()=>utils_dist_module_$5df64b3807dc15ee$var$getViewportSize()
    );
    $12uGp$useEffect(()=>{
        // Use visualViewport api to track available height even on iOS virtual keyboard opening
        let onResize = ()=>{
            setSize((size)=>{
                let newSize = utils_dist_module_$5df64b3807dc15ee$var$getViewportSize();
                if (newSize.width === size.width && newSize.height === size.height) return size;
                return newSize;
            });
        };
        if (!utils_dist_module_$5df64b3807dc15ee$var$visualViewport) window.addEventListener('resize', onResize);
        else utils_dist_module_$5df64b3807dc15ee$var$visualViewport.addEventListener('resize', onResize);
        return ()=>{
            if (!utils_dist_module_$5df64b3807dc15ee$var$visualViewport) window.removeEventListener('resize', onResize);
            else utils_dist_module_$5df64b3807dc15ee$var$visualViewport.removeEventListener('resize', onResize);
        };
    }, []);
    return size1;
}
function utils_dist_module_$5df64b3807dc15ee$var$getViewportSize() {
    return {
        width: (utils_dist_module_$5df64b3807dc15ee$var$visualViewport === null || utils_dist_module_$5df64b3807dc15ee$var$visualViewport === void 0 ? void 0 : utils_dist_module_$5df64b3807dc15ee$var$visualViewport.width) || window.innerWidth,
        height: (utils_dist_module_$5df64b3807dc15ee$var$visualViewport === null || utils_dist_module_$5df64b3807dc15ee$var$visualViewport === void 0 ? void 0 : utils_dist_module_$5df64b3807dc15ee$var$visualViewport.height) || window.innerHeight
    };
}




let utils_dist_module_$ef06256079686ba0$var$descriptionId = 0;
const utils_dist_module_$ef06256079686ba0$var$descriptionNodes = new Map();
function utils_dist_module_$ef06256079686ba0$export$f8aeda7b10753fa1(description) {
    let [id1, setId] = $12uGp$useState(null);
    utils_dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        if (!description) return;
        let desc = utils_dist_module_$ef06256079686ba0$var$descriptionNodes.get(description);
        if (!desc) {
            let id = `react-aria-description-${utils_dist_module_$ef06256079686ba0$var$descriptionId++}`;
            setId(id);
            let node = document.createElement('div');
            node.id = id;
            node.style.display = 'none';
            node.textContent = description;
            document.body.appendChild(node);
            desc = {
                refCount: 0,
                element: node
            };
            utils_dist_module_$ef06256079686ba0$var$descriptionNodes.set(description, desc);
        } else setId(desc.element.id);
        desc.refCount++;
        return ()=>{
            if (--desc.refCount === 0) {
                desc.element.remove();
                utils_dist_module_$ef06256079686ba0$var$descriptionNodes.delete(description);
            }
        };
    }, [
        description
    ]);
    return {
        'aria-describedby': description ? id1 : undefined
    };
}


/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ function utils_dist_module_$c87311424ea30a05$var$testUserAgent(re) {
    var ref;
    if (typeof window === 'undefined' || window.navigator == null) return false;
    return ((ref = window.navigator['userAgentData']) === null || ref === void 0 ? void 0 : ref.brands.some((brand)=>re.test(brand.brand)
    )) || re.test(window.navigator.userAgent);
}
function utils_dist_module_$c87311424ea30a05$var$testPlatform(re) {
    var ref;
    return typeof window !== 'undefined' && window.navigator != null ? re.test(((ref = window.navigator['userAgentData']) === null || ref === void 0 ? void 0 : ref.platform) || window.navigator.platform) : false;
}
function utils_dist_module_$c87311424ea30a05$export$9ac100e40613ea10() {
    return utils_dist_module_$c87311424ea30a05$var$testPlatform(/^Mac/i);
}
function utils_dist_module_$c87311424ea30a05$export$186c6964ca17d99() {
    return utils_dist_module_$c87311424ea30a05$var$testPlatform(/^iPhone/i);
}
function utils_dist_module_$c87311424ea30a05$export$7bef049ce92e4224() {
    return utils_dist_module_$c87311424ea30a05$var$testPlatform(/^iPad/i) || utils_dist_module_$c87311424ea30a05$export$9ac100e40613ea10() && navigator.maxTouchPoints > 1;
}
function utils_dist_module_$c87311424ea30a05$export$fedb369cb70207f1() {
    return utils_dist_module_$c87311424ea30a05$export$186c6964ca17d99() || utils_dist_module_$c87311424ea30a05$export$7bef049ce92e4224();
}
function utils_dist_module_$c87311424ea30a05$export$e1865c3bedcd822b() {
    return utils_dist_module_$c87311424ea30a05$export$9ac100e40613ea10() || utils_dist_module_$c87311424ea30a05$export$fedb369cb70207f1();
}
function utils_dist_module_$c87311424ea30a05$export$78551043582a6a98() {
    return utils_dist_module_$c87311424ea30a05$var$testUserAgent(/AppleWebKit/i) && !utils_dist_module_$c87311424ea30a05$export$6446a186d09e379e();
}
function utils_dist_module_$c87311424ea30a05$export$6446a186d09e379e() {
    return utils_dist_module_$c87311424ea30a05$var$testUserAgent(/Chrome/i);
}
function utils_dist_module_$c87311424ea30a05$export$a11b0059900ceec8() {
    return utils_dist_module_$c87311424ea30a05$var$testUserAgent(/Android/i);
}



function utils_dist_module_$e9faafb641e167db$export$90fc3a17d93f704c(ref, event, handler1, options) {
    let handlerRef = $12uGp$useRef(handler1);
    handlerRef.current = handler1;
    let isDisabled = handler1 == null;
    $12uGp$useEffect(()=>{
        if (isDisabled) return;
        let element = ref.current;
        let handler = (e)=>handlerRef.current.call(this, e)
        ;
        element.addEventListener(event, handler, options);
        return ()=>{
            element.removeEventListener(event, handler, options);
        };
    }, [
        ref,
        event,
        options,
        isDisabled
    ]);
}




function utils_dist_module_$1dbecbe27a04f9af$export$14d238f342723f25(defaultValue) {
    let [value, setValue] = $12uGp$useState(defaultValue);
    let valueRef = $12uGp$useRef(value);
    let effect = $12uGp$useRef(null);
    valueRef.current = value;
    // Store the function in a ref so we can always access the current version
    // which has the proper `value` in scope.
    let nextRef = $12uGp$useRef(null);
    nextRef.current = ()=>{
        // Run the generator to the next yield.
        let newValue = effect.current.next();
        // If the generator is done, reset the effect.
        if (newValue.done) {
            effect.current = null;
            return;
        }
        // If the value is the same as the current value,
        // then continue to the next yield. Otherwise,
        // set the value in state and wait for the next layout effect.
        if (value === newValue.value) nextRef.current();
        else setValue(newValue.value);
    };
    utils_dist_module_$f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(()=>{
        // If there is an effect currently running, continue to the next yield.
        if (effect.current) nextRef.current();
    });
    let queue = $12uGp$useCallback((fn)=>{
        effect.current = fn(valueRef.current);
        nextRef.current();
    }, [
        effect,
        nextRef
    ]);
    return [
        value,
        queue
    ];
}


function utils_dist_module_$2f04cbc44ee30ce0$export$53a0910f038337bd(scrollView, element) {
    let offsetX = utils_dist_module_$2f04cbc44ee30ce0$var$relativeOffset(scrollView, element, 'left');
    let offsetY = utils_dist_module_$2f04cbc44ee30ce0$var$relativeOffset(scrollView, element, 'top');
    let width = element.offsetWidth;
    let height = element.offsetHeight;
    let x = scrollView.scrollLeft;
    let y = scrollView.scrollTop;
    let maxX = x + scrollView.offsetWidth;
    let maxY = y + scrollView.offsetHeight;
    if (offsetX <= x) x = offsetX;
    else if (offsetX + width > maxX) x += offsetX + width - maxX;
    if (offsetY <= y) y = offsetY;
    else if (offsetY + height > maxY) y += offsetY + height - maxY;
    scrollView.scrollLeft = x;
    scrollView.scrollTop = y;
}
/**
 * Computes the offset left or top from child to ancestor by accumulating
 * offsetLeft or offsetTop through intervening offsetParents.
 */ function utils_dist_module_$2f04cbc44ee30ce0$var$relativeOffset(ancestor, child, axis) {
    const prop = axis === 'left' ? 'offsetLeft' : 'offsetTop';
    let sum = 0;
    while(child.offsetParent){
        sum += child[prop];
        if (child.offsetParent === ancestor) break;
        else if (child.offsetParent.contains(ancestor)) {
            // If the ancestor is not `position:relative`, then we stop at
            // _its_ offset parent, and we subtract off _its_ offset, so that
            // we end up with the proper offset from child to ancestor.
            sum -= ancestor[prop];
            break;
        }
        child = child.offsetParent;
    }
    return sum;
}






//# sourceMappingURL=module.js.map

;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/utils/console.js
const o={};const warn=(n,e)=>{const r=`[Next UI]${e?` [${e}]`:" "}: ${n}`;if("undefined"!=typeof console&&!o[r]){if(o[r]=!0,"production"!=="production")return console.error(r);console.warn(r)}};
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/theme/stitches.config.js + 1 modules
var stitches_config = __webpack_require__(6212);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/utils/with-defaults.js
var with_defaults = __webpack_require__(88);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/utils/clsx.js
var utils_clsx = __webpack_require__(1309);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/utils/drip.js
const a=(0,stitches_config/* keyframes */.F4)({"0%":{opacity:0,transform:"scale(0.25)"},"30%":{opacity:1},"80%":{opacity:.5},"100%":{transform:"scale(28)",opacity:0}});const StyledDrip=(0,stitches_config/* styled */.zo)("div",{position:"absolute",left:0,right:0,top:0,bottom:0,"& svg":{position:"absolute",animation:`350ms linear ${a}`,animationFillMode:"forwards",width:"$md",height:"$md"}});const m=({visible:t,x:o,y:r,color:l,onCompleted:a,className:m,...c})=>{const d=(0,react.useRef)(null),p=Number.isNaN(+r)?0:r-10,f=Number.isNaN(+o)?0:o-10;return (0,react.useEffect)((()=>{let t=d.current;if(t)return t.addEventListener("animationend",a),()=>{t&&t.removeEventListener("animationend",a)}})),t?(0,jsx_runtime.jsx)(StyledDrip,{ref:d,className:(0,utils_clsx/* default */.Z)("nextui-drip",m),...c,children:(0,jsx_runtime.jsx)("svg",{height:"20",style:{top:p,left:f},viewBox:"0 0 20 20",width:"20",children:(0,jsx_runtime.jsx)("g",{fill:"none",fillRule:"evenodd",stroke:"none",strokeWidth:"1",children:(0,jsx_runtime.jsx)("g",{className:"nextui-drip-filler",fill:l,children:(0,jsx_runtime.jsx)("rect",{height:"100%",rx:"10",width:"100%"})})})})}):null},c=react.memo(m);/* harmony default export */ var drip = ((0,with_defaults/* default */.Z)(c,{visible:!1,x:0,y:0,className:""}));
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/use-drip/use-drip.js
/* harmony default export */ var use_drip = ((e=!1,n)=>{const[r,o]=(0,react.useState)(e),[c,i]=(0,react.useState)(0),[l,u]=(0,react.useState)(0);return{visible:r,x:c,y:l,onClick:t=>{if(!n.current)return;const e=n.current.getBoundingClientRect();o(!0),i(t.clientX-e.left),u(t.clientY-e.top)},onCompleted:()=>{o(!1),i(0),u(0)}}});
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/use-drip/index.js
/* harmony default export */ var esm_use_drip = (use_drip);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/utils/dom.js
var dom = __webpack_require__(2903);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/utils/assertion.js
var assertion = __webpack_require__(3569);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/utils/system.js
function forwardRef(f){return (0,react.forwardRef)(f)}
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/button/utils.js
const filterPropsWithGroup=(e,o)=>{var r,t,n,l,d,a,i,s,g,u,b;return o.isButtonGroup?{...e,auto:!0,shadow:!1,bordered:null!=(r=o.bordered)?r:e.bordered,borderWeight:null!=(t=o.borderWeight)?t:e.borderWeight,ghost:null!=(n=o.ghost)?n:e.ghost,ripple:null!=(l=o.ripple)?l:e.ripple,flat:null!=(d=o.flat)?d:e.flat,animated:null!=(a=o.animated)?a:e.animated,rounded:null!=(i=o.rounded)?i:e.rounded,light:null!=(s=o.light)?s:e.light,size:null!=(g=o.size)?g:e.size,color:null!=(u=o.color)?u:e.color,disabled:null!=(b=o.disabled)?b:e.disabled}:e};const getCssColors=e=>{if(!e.disabled)return e.auto&&"gradient"===e.color&&(e.bordered||e.ghost)?{px:"$$buttonBorderWeight",py:"$$buttonBorderWeight"}:{};const o={bg:"$accents1",color:"$accents7",transform:"none",boxShadow:"none",pe:"none"};return e.bordered||e.flat||e.ghost||e.light?"gradient"===e.color&&(e.bordered||e.ghost)?{color:"$accents4",backgroundImage:"linear-gradient($background, $background), linear-gradient($accents2, $accents2)",transform:"none",boxShadow:"none",pe:"none",pl:"$$buttonBorderWeight",pr:"$$buttonBorderWeight"}:e.bordered||e.ghost||e.light?{...o,bg:"transparent",borderColor:"$accents4"}:e.flat?{...o,bg:"$accents1"}:{}:o};
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/button/button-group-context.js
const button_group_context_o={isButtonGroup:!1,disabled:!1};const ButtonGroupContext=react.createContext(button_group_context_o);const useButtonGroupContext=()=>react.useContext(ButtonGroupContext);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/button/button-icon.js
const StyledButtonIcon=(0,stitches_config/* styled */.zo)("span",{dflex:"center",position:"absolute",left:"$$buttonPadding",right:"auto",top:"50%",transform:"translateY(-50%)",color:"inherit",zIndex:"$1","& svg":{background:"transparent"},variants:{isAuto:{true:{position:"relative",transform:"none",top:"0%"}},isRight:{true:{right:"$$buttonPadding",left:"auto"}},isSingle:{true:{position:"static",transform:"none"}},isGradientButtonBorder:{true:{}}},compoundVariants:[{isAuto:!0,isRight:!0,isSingle:!1,css:{order:2,ml:"calc($$buttonPadding / 2)",right:"0%",left:"0%"}},{isAuto:!0,isRight:!1,isSingle:!1,css:{order:0,mr:"calc($$buttonPadding / 2)",right:"0%",left:"0%"}},{isSingle:!0,isRight:!1,css:{ml:0}},{isSingle:!0,isRight:!0,css:{mr:0}},{isSingle:!0,isRight:!1,isGradientButtonBorder:!0,css:{mr:"calc($$buttonPadding / 2)"}}]});const e=({children:t,className:i,css:n,...e})=>(0,jsx_runtime.jsx)(StyledButtonIcon,{className:(0,utils_clsx/* default */.Z)("nextui-button-icon",{"nextui-button-icon-right":e.isRight,"nextui-button-icon-single":e.isSingle},i),css:{...n},...e,children:t});e.toString=()=>".nextui-button-icon";const button_icon_r=react.memo(e);/* harmony default export */ var button_icon = ((0,with_defaults/* default */.Z)(button_icon_r,{className:""}));
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/theme/shared-css.js
var shared_css = __webpack_require__(9975);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/button/button.styles.js
const StyledButton=(0,stitches_config/* styled */.zo)("button",{$$buttonBorderRadius:"$radii$md",$$buttonPressedScale:.97,dflex:"center",appearance:"none",boxSizing:"border-box",fontWeight:"$medium",us:"none",lineHeight:"$sm",ta:"center",whiteSpace:"nowrap",transition:"$button",position:"relative",overflow:"hidden",border:"none",cursor:"pointer",pe:"auto",p:0,br:"$$buttonBorderRadius","@motion":{transition:"none"},".nextui-button-text":{dflex:"center",zIndex:"$2","p, pre, div":{margin:0}},[`& ${StyledDrip}`]:{zIndex:"$1",".nextui-drip-filler":{opacity:.25,fill:"$accents2"}},variants:{bordered:{true:{bg:"transparent",borderStyle:"solid",color:"$text"}},ghost:{true:{}},color:{default:{bg:"$primary",color:"$primarySolidContrast"},primary:{bg:"$primary",color:"$primarySolidContrast"},secondary:{bg:"$secondary",color:"$secondarySolidContrast"},success:{bg:"$success",color:"$successSolidContrast"},warning:{bg:"$warning",color:"$warningSolidContrast"},error:{bg:"$error",color:"$errorSolidContrast"},gradient:{bg:"$gradient",color:"$primarySolidContrast"}},size:{xs:{$$buttonPadding:"$space$3",$$buttonBorderRadius:"$radii$xs",$$buttonHeight:"$space$10",px:"$3",height:"$$buttonHeight",lh:"$space$10",width:"auto",minWidth:"$20",fontSize:"$xs"},sm:{$$buttonPadding:"$space$5",$$buttonBorderRadius:"$radii$sm",$$buttonHeight:"$space$12",px:"$5",height:"$$buttonHeight",lh:"$space$14",width:"auto",minWidth:"$36",fontSize:"$sm"},md:{$$buttonPadding:"$space$7",$$buttonBorderRadius:"$radii$md",$$buttonHeight:"$space$14",px:"$7",height:"$$buttonHeight",lh:"$space$14",width:"auto",minWidth:"$48",fontSize:"$sm"},lg:{$$buttonPadding:"$space$9",$$buttonBorderRadius:"$radii$base",$$buttonHeight:"$space$16",px:"$9",height:"$$buttonHeight",lh:"$space$15",width:"auto",minWidth:"$60",fontSize:"$md"},xl:{$$buttonPadding:"$space$10",$$buttonBorderRadius:"$radii$xl",$$buttonHeight:"$space$18",px:"$10",height:"$$buttonHeight",lh:"$space$17",width:"auto",minWidth:"$72",fontSize:"$lg"}},borderWeight:{light:{bw:"$light",$$buttonBorderWeight:"$borderWeights$light"},normal:{bw:"$normal",$$buttonBorderWeight:"$borderWeights$normal"},bold:{bw:"$bold",$$buttonBorderWeight:"$borderWeights$bold"},extrabold:{bw:"$extrabold",$$buttonBorderWeight:"$borderWeights$extrabold"},black:{bw:"$black",$$buttonBorderWeight:"$borderWeights$black"}},flat:{true:{color:"$text"}},light:{true:{bg:"transparent",[`& ${StyledDrip}`]:{".nextui-drip-filler":{opacity:.8,fill:"$accents2"}}}},shadow:{true:{bs:"$sm"}},animated:{false:{transition:"none"}},auto:{true:{width:"auto",minWidth:"min-content"}},rounded:{true:{$$buttonBorderRadius:"$radii$pill"}},isPressed:{true:{}},isHovered:{true:{}},isChildLess:{true:{p:0,width:"$$buttonHeight",height:"$$buttonHeight"}}},compoundVariants:[{isPressed:!0,animated:!0,css:{transform:"scale($$buttonPressedScale)"}},{auto:!0,isChildLess:!1,size:"xs",css:{px:"$5",minWidth:"min-content"}},{auto:!0,isChildLess:!1,size:"sm",css:{px:"$8",minWidth:"min-content"}},{auto:!0,isChildLess:!1,size:"md",css:{px:"$9",minWidth:"min-content"}},{auto:!0,isChildLess:!1,size:"lg",css:{px:"$10",minWidth:"min-content"}},{auto:!0,isChildLess:!1,size:"xl",css:{px:"$11",minWidth:"min-content"}},{shadow:!0,color:"default",css:{normalShadow:"$primaryShadow"}},{shadow:!0,color:"primary",css:{normalShadow:"$primaryShadow"}},{shadow:!0,color:"secondary",css:{normalShadow:"$secondaryShadow"}},{shadow:!0,color:"warning",css:{normalShadow:"$warningShadow"}},{shadow:!0,color:"success",css:{normalShadow:"$successShadow"}},{shadow:!0,color:"error",css:{normalShadow:"$errorShadow"}},{shadow:!0,color:"gradient",css:{normalShadow:"$primaryShadow"}},{light:!0,color:"default",css:{bg:"transparent",color:"$text",[`& ${StyledDrip}`]:{".nextui-drip-filler":{opacity:.8,fill:"$primaryLightActive"}}}},{light:!0,color:"primary",css:{bg:"transparent",color:"$primary",[`& ${StyledDrip}`]:{".nextui-drip-filler":{opacity:.8,fill:"$primaryLightActive"}}}},{light:!0,color:"secondary",css:{bg:"transparent",color:"$secondary",[`& ${StyledDrip}`]:{".nextui-drip-filler":{opacity:.8,fill:"$secondaryLightActive"}}}},{light:!0,color:"warning",css:{bg:"transparent",color:"$warning",[`& ${StyledDrip}`]:{".nextui-drip-filler":{opacity:.8,fill:"$warningLightActive"}}}},{light:!0,color:"success",css:{bg:"transparent",color:"$success",[`& ${StyledDrip}`]:{".nextui-drip-filler":{opacity:.8,fill:"$successLightActive"}}}},{light:!0,color:"error",css:{bg:"transparent",color:"$error",[`& ${StyledDrip}`]:{".nextui-drip-filler":{opacity:.8,fill:"$errorLightActive"}}}},{bordered:!0,color:"default",css:{bg:"transparent",borderColor:"$primary",color:"$primary",[`& ${StyledDrip}`]:{".nextui-drip-filler":{fill:"$primary"}}}},{bordered:!0,color:"primary",css:{bg:"transparent",borderColor:"$primary",color:"$primary",[`& ${StyledDrip}`]:{".nextui-drip-filler":{fill:"$primary"}}}},{bordered:!0,color:"secondary",css:{bg:"transparent",borderColor:"$secondary",color:"$secondary",[`& ${StyledDrip}`]:{".nextui-drip-filler":{fill:"$secondary"}}}},{bordered:!0,color:"success",css:{bg:"transparent",borderColor:"$success",color:"$success",[`& ${StyledDrip}`]:{".nextui-drip-filler":{fill:"$success"}}}},{bordered:!0,color:"warning",css:{bg:"transparent",borderColor:"$warning",color:"$warning",[`& ${StyledDrip}`]:{".nextui-drip-filler":{fill:"$warning"}}}},{bordered:!0,color:"error",css:{bg:"transparent",borderColor:"$error",color:"$error",[`& ${StyledDrip}`]:{".nextui-drip-filler":{fill:"$error"}}}},{bordered:!0,color:"gradient",css:{bg:"transparent",color:"$text",padding:"$$buttonBorderWeight",bgClip:"content-box, border-box",borderColor:"$primary",backgroundImage:"linear-gradient($background, $background), $gradient",border:"none",[`& ${StyledDrip}`]:{".nextui-drip-filler":{fill:"$secondary"}}}},{ghost:!0,isHovered:!0,color:"default",css:{bg:"$primary",color:"$primarySolidContrast"}},{ghost:!0,isHovered:!0,color:"primary",css:{bg:"$primary",color:"$primarySolidContrast"}},{ghost:!0,isHovered:!0,color:"secondary",css:{bg:"$secondary",color:"$secondarySolidContrast"}},{ghost:!0,isHovered:!0,color:"success",css:{bg:"$success",color:"$successSolidContrast"}},{ghost:!0,isHovered:!0,color:"warning",css:{bg:"$warning",color:"$warningSolidContrast"}},{ghost:!0,isHovered:!0,color:"error",css:{bg:"$error",color:"$errorSolidContrast"}},{ghost:!0,color:"gradient",isHovered:!0,css:{bg:"$gradient",color:"$white"}},{flat:!0,color:"default",css:{bg:"$primaryLight",color:"$primaryLightContrast",[`& ${StyledDrip}`]:{".nextui-drip-filler":{opacity:.4,fill:"$primary"}}}},{flat:!0,color:"primary",css:{bg:"$primaryLight",color:"$primaryLightContrast",[`& ${StyledDrip}`]:{".nextui-drip-filler":{opacity:.4,fill:"$primary"}}}},{flat:!0,color:"secondary",css:{bg:"$secondaryLight",color:"$secondaryLightContrast",[`& ${StyledDrip}`]:{".nextui-drip-filler":{opacity:.4,fill:"$secondary"}}}},{flat:!0,color:"success",css:{bg:"$successLight",color:"$successLightContrast",[`& ${StyledDrip}`]:{".nextui-drip-filler":{opacity:.4,fill:"$success"}}}},{flat:!0,color:"warning",css:{bg:"$warningLight",color:"$warningLightContrast",[`& ${StyledDrip}`]:{".nextui-drip-filler":{opacity:.4,fill:"$warning"}}}},{flat:!0,color:"error",css:{bg:"$errorLight",color:"$errorLightContrast",[`& ${StyledDrip}`]:{".nextui-drip-filler":{opacity:.4,fill:"$error"}}}},{flat:!0,isHovered:!0,color:"default",css:{bg:"$primaryLightHover"}},{flat:!0,isHovered:!0,color:"primary",css:{bg:"$primaryLightHover"}},{flat:!0,isHovered:!0,color:"secondary",css:{bg:"$secondaryLightHover"}},{flat:!0,isHovered:!0,color:"success",css:{bg:"$successLightHover"}},{flat:!0,isHovered:!0,color:"warning",css:{bg:"$warningLightHover"}},{flat:!0,isHovered:!0,color:"error",css:{bg:"$errorLightHover"}},{flat:!0,isPressed:!0,color:"default",css:{bg:"$primaryLightActive"}},{flat:!0,isPressed:!0,color:"primary",css:{bg:"$primaryLightActive"}},{flat:!0,isPressed:!0,color:"secondary",css:{bg:"$secondaryLightActive"}},{flat:!0,isPressed:!0,color:"success",css:{bg:"$successLightActive"}},{flat:!0,isPressed:!0,color:"warning",css:{bg:"$warningLightActive"}},{flat:!0,isPressed:!0,color:"error",css:{bg:"$errorLightActive"}},{auto:!0,color:"gradient",bordered:!0,css:{".nextui-button-text":{px:"$$buttonPadding"},".nextui-button-icon":{ml:"$$buttonPadding"},".nextui-button-icon-right":{mr:"$$buttonPadding"},".nextui-button-text-left":{pl:0},".nextui-button-text-right":{pr:0}}},{rounded:!0,size:"xs",css:{br:"$pill"}},{rounded:!0,size:"sm",css:{br:"$pill"}},{rounded:!0,size:"md",css:{br:"$pill"}},{rounded:!0,size:"lg",css:{br:"$pill"}},{rounded:!0,size:"xl",css:{br:"$pill"}}],defaultVariants:{color:"default",borderWeight:"normal",animated:!0,size:"md"}},shared_css/* cssFocusVisible */.BM);/* harmony default export */ var button_styles = (StyledButton);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/button/button.js
const C=forwardRef(((d,p)=>{const{as:C,css:v,iconLeftCss:N,iconRightCss:F,onClick:B,onPress:j,onPressStart:S,onPressEnd:k,onPressChange:R,onPressUp:U,...T}=d,A=useButtonGroupContext(),D=filterPropsWithGroup(T,A),E=getCssColors(D),{flat:G,children:H,disabled:L,animated:V,light:W,ripple:I,bordered:$,auto:q,borderWeight:z,icon:J,iconRight:K,ghost:M,autoFocus:O,className:Q,...X}=D,Y=t=>{V&&I&&Z.current&&nt(t)},Z=(0,dom/* useDOMRef */.gy)(p),{buttonProps:_,isPressed:tt}=$701a24aa0da5b062$export$ea18c227d4417cc3({...T,isDisabled:L,elementType:C,onPress:t=>{"keyboard"===t.pointerType||"virtual"===t.pointerType?Y(t):"undefined"!=typeof window&&window.event&&Y(window.event),B&&(B(t),console.warn("onClick is deprecated, please use onPress")),null==j||j(t)},onPressStart:S,onPressEnd:k,onPressChange:R,onPressUp:U},Z),{hoverProps:et,isHovered:ot}=dist_module_$6179b936705e76d3$export$ae780daf29e6d456({isDisabled:L}),{isFocused:rt,isFocusVisible:st,focusProps:it}=$f7dceffc5ad7768b$export$4e328f61c538687f({autoFocus:O}),{onClick:nt,...at}=esm_use_drip(!1,Z);assertion/* __DEV__ */.Ts&&"gradient"===D.color&&(G||W)&&warn("Using the gradient color on flat and light buttons will have no effect.");const lt=J||K,ut=0===react.Children.count(H),dt=Boolean(K),ct=(0,react.useMemo)((()=>tt?"pressed":ot?"hovered":L?"disabled":"ready"),[L,ot,tt]),mt=(0,react.useMemo)((()=>dt?F:N),[dt,F,N]);return (0,jsx_runtime.jsxs)(button_styles,{ref:Z,animated:V,as:C,auto:q,borderWeight:z,bordered:$||M,className:(0,utils_clsx/* default */.Z)("nextui-button",`nextui-button--${ct}`,Q),css:{...v,...E},"data-state":ct,flat:G,ghost:M,isChildLess:ut,isFocusVisible:st&&!L,isHovered:ot||M&&rt,isPressed:tt,light:W,...utils_dist_module_$3ef42575df84b30b$export$9d1611c77c2fe928(_,it,et,X),children:[0===react.Children.count(H)?(0,jsx_runtime.jsx)(button_icon,{isSingle:!0,css:mt,isAuto:q,isGradientButtonBorder:"gradient"===d.color&&($||M),isRight:dt,children:lt}):lt?(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(button_icon,{css:mt,isAuto:q,isGradientButtonBorder:"gradient"===d.color&&($||M),isRight:dt,isSingle:!1,children:lt}),(0,jsx_runtime.jsx)("div",{className:(0,utils_clsx/* default */.Z)("nextui-button-text",{"nextui-button-text-right":dt,"nextui-button-text-left":!dt}),children:H})]}):(0,jsx_runtime.jsx)("span",{className:"nextui-button-text",children:H}),(0,jsx_runtime.jsx)(drip,{className:"nextui-button-drip",color:"white",...at})]})}));assertion/* __DEV__ */.Ts&&(C.displayName="NextUI.Button"),C.toString=()=>".nextui-button";/* harmony default export */ var button_button = ((0,with_defaults/* default */.Z)(C,{ghost:!1,bordered:!1,ripple:!0,animated:!0,disabled:!1,autoFocus:!1,auto:!1,className:"",type:"button"}));
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/button/button-group.styles.js
const StyledButtonGroup=(0,stitches_config/* styled */.zo)("div",{display:"inline-flex",margin:"$3",backgroundColor:"transparent",height:"min-content",[`& ${button_styles}`]:{".nextui-button-text":{top:0}},variants:{vertical:{true:{fd:"column",[`& ${button_styles}`]:{"&:not(:first-child)":{btlr:0,btrr:0},"&:not(:last-child)":{bblr:0,bbrr:0}}},false:{fd:"row",[`& ${button_styles}`]:{"&:not(:first-child)":{btlr:0,bblr:0},"&:not(:last-child)":{btrr:0,bbrr:0}}}},size:{xs:{br:"$xs"},sm:{br:"$sm"},md:{br:"$md"},lg:{br:"$base"},xl:{br:"$xl"}},rounded:{true:{br:"$pill"}},bordered:{true:{bg:"transparent"}},gradient:{true:{pl:0}}},defaultVariants:{vertical:!1},compoundVariants:[{bordered:!0,vertical:!0,css:{[`& ${button_styles}`]:{"&:not(:last-child)":{borderBottom:"none",paddingBottom:"0"}}}},{bordered:!0,vertical:!1,css:{[`& ${button_styles}`]:{"&:not(:first-child)":{borderLeft:"none"}}}},{bordered:!0,vertical:!1,gradient:!0,css:{[`& ${button_styles}`]:{"&:not(:last-child)&:not(:first-child)":{pl:0},"&:last-child":{pl:0}}}}]});/* harmony default export */ var button_group_styles = (StyledButtonGroup);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/button/button-group.js
const button_group_a=o=>{const{disabled:t,size:a,color:l,bordered:n,ghost:s,light:u,flat:m,shadow:p,auto:c,animated:g,rounded:h,ripple:b,borderWeight:f,children:x,...z}=o,w=(0,react.useMemo)((()=>({disabled:t,size:a,color:l,bordered:n,light:u,ghost:s,flat:m,shadow:p,auto:c,borderWeight:f,animated:g,rounded:h,ripple:b,isButtonGroup:!0})),[t,g,a,b,l,n,u,s,m,f]);return (0,jsx_runtime.jsx)(ButtonGroupContext.Provider,{value:w,children:(0,jsx_runtime.jsx)(button_group_styles,{bordered:n||s,gradient:"gradient"===o.color,size:a,...z,children:x})})};button_group_a.toString=()=>".nextui-button-group";const l=react.memo(button_group_a);/* harmony default export */ var button_group = ((0,with_defaults/* default */.Z)(l,{borderWeight:"normal",size:"md",color:"default"}));
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/button/index.js
button_button.Group=button_group;/* harmony default export */ var esm_button = (button_button);

/***/ }),

/***/ 3165:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ esm_container; }
});

// UNUSED EXPORTS: StyledContainer

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(7294);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/utils/dom.js
var dom = __webpack_require__(2903);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/theme/stitches.config.js + 1 modules
var stitches_config = __webpack_require__(6212);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/container/container.styles.js
const StyledContainer=(0,stitches_config/* styled */.zo)("div",{w:"100%",mr:"auto",ml:"auto",variants:{fluid:{true:{maxWidth:"100%"}},responsive:{true:{"@xs":{maxWidth:"$breakpoints$xs"},"@sm":{maxWidth:"$breakpoints$sm"},"@md":{maxWidth:"$breakpoints$md"},"@lg":{maxWidth:"$breakpoints$lg"},"@xl":{maxWidth:"$breakpoints$xl"}}}},defaultVariants:{fluid:!1,responsive:!0}});/* harmony default export */ var container_styles = (StyledContainer);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/container/container.js
const a=react.forwardRef(((s,a)=>{const{xs:n,sm:o,md:l,lg:p,xl:m,wrap:d,gap:c,as:f,display:x,justify:$,direction:u,alignItems:g,alignContent:y,children:b,responsive:k,fluid:j,css:v,...w}=s,C=(0,dom/* useDOMRef */.gy)(a),h=(0,react.useMemo)((()=>`calc(${c} * $space$sm)`),[c]);return (0,jsx_runtime.jsx)(container_styles,{ref:C,as:f,css:{px:h,maxWidth:n?"$breakpoints$xs":o?"$breakpoints$sm":l?"$breakpoints$md":p?"$breakpoints$lg":m?"$breakpoints$xl":"",alignItems:g,alignContent:y,flexWrap:d,display:x,justifyContent:$,flexDirection:u,...v},fluid:j,responsive:k,...w,children:b})}));a.displayName="NextUI.Container",a.toString=()=>".nextui-container",a.defaultProps={gap:2,xs:!1,sm:!1,md:!1,lg:!1,xl:!1,responsive:!0,fluid:!1,wrap:"wrap",as:"div",display:"block"};/* harmony default export */ var container = (react.memo(a));
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/container/index.js
/* harmony default export */ var esm_container = (container);

/***/ }),

/***/ 2553:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ZP": function() { return /* binding */ esm_grid; }
});

// UNUSED EXPORTS: StyledGridContainer, StyledGridItem

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(7294);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/utils/clsx.js
var clsx = __webpack_require__(1309);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/utils/with-defaults.js
var with_defaults = __webpack_require__(88);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/theme/stitches.config.js + 1 modules
var stitches_config = __webpack_require__(6212);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/grid/grid.styles.js
const StyledGridContainer=(0,stitches_config/* styled */.zo)("div",{});const StyledGridItem=(0,stitches_config/* styled */.zo)("div",{margin:0,boxSizing:"border-box",padding:"$$gridGapUnit"});
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/grid/grid-item.js
const l=t=>{const s=0===t?"none":"inherit";if("number"==typeof t){const e=100/12*t,i=e>100?"100%":e<0?"0":`${e}%`;return{flexGrow:0,display:s,maxWidth:i,flexBasis:i}}return{flexGrow:1,display:s,maxWidth:"100%",flexBasis:"0"}},n=react.forwardRef((({xs:t,sm:i,md:n,lg:o,xl:x,css:a,justify:d,direction:c,alignItems:f,alignContent:u,children:g,className:p,...y},h)=>{const j=(0,react.useMemo)((()=>{const s={xs:t,sm:i,md:n,lg:o,xl:x};return Object.keys(s).reduce(((t,e)=>void 0!==s[e]&&!1!==s[e]?`${t} ${e}`:t),"").trim()}),[t,i,n,o,x]);return (0,jsx_runtime.jsx)(StyledGridItem,{ref:h,className:(0,clsx/* default */.Z)("nextui-grid-item",j,p),css:{alignItems:f,alignContent:u,justifyContent:d,flexDirection:c,"&.xs":{...l(t)},"@xsMax":{"&.xs":{...l(t)}},"@sm":{"&.sm":{...l(i)}},"@md":{"&.md":{...l(n)}},"@lg":{"&.lg":{...l(o)}},"@xl":{"&.xl":{...l(x)}},...a},...y,children:g})}));n.displayName="NextUI.GridItem",n.toString=()=>".nextui-grid-item";/* harmony default export */ var grid_item = ((0,with_defaults/* default */.Z)(n,{xs:!1,sm:!1,md:!1,lg:!1,xl:!1,className:""}));
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/grid/grid.js
const i=react.forwardRef((({children:r,css:i,...o},m)=>(0,jsx_runtime.jsx)(grid_item,{ref:m,css:{...i},...o,children:r})));i.displayName="NextUI.Grid",i.toString=()=>".nextui-grid";/* harmony default export */ var grid = (i);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/grid/grid-container.js
const c=react.forwardRef((({gap:r,wrap:t,css:c,children:o,className:n,...p},l)=>{const m=(0,react.useMemo)((()=>`calc(${r} * $space$3)`),[r]);return (0,jsx_runtime.jsx)(grid_item,{ref:l,className:(0,clsx/* default */.Z)("nextui-grid-container",n),css:{$$gridGapUnit:m,display:"flex",flexWrap:t,boxSizing:"border-box",margin:"calc(-1 * $$gridGapUnit)",width:"calc(100% + $$gridGapUnit * 2)",...c},...p,children:o})}));c.displayName="NextUI.GridContainer",c.toString=()=>".nextui-grid-container";/* harmony default export */ var grid_container = ((0,with_defaults/* default */.Z)(c,{gap:0,wrap:"wrap",className:""}));
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/grid/index.js
grid.Container=grid_container;/* harmony default export */ var esm_grid = (grid);

/***/ }),

/***/ 6979:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ esm_text; }
});

// UNUSED EXPORTS: StyledText

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(7294);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/utils/dom.js
var dom = __webpack_require__(2903);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/utils/assertion.js
var assertion = __webpack_require__(3569);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/utils/color.js + 1 modules
var color = __webpack_require__(3917);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/theme/stitches.config.js + 1 modules
var stitches_config = __webpack_require__(6212);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/theme/shared-css.js
var shared_css = __webpack_require__(9975);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/text/text.styles.js
const StyledText=(0,stitches_config/* styled */.zo)("p",{variants:{weight:{hairline:{fontWeight:"$hairline"},thin:{fontWeight:"$thin"},light:{fontWeight:"$light"},normal:{fontWeight:"$normal"},medium:{fontWeight:"$medium"},semibold:{fontWeight:"$semibold"},bold:{fontWeight:"$bold"},extrabold:{fontWeight:"$extrabold"},black:{fontWeight:"$black"}}}},shared_css/* cssHideShowIn */.Zj);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/text/child.js
const TextChild=react.forwardRef(((t,i)=>{const{children:m,tag:d,color:f="default",transform:x,size:a,css:c,...n}=t,p=(0,dom/* useDOMRef */.gy)(i),u=(0,react.useMemo)((()=>(0,color/* isNormalColor */.h1)(f)?"default"===f?"$text":`$${f}`:f),[f]);return (0,jsx_runtime.jsx)(StyledText,{ref:p,as:d,css:{color:u,fontSize:a,tt:x,...c},...n,children:m})}));assertion/* __DEV__ */.Ts&&(TextChild.displayName="NextUI.TextChild"),TextChild.toString=()=>".nextui-text-child";/* harmony default export */ var child = (react.memo(TextChild));
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/text/text.js
const n=(t,e,r,o)=>{if(!t.length)return e;const l=t.slice(1,t.length);return (0,jsx_runtime.jsx)(child,{size:r,tag:t[0],transform:o,children:n(l,e,r)})};const Text=react.forwardRef(((t,o)=>{const{h1:l=!1,h2:m=!1,h3:h=!1,h4:a=!1,h5:f=!1,h6:c=!1,b:x=!1,small:p=!1,i:d=!1,span:u=!1,del:b=!1,em:g=!1,blockquote:T=!1,transform:j="none",size:k,children:y,...z}=t,q=(0,dom/* useDOMRef */.gy)(o),N={h1:l,h2:m,h3:h,h4:a,h5:f,h6:c,blockquote:T},O={span:u,small:p,b:x,em:g,i:d,del:b},w=Object.keys(N).filter((t=>N[t])),I=Object.keys(O).filter((t=>O[t])),R=(0,react.useMemo)((()=>w[0]?w[0]:I[0]?I[0]:"p"),[w,I]),S=I.filter((t=>t!==R)),U=(0,react.useMemo)((()=>S.length?n(S,y,k,j):y),[S,y,k,j]);return (0,jsx_runtime.jsx)(child,{ref:q,size:k,tag:R,transform:j,...z,children:U})}));assertion/* __DEV__ */.Ts&&(Text.displayName="NextUI.Text"),Text.toString=()=>".nextui-text";/* harmony default export */ var text_text = (react.memo(Text));
;// CONCATENATED MODULE: ./node_modules/@nextui-org/react/esm/text/index.js
/* harmony default export */ var esm_text = (text_text);

/***/ }),

/***/ 9975:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BM": function() { return /* binding */ cssFocusVisible; },
/* harmony export */   "Zj": function() { return /* binding */ cssHideShowIn; }
/* harmony export */ });
/* unused harmony exports sharedFocus, cssNoBlurriness, sharedVisuallyHidden, cssHideIn, cssShowIn */
/* harmony import */ var _stitches_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6212);
const sharedFocus=(0,_stitches_config__WEBPACK_IMPORTED_MODULE_0__/* .css */ .iv)({WebkitTapHighlightColor:"transparent","&:focus:not(&:focus-visible)":{boxShadow:"none"},"&:focus":{outline:"none",boxShadow:"0 0 0 2px $colors$background, 0 0 0 4px $colors$primary"},"@safari":{WebkitTapHighlightColor:"transparent",outline:"none"}});const cssFocusVisible=(0,_stitches_config__WEBPACK_IMPORTED_MODULE_0__/* .css */ .iv)({variants:{isFocusVisible:{true:{outline:"transparent solid 2px",outlineOffset:"2px",boxShadow:"0 0 0 2px $colors$background, 0 0 0 4px $colors$primary"},false:{outline:"none"}}}});const cssNoBlurriness=(0,_stitches_config__WEBPACK_IMPORTED_MODULE_0__/* .css */ .iv)({transform:"translateZ(0)",backfaceVisibility:"hidden"});const sharedVisuallyHidden=(0,_stitches_config__WEBPACK_IMPORTED_MODULE_0__/* .css */ .iv)({border:"0px",clip:"rect(0px, 0px, 0px, 0px)",height:"1px",width:"1px",margin:"-1px",padding:"0px",overflow:"hidden",whiteSpace:"nowrap",position:"absolute"});const cssHideIn=(0,_stitches_config__WEBPACK_IMPORTED_MODULE_0__/* .css */ .iv)({variants:{hideIn:{xs:{"@xsMax":{display:"none"}},sm:{"@smMax":{display:"none"}},md:{"@mdMax":{display:"none"}},lg:{"@lgMax":{display:"none"}},xl:{"@xlMax":{display:"none"}}}}});const cssShowIn=(0,_stitches_config__WEBPACK_IMPORTED_MODULE_0__/* .css */ .iv)({variants:{showIn:{xs:{"@xs":{display:"none"}},sm:{"@sm":{display:"none"}},md:{"@md":{display:"none"}},lg:{"@lg":{display:"none"}},xl:{"@xl":{display:"none"}}}}});const cssHideShowIn=(0,_stitches_config__WEBPACK_IMPORTED_MODULE_0__/* .css */ .iv)(cssHideIn,cssShowIn);

/***/ }),

/***/ 3569:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ts": function() { return /* binding */ __DEV__; }
/* harmony export */ });
/* unused harmony exports __TEST__, isArray, isEmptyArray, isObject, isEmptyObject, isEmpty, isFunction */
const __DEV__="production"!=="production";const __TEST__=(/* unused pure expression or super */ null && ("test"==="production"));function isArray(t){return Array.isArray(t)}function isEmptyArray(t){return isArray(t)&&0===t.length}function isObject(t){const r=typeof t;return null!=t&&("object"===r||"function"===r)&&!isArray(t)}function isEmptyObject(t){return isObject(t)&&0===Object.keys(t).length}function isEmpty(t){return isArray(t)?isEmptyArray(t):isObject(t)?isEmptyObject(t):null==t||""===t}function isFunction(t){return"function"==typeof t}

/***/ }),

/***/ 2903:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "gy": function() { return /* binding */ useDOMRef; }
/* harmony export */ });
/* unused harmony exports canUseDOM, isBrowser, detectDeviceType, detectOS, detectBrowser, detectTouch, createDOMRef, createFocusableRef, useFocusableRef, useSyncRef */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7294);
function canUseDOM(){return!("undefined"==typeof window||!window.document||!window.document.createElement)}const isBrowser=canUseDOM();function detectDeviceType(e){const{userAgent:t}=e;return/(tablet)|(iPad)|(Nexus 9)/i.test(t)?"tablet":/(mobi)/i.test(t)?"phone":"desktop"}function detectOS(e){return!!isBrowser&&function(e){const{userAgent:t,platform:r}=e;switch(!0){case/Android/.test(t):return"Android";case/iPhone|iPad|iPod/.test(r):return"iOS";case/Win/.test(r):return"Windows";case/Mac/.test(r):return"Mac";case/CrOS/.test(t):return"Chrome OS";case/Firefox/.test(t):return"Firefox OS";default:return null}}(window.navigator)===e}function detectBrowser(e){return!!isBrowser&&function(e){const{userAgent:t,vendor:r}=e,n=/(android)/i.test(t);switch(!0){case/CriOS/.test(t):return"Chrome for iOS";case/Edg\//.test(t):return"Edge";case n&&/Silk\//.test(t):return"Silk";case/Chrome/.test(t)&&/Google Inc/.test(r):return"Chrome";case/Firefox\/\d+\.\d+$/.test(t):return"Firefox";case n:return"AOSP";case/MSIE|Trident/.test(t):return"IE";case/Safari/.test(e.userAgent)&&/Apple Computer/.test(t):return"Safari";case/AppleWebKit/.test(t):return"WebKit";default:return null}}(window.navigator)===e}function detectTouch(){return!!isBrowser&&(null===window.ontouchstart&&null===window.ontouchmove&&null===window.ontouchend)}function createDOMRef(e){return{UNSAFE_getDOMNode:()=>e.current}}function createFocusableRef(e,t=e){return{...createDOMRef(e),focus(){t.current&&t.current.focus()}}}function useDOMRef(t){const n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);return (0,react__WEBPACK_IMPORTED_MODULE_0__.useImperativeHandle)(t,(()=>n.current)),n}function useFocusableRef(t,n){const o=r(null);return e(t,(()=>createFocusableRef(o,n))),o}function useSyncRef(e,r){t((()=>{if(e&&e.ref&&r&&r.current)return e.ref.current=r.current,()=>{var t;null!=(t=e.ref)&&t.current&&(e.ref.current=null)}}),[e,r])}

/***/ })

}]);