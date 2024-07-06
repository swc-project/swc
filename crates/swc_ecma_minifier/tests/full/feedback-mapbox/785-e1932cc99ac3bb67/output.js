(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[785],{/***/840:/***/function(t,e,n){var r;!/*! Hammer.JS - v2.0.7 - 2016-04-22
             * http://hammerjs.github.io/
             *
             * Copyright (c) 2016 Jorik Tangelder;
             * Licensed under the MIT license */function(i,o,a,s){"use strict";var c,u=["","webkit","Moz","MS","ms","o"],l=o.createElement("div"),h=Math.round,p=Math.abs,f=Date.now;/**
                 * set a timeout with a given scope
                 * @param {Function} fn
                 * @param {Number} timeout
                 * @param {Object} context
                 * @returns {number}
                 */function d(t,e,n){return setTimeout(O(t,n),e)}/**
                 * if the argument is an array, we want to execute the fn on each entry
                 * if it aint an array we don't want to do a thing.
                 * this is used by all the methods that accept a single and array argument.
                 * @param {*|Array} arg
                 * @param {String} fn
                 * @param {Object} [context]
                 * @returns {Boolean}
                 */function v(t,e,n){return!!Array.isArray(t)&&(g(t,n[e],n),!0)}/**
                 * walk objects and arrays
                 * @param {Object} obj
                 * @param {Function} iterator
                 * @param {Object} context
                 */function g(t,e,n){var r;if(t){if(t.forEach)t.forEach(e,n);else if(t.length!==s)for(r=0;r<t.length;)e.call(n,t[r],r,t),r++;else for(r in t)t.hasOwnProperty(r)&&e.call(n,t[r],r,t)}}/**
                 * wrap a method with a deprecation warning and stack trace
                 * @param {Function} method
                 * @param {String} name
                 * @param {String} message
                 * @returns {Function} A new function wrapping the supplied method.
                 */function m(t,e,n){var r="DEPRECATED METHOD: "+e+"\n"+n+" AT \n";return function(){var e=Error("get-stack-trace"),n=e&&e.stack?e.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",o=i.console&&(i.console.warn||i.console.log);return o&&o.call(i.console,r,n),t.apply(this,arguments)}}c="function"!=typeof Object.assign?function(t){if(null==t)throw TypeError("Cannot convert undefined or null to object");for(var e=Object(t),n=1;n<arguments.length;n++){var r=arguments[n];if(null!=r)for(var i in r)r.hasOwnProperty(i)&&(e[i]=r[i])}return e}:Object.assign;/**
                 * extend object.
                 * means that properties in dest will be overwritten by the ones in src.
                 * @param {Object} dest
                 * @param {Object} src
                 * @param {Boolean} [merge=false]
                 * @returns {Object} dest
                 */var b=m(function(t,e,n){for(var r=Object.keys(e),i=0;i<r.length;)(!n||n&&t[r[i]]===s)&&(t[r[i]]=e[r[i]]),i++;return t},"extend","Use `assign`."),y=m(function(t,e){return b(t,e,!0)},"merge","Use `assign`.");/**
                 * simple class inheritance
                 * @param {Function} child
                 * @param {Function} base
                 * @param {Object} [properties]
                 */function w(t,e,n){var r,i=e.prototype;(r=t.prototype=Object.create(i)).constructor=t,r._super=i,n&&c(r,n)}/**
                 * simple function bind
                 * @param {Function} fn
                 * @param {Object} context
                 * @returns {Function}
                 */function O(t,e){return function(){return t.apply(e,arguments)}}/**
                 * let a boolean value also be a function that must return a boolean
                 * this first item in args will be used as the context
                 * @param {Boolean|Function} val
                 * @param {Array} [args]
                 * @returns {Boolean}
                 */function E(t,e){return"function"==typeof t?t.apply(e&&e[0]||s,e):t}/**
                 * addEventListener with multiple events at once
                 * @param {EventTarget} target
                 * @param {String} types
                 * @param {Function} handler
                 */function _(t,e,n){g(S(e),function(e){t.addEventListener(e,n,!1)})}/**
                 * removeEventListener with multiple events at once
                 * @param {EventTarget} target
                 * @param {String} types
                 * @param {Function} handler
                 */function P(t,e,n){g(S(e),function(e){t.removeEventListener(e,n,!1)})}/**
                 * find if a node is in the given parent
                 * @method hasParent
                 * @param {HTMLElement} node
                 * @param {HTMLElement} parent
                 * @return {Boolean} found
                 */function M(t,e){for(;t;){if(t==e)return!0;t=t.parentNode}return!1}/**
                 * small indexOf wrapper
                 * @param {String} str
                 * @param {String} find
                 * @returns {Boolean} found
                 */function j(t,e){return t.indexOf(e)>-1}/**
                 * split string on whitespace
                 * @param {String} str
                 * @returns {Array} words
                 */function S(t){return t.trim().split(/\s+/g)}/**
                 * find if a array contains the object using indexOf or a simple polyFill
                 * @param {Array} src
                 * @param {String} find
                 * @param {String} [findByKey]
                 * @return {Boolean|Number} false when not found, or the index
                 */function T(t,e,n){if(t.indexOf&&!n)return t.indexOf(e);for(var r=0;r<t.length;){if(n&&t[r][n]==e||!n&&t[r]===e)return r;r++}return -1}/**
                 * convert array-like objects to real arrays
                 * @param {Object} obj
                 * @returns {Array}
                 */function k(t){return Array.prototype.slice.call(t,0)}/**
                 * unique array with objects based on a key (like 'id') or just by the array's value
                 * @param {Array} src [{id:1},{id:2},{id:1}]
                 * @param {String} [key]
                 * @param {Boolean} [sort=False]
                 * @returns {Array} [{id:1},{id:2}]
                 */function x(t,e,n){for(var r=[],i=[],o=0;o<t.length;){var a=e?t[o][e]:t[o];0>T(i,a)&&r.push(t[o]),i[o]=a,o++}return n&&(r=e?r.sort(function(t,n){return t[e]>n[e]}):r.sort()),r}/**
                 * get the prefixed property
                 * @param {Object} obj
                 * @param {String} property
                 * @returns {String|Undefined} prefixed
                 */function D(t,e){for(var n,r,i=e[0].toUpperCase()+e.slice(1),o=0;o<u.length;){if((r=(n=u[o])?n+i:e)in t)return r;o++}return s}/**
                 * get a unique id
                 * @returns {number} uniqueId
                 */var C=1;/**
                 * get the window object of an element
                 * @param {HTMLElement} element
                 * @returns {DocumentView|Window}
                 */function R(t){var e=t.ownerDocument||t;return e.defaultView||e.parentWindow||i}var A="ontouchstart"in i,I=D(i,"PointerEvent")!==s,L=A&&/mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent),N="touch",z="mouse",F=["x","y"],V=["clientX","clientY"];/**
                 * create new input type manager
                 * @param {Manager} manager
                 * @param {Function} callback
                 * @returns {Input}
                 * @constructor
                 */function Z(t,e){var n=this;this.manager=t,this.callback=e,this.element=t.element,this.target=t.options.inputTarget,// smaller wrapper around the handler, for the scope and the enabled state of the manager,
// so when disabled the input events are completely bypassed.
this.domHandler=function(e){E(t.options.enable,[t])&&n.handler(e)},this.init()}/**
                 * handle input events
                 * @param {Manager} manager
                 * @param {String} eventType
                 * @param {Object} input
                 */function B(t,e,n){var r,i,o,a,c,u,l,h,d,v,g,m,b,y,w,O=n.pointers.length,E=n.changedPointers.length,_=1&e&&O-E==0,P=12&e&&O-E==0;n.isFirst=!!_,n.isFinal=!!P,_&&(t.session={}),// source event is the normalized value of the domEvents
// like 'touchstart, mouseup, pointerdown'
n.eventType=e,r=t.session,o=(i=n.pointers).length,r.firstInput||(r.firstInput=U(n)),o>1&&!r.firstMultiple?r.firstMultiple=U(n):1===o&&(r.firstMultiple=!1),a=r.firstInput,u=(c=r.firstMultiple)?c.center:a.center,l=n.center=q(i),n.timeStamp=f(),n.deltaTime=n.timeStamp-a.timeStamp,n.angle=Y(u,l),n.distance=X(u,l),h=n.center,d=r.offsetDelta||{},v=r.prevDelta||{},g=r.prevInput||{},(1===n.eventType||4===g.eventType)&&(v=r.prevDelta={x:g.deltaX||0,y:g.deltaY||0},d=r.offsetDelta={x:h.x,y:h.y}),n.deltaX=v.x+(h.x-d.x),n.deltaY=v.y+(h.y-d.y),n.offsetDirection=H(n.deltaX,n.deltaY),m=W(n.deltaTime,n.deltaX,n.deltaY),n.overallVelocityX=m.x,n.overallVelocityY=m.y,n.overallVelocity=p(m.x)>p(m.y)?m.x:m.y,n.scale=c?(b=c.pointers,X(i[0],i[1],V)/X(b[0],b[1],V)):1,n.rotation=c?(y=c.pointers,Y(i[1],i[0],V)+Y(y[1],y[0],V)):0,n.maxPointers=r.prevInput?n.pointers.length>r.prevInput.maxPointers?n.pointers.length:r.prevInput.maxPointers:n.pointers.length,/**
                 * velocity is calculated every x ms
                 * @param {Object} session
                 * @param {Object} input
                 */function(t,e){var n,r,i,o,a=t.lastInterval||e,c=e.timeStamp-a.timeStamp;if(8!=e.eventType&&(c>25||a.velocity===s)){var u=e.deltaX-a.deltaX,l=e.deltaY-a.deltaY,h=W(c,u,l);r=h.x,i=h.y,n=p(h.x)>p(h.y)?h.x:h.y,o=H(u,l),t.lastInterval=e}else // use latest velocity info if it doesn't overtake a minimum period
n=a.velocity,r=a.velocityX,i=a.velocityY,o=a.direction;e.velocity=n,e.velocityX=r,e.velocityY=i,e.direction=o}(r,n),w=t.element,M(n.srcEvent.target,w)&&(w=n.srcEvent.target),n.target=w,// emit secret event
t.emit("hammer.input",n),t.recognize(n),t.session.prevInput=n}/**
                 * create a simple clone from the input used for storage of firstInput and firstMultiple
                 * @param {Object} input
                 * @returns {Object} clonedInputData
                 */function U(t){for(// make a simple copy of the pointers because we will get a reference if we don't
// we only need clientXY for the calculations
var e=[],n=0;n<t.pointers.length;)e[n]={clientX:h(t.pointers[n].clientX),clientY:h(t.pointers[n].clientY)},n++;return{timeStamp:f(),pointers:e,center:q(e),deltaX:t.deltaX,deltaY:t.deltaY}}/**
                 * get the center of all the pointers
                 * @param {Array} pointers
                 * @return {Object} center contains `x` and `y` properties
                 */function q(t){var e=t.length;// no need to loop when only one touch
if(1===e)return{x:h(t[0].clientX),y:h(t[0].clientY)};for(var n=0,r=0,i=0;i<e;)n+=t[i].clientX,r+=t[i].clientY,i++;return{x:h(n/e),y:h(r/e)}}/**
                 * calculate the velocity between two points. unit is in px per ms.
                 * @param {Number} deltaTime
                 * @param {Number} x
                 * @param {Number} y
                 * @return {Object} velocity `x` and `y`
                 */function W(t,e,n){return{x:e/t||0,y:n/t||0}}/**
                 * get the direction between two points
                 * @param {Number} x
                 * @param {Number} y
                 * @return {Number} direction
                 */function H(t,e){return t===e?1:p(t)>=p(e)?t<0?2:4:e<0?8:16}/**
                 * calculate the absolute distance between two points
                 * @param {Object} p1 {x, y}
                 * @param {Object} p2 {x, y}
                 * @param {Array} [props] containing x and y keys
                 * @return {Number} distance
                 */function X(t,e,n){n||(n=F);var r=e[n[0]]-t[n[0]],i=e[n[1]]-t[n[1]];return Math.sqrt(r*r+i*i)}/**
                 * calculate the angle between two coordinates
                 * @param {Object} p1
                 * @param {Object} p2
                 * @param {Array} [props] containing x and y keys
                 * @return {Number} angle
                 */function Y(t,e,n){n||(n=F);var r=e[n[0]]-t[n[0]];return 180*Math.atan2(e[n[1]]-t[n[1]],r)/Math.PI}Z.prototype={/**
                     * should handle the inputEvent data and trigger the callback
                     * @virtual
                     */handler:function(){},/**
                     * bind the events
                     */init:function(){this.evEl&&_(this.element,this.evEl,this.domHandler),this.evTarget&&_(this.target,this.evTarget,this.domHandler),this.evWin&&_(R(this.element),this.evWin,this.domHandler)},/**
                     * unbind the events
                     */destroy:function(){this.evEl&&P(this.element,this.evEl,this.domHandler),this.evTarget&&P(this.target,this.evTarget,this.domHandler),this.evWin&&P(R(this.element),this.evWin,this.domHandler)}};var K={mousedown:1,mousemove:2,mouseup:4};/**
                 * Mouse events input
                 * @constructor
                 * @extends Input
                 */function G(){this.evEl="mousedown",this.evWin="mousemove mouseup",this.pressed=!1,Z.apply(this,arguments)}w(G,Z,{/**
                     * handle mouse events
                     * @param {Object} ev
                     */handler:function(t){var e=K[t.type];// mouse must be down
1&e&&0===t.button&&(this.pressed=!0),2&e&&1!==t.which&&(e=4),this.pressed&&(4&e&&(this.pressed=!1),this.callback(this.manager,e,{pointers:[t],changedPointers:[t],pointerType:z,srcEvent:t}))}});var $={pointerdown:1,pointermove:2,pointerup:4,pointercancel:8,pointerout:8},J={2:N,3:"pen",4:z,5:"kinect"},Q="pointerdown",tt="pointermove pointerup pointercancel";/**
                 * Pointer events input
                 * @constructor
                 * @extends Input
                 */function te(){this.evEl=Q,this.evWin=tt,Z.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}i.MSPointerEvent&&!i.PointerEvent&&(Q="MSPointerDown",tt="MSPointerMove MSPointerUp MSPointerCancel"),w(te,Z,{/**
                     * handle mouse events
                     * @param {Object} ev
                     */handler:function(t){var e=this.store,n=!1,r=$[t.type.toLowerCase().replace("ms","")],i=J[t.pointerType]||t.pointerType,o=i==N,a=T(e,t.pointerId,"pointerId");// it not found, so the pointer hasn't been down (so it's probably a hover)
1&r&&(0===t.button||o)?a<0&&(e.push(t),a=e.length-1):12&r&&(n=!0),!(a<0)&&(// update the event in the store
e[a]=t,this.callback(this.manager,r,{pointers:e,changedPointers:[t],pointerType:i,srcEvent:t}),n&&// remove from the store
e.splice(a,1))}});var tn={touchstart:1,touchmove:2,touchend:4,touchcancel:8};/**
                 * Touch events input
                 * @constructor
                 * @extends Input
                 */function tr(){this.evTarget="touchstart",this.evWin="touchstart touchmove touchend touchcancel",this.started=!1,Z.apply(this,arguments)}/**
                 * @this {TouchInput}
                 * @param {Object} ev
                 * @param {Number} type flag
                 * @returns {undefined|Array} [all, changed]
                 */function ti(t,e){var n=k(t.touches),r=k(t.changedTouches);return 12&e&&(n=x(n.concat(r),"identifier",!0)),[n,r]}w(tr,Z,{handler:function(t){var e=tn[t.type];if(1===e&&(this.started=!0),this.started){var n=ti.call(this,t,e);12&e&&n[0].length-n[1].length==0&&(this.started=!1),this.callback(this.manager,e,{pointers:n[0],changedPointers:n[1],pointerType:N,srcEvent:t})}}});var to={touchstart:1,touchmove:2,touchend:4,touchcancel:8};/**
                 * Multi-user touch events input
                 * @constructor
                 * @extends Input
                 */function ta(){this.evTarget="touchstart touchmove touchend touchcancel",this.targetIds={},Z.apply(this,arguments)}/**
                 * @this {TouchInput}
                 * @param {Object} ev
                 * @param {Number} type flag
                 * @returns {undefined|Array} [all, changed]
                 */function ts(t,e){var n=k(t.touches),r=this.targetIds;// when there is only one touch, the process can be simplified
if(3&e&&1===n.length)return r[n[0].identifier]=!0,[n,n];var i,o,a=k(t.changedTouches),s=[],c=this.target;// collect touches
if(// get target touches from touches
o=n.filter(function(t){return M(t.target,c)}),1===e)for(i=0;i<o.length;)r[o[i].identifier]=!0,i++;for(// filter changed touches to only contain touches that exist in the collected target ids
i=0;i<a.length;)r[a[i].identifier]&&s.push(a[i]),12&e&&delete r[a[i].identifier],i++;if(s.length)return[// merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
x(o.concat(s),"identifier",!0),s]}function tc(){Z.apply(this,arguments);var t=O(this.handler,this);this.touch=new ta(this.manager,t),this.mouse=new G(this.manager,t),this.primaryTouch=null,this.lastTouches=[]}function tu(t,e){1&t?(this.primaryTouch=e.changedPointers[0].identifier,tl.call(this,e)):12&t&&tl.call(this,e)}function tl(t){var e=t.changedPointers[0];if(e.identifier===this.primaryTouch){var n={x:e.clientX,y:e.clientY};this.lastTouches.push(n);var r=this.lastTouches;setTimeout(function(){var t=r.indexOf(n);t>-1&&r.splice(t,1)},2500)}}function th(t){for(var e=t.srcEvent.clientX,n=t.srcEvent.clientY,r=0;r<this.lastTouches.length;r++){var i=this.lastTouches[r],o=Math.abs(e-i.x),a=Math.abs(n-i.y);if(o<=25&&a<=25)return!0}return!1}w(ta,Z,{handler:function(t){var e=to[t.type],n=ts.call(this,t,e);n&&this.callback(this.manager,e,{pointers:n[0],changedPointers:n[1],pointerType:N,srcEvent:t})}}),w(tc,Z,{/**
                     * handle mouse and touch events
                     * @param {Hammer} manager
                     * @param {String} inputEvent
                     * @param {Object} inputData
                     */handler:function(t,e,n){var r=n.pointerType==N,i=n.pointerType==z;if(!i||!n.sourceCapabilities||!n.sourceCapabilities.firesTouchEvents){// when we're in a touch event, record touches to  de-dupe synthetic mouse event
if(r)tu.call(this,e,n);else if(i&&th.call(this,n))return;this.callback(t,e,n)}},/**
                     * remove the event listeners
                     */destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var tp=D(l.style,"touchAction"),tf=s!==tp,td="compute",tv="auto",tg="manipulation",tm="none",tb="pan-x",ty="pan-y",tw=function(){if(!tf)return!1;var t={},e=i.CSS&&i.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(n){// If css.supports is not supported but there is native touch-action assume it supports
// all values. This is the case for IE 10 and 11.
t[n]=!e||i.CSS.supports("touch-action",n)}),t}();/**
                 * Touch Action
                 * sets the touchAction property or uses the js alternative
                 * @param {Manager} manager
                 * @param {String} value
                 * @constructor
                 */function tO(t,e){this.manager=t,this.set(e)}/**
                 * Recognizer
                 * Every recognizer needs to extend from this class.
                 * @constructor
                 * @param {Object} options
                 */function tE(t){var e;this.options=c({},this.defaults,t||{}),this.id=C++,this.manager=null,// default is enable true
this.options.enable=s===(e=this.options.enable)||e,this.state=1,this.simultaneous={},this.requireFail=[]}/**
                 * get a usable string, used as event postfix
                 * @param {Const} state
                 * @returns {String} state
                 */function t_(t){return 16&t?"cancel":8&t?"end":4&t?"move":2&t?"start":""}/**
                 * direction cons to string
                 * @param {Const} direction
                 * @returns {String}
                 */function tP(t){return 16==t?"down":8==t?"up":2==t?"left":4==t?"right":""}/**
                 * get a recognizer by name if it is bound to a manager
                 * @param {Recognizer|String} otherRecognizer
                 * @param {Recognizer} recognizer
                 * @returns {Recognizer}
                 */function tM(t,e){var n=e.manager;return n?n.get(t):t}/**
                 * This recognizer is just used as a base for the simple attribute recognizers.
                 * @constructor
                 * @extends Recognizer
                 */function tj(){tE.apply(this,arguments)}/**
                 * Pan
                 * Recognized when the pointer is down and moved in the allowed direction.
                 * @constructor
                 * @extends AttrRecognizer
                 */function tS(){tj.apply(this,arguments),this.pX=null,this.pY=null}/**
                 * Pinch
                 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
                 * @constructor
                 * @extends AttrRecognizer
                 */function tT(){tj.apply(this,arguments)}/**
                 * Press
                 * Recognized when the pointer is down for x ms without any movement.
                 * @constructor
                 * @extends Recognizer
                 */function tk(){tE.apply(this,arguments),this._timer=null,this._input=null}/**
                 * Rotate
                 * Recognized when two or more pointer are moving in a circular motion.
                 * @constructor
                 * @extends AttrRecognizer
                 */function tx(){tj.apply(this,arguments)}/**
                 * Swipe
                 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
                 * @constructor
                 * @extends AttrRecognizer
                 */function tD(){tj.apply(this,arguments)}/**
                 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
                 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
                 * a single tap.
                 *
                 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
                 * multi-taps being recognized.
                 * @constructor
                 * @extends Recognizer
                 */function tC(){tE.apply(this,arguments),// previous time and center,
// used for tap counting
this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}/**
                 * Simple way to create a manager with a default set of recognizers.
                 * @param {HTMLElement} element
                 * @param {Object} [options]
                 * @constructor
                 */function tR(t,e){var n,r;return(e=e||{}).recognizers=(n=e.recognizers,r=tR.defaults.preset,s===n?r:n),new tA(t,e)}/**
                 * Manager
                 * @param {HTMLElement} element
                 * @param {Object} [options]
                 * @constructor
                 */function tA(t,e){var n;this.options=c({},tR.defaults,e||{}),this.options.inputTarget=this.options.inputTarget||t,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=t,this.input=new((n=this.options.inputClass)?n:I?te:L?ta:A?tc:G)(this,B),this.touchAction=new tO(this,this.options.touchAction),tI(this,!0),g(this.options.recognizers,function(t){var e=this.add(new t[0](t[1]));t[2]&&e.recognizeWith(t[2]),t[3]&&e.requireFailure(t[3])},this)}/**
                 * add/remove the css properties as defined in manager.options.cssProps
                 * @param {Manager} manager
                 * @param {Boolean} add
                 */function tI(t,e){var n,r=t.element;r.style&&(g(t.options.cssProps,function(i,o){n=D(r.style,o),e?(t.oldCssProps[n]=r.style[n],r.style[n]=i):r.style[n]=t.oldCssProps[n]||""}),e||(t.oldCssProps={}))}tO.prototype={/**
                     * set the touchAction value on the element or enable the polyfill
                     * @param {String} value
                     */set:function(t){t==td&&(t=this.compute()),tf&&this.manager.element.style&&tw[t]&&(this.manager.element.style[tp]=t),this.actions=t.toLowerCase().trim()},/**
                     * just re-set the touchAction value
                     */update:function(){this.set(this.manager.options.touchAction)},/**
                     * compute the value for the touchAction property based on the recognizer's settings
                     * @returns {String} value
                     */compute:function(){var t=[];return g(this.manager.recognizers,function(e){E(e.options.enable,[e])&&(t=t.concat(e.getTouchAction()))}),/**
                 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
                 * @param {String} actions
                 * @returns {*}
                 */function(t){// none
if(j(t,tm))return tm;var e=j(t,tb),n=j(t,ty);return(// if both pan-x and pan-y are set (different recognizers
// for different directions, e.g. horizontal pan but vertical swipe?)
// we need none (as otherwise with pan-x pan-y combined none of these
// recognizers will work, since the browser would handle all panning
e&&n?tm:e||n?e?tb:ty:j(t,tg)?tg:tv)}(t.join(" "))},/**
                     * this method is called on each input cycle and provides the preventing of the browser behavior
                     * @param {Object} input
                     */preventDefaults:function(t){var e=t.srcEvent,n=t.offsetDirection;// if the touch action did prevented once this session
if(this.manager.session.prevented){e.preventDefault();return}var r=this.actions,i=j(r,tm)&&!tw[tm],o=j(r,ty)&&!tw[ty],a=j(r,tb)&&!tw[tb];if(i){//do not prevent defaults if this is a tap gesture
var s=1===t.pointers.length,c=t.distance<2,u=t.deltaTime<250;if(s&&c&&u)return}if((!a||!o)&&(i||o&&6&n||a&&24&n))return this.preventSrc(e)},/**
                     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
                     * @param {Object} srcEvent
                     */preventSrc:function(t){this.manager.session.prevented=!0,t.preventDefault()}},tE.prototype={/**
                     * @virtual
                     * @type {Object}
                     */defaults:{},/**
                     * set options
                     * @param {Object} options
                     * @return {Recognizer}
                     */set:function(t){return c(this.options,t),// also update the touchAction, in case something changed about the directions/enabled state
this.manager&&this.manager.touchAction.update(),this},/**
                     * recognize simultaneous with an other recognizer.
                     * @param {Recognizer} otherRecognizer
                     * @returns {Recognizer} this
                     */recognizeWith:function(t){if(v(t,"recognizeWith",this))return this;var e=this.simultaneous;return e[(t=tM(t,this)).id]||(e[t.id]=t,t.recognizeWith(this)),this},/**
                     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
                     * @param {Recognizer} otherRecognizer
                     * @returns {Recognizer} this
                     */dropRecognizeWith:function(t){return v(t,"dropRecognizeWith",this)||(t=tM(t,this),delete this.simultaneous[t.id]),this},/**
                     * recognizer can only run when an other is failing
                     * @param {Recognizer} otherRecognizer
                     * @returns {Recognizer} this
                     */requireFailure:function(t){if(v(t,"requireFailure",this))return this;var e=this.requireFail;return -1===T(e,t=tM(t,this))&&(e.push(t),t.requireFailure(this)),this},/**
                     * drop the requireFailure link. it does not remove the link on the other recognizer.
                     * @param {Recognizer} otherRecognizer
                     * @returns {Recognizer} this
                     */dropRequireFailure:function(t){if(v(t,"dropRequireFailure",this))return this;t=tM(t,this);var e=T(this.requireFail,t);return e>-1&&this.requireFail.splice(e,1),this},/**
                     * has require failures boolean
                     * @returns {boolean}
                     */hasRequireFailures:function(){return this.requireFail.length>0},/**
                     * if the recognizer can recognize simultaneous with an other recognizer
                     * @param {Recognizer} otherRecognizer
                     * @returns {Boolean}
                     */canRecognizeWith:function(t){return!!this.simultaneous[t.id]},/**
                     * You should use `tryEmit` instead of `emit` directly to check
                     * that all the needed recognizers has failed before emitting.
                     * @param {Object} input
                     */emit:function(t){var e=this,n=this.state;function r(n){e.manager.emit(n,t)}n<8&&r(e.options.event+t_(n)),r(e.options.event),t.additionalEvent&&// additional event(panleft, panright, pinchin, pinchout...)
r(t.additionalEvent),n>=8&&r(e.options.event+t_(n))},/**
                     * Check that all the require failure recognizers has failed,
                     * if true, it emits a gesture event,
                     * otherwise, setup the state to FAILED.
                     * @param {Object} input
                     */tryEmit:function(t){if(this.canEmit())return this.emit(t);// it's failing anyway
this.state=32},/**
                     * can we emit?
                     * @returns {boolean}
                     */canEmit:function(){for(var t=0;t<this.requireFail.length;){if(!(33&this.requireFail[t].state))return!1;t++}return!0},/**
                     * update the recognizer
                     * @param {Object} inputData
                     */recognize:function(t){// make a new copy of the inputData
// so we can change the inputData without messing up the other recognizers
var e=c({},t);// is is enabled and allow recognizing?
if(!E(this.options.enable,[this,e])){this.reset(),this.state=32;return}56&this.state&&(this.state=1),this.state=this.process(e),30&this.state&&this.tryEmit(e)},/**
                     * return the state of the recognizer
                     * the actual recognizing happens in this method
                     * @virtual
                     * @param {Object} inputData
                     * @returns {Const} STATE
                     */process:function(t){},/**
                     * return the preferred touch-action
                     * @virtual
                     * @returns {Array}
                     */getTouchAction:function(){},/**
                     * called when the gesture isn't allowed to recognize
                     * like when another is being recognized or it is disabled
                     * @virtual
                     */reset:function(){}},w(tj,tE,{/**
                     * @namespace
                     * @memberof AttrRecognizer
                     */defaults:{/**
                         * @type {Number}
                         * @default 1
                         */pointers:1},/**
                     * Used to check if it the recognizer receives valid input, like input.distance > 10.
                     * @memberof AttrRecognizer
                     * @param {Object} input
                     * @returns {Boolean} recognized
                     */attrTest:function(t){var e=this.options.pointers;return 0===e||t.pointers.length===e},/**
                     * Process the input and return the state for the recognizer
                     * @memberof AttrRecognizer
                     * @param {Object} input
                     * @returns {*} State
                     */process:function(t){var e=this.state,n=t.eventType,r=6&e,i=this.attrTest(t);return(// on cancel input and we've recognized before, return STATE_CANCELLED
r&&(8&n||!i)?16|e:r||i?4&n?8|e:2&e?4|e:2:32)}}),w(tS,tj,{/**
                     * @namespace
                     * @memberof PanRecognizer
                     */defaults:{event:"pan",threshold:10,pointers:1,direction:30},getTouchAction:function(){var t=this.options.direction,e=[];return 6&t&&e.push(ty),24&t&&e.push(tb),e},directionTest:function(t){var e=this.options,n=!0,r=t.distance,i=t.direction,o=t.deltaX,a=t.deltaY;return i&e.direction||(6&e.direction?(i=0===o?1:o<0?2:4,n=o!=this.pX,r=Math.abs(t.deltaX)):(i=0===a?1:a<0?8:16,n=a!=this.pY,r=Math.abs(t.deltaY))),t.direction=i,n&&r>e.threshold&&i&e.direction},attrTest:function(t){return tj.prototype.attrTest.call(this,t)&&(2&this.state||!(2&this.state)&&this.directionTest(t))},emit:function(t){this.pX=t.deltaX,this.pY=t.deltaY;var e=tP(t.direction);e&&(t.additionalEvent=this.options.event+e),this._super.emit.call(this,t)}}),w(tT,tj,{/**
                     * @namespace
                     * @memberof PinchRecognizer
                     */defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[tm]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.scale-1)>this.options.threshold||2&this.state)},emit:function(t){if(1!==t.scale){var e=t.scale<1?"in":"out";t.additionalEvent=this.options.event+e}this._super.emit.call(this,t)}}),w(tk,tE,{/**
                     * @namespace
                     * @memberof PressRecognizer
                     */defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[tv]},process:function(t){var e=this.options,n=t.pointers.length===e.pointers,r=t.distance<e.threshold,i=t.deltaTime>e.time;// we only allow little movement
// and we've reached an end event, so a tap is possible
if(this._input=t,r&&n&&(!(12&t.eventType)||i)){if(1&t.eventType)this.reset(),this._timer=d(function(){this.state=8,this.tryEmit()},e.time,this);else if(4&t.eventType)return 8}else this.reset();return 32},reset:function(){clearTimeout(this._timer)},emit:function(t){8===this.state&&(t&&4&t.eventType?this.manager.emit(this.options.event+"up",t):(this._input.timeStamp=f(),this.manager.emit(this.options.event,this._input)))}}),w(tx,tj,{/**
                     * @namespace
                     * @memberof RotateRecognizer
                     */defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[tm]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.rotation)>this.options.threshold||2&this.state)}}),w(tD,tj,{/**
                     * @namespace
                     * @memberof SwipeRecognizer
                     */defaults:{event:"swipe",threshold:10,velocity:.3,direction:30,pointers:1},getTouchAction:function(){return tS.prototype.getTouchAction.call(this)},attrTest:function(t){var e,n=this.options.direction;return 30&n?e=t.overallVelocity:6&n?e=t.overallVelocityX:24&n&&(e=t.overallVelocityY),this._super.attrTest.call(this,t)&&n&t.offsetDirection&&t.distance>this.options.threshold&&t.maxPointers==this.options.pointers&&p(e)>this.options.velocity&&4&t.eventType},emit:function(t){var e=tP(t.offsetDirection);e&&this.manager.emit(this.options.event+e,t),this.manager.emit(this.options.event,t)}}),w(tC,tE,{/**
                     * @namespace
                     * @memberof PinchRecognizer
                     */defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[tg]},process:function(t){var e=this.options,n=t.pointers.length===e.pointers,r=t.distance<e.threshold,i=t.deltaTime<e.time;if(this.reset(),1&t.eventType&&0===this.count)return this.failTimeout();// we only allow little movement
// and we've reached an end event, so a tap is possible
if(r&&i&&n){if(4!=t.eventType)return this.failTimeout();var o=!this.pTime||t.timeStamp-this.pTime<e.interval,a=!this.pCenter||X(this.pCenter,t.center)<e.posThreshold;if(this.pTime=t.timeStamp,this.pCenter=t.center,a&&o?this.count+=1:this.count=1,this._input=t,0==this.count%e.taps)return(// no failing requirements, immediately trigger the tap event
// or wait as long as the multitap interval to trigger
this.hasRequireFailures()?(this._timer=d(function(){this.state=8,this.tryEmit()},e.interval,this),2):8)}return 32},failTimeout:function(){return this._timer=d(function(){this.state=32},this.options.interval,this),32},reset:function(){clearTimeout(this._timer)},emit:function(){8==this.state&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),/**
                 * @const {string}
                 */tR.VERSION="2.0.7",/**
                 * default settings
                 * @namespace
                 */tR.defaults={/**
                     * set if DOM events are being triggered.
                     * But this is slower and unused by simple implementations, so disabled by default.
                     * @type {Boolean}
                     * @default false
                     */domEvents:!1,/**
                     * The value for the touchAction property/fallback.
                     * When set to `compute` it will magically set the correct value based on the added recognizers.
                     * @type {String}
                     * @default compute
                     */touchAction:td,/**
                     * @type {Boolean}
                     * @default true
                     */enable:!0,/**
                     * EXPERIMENTAL FEATURE -- can be removed/changed
                     * Change the parent input target element.
                     * If Null, then it is being set the to main element.
                     * @type {Null|EventTarget}
                     * @default null
                     */inputTarget:null,/**
                     * force an input class
                     * @type {Null|Function}
                     * @default null
                     */inputClass:null,/**
                     * Default recognizer setup when calling `Hammer()`
                     * When creating a new Manager these will be skipped.
                     * @type {Array}
                     */preset:[// RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
[tx,{enable:!1}],[tT,{enable:!1},["rotate"]],[tD,{direction:6}],[tS,{direction:6},["swipe"]],[tC],[tC,{event:"doubletap",taps:2},["tap"]],[tk]],/**
                     * Some CSS properties can be used to improve the working of Hammer.
                     * Add them to this method and they will be set when creating a new Manager.
                     * @namespace
                     */cssProps:{/**
                         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
                         * @type {String}
                         * @default 'none'
                         */userSelect:"none",/**
                         * Disable the Windows Phone grippers when pressing an element.
                         * @type {String}
                         * @default 'none'
                         */touchSelect:"none",/**
                         * Disables the default callout shown when you touch and hold a touch target.
                         * On iOS, when you touch and hold a touch target such as a link, Safari displays
                         * a callout containing information about the link. This property allows you to disable that callout.
                         * @type {String}
                         * @default 'none'
                         */touchCallout:"none",/**
                         * Specifies whether zooming is enabled. Used by IE10>
                         * @type {String}
                         * @default 'none'
                         */contentZooming:"none",/**
                         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
                         * @type {String}
                         * @default 'none'
                         */userDrag:"none",/**
                         * Overrides the highlight color shown when the user taps a link or a JavaScript
                         * clickable element in iOS. This property obeys the alpha value, if specified.
                         * @type {String}
                         * @default 'rgba(0,0,0,0)'
                         */tapHighlightColor:"rgba(0,0,0,0)"}},tA.prototype={/**
                     * set options
                     * @param {Object} options
                     * @returns {Manager}
                     */set:function(t){return c(this.options,t),t.touchAction&&this.touchAction.update(),t.inputTarget&&(// Clean up existing event listeners and reinitialize
this.input.destroy(),this.input.target=t.inputTarget,this.input.init()),this},/**
                     * stop recognizing for this session.
                     * This session will be discarded, when a new [input]start event is fired.
                     * When forced, the recognizer cycle is stopped immediately.
                     * @param {Boolean} [force]
                     */stop:function(t){this.session.stopped=t?2:1},/**
                     * run the recognizers!
                     * called by the inputHandler function on every movement of the pointers (touches)
                     * it walks through all the recognizers and tries to detect the gesture that is being made
                     * @param {Object} inputData
                     */recognize:function(t){var e,n=this.session;if(!n.stopped){// run the touch-action polyfill
this.touchAction.preventDefaults(t);var r=this.recognizers,i=n.curRecognizer;// reset when the last recognizer is recognized
// or when we're in a new session
(!i||i&&8&i.state)&&(i=n.curRecognizer=null);for(var o=0;o<r.length;)e=r[o],2!==n.stopped&&// 1
(!i||e==i||// 2
e.canRecognizeWith(i))?// 3
e.recognize(t):e.reset(),!i&&14&e.state&&(i=n.curRecognizer=e),o++}},/**
                     * get a recognizer by its event name.
                     * @param {Recognizer|String} recognizer
                     * @returns {Recognizer|Null}
                     */get:function(t){if(t instanceof tE)return t;for(var e=this.recognizers,n=0;n<e.length;n++)if(e[n].options.event==t)return e[n];return null},/**
                     * add a recognizer to the manager
                     * existing recognizers with the same event name will be removed
                     * @param {Recognizer} recognizer
                     * @returns {Recognizer|Manager}
                     */add:function(t){if(v(t,"add",this))return this;// remove existing
var e=this.get(t.options.event);return e&&this.remove(e),this.recognizers.push(t),t.manager=this,this.touchAction.update(),t},/**
                     * remove a recognizer by name or instance
                     * @param {Recognizer|String} recognizer
                     * @returns {Manager}
                     */remove:function(t){if(v(t,"remove",this))return this;// let's make sure this recognizer exists
if(t=this.get(t)){var e=this.recognizers,n=T(e,t);-1!==n&&(e.splice(n,1),this.touchAction.update())}return this},/**
                     * bind event
                     * @param {String} events
                     * @param {Function} handler
                     * @returns {EventEmitter} this
                     */on:function(t,e){if(s!==t&&s!==e){var n=this.handlers;return g(S(t),function(t){n[t]=n[t]||[],n[t].push(e)}),this}},/**
                     * unbind event, leave emit blank to remove all handlers
                     * @param {String} events
                     * @param {Function} [handler]
                     * @returns {EventEmitter} this
                     */off:function(t,e){if(s!==t){var n=this.handlers;return g(S(t),function(t){e?n[t]&&n[t].splice(T(n[t],e),1):delete n[t]}),this}},/**
                     * emit event to the listeners
                     * @param {String} event
                     * @param {Object} data
                     */emit:function(t,e){this.options.domEvents&&((n=o.createEvent("Event")).initEvent(t,!0,!0),n.gesture=e,e.target.dispatchEvent(n));// no handlers, so skip it all
var n,r=this.handlers[t]&&this.handlers[t].slice();if(r&&r.length){e.type=t,e.preventDefault=function(){e.srcEvent.preventDefault()};for(var i=0;i<r.length;)r[i](e),i++}},/**
                     * destroy the manager and unbinds all events
                     * it doesn't unbind dom events, that is the user own responsibility
                     */destroy:function(){this.element&&tI(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},c(tR,{INPUT_START:1,INPUT_MOVE:2,INPUT_END:4,INPUT_CANCEL:8,STATE_POSSIBLE:1,STATE_BEGAN:2,STATE_CHANGED:4,STATE_ENDED:8,STATE_RECOGNIZED:8,STATE_CANCELLED:16,STATE_FAILED:32,DIRECTION_NONE:1,DIRECTION_LEFT:2,DIRECTION_RIGHT:4,DIRECTION_UP:8,DIRECTION_DOWN:16,DIRECTION_HORIZONTAL:6,DIRECTION_VERTICAL:24,DIRECTION_ALL:30,Manager:tA,Input:Z,TouchAction:tO,TouchInput:ta,MouseInput:G,PointerEventInput:te,TouchMouseInput:tc,SingleTouchInput:tr,Recognizer:tE,AttrRecognizer:tj,Tap:tC,Pan:tS,Swipe:tD,Pinch:tT,Rotate:tx,Press:tk,on:_,off:P,each:g,merge:y,extend:b,assign:c,inherit:w,bindFn:O,prefixed:D}),(void 0!==i?i:"undefined"!=typeof self?self:{}).Hammer=tR,s!==(r=(function(){return tR}).call(e,n,e,t))&&(t.exports=r)}(window,document,0);/***/},/***/3454:/***/function(t,e,n){"use strict";var r,i;t.exports=(null===(r=n.g.process)||void 0===r?void 0:r.env)&&"object"==typeof(null===(i=n.g.process)||void 0===i?void 0:i.env)?n.g.process:n(7663);//# sourceMappingURL=process.js.map
/***/},/***/7663:/***/function(t){!function(){var e={162:function(t){var e,n,r,i=t.exports={};function o(){throw Error("setTimeout has not been defined")}function a(){throw Error("clearTimeout has not been defined")}function s(t){if(e===setTimeout)return setTimeout(t,0);if((e===o||!e)&&setTimeout)return e=setTimeout,setTimeout(t,0);try{return e(t,0)}catch(n){try{return e.call(null,t,0)}catch(n){return e.call(this,t,0)}}}!function(){try{e="function"==typeof setTimeout?setTimeout:o}catch(t){e=o}try{n="function"==typeof clearTimeout?clearTimeout:a}catch(t){n=a}}();var c=[],u=!1,l=-1;function h(){u&&r&&(u=!1,r.length?c=r.concat(c):l=-1,c.length&&p())}function p(){if(!u){var t=s(h);u=!0;for(var e=c.length;e;){for(r=c,c=[];++l<e;)r&&r[l].run();l=-1,e=c.length}r=null,u=!1,function(t){if(n===clearTimeout)return clearTimeout(t);if((n===a||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(t);try{n(t)}catch(e){try{return n.call(null,t)}catch(e){return n.call(this,t)}}}(t)}}function f(t,e){this.fun=t,this.array=e}function d(){}i.nextTick=function(t){var e=Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];c.push(new f(t,e)),1!==c.length||u||s(p)},f.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=d,i.addListener=d,i.once=d,i.off=d,i.removeListener=d,i.removeAllListeners=d,i.emit=d,i.prependListener=d,i.prependOnceListener=d,i.listeners=function(t){return[]},i.binding=function(t){throw Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(t){throw Error("process.chdir is not supported")},i.umask=function(){return 0}}},n={};function r(t){var i=n[t];if(void 0!==i)return i.exports;var o=n[t]={exports:{}},a=!0;try{e[t](o,o.exports,r),a=!1}finally{a&&delete n[t]}return o.exports}r.ab="//";var i=r(162);t.exports=i}();/***/},/***/2703:/***/function(t,e,n){"use strict";/**
             * Copyright (c) 2013-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */var r=n(414);function i(){}function o(){}o.resetWarningCache=i,t.exports=function(){function t(t,e,n,i,o,a){if(a!==r){var s=Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function e(){return t}t.isRequired=t;// Important!
// Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
var n={array:t,bigint:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:o,resetWarningCache:i};return n.PropTypes=n,n};/***/},/***/5697:/***/function(t,e,n){// By explicitly using `prop-types` you are opting into new production behavior.
// http://fb.me/prop-types-in-prod
t.exports=n(2703)();/***/},/***/414:/***/function(t){"use strict";t.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";/***/},/***/6785:/***/function(t,e,n){"use strict";// UNUSED EXPORTS: AttributionControl, BaseControl, CanvasOverlay, FlyToInterpolator, FullscreenControl, GeolocateControl, HTMLOverlay, InteractiveMap, Layer, LinearInterpolator, MapContext, MapController, Marker, NavigationControl, Popup, SVGOverlay, ScaleControl, Source, StaticMap, TRANSITION_EVENTS, TransitionInterpolator, WebMercatorViewport, _MapContext, _useMapControl, setRTLTextPlugin
function r(){return(r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js
function o(t,e){if(t){if("string"==typeof t)return i(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);if("Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return i(t,e)}}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}// EXPORTS
n.d(e,{ZP:function(){return /* reexport */na}});// EXTERNAL MODULE: ./node_modules/react/index.js
var s,c,u,l,h=n(7294),p=n(5697);function f(t,e){return function(t){if(Array.isArray(t))return t}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
(t)||function(t,e){var n,r,i=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=i){var o=[],a=!0,s=!1;try{for(i=i.call(t);!(a=(n=i.next()).done)&&(o.push(n.value),!e||o.length!==e);a=!0);}catch(t){s=!0,r=t}finally{try{a||null==i.return||i.return()}finally{if(s)throw r}}return o}}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
(t,e)||o(t,e)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js
()}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/node_modules/gl-matrix/esm/common.js
var d="undefined"!=typeof Float32Array?Float32Array:Array;function v(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}function g(t,e){var n,r,i,o,a,s;const c=(n=[],r=e[0],i=e[1],o=e[2],a=e[3],n[0]=t[0]*r+t[4]*i+t[8]*o+t[12]*a,n[1]=t[1]*r+t[5]*i+t[9]*o+t[13]*a,n[2]=t[2]*r+t[6]*i+t[10]*o+t[14]*a,n[3]=t[3]*r+t[7]*i+t[11]*o+t[15]*a,n);return s=1/c[3],c[0]=c[0]*s,c[1]=c[1]*s,c[2]=c[2]*s,c[3]=c[3]*s,c}function m(t,e){const n=t%e;return n<0?e+n:n}Math.hypot||(Math.hypot=function(){for(var t=0,e=arguments.length;e--;)t+=arguments[e]*arguments[e];return Math.sqrt(t)}),s=new d(4),d!=Float32Array&&(s[0]=0,s[1]=0,s[2]=0,s[3]=0);const b=Math.log2||function(t){return Math.log(t)*Math.LOG2E};// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/node_modules/gl-matrix/esm/mat4.js
/**
             * Multiplies two mat4s
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the first operand
             * @param {ReadonlyMat4} b the second operand
             * @returns {mat4} out
             */function y(t,e,n){var r=e[0],i=e[1],o=e[2],a=e[3],s=e[4],c=e[5],u=e[6],l=e[7],h=e[8],p=e[9],f=e[10],d=e[11],v=e[12],g=e[13],m=e[14],b=e[15],y=n[0],w=n[1],O=n[2],E=n[3];return t[0]=y*r+w*s+O*h+E*v,t[1]=y*i+w*c+O*p+E*g,t[2]=y*o+w*u+O*f+E*m,t[3]=y*a+w*l+O*d+E*b,y=n[4],w=n[5],O=n[6],E=n[7],t[4]=y*r+w*s+O*h+E*v,t[5]=y*i+w*c+O*p+E*g,t[6]=y*o+w*u+O*f+E*m,t[7]=y*a+w*l+O*d+E*b,y=n[8],w=n[9],O=n[10],E=n[11],t[8]=y*r+w*s+O*h+E*v,t[9]=y*i+w*c+O*p+E*g,t[10]=y*o+w*u+O*f+E*m,t[11]=y*a+w*l+O*d+E*b,y=n[12],w=n[13],O=n[14],E=n[15],t[12]=y*r+w*s+O*h+E*v,t[13]=y*i+w*c+O*p+E*g,t[14]=y*o+w*u+O*f+E*m,t[15]=y*a+w*l+O*d+E*b,t}/**
             * Translate a mat4 by the given vector
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the matrix to translate
             * @param {ReadonlyVec3} v vector to translate by
             * @returns {mat4} out
             */function w(t,e,n){var r,i,o,a,s,c,u,l,h,p,f,d,v=n[0],g=n[1],m=n[2];return e===t?(t[12]=e[0]*v+e[4]*g+e[8]*m+e[12],t[13]=e[1]*v+e[5]*g+e[9]*m+e[13],t[14]=e[2]*v+e[6]*g+e[10]*m+e[14],t[15]=e[3]*v+e[7]*g+e[11]*m+e[15]):(r=e[0],i=e[1],o=e[2],a=e[3],s=e[4],c=e[5],u=e[6],l=e[7],h=e[8],p=e[9],f=e[10],d=e[11],t[0]=r,t[1]=i,t[2]=o,t[3]=a,t[4]=s,t[5]=c,t[6]=u,t[7]=l,t[8]=h,t[9]=p,t[10]=f,t[11]=d,t[12]=r*v+s*g+h*m+e[12],t[13]=i*v+c*g+p*m+e[13],t[14]=o*v+u*g+f*m+e[14],t[15]=a*v+l*g+d*m+e[15]),t}/**
             * Scales the mat4 by the dimensions in the given vec3 not using vectorization
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the matrix to scale
             * @param {ReadonlyVec3} v the vec3 to scale the matrix by
             * @returns {mat4} out
             **/function O(t,e,n){var r=n[0],i=n[1],o=n[2];return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t[3]=e[3]*r,t[4]=e[4]*i,t[5]=e[5]*i,t[6]=e[6]*i,t[7]=e[7]*i,t[8]=e[8]*o,t[9]=e[9]*o,t[10]=e[10]*o,t[11]=e[11]*o,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}/**
             * Returns whether or not the matrices have approximately the same elements in the same position.
             *
             * @param {ReadonlyMat4} a The first matrix.
             * @param {ReadonlyMat4} b The second matrix.
             * @returns {Boolean} True if the matrices are equal, false otherwise.
             */function E(t,e){var n=t[0],r=t[1],i=t[2],o=t[3],a=t[4],s=t[5],c=t[6],u=t[7],l=t[8],h=t[9],p=t[10],f=t[11],d=t[12],v=t[13],g=t[14],m=t[15],b=e[0],y=e[1],w=e[2],O=e[3],E=e[4],_=e[5],P=e[6],M=e[7],j=e[8],S=e[9],T=e[10],k=e[11],x=e[12],D=e[13],C=e[14],R=e[15];return Math.abs(n-b)<=1e-6*Math.max(1,Math.abs(n),Math.abs(b))&&Math.abs(r-y)<=1e-6*Math.max(1,Math.abs(r),Math.abs(y))&&Math.abs(i-w)<=1e-6*Math.max(1,Math.abs(i),Math.abs(w))&&Math.abs(o-O)<=1e-6*Math.max(1,Math.abs(o),Math.abs(O))&&Math.abs(a-E)<=1e-6*Math.max(1,Math.abs(a),Math.abs(E))&&Math.abs(s-_)<=1e-6*Math.max(1,Math.abs(s),Math.abs(_))&&Math.abs(c-P)<=1e-6*Math.max(1,Math.abs(c),Math.abs(P))&&Math.abs(u-M)<=1e-6*Math.max(1,Math.abs(u),Math.abs(M))&&Math.abs(l-j)<=1e-6*Math.max(1,Math.abs(l),Math.abs(j))&&Math.abs(h-S)<=1e-6*Math.max(1,Math.abs(h),Math.abs(S))&&Math.abs(p-T)<=1e-6*Math.max(1,Math.abs(p),Math.abs(T))&&Math.abs(f-k)<=1e-6*Math.max(1,Math.abs(f),Math.abs(k))&&Math.abs(d-x)<=1e-6*Math.max(1,Math.abs(d),Math.abs(x))&&Math.abs(v-D)<=1e-6*Math.max(1,Math.abs(v),Math.abs(D))&&Math.abs(g-C)<=1e-6*Math.max(1,Math.abs(g),Math.abs(C))&&Math.abs(m-R)<=1e-6*Math.max(1,Math.abs(m),Math.abs(R))}/**
             * Adds two vec2's
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @returns {vec2} out
             */function _(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t}/**
             * Performs a linear interpolation between two vec2's
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
             * @returns {vec2} out
             */function P(t,e,n,r){var i=e[0],o=e[1];return t[0]=i+r*(n[0]-i),t[1]=o+r*(n[1]-o),t}function M(t,e){if(!t)throw Error(e||"@math.gl/web-mercator: assertion failed.")}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/web-mercator-utils.js
c=new d(2),d!=Float32Array&&(c[0]=0,c[1]=0),u=new d(3),d!=Float32Array&&(u[0]=0,u[1]=0,u[2]=0);//# sourceMappingURL=assert.js.map
const j=Math.PI,S=j/4,T=j/180,k=180/j;function x(t){return Math.pow(2,t)}function D([t,e]){M(Number.isFinite(t)),M(Number.isFinite(e)&&e>=-90&&e<=90,"invalid latitude");const n=512*(j+Math.log(Math.tan(S+e*T*.5)))/(2*j);return[512*(t*T+j)/(2*j),n]}function C([t,e]){const n=2*(Math.atan(Math.exp(e/512*(2*j)-j))-S);return[(t/512*(2*j)-j)*k,n*k]}function R(t){return 2*Math.atan(.5/t)*k}function A(t){return .5/Math.tan(.5*t*T)}function I(t,e,n=0){const[r,i,o]=t;if(M(Number.isFinite(r)&&Number.isFinite(i),"invalid pixel coordinate"),Number.isFinite(o))return g(e,[r,i,o,1]);const a=g(e,[r,i,0,1]),s=g(e,[r,i,1,1]),c=a[2],u=s[2];return P([],a,s,c===u?0:((n||0)-c)/(u-c))}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/fit-bounds.js
//# sourceMappingURL=fit-bounds.js.map
const L=Math.PI/180;function N(t,e,n){const{pixelUnprojectionMatrix:r}=t,i=g(r,[e,0,1,1]),o=g(r,[e,t.height,1,1]),a=(n*t.distanceScales.unitsPerMeter[2]-i[2])/(o[2]-i[2]),s=C(P([],i,o,a));return s[2]=n,s}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/web-mercator-viewport.js
//# sourceMappingURL=get-bounds.js.map
class z{constructor({width:t,height:e,latitude:n=0,longitude:r=0,zoom:i=0,pitch:o=0,bearing:a=0,altitude:s=null,fovy:c=null,position:u=null,nearZMultiplier:l=.02,farZMultiplier:h=1.01}={width:1,height:1}){t=t||1,e=e||1,null===c&&null===s?c=R(s=1.5):null===c?c=R(s):null===s&&(s=A(c));const p=x(i);s=Math.max(.75,s);const f=function({latitude:t,longitude:e,highPrecision:n=!1}){M(Number.isFinite(t)&&Number.isFinite(e));const r={},i=Math.cos(t*T),o=512/360,a=512/360/i,s=512/4003e4/i;if(r.unitsPerMeter=[s,s,s],r.metersPerUnit=[1/s,1/s,1/s],r.unitsPerDegree=[o,a,s],r.degreesPerUnit=[1/o,1/a,1/s],n){const e=T*Math.tan(t*T)/i,n=512/4003e4*e,c=n/a*s;r.unitsPerDegree2=[0,o*e/2,n],r.unitsPerMeter2=[c,0,c]}return r}({longitude:r,latitude:n}),d=D([r,n]);if(d[2]=0,u){var g,m;g=[],m=f.unitsPerMeter,g[0]=u[0]*m[0],g[1]=u[1]*m[1],g[2]=u[2]*m[2],d[0]=d[0]+g[0],d[1]=d[1]+g[1],d[2]=d[2]+g[2]}this.projectionMatrix=function({width:t,height:e,pitch:n,altitude:r,fovy:i,nearZMultiplier:o,farZMultiplier:a}){var s,c,u;const{fov:l,aspect:h,near:p,far:f}=function({width:t,height:e,fovy:n=R(1.5),altitude:r,pitch:i=0,nearZMultiplier:o=1,farZMultiplier:a=1}){void 0!==r&&(n=R(r));const s=.5*n*T,c=A(n),u=i*T,l=Math.sin(s)*c/Math.sin(Math.min(Math.max(Math.PI/2-u-s,.01),Math.PI-.01)),h=Math.sin(u)*l+c;return{fov:2*s,aspect:t/e,focalDistance:c,near:o,far:h*a}}({width:t,height:e,altitude:r,fovy:i,pitch:n,nearZMultiplier:o,farZMultiplier:a});return s=[],u=1/Math.tan(l/2),s[0]=u/h,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=u,s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[11]=-1,s[12]=0,s[13]=0,s[15]=0,null!=f&&f!==1/0?(c=1/(p-f),s[10]=(f+p)*c,s[14]=2*f*p*c):(s[10]=-1,s[14]=-2*p),s}({width:t,height:e,pitch:o,fovy:c,nearZMultiplier:l,farZMultiplier:h}),this.viewMatrix=function({height:t,pitch:e,bearing:n,altitude:r,scale:i,center:o=null}){var a,s,c,u,l,h,p,f,d,g,m,b,y,E,_,P,M,j,S,k,x,D,C;const R=v();return w(R,R,[0,0,-r]),s=Math.sin(a=-e*T),c=Math.cos(a),u=R[4],l=R[5],h=R[6],p=R[7],f=R[8],d=R[9],g=R[10],m=R[11],R!=R&&(// If the source and destination differ, copy the unchanged rows
R[0]=R[0],R[1]=R[1],R[2]=R[2],R[3]=R[3],R[12]=R[12],R[13]=R[13],R[14]=R[14],R[15]=R[15]),R[4]=u*c+f*s,R[5]=l*c+d*s,R[6]=h*c+g*s,R[7]=p*c+m*s,R[8]=f*c-u*s,R[9]=d*c-l*s,R[10]=g*c-h*s,R[11]=m*c-p*s,y=Math.sin(b=n*T),E=Math.cos(b),_=R[0],P=R[1],M=R[2],j=R[3],S=R[4],k=R[5],x=R[6],D=R[7],R!=R&&(// If the source and destination differ, copy the unchanged last row
R[8]=R[8],R[9]=R[9],R[10]=R[10],R[11]=R[11],R[12]=R[12],R[13]=R[13],R[14]=R[14],R[15]=R[15]),R[0]=_*E+S*y,R[1]=P*E+k*y,R[2]=M*E+x*y,R[3]=j*E+D*y,R[4]=S*E-_*y,R[5]=k*E-P*y,R[6]=x*E-M*y,R[7]=D*E-j*y,O(R,R,[i/=t,i,i]),o&&w(R,R,((C=[])[0]=-o[0],C[1]=-o[1],C[2]=-o[2],C)),R}({height:e,scale:p,center:d,pitch:o,bearing:a,altitude:s}),this.width=t,this.height=e,this.scale=p,this.latitude=n,this.longitude=r,this.zoom=i,this.pitch=o,this.bearing=a,this.altitude=s,this.fovy=c,this.center=d,this.meterOffset=u||[0,0,0],this.distanceScales=f,this._initMatrices(),this.equals=this.equals.bind(this),this.project=this.project.bind(this),this.unproject=this.unproject.bind(this),this.projectPosition=this.projectPosition.bind(this),this.unprojectPosition=this.unprojectPosition.bind(this),Object.freeze(this)}_initMatrices(){var t,e,n,r,i,o,a,s,c,u,l,h,p,f,d,g,m,b,E,_,P,M,j,S,T,k,x,D,C,R;const{width:A,height:I,projectionMatrix:L,viewMatrix:N}=this,z=v();y(z,z,L),y(z,z,N),this.viewProjectionMatrix=z;const F=v();O(F,F,[A/2,-I/2,1]),w(F,F,[1,-1,0]),y(F,F,z);const V=(t=v(),e=F[0],n=F[1],r=F[2],i=F[3],o=F[4],a=F[5],s=F[6],c=F[7],u=F[8],l=F[9],h=F[10],p=F[11],f=F[12],d=F[13],g=F[14],m=F[15],b=e*a-n*o,E=e*s-r*o,_=e*c-i*o,P=n*s-r*a,M=n*c-i*a,j=r*c-i*s,S=u*d-l*f,T=u*g-h*f,k=u*m-p*f,x=l*g-h*d,D=l*m-p*d,(R=b*(C=h*m-p*g)-E*D+_*x+P*k-M*T+j*S)?(R=1/R,t[0]=(a*C-s*D+c*x)*R,t[1]=(r*D-n*C-i*x)*R,t[2]=(d*j-g*M+m*P)*R,t[3]=(h*M-l*j-p*P)*R,t[4]=(s*k-o*C-c*T)*R,t[5]=(e*C-r*k+i*T)*R,t[6]=(g*_-f*j-m*E)*R,t[7]=(u*j-h*_+p*E)*R,t[8]=(o*D-a*k+c*S)*R,t[9]=(n*k-e*D-i*S)*R,t[10]=(f*M-d*_+m*b)*R,t[11]=(l*_-u*M-p*b)*R,t[12]=(a*T-o*x-s*S)*R,t[13]=(e*x-n*T+r*S)*R,t[14]=(d*E-f*P-g*b)*R,t[15]=(u*P-l*E+h*b)*R,t):null);if(!V)throw Error("Pixel project matrix not invertible");this.pixelProjectionMatrix=F,this.pixelUnprojectionMatrix=V}equals(t){return t instanceof z&&t.width===this.width&&t.height===this.height&&E(t.projectionMatrix,this.projectionMatrix)&&E(t.viewMatrix,this.viewMatrix)}project(t,{topLeft:e=!0}={}){const n=function(t,e){const[n,r,i=0]=t;return M(Number.isFinite(n)&&Number.isFinite(r)&&Number.isFinite(i)),g(e,[n,r,i,1])}(this.projectPosition(t),this.pixelProjectionMatrix),[r,i]=n,o=e?i:this.height-i;return 2===t.length?[r,o]:[r,o,n[2]]}unproject(t,{topLeft:e=!0,targetZ:n}={}){const[r,i,o]=t,a=e?i:this.height-i,s=n&&n*this.distanceScales.unitsPerMeter[2],c=I([r,a,o],this.pixelUnprojectionMatrix,s),[u,l,h]=this.unprojectPosition(c);return Number.isFinite(o)?[u,l,h]:Number.isFinite(n)?[u,l,n]:[u,l]}projectPosition(t){const[e,n]=D(t);return[e,n,(t[2]||0)*this.distanceScales.unitsPerMeter[2]]}unprojectPosition(t){const[e,n]=C(t);return[e,n,(t[2]||0)*this.distanceScales.metersPerUnit[2]]}projectFlat(t){return D(t)}unprojectFlat(t){return C(t)}getMapCenterByLngLatPosition({lngLat:t,pos:e}){var n;const r=I(e,this.pixelUnprojectionMatrix),i=_([],D(t),((n=[])[0]=-r[0],n[1]=-r[1],n));return C(_([],this.center,i))}getLocationAtPoint({lngLat:t,pos:e}){return this.getMapCenterByLngLatPosition({lngLat:t,pos:e})}fitBounds(t,e={}){const{width:n,height:r}=this,{longitude:i,latitude:o,zoom:a}=//# sourceMappingURL=web-mercator-utils.js.map
function({width:t,height:e,bounds:n,minExtent:r=0,maxZoom:i=24,padding:o=0,offset:a=[0,0]}){const[[s,c],[u,l]]=n;if(Number.isFinite(o)){const t=o;o={top:t,bottom:t,left:t,right:t}}else M(Number.isFinite(o.top)&&Number.isFinite(o.bottom)&&Number.isFinite(o.left)&&Number.isFinite(o.right));const h=D([s,l<-85.051129?-85.051129:l>85.051129?85.051129:l]),p=D([u,c<-85.051129?-85.051129:c>85.051129?85.051129:c]),f=[Math.max(Math.abs(p[0]-h[0]),r),Math.max(Math.abs(p[1]-h[1]),r)],d=[t-o.left-o.right-2*Math.abs(a[0]),e-o.top-o.bottom-2*Math.abs(a[1])];M(d[0]>0&&d[1]>0);const v=d[0]/f[0],g=d[1]/f[1],m=(o.right-o.left)/2/v,y=(o.bottom-o.top)/2/g,w=C([(p[0]+h[0])/2+m,(p[1]+h[1])/2+y]),O=Math.min(i,b(Math.abs(Math.min(v,g))));return M(Number.isFinite(O)),{longitude:w[0],latitude:w[1],zoom:O}}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/get-bounds.js
(Object.assign({width:n,height:r,bounds:t},e));return new z({width:n,height:r,longitude:i,latitude:o,zoom:a})}getBounds(t){const e=this.getBoundingRegion(t),n=Math.min(...e.map(t=>t[0])),r=Math.max(...e.map(t=>t[0]));return[[n,Math.min(...e.map(t=>t[1]))],[r,Math.max(...e.map(t=>t[1]))]]}getBoundingRegion(t={}){return function(t,e=0){let n,r;const{width:i,height:o,unproject:a}=t,s={targetZ:e},c=a([0,o],s),u=a([i,o],s);return(t.fovy?.5*t.fovy*L:Math.atan(.5/t.altitude))>(90-t.pitch)*L-.01?(n=N(t,0,e),r=N(t,i,e)):(n=a([0,0],s),r=a([i,0],s)),[c,u,r,n]}(this,t.z||0)}}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/normalize-viewport-props.js
const F=["longitude","latitude","zoom"],V={curve:1.414,speed:1.2};function Z(t,e,n){var r,i;const o=(n=Object.assign({},V,n)).curve,a=t.zoom,s=[t.longitude,t.latitude],c=x(a),u=e.zoom,l=[e.longitude,e.latitude],h=x(u-a),p=D(s),f=(r=[],i=D(l),r[0]=i[0]-p[0],r[1]=i[1]-p[1],r),d=Math.max(t.width,t.height),v=d/h,g=Math.hypot(f[0],f[1])*c,m=Math.max(g,.01),b=o*o,y=(v*v-d*d+b*b*m*m)/(2*d*b*m),w=(v*v-d*d-b*b*m*m)/(2*v*b*m),O=Math.log(Math.sqrt(y*y+1)-y),E=Math.log(Math.sqrt(w*w+1)-w);return{startZoom:a,startCenterXY:p,uDelta:f,w0:d,u1:g,S:(E-O)/o,rho:o,rho2:b,r0:O,r1:E}}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/index.js // CONCATENATED MODULE: ./node_modules/viewport-mercator-project/module.js // CONCATENATED MODULE: ./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js
//# sourceMappingURL=fly-to-viewport.js.map
//# sourceMappingURL=index.js.map
/**
             * A collection of shims that provide minimal functionality of the ES6 collections.
             *
             * These implementations are not meant to be used outside of the ResizeObserver
             * modules as they cover only a limited range of use cases.
             *//* eslint-disable require-jsdoc, valid-jsdoc */var B=function(){if("undefined"!=typeof Map)return Map;/**
                 * Returns index in provided array that matches the specified key.
                 *
                 * @param {Array<Array>} arr
                 * @param {*} key
                 * @returns {number}
                 */function t(t,e){var n=-1;return t.some(function(t,r){return t[0]===e&&(n=r,!0)}),n}return /** @class */function(){function e(){this.__entries__=[]}return Object.defineProperty(e.prototype,"size",{/**
                         * @returns {boolean}
                         */get:function(){return this.__entries__.length},enumerable:!0,configurable:!0}),/**
                     * @param {*} key
                     * @returns {*}
                     */e.prototype.get=function(e){var n=t(this.__entries__,e),r=this.__entries__[n];return r&&r[1]},/**
                     * @param {*} key
                     * @param {*} value
                     * @returns {void}
                     */e.prototype.set=function(e,n){var r=t(this.__entries__,e);~r?this.__entries__[r][1]=n:this.__entries__.push([e,n])},/**
                     * @param {*} key
                     * @returns {void}
                     */e.prototype.delete=function(e){var n=this.__entries__,r=t(n,e);~r&&n.splice(r,1)},/**
                     * @param {*} key
                     * @returns {void}
                     */e.prototype.has=function(e){return!!~t(this.__entries__,e)},/**
                     * @returns {void}
                     */e.prototype.clear=function(){this.__entries__.splice(0)},/**
                     * @param {Function} callback
                     * @param {*} [ctx=null]
                     * @returns {void}
                     */e.prototype.forEach=function(t,e){void 0===e&&(e=null);for(var n=0,r=this.__entries__;n<r.length;n++){var i=r[n];t.call(e,i[1],i[0])}},e}()}(),U="undefined"!=typeof window&&"undefined"!=typeof document&&window.document===document,q=void 0!==n.g&&n.g.Math===Math?n.g:"undefined"!=typeof self&&self.Math===Math?self:"undefined"!=typeof window&&window.Math===Math?window:Function("return this")(),W="function"==typeof requestAnimationFrame?requestAnimationFrame.bind(q):function(t){return setTimeout(function(){return t(Date.now())},1e3/60)},H=["top","right","bottom","left","width","height","size","weight"],X="undefined"!=typeof MutationObserver,Y=/** @class */function(){/**
                 * Creates a new instance of ResizeObserverController.
                 *
                 * @private
                 */function t(){/**
                     * Indicates whether DOM listeners have been added.
                     *
                     * @private {boolean}
                     */this.connected_=!1,/**
                     * Tells that controller has subscribed for Mutation Events.
                     *
                     * @private {boolean}
                     */this.mutationEventsAdded_=!1,/**
                     * Keeps reference to the instance of MutationObserver.
                     *
                     * @private {MutationObserver}
                     */this.mutationsObserver_=null,/**
                     * A list of connected observers.
                     *
                     * @private {Array<ResizeObserverSPI>}
                     */this.observers_=[],this.onTransitionEnd_=this.onTransitionEnd_.bind(this),this.refresh=/**
             * Creates a wrapper function which ensures that provided callback will be
             * invoked only once during the specified delay period.
             *
             * @param {Function} callback - Function to be invoked after the delay period.
             * @param {number} delay - Delay after which to invoke callback.
             * @returns {Function}
             */function(t,e){var n=!1,r=!1,i=0;/**
                 * Invokes the original callback function and schedules new invocation if
                 * the "proxy" was called during current request.
                 *
                 * @returns {void}
                 */function o(){n&&(n=!1,t()),r&&s()}/**
                 * Callback invoked after the specified delay. It will further postpone
                 * invocation of the original function delegating it to the
                 * requestAnimationFrame.
                 *
                 * @returns {void}
                 */function a(){W(o)}/**
                 * Schedules invocation of the original function.
                 *
                 * @returns {void}
                 */function s(){var t=Date.now();if(n){// Reject immediately following calls.
if(t-i<2)return;// Schedule new call to be in invoked when the pending one is resolved.
// This is important for "transitions" which never actually start
// immediately so there is a chance that we might miss one if change
// happens amids the pending invocation.
r=!0}else n=!0,r=!1,setTimeout(a,20);i=t}return s}(this.refresh.bind(this),0)}return(/**
                 * Adds observer to observers list.
                 *
                 * @param {ResizeObserverSPI} observer - Observer to be added.
                 * @returns {void}
                 */t.prototype.addObserver=function(t){~this.observers_.indexOf(t)||this.observers_.push(t),this.connected_||this.connect_()},/**
                 * Removes observer from observers list.
                 *
                 * @param {ResizeObserverSPI} observer - Observer to be removed.
                 * @returns {void}
                 */t.prototype.removeObserver=function(t){var e=this.observers_,n=e.indexOf(t);~n&&e.splice(n,1),!e.length&&this.connected_&&this.disconnect_()},/**
                 * Invokes the update of observers. It will continue running updates insofar
                 * it detects changes.
                 *
                 * @returns {void}
                 */t.prototype.refresh=function(){// Continue running updates if changes have been detected as there might
// be future ones caused by CSS transitions.
this.updateObservers_()&&this.refresh()},/**
                 * Updates every observer from observers list and notifies them of queued
                 * entries.
                 *
                 * @private
                 * @returns {boolean} Returns "true" if any observer has detected changes in
                 *      dimensions of it's elements.
                 */t.prototype.updateObservers_=function(){// Collect observers that have active observations.
var t=this.observers_.filter(function(t){return t.gatherActive(),t.hasActive()});return(// Deliver notifications in a separate cycle in order to avoid any
// collisions between observers, e.g. when multiple instances of
// ResizeObserver are tracking the same element and the callback of one
// of them changes content dimensions of the observed target. Sometimes
// this may result in notifications being blocked for the rest of observers.
t.forEach(function(t){return t.broadcastActive()}),t.length>0)},/**
                 * Initializes DOM listeners.
                 *
                 * @private
                 * @returns {void}
                 */t.prototype.connect_=function(){// Do nothing if running in a non-browser environment or if listeners
// have been already added.
U&&!this.connected_&&(// Subscription to the "Transitionend" event is used as a workaround for
// delayed transitions. This way it's possible to capture at least the
// final state of an element.
document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),X?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},/**
                 * Removes DOM listeners.
                 *
                 * @private
                 * @returns {void}
                 */t.prototype.disconnect_=function(){// Do nothing if running in a non-browser environment or if listeners
// have been already removed.
U&&this.connected_&&(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},/**
                 * "Transitionend" event handler.
                 *
                 * @private
                 * @param {TransitionEvent} event
                 * @returns {void}
                 */t.prototype.onTransitionEnd_=function(t){var e=t.propertyName,n=void 0===e?"":e;H.some(function(t){return!!~n.indexOf(t)})&&this.refresh()},/**
                 * Returns instance of the ResizeObserverController.
                 *
                 * @returns {ResizeObserverController}
                 */t.getInstance=function(){return this.instance_||(this.instance_=new t),this.instance_},/**
                 * Holds reference to the controller's instance.
                 *
                 * @private {ResizeObserverController}
                 */t.instance_=null,t)}(),K=function(t,e){for(var n=0,r=Object.keys(e);n<r.length;n++){var i=r[n];Object.defineProperty(t,i,{value:e[i],enumerable:!1,writable:!1,configurable:!0})}return t},G=function(t){// Return the local global object if it's not possible extract one from
// provided element.
return t&&t.ownerDocument&&t.ownerDocument.defaultView||q},$=te(0,0,0,0);/**
             * Converts provided string to a number.
             *
             * @param {number|string} value
             * @returns {number}
             */function J(t){return parseFloat(t)||0}/**
             * Extracts borders size from provided styles.
             *
             * @param {CSSStyleDeclaration} styles
             * @param {...string} positions - Borders positions (top, right, ...)
             * @returns {number}
             */function Q(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return e.reduce(function(e,n){return e+J(t["border-"+n+"-width"])},0)}/**
             * Checks whether provided element is an instance of the SVGGraphicsElement.
             *
             * @param {Element} target - Element to be checked.
             * @returns {boolean}
             */var tt=// Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
// interface.
"undefined"!=typeof SVGGraphicsElement?function(t){return t instanceof G(t).SVGGraphicsElement}:function(t){return t instanceof G(t).SVGElement&&"function"==typeof t.getBBox};/**
             * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
             * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
             *
             * @param {number} x - X coordinate.
             * @param {number} y - Y coordinate.
             * @param {number} width - Rectangle's width.
             * @param {number} height - Rectangle's height.
             * @returns {DOMRectInit}
             */function te(t,e,n,r){return{x:t,y:e,width:n,height:r}}/**
             * Class that is responsible for computations of the content rectangle of
             * provided DOM element and for keeping track of it's changes.
             */var tn=/** @class */function(){/**
                 * Creates an instance of ResizeObservation.
                 *
                 * @param {Element} target - Element to be observed.
                 */function t(t){/**
                     * Broadcasted width of content rectangle.
                     *
                     * @type {number}
                     */this.broadcastWidth=0,/**
                     * Broadcasted height of content rectangle.
                     *
                     * @type {number}
                     */this.broadcastHeight=0,/**
                     * Reference to the last observed content rectangle.
                     *
                     * @private {DOMRectInit}
                     */this.contentRect_=te(0,0,0,0),this.target=t}return(/**
                 * Updates content rectangle and tells whether it's width or height properties
                 * have changed since the last broadcast.
                 *
                 * @returns {boolean}
                 */t.prototype.isActive=function(){var t=/**
             * Calculates an appropriate content rectangle for provided html or svg element.
             *
             * @param {Element} target - Element content rectangle of which needs to be calculated.
             * @returns {DOMRectInit}
             */function(t){if(!U)return $;if(tt(t)){var e;return te(0,0,(e=t.getBBox()).width,e.height)}return(/**
             * Calculates content rectangle of provided HTMLElement.
             *
             * @param {HTMLElement} target - Element for which to calculate the content rectangle.
             * @returns {DOMRectInit}
             */function(t){// Client width & height properties can't be
// used exclusively as they provide rounded values.
var e=t.clientWidth,n=t.clientHeight;// By this condition we can catch all non-replaced inline, hidden and
// detached elements. Though elements with width & height properties less
// than 0.5 will be discarded as well.
//
// Without it we would need to implement separate methods for each of
// those cases and it's not possible to perform a precise and performance
// effective test for hidden elements. E.g. even jQuery's ':visible' filter
// gives wrong results for elements with width & height less than 0.5.
if(!e&&!n)return $;var r=G(t).getComputedStyle(t),i=/**
             * Extracts paddings sizes from provided styles.
             *
             * @param {CSSStyleDeclaration} styles
             * @returns {Object} Paddings box.
             */function(t){for(var e={},n=0,r=["top","right","bottom","left"];n<r.length;n++){var i=r[n],o=t["padding-"+i];e[i]=J(o)}return e}(r),o=i.left+i.right,a=i.top+i.bottom,s=J(r.width),c=J(r.height);// Following steps can't be applied to the document's root element as its
// client[Width/Height] properties represent viewport area of the window.
// Besides, it's as well not necessary as the <html> itself neither has
// rendered scroll bars nor it can be clipped.
if("border-box"===r.boxSizing&&(Math.round(s+o)!==e&&(s-=Q(r,"left","right")+o),Math.round(c+a)!==n&&(c-=Q(r,"top","bottom")+a)),t!==G(t).document.documentElement){// In some browsers (only in Firefox, actually) CSS width & height
// include scroll bars size which can be removed at this step as scroll
// bars are the only difference between rounded dimensions + paddings
// and "client" properties, though that is not always true in Chrome.
var u=Math.round(s+o)-e,l=Math.round(c+a)-n;1!==Math.abs(u)&&(s-=u),1!==Math.abs(l)&&(c-=l)}return te(i.left,i.top,s,c)}(t))}(this.target);return this.contentRect_=t,t.width!==this.broadcastWidth||t.height!==this.broadcastHeight},/**
                 * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
                 * from the corresponding properties of the last observed content rectangle.
                 *
                 * @returns {DOMRectInit} Last observed content rectangle.
                 */t.prototype.broadcastRect=function(){var t=this.contentRect_;return this.broadcastWidth=t.width,this.broadcastHeight=t.height,t},t)}(),tr=/**
                 * Creates an instance of ResizeObserverEntry.
                 *
                 * @param {Element} target - Element that is being observed.
                 * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
                 */function(t,e){var n,r,i,o,a,s=(n=e.x,r=e.y,i=e.width,o=e.height,// Rectangle's properties are not writable and non-enumerable.
K(a=Object.create(("undefined"!=typeof DOMRectReadOnly?DOMRectReadOnly:Object).prototype),{x:n,y:r,width:i,height:o,top:r,right:n+i,bottom:o+r,left:n}),a);// According to the specification following properties are not writable
// and are also not enumerable in the native implementation.
//
// Property accessors are not being used as they'd require to define a
// private WeakMap storage which may cause memory leaks in browsers that
// don't support this type of collections.
K(this,{target:t,contentRect:s})},ti=/** @class */function(){/**
                 * Creates a new instance of ResizeObserver.
                 *
                 * @param {ResizeObserverCallback} callback - Callback function that is invoked
                 *      when one of the observed elements changes it's content dimensions.
                 * @param {ResizeObserverController} controller - Controller instance which
                 *      is responsible for the updates of observer.
                 * @param {ResizeObserver} callbackCtx - Reference to the public
                 *      ResizeObserver instance which will be passed to callback function.
                 */function t(t,e,n){if(/**
                     * Collection of resize observations that have detected changes in dimensions
                     * of elements.
                     *
                     * @private {Array<ResizeObservation>}
                     */this.activeObservations_=[],/**
                     * Registry of the ResizeObservation instances.
                     *
                     * @private {Map<Element, ResizeObservation>}
                     */this.observations_=new B,"function"!=typeof t)throw TypeError("The callback provided as parameter 1 is not a function.");this.callback_=t,this.controller_=e,this.callbackCtx_=n}return(/**
                 * Starts observing provided element.
                 *
                 * @param {Element} target - Element to be observed.
                 * @returns {void}
                 */t.prototype.observe=function(t){if(!arguments.length)throw TypeError("1 argument required, but only 0 present.");// Do nothing if current environment doesn't have the Element interface.
if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof G(t).Element))throw TypeError('parameter 1 is not of type "Element".');var e=this.observations_;// Do nothing if element is already being observed.
e.has(t)||(e.set(t,new tn(t)),this.controller_.addObserver(this),// Force the update of observations.
this.controller_.refresh())}},/**
                 * Stops observing provided element.
                 *
                 * @param {Element} target - Element to stop observing.
                 * @returns {void}
                 */t.prototype.unobserve=function(t){if(!arguments.length)throw TypeError("1 argument required, but only 0 present.");// Do nothing if current environment doesn't have the Element interface.
if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof G(t).Element))throw TypeError('parameter 1 is not of type "Element".');var e=this.observations_;// Do nothing if element is not being observed.
e.has(t)&&(e.delete(t),e.size||this.controller_.removeObserver(this))}},/**
                 * Stops observing all elements.
                 *
                 * @returns {void}
                 */t.prototype.disconnect=function(){this.clearActive(),this.observations_.clear(),this.controller_.removeObserver(this)},/**
                 * Collects observation instances the associated element of which has changed
                 * it's content rectangle.
                 *
                 * @returns {void}
                 */t.prototype.gatherActive=function(){var t=this;this.clearActive(),this.observations_.forEach(function(e){e.isActive()&&t.activeObservations_.push(e)})},/**
                 * Invokes initial callback function with a list of ResizeObserverEntry
                 * instances collected from active resize observations.
                 *
                 * @returns {void}
                 */t.prototype.broadcastActive=function(){// Do nothing if observer doesn't have active observations.
if(this.hasActive()){var t=this.callbackCtx_,e=this.activeObservations_.map(function(t){return new tr(t.target,t.broadcastRect())});this.callback_.call(t,e,t),this.clearActive()}},/**
                 * Clears the collection of active observations.
                 *
                 * @returns {void}
                 */t.prototype.clearActive=function(){this.activeObservations_.splice(0)},/**
                 * Tells whether observer has active observations.
                 *
                 * @returns {boolean}
                 */t.prototype.hasActive=function(){return this.activeObservations_.length>0},t)}(),to="undefined"!=typeof WeakMap?new WeakMap:new B,ta=/**
                 * Creates a new instance of ResizeObserver.
                 *
                 * @param {ResizeObserverCallback} callback - Callback that is invoked when
                 *      dimensions of the observed elements change.
                 */function t(e){if(!(this instanceof t))throw TypeError("Cannot call a class as a function.");if(!arguments.length)throw TypeError("1 argument required, but only 0 present.");var n=new ti(e,Y.getInstance(),this);to.set(this,n)};// Expose public methods of ResizeObserver.
["observe","unobserve","disconnect"].forEach(function(t){ta.prototype[t]=function(){var e;return(e=to.get(this))[t].apply(e,arguments)}});var ts=// Export existing implementation if available.
void 0!==q.ResizeObserver?q.ResizeObserver:ta;function tc(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
function tu(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function tl(t,e,n){return e&&tu(t.prototype,e),n&&tu(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/globals.js
"undefined"!=typeof window?window:n.g,void 0!==n.g?n.g:window;var th="undefined"!=typeof document?document:{};// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/style-utils.js
//# sourceMappingURL=globals.js.map
function tp(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function tf(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?tp(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):tp(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}function td(t,e){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(i=function(t,e){if(t){if("string"==typeof t)return tv(t,void 0);var n=Object.prototype.toString.call(t).slice(8,-1);if("Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return tv(t,void 0)}}(t))||e&&t&&"number"==typeof t.length){i&&(t=i);var n=0,r=function(){};return{s:r,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:r}}throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o,a=!0,s=!1;return{s:function(){i=t[Symbol.iterator]()},n:function(){var t=i.next();return a=t.done,t},e:function(t){s=!0,o=t},f:function(){try{a||null==i.return||i.return()}finally{if(s)throw o}}}}function tv(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}var tg=["type","source","source-layer","minzoom","maxzoom","filter","layout"];function tm(t){if(!t)return null;if("string"==typeof t)return t;t.toJS&&(t=t.toJS());var e,n={},r=td(t.layers);try{for(r.s();!(e=r.n()).done;){var i=e.value;n[i.id]=i}}catch(t){r.e(t)}finally{r.f()}var o=t.layers.map(function(t){var e=n[t.ref],r=null;if("interactive"in t&&(r=tf({},t),delete r.interactive),e){r=r||tf({},t),delete r.ref;var i,o=td(tg);try{for(o.s();!(i=o.n()).done;){var a=i.value;a in e&&(r[a]=e[a])}}catch(t){o.e(t)}finally{o.f()}}return r||t});return tf(tf({},t),{},{layers:o})}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/mapbox/mapbox.js
//# sourceMappingURL=style-utils.js.map
/* provided dependency */var tb=n(3454),ty={container:p.object,gl:p.object,mapboxApiAccessToken:p.string,mapboxApiUrl:p.string,attributionControl:p.bool,preserveDrawingBuffer:p.bool,reuseMaps:p.bool,transformRequest:p.func,mapOptions:p.object,mapStyle:p.oneOfType([p.string,p.object]),preventStyleDiffing:p.bool,visible:p.bool,asyncRender:p.bool,onLoad:p.func,onError:p.func,width:p.number,height:p.number,viewState:p.object,longitude:p.number,latitude:p.number,zoom:p.number,bearing:p.number,pitch:p.number,altitude:p.number},tw={container:th.body,mapboxApiAccessToken:function(){var t=null;if("undefined"!=typeof window&&window.location){var e=window.location.search.match(/access_token=([^&\/]*)/);t=e&&e[1]}return t||void 0===tb||(t=t||tb.env.MapboxAccessToken||tb.env.REACT_APP_MAPBOX_ACCESS_TOKEN),t||"no-token"}(),mapboxApiUrl:"https://api.mapbox.com",preserveDrawingBuffer:!1,attributionControl:!0,reuseMaps:!1,mapOptions:{},mapStyle:"mapbox://styles/mapbox/light-v8",preventStyleDiffing:!1,visible:!0,asyncRender:!1,onLoad:function(){},onError:function(t){t&&console.error(t.error)},width:0,height:0,longitude:0,latitude:0,zoom:0,bearing:0,pitch:0,altitude:1.5};function tO(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"component";t.debug&&p.checkPropTypes(ty,t,"prop",e)}var tE=function(){function t(e){var n=this;if(tc(this,t),a(this,"props",tw),a(this,"width",0),a(this,"height",0),a(this,"_fireLoadEvent",function(){n.props.onLoad({type:"load",target:n._map})}),a(this,"_handleError",function(t){n.props.onError(t)}),!e.mapboxgl)throw Error("Mapbox not available");this.mapboxgl=e.mapboxgl,t.initialized||(t.initialized=!0,this._checkStyleSheet(this.mapboxgl.version)),this._initialize(e)}return tl(t,[{key:"finalize",value:function(){return this._destroy(),this}},{key:"setProps",value:function(t){return this._update(this.props,t),this}},{key:"redraw",value:function(){var t=this._map;t.style&&(t._frame&&(t._frame.cancel(),t._frame=null),t._render())}},{key:"getMap",value:function(){return this._map}},{key:"_reuse",value:function(e){this._map=t.savedMap;var n=this._map.getContainer(),r=e.container;for(r.classList.add("mapboxgl-map");n.childNodes.length>0;)r.appendChild(n.childNodes[0]);this._map._container=r,t.savedMap=null,e.mapStyle&&this._map.setStyle(tm(e.mapStyle),{diff:!1}),this._map.isStyleLoaded()?this._fireLoadEvent():this._map.once("styledata",this._fireLoadEvent)}},{key:"_create",value:function(e){if(e.reuseMaps&&t.savedMap)this._reuse(e);else{if(e.gl){var n=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(){return HTMLCanvasElement.prototype.getContext=n,e.gl}}var r={container:e.container,center:[0,0],zoom:8,pitch:0,bearing:0,maxZoom:24,style:tm(e.mapStyle),interactive:!1,trackResize:!1,attributionControl:e.attributionControl,preserveDrawingBuffer:e.preserveDrawingBuffer};e.transformRequest&&(r.transformRequest=e.transformRequest),this._map=new this.mapboxgl.Map(Object.assign({},r,e.mapOptions)),this._map.once("load",this._fireLoadEvent),this._map.on("error",this._handleError)}return this}},{key:"_destroy",value:function(){this._map&&(this.props.reuseMaps&&!t.savedMap?(t.savedMap=this._map,this._map.off("load",this._fireLoadEvent),this._map.off("error",this._handleError),this._map.off("styledata",this._fireLoadEvent)):this._map.remove(),this._map=null)}},{key:"_initialize",value:function(t){var e=this;tO(t=Object.assign({},tw,t),"Mapbox"),this.mapboxgl.accessToken=t.mapboxApiAccessToken||tw.mapboxApiAccessToken,this.mapboxgl.baseApiUrl=t.mapboxApiUrl,this._create(t);var n=t.container;Object.defineProperty(n,"offsetWidth",{configurable:!0,get:function(){return e.width}}),Object.defineProperty(n,"clientWidth",{configurable:!0,get:function(){return e.width}}),Object.defineProperty(n,"offsetHeight",{configurable:!0,get:function(){return e.height}}),Object.defineProperty(n,"clientHeight",{configurable:!0,get:function(){return e.height}});var r=this._map.getCanvas();r&&(r.style.outline="none"),this._updateMapViewport({},t),this._updateMapSize({},t),this.props=t}},{key:"_update",value:function(t,e){if(this._map){tO(e=Object.assign({},this.props,e),"Mapbox");var n=this._updateMapViewport(t,e),r=this._updateMapSize(t,e);this._updateMapStyle(t,e),!e.asyncRender&&(n||r)&&this.redraw(),this.props=e}}},{key:"_updateMapStyle",value:function(t,e){t.mapStyle!==e.mapStyle&&this._map.setStyle(tm(e.mapStyle),{diff:!e.preventStyleDiffing})}},{key:"_updateMapSize",value:function(t,e){var n=t.width!==e.width||t.height!==e.height;return n&&(this.width=e.width,this.height=e.height,this._map.resize()),n}},{key:"_updateMapViewport",value:function(t,e){var n=this._getViewState(t),r=this._getViewState(e),i=r.latitude!==n.latitude||r.longitude!==n.longitude||r.zoom!==n.zoom||r.pitch!==n.pitch||r.bearing!==n.bearing||r.altitude!==n.altitude;return i&&(this._map.jumpTo(this._viewStateToMapboxProps(r)),r.altitude!==n.altitude&&(this._map.transform.altitude=r.altitude)),i}},{key:"_getViewState",value:function(t){var e=t.viewState||t,n=e.longitude,r=e.latitude,i=e.zoom,o=e.pitch,a=e.bearing,s=e.altitude;return{longitude:n,latitude:r,zoom:i,pitch:void 0===o?0:o,bearing:void 0===a?0:a,altitude:void 0===s?1.5:s}}},{key:"_checkStyleSheet",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"0.47.0";if(void 0!==th)try{var e=th.createElement("div");if(e.className="mapboxgl-map",e.style.display="none",th.body.appendChild(e),!("static"!==window.getComputedStyle(e).position)){var n=th.createElement("link");n.setAttribute("rel","stylesheet"),n.setAttribute("type","text/css"),n.setAttribute("href","https://api.tiles.mapbox.com/mapbox-gl-js/v".concat(t,"/mapbox-gl.css")),th.head.appendChild(n)}}catch(t){}}},{key:"_viewStateToMapboxProps",value:function(t){return{center:[t.longitude,t.latitude],zoom:t.zoom,bearing:t.bearing,pitch:t.pitch}}}]),t}();a(tE,"initialized",!1),a(tE,"propTypes",ty),a(tE,"defaultProps",tw),a(tE,"savedMap",null);//# sourceMappingURL=mapbox.js.map
// EXTERNAL MODULE: ./node_modules/mapbox-gl/dist/mapbox-gl.js
var t_=n(6158),tP=/*#__PURE__*/n.n(t_);function tM(t){return Array.isArray(t)||ArrayBuffer.isView(t)}function tj(t,e,n){return Math.max(e,Math.min(n,t))}function tS(t,e,n){return tM(t)?t.map(function(t,r){return tS(t,e[r],n)}):n*e+(1-n)*t}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/assert.js
//# sourceMappingURL=math-utils.js.map
function tT(t,e){if(!t)throw Error(e||"react-map-gl: assertion failed.")}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/map-state.js
//# sourceMappingURL=assert.js.map
function tk(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function tx(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?tk(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):tk(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var tD={minZoom:0,maxZoom:24,minPitch:0,maxPitch:85},tC={pitch:0,bearing:0,altitude:1.5},tR=function(){function t(e){var n=e.width,r=e.height,i=e.latitude,o=e.longitude,a=e.zoom,s=e.bearing,c=void 0===s?tC.bearing:s,u=e.pitch,l=void 0===u?tC.pitch:u,h=e.altitude,p=void 0===h?tC.altitude:h,f=e.maxZoom,d=void 0===f?tD.maxZoom:f,v=e.minZoom,g=void 0===v?tD.minZoom:v,m=e.maxPitch,b=void 0===m?tD.maxPitch:m,y=e.minPitch,w=void 0===y?tD.minPitch:y,O=e.transitionDuration,E=e.transitionEasing,_=e.transitionInterpolator,P=e.transitionInterruption,M=e.startPanLngLat,j=e.startZoomLngLat,S=e.startRotatePos,T=e.startBearing,k=e.startPitch,x=e.startZoom;tc(this,t),tT(Number.isFinite(n),"`width` must be supplied"),tT(Number.isFinite(r),"`height` must be supplied"),tT(Number.isFinite(o),"`longitude` must be supplied"),tT(Number.isFinite(i),"`latitude` must be supplied"),tT(Number.isFinite(a),"`zoom` must be supplied"),this._viewportProps=this._applyConstraints({width:n,height:r,latitude:i,longitude:o,zoom:a,bearing:c,pitch:l,altitude:p,maxZoom:d,minZoom:g,maxPitch:b,minPitch:w,transitionDuration:O,transitionEasing:E,transitionInterpolator:_,transitionInterruption:P}),this._state={startPanLngLat:M,startZoomLngLat:j,startRotatePos:S,startBearing:T,startPitch:k,startZoom:x}}return tl(t,[{key:"getViewportProps",value:function(){return this._viewportProps}},{key:"getState",value:function(){return this._state}},{key:"panStart",value:function(t){var e=t.pos;return this._getUpdatedMapState({startPanLngLat:this._unproject(e)})}},{key:"pan",value:function(t){var e=t.pos,n=t.startPos,r=this._state.startPanLngLat||this._unproject(n);if(!r)return this;var i=f(this._calculateNewLngLat({startPanLngLat:r,pos:e}),2),o=i[0],a=i[1];return this._getUpdatedMapState({longitude:o,latitude:a})}},{key:"panEnd",value:function(){return this._getUpdatedMapState({startPanLngLat:null})}},{key:"rotateStart",value:function(t){var e=t.pos;return this._getUpdatedMapState({startRotatePos:e,startBearing:this._viewportProps.bearing,startPitch:this._viewportProps.pitch})}},{key:"rotate",value:function(t){var e,n=t.pos,r=t.deltaAngleX,i=t.deltaAngleY,o=this._state,a=o.startRotatePos,s=o.startBearing,c=o.startPitch;return Number.isFinite(s)&&Number.isFinite(c)?(e=n?this._calculateNewPitchAndBearing(tx(tx({},this._getRotationParams(n,a)),{},{startBearing:s,startPitch:c})):{bearing:s+(void 0===r?0:r),pitch:c+(void 0===i?0:i)},this._getUpdatedMapState(e)):this}},{key:"rotateEnd",value:function(){return this._getUpdatedMapState({startBearing:null,startPitch:null})}},{key:"zoomStart",value:function(t){var e=t.pos;return this._getUpdatedMapState({startZoomLngLat:this._unproject(e),startZoom:this._viewportProps.zoom})}},{key:"zoom",value:function(t){var e=t.pos,n=t.startPos,r=t.scale;tT(r>0,"`scale` must be a positive number");var i=this._state,o=i.startZoom,a=i.startZoomLngLat;Number.isFinite(o)||(o=this._viewportProps.zoom,a=this._unproject(n)||this._unproject(e)),tT(a,"`startZoomLngLat` prop is required for zoom behavior to calculate where to position the map.");var s=this._calculateNewZoom({scale:r,startZoom:o||0}),c=f(new z(Object.assign({},this._viewportProps,{zoom:s})).getMapCenterByLngLatPosition({lngLat:a,pos:e}),2),u=c[0],l=c[1];return this._getUpdatedMapState({zoom:s,longitude:u,latitude:l})}},{key:"zoomEnd",value:function(){return this._getUpdatedMapState({startZoomLngLat:null,startZoom:null})}},{key:"_getUpdatedMapState",value:function(e){return new t(Object.assign({},this._viewportProps,this._state,e))}},{key:"_applyConstraints",value:function(t){var e=t.maxZoom,n=t.minZoom,r=t.zoom;t.zoom=tj(r,n,e);var i=t.maxPitch,o=t.minPitch,a=t.pitch;return t.pitch=tj(a,o,i),Object.assign(t,function({width:t,height:e,longitude:n,latitude:r,zoom:i,pitch:o=0,bearing:a=0}){(n<-180||n>180)&&(n=m(n+180,360)-180),(a<-180||a>180)&&(a=m(a+180,360)-180);const s=b(e/512);if(i<=s)i=s,r=0;else{const t=e/2/Math.pow(2,i),n=C([0,t])[1];if(r<n)r=n;else{const e=C([0,512-t])[1];r>e&&(r=e)}}return{width:t,height:e,longitude:n,latitude:r,zoom:i,pitch:o,bearing:a}}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/fly-to-viewport.js
(t)),t}},{key:"_unproject",value:function(t){var e=new z(this._viewportProps);return t&&e.unproject(t)}},{key:"_calculateNewLngLat",value:function(t){var e=t.startPanLngLat,n=t.pos;return new z(this._viewportProps).getMapCenterByLngLatPosition({lngLat:e,pos:n})}},{key:"_calculateNewZoom",value:function(t){var e=t.scale,n=t.startZoom,r=this._viewportProps,i=r.maxZoom;return tj(n+Math.log2(e),r.minZoom,i)}},{key:"_calculateNewPitchAndBearing",value:function(t){var e=t.deltaScaleX,n=t.deltaScaleY,r=t.startBearing,i=t.startPitch;n=tj(n,-1,1);var o=this._viewportProps,a=o.minPitch,s=o.maxPitch,c=i;return n>0?c=i+n*(s-i):n<0&&(c=i-n*(a-i)),{pitch:c,bearing:r+180*e}}},{key:"_getRotationParams",value:function(t,e){var n=t[0]-e[0],r=t[1]-e[1],i=t[1],o=e[1],a=this._viewportProps,s=a.width,c=a.height,u=0;return r>0?Math.abs(c-o)>5&&(u=r/(o-c)*1.2):r<0&&o>5&&(u=1-i/o),{deltaScaleX:n/s,deltaScaleY:u=Math.min(1,Math.max(-1,u))}}}]),t}();//# sourceMappingURL=map-constraints.js.map
function tA(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function tI(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?tA(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):tA(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var tL=(0,h.createContext)({viewport:null,map:null,container:null,onViewportChange:null,onViewStateChange:null,eventManager:null}),tN=tL.Provider;tL.Provider=function(t){var e=t.value,n=t.children,r=f((0,h.useState)(null),2),i=r[0],o=r[1],a=(0,h.useContext)(tL);return e=tI(tI({setMap:o},a),{},{map:a&&a.map||i},e),h.createElement(tN,{value:e},n)};//# sourceMappingURL=map-context.js.map
var tz="undefined"!=typeof window?h.useLayoutEffect:h.useEffect;//# sourceMappingURL=use-isomorphic-layout-effect.js.map
function tF(t,e){var n=e.longitude,r=e.latitude;return t&&t.queryTerrainElevation&&t.queryTerrainElevation([n,r])||0}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/static-map.js
//# sourceMappingURL=terrain.js.map
function tV(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function tZ(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?tV(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):tV(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var tB="A valid API access token is required to use Mapbox data";function tU(t){var e=t.map,n=t.props,r=t.width,i=t.height,o=tZ(tZ(tZ({},n),n.viewState),{},{width:r,height:i});return o.position=[0,0,tF(e,o)],new z(o)}var tq={position:"absolute",width:"100%",height:"100%",overflow:"hidden"},tW=Object.assign({},tE.propTypes,{width:p.oneOfType([p.number,p.string]),height:p.oneOfType([p.number,p.string]),onResize:p.func,disableTokenWarning:p.bool,visible:p.bool,className:p.string,style:p.object,visibilityConstraints:p.object}),tH=Object.assign({},tE.defaultProps,{disableTokenWarning:!1,visible:!0,onResize:function(){},className:"",style:null,visibilityConstraints:tD});function tX(){return h.createElement("div",{key:"warning",id:"no-token-warning",style:{position:"absolute",left:0,top:0}},h.createElement("h3",{key:"header"},tB),h.createElement("div",{key:"text"},"For information on setting up your basemap, read"),h.createElement("a",{key:"link",href:"https://visgl.github.io/react-map-gl/docs/get-started/mapbox-tokens"},"Note on Map Tokens"))}var tY=(0,h.forwardRef)(function(t,e){var n=f((0,h.useState)(!0),2),r=n[0],i=n[1],o=f((0,h.useState)({width:0,height:0}),2),a=o[0],s=o[1],c=(0,h.useRef)(null),u=(0,h.useRef)(null),l=(0,h.useRef)(null),p=(0,h.useRef)(null),d=(0,h.useContext)(tL);tz(function(){if(tY.supported()){var e=new tE(tZ(tZ(tZ({},t),a),{},{mapboxgl:tP(),container:u.current,onError:function(e){401===(e.error&&e.error.status||e.status)&&r&&(console.error(tB),i(!1)),t.onError(e)}}));c.current=e,d&&d.setMap&&d.setMap(e.getMap());var n=new ts(function(e){if(e[0].contentRect){var n=e[0].contentRect,r=n.width,i=n.height;s({width:r,height:i}),t.onResize({width:r,height:i})}});return n.observe(l.current),function(){e.finalize(),c.current=null,n.disconnect()}}},[]),tz(function(){c.current&&c.current.setProps(tZ(tZ({},t),a))});var v=c.current&&c.current.getMap();(0,h.useImperativeHandle)(e,function(){return{getMap:function(){return c.current&&c.current.getMap()},queryRenderedFeatures:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=c.current&&c.current.getMap();return n&&n.queryRenderedFeatures(t,e)}}},[]);var g=(0,h.useCallback)(function(t){var e=t.target;e===p.current&&e.scrollTo(0,0)},[]),m=v&&h.createElement(tN,{value:tZ(tZ({},d),{},{viewport:d.viewport||tU(tZ({map:v,props:t},a)),map:v,container:d.container||l.current})},h.createElement("div",{key:"map-overlays",className:"overlays",ref:p,style:tq,onScroll:g},t.children)),b=t.className,y=t.width,w=t.height,O=t.style,E=t.visibilityConstraints,_=Object.assign({position:"relative"},O,{width:y,height:w}),P=Object.assign({},tq,{visibility:t.visible&&function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:tD;for(var n in e){var r,i=n.slice(0,3),o=(r=n.slice(3))[0].toLowerCase()+r.slice(1);if("min"===i&&t[o]<e[n]||"max"===i&&t[o]>e[n])return!1}return!0}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/map-context.js
(t.viewState||t,E)?"inherit":"hidden"});return h.createElement("div",{key:"map-container",ref:l,style:_},h.createElement("div",{key:"map-mapbox",ref:u,style:P,className:b}),m,!r&&!t.disableTokenWarning&&h.createElement(tX,null))});function tK(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}tY.supported=function(){return tP()&&tP().supported()},tY.propTypes=tW,tY.defaultProps=tH;var tG=function(){function t(){tc(this,t),a(this,"propNames",[])}return tl(t,[{key:"arePropsEqual",value:function(t,e){var n,r=//# sourceMappingURL=static-map.js.map
function(t,e){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(i=function(t,e){if(t){if("string"==typeof t)return tK(t,void 0);var n=Object.prototype.toString.call(t).slice(8,-1);if("Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return tK(t,void 0)}}(t))){i&&(t=i);var n=0,r=function(){};return{s:r,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:r}}throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o,a=!0,s=!1;return{s:function(){i=t[Symbol.iterator]()},n:function(){var t=i.next();return a=t.done,t},e:function(t){s=!0,o=t},f:function(){try{a||null==i.return||i.return()}finally{if(s)throw o}}}}(this.propNames||[]);try{for(r.s();!(n=r.n()).done;){var i=n.value;if(!function t(e,n){if(e===n)return!0;if(tM(e)&&tM(n)){if(e.length!==n.length)return!1;for(var r=0;r<e.length;++r)if(!t(e[r],n[r]))return!1;return!0}return 1e-7>=Math.abs(e-n)}(t[i],e[i]))return!1}}catch(t){r.e(t)}finally{r.f()}return!0}},{key:"initializeProps",value:function(t,e){return{start:t,end:e}}},{key:"interpolateProps",value:function(t,e,n){tT(!1,"interpolateProps is not implemented")}},{key:"getDuration",value:function(t,e){return e.transitionDuration}}]),t}();// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
//# sourceMappingURL=transition-interpolator.js.map
function t$(t){if(void 0===t)throw ReferenceError("this hasn't been initialised - super() hasn't been called");return t}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function tJ(t,e){return(tJ=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js
function tQ(t,e){if("function"!=typeof e&&null!==e)throw TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&tJ(t,e)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function t0(t){return(t0="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js
function t1(t,e){if(e&&("object"===t0(e)||"function"==typeof e))return e;if(void 0!==e)throw TypeError("Derived constructors may only return object or undefined");return t$(t)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function t2(t){return(t2=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/transition/transition-utils.js
var t5={longitude:1,bearing:1};function t4(t){return Number.isFinite(t)||Array.isArray(t)}function t3(t,e,n){return t in t5&&Math.abs(n-e)>180&&(n=n<0?n+360:n-360),n}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/transition/viewport-fly-to-interpolator.js
//# sourceMappingURL=transition-utils.js.map
function t8(t,e){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(i=function(t,e){if(t){if("string"==typeof t)return t6(t,void 0);var n=Object.prototype.toString.call(t).slice(8,-1);if("Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return t6(t,void 0)}}(t))||e&&t&&"number"==typeof t.length){i&&(t=i);var n=0,r=function(){};return{s:r,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:r}}throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o,a=!0,s=!1;return{s:function(){i=t[Symbol.iterator]()},n:function(){var t=i.next();return a=t.done,t},e:function(t){s=!0,o=t},f:function(){try{a||null==i.return||i.return()}finally{if(s)throw o}}}}function t6(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}var t9=["longitude","latitude","zoom","bearing","pitch"],t7=["latitude","longitude","zoom","width","height"],et=["bearing","pitch"],ee={speed:1.2,curve:1.414};//# sourceMappingURL=viewport-fly-to-interpolator.js.map
function en(t,e){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(i=function(t,e){if(t){if("string"==typeof t)return er(t,void 0);var n=Object.prototype.toString.call(t).slice(8,-1);if("Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return er(t,void 0)}}(t))||e&&t&&"number"==typeof t.length){i&&(t=i);var n=0,r=function(){};return{s:r,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:r}}throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o,a=!0,s=!1;return{s:function(){i=t[Symbol.iterator]()},n:function(){var t=i.next();return a=t.done,t},e:function(t){s=!0,o=t},f:function(){try{a||null==i.return||i.return()}finally{if(s)throw o}}}}function er(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}!function(t){tQ(r,t);var e,n=(e=function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}(),function(){var t,n=t2(r);return t=e?Reflect.construct(n,arguments,t2(this).constructor):n.apply(this,arguments),t1(this,t)});function r(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return tc(this,r),a(t$(t=n.call(this)),"propNames",t9),t.props=Object.assign({},ee,e),t}tl(r,[{key:"initializeProps",value:function(t,e){var n,r={},i={},o=t8(t7);try{for(o.s();!(n=o.n()).done;){var a=n.value,s=t[a],c=e[a];tT(t4(s)&&t4(c),"".concat(a," must be supplied for transition")),r[a]=s,i[a]=t3(a,s,c)}}catch(t){o.e(t)}finally{o.f()}var u,l=t8(et);try{for(l.s();!(u=l.n()).done;){var h=u.value,p=t[h]||0,f=e[h]||0;r[h]=p,i[h]=t3(h,p,f)}}catch(t){l.e(t)}finally{l.f()}return{start:r,end:i}}},{key:"interpolateProps",value:function(t,e,n){var r,i=function(t,e,n,r={}){var i;const o={},{startZoom:a,startCenterXY:s,uDelta:c,w0:u,u1:l,S:h,rho:p,rho2:f,r0:d}=Z(t,e,r);if(l<.01){for(const r of F){const i=t[r],a=e[r];o[r]=n*a+(1-n)*i}return o}const v=n*h,g=Math.cosh(d)/Math.cosh(d+p*v),m=(Math.cosh(d)*Math.tanh(d+p*v)-Math.sinh(d))/f*u/l,y=a+b(1/g),w=((i=[])[0]=c[0]*m,i[1]=c[1]*m,i);_(w,w,s);const O=C(w);return o.longitude=O[0],o.latitude=O[1],o.zoom=y,o}(t,e,n,this.props),o=t8(et);try{for(o.s();!(r=o.n()).done;){var a=r.value;i[a]=tS(t[a],e[a],n)}}catch(t){o.e(t)}finally{o.f()}return i}},{key:"getDuration",value:function(t,e){var n=e.transitionDuration;return"auto"===n&&(n=function(t,e,n={}){let r;const{screenSpeed:i,speed:o,maxDuration:a}=n=Object.assign({},V,n),{S:s,rho:c}=Z(t,e,n),u=1e3*s;return r=Number.isFinite(i)?u/(i/c):u/o,Number.isFinite(a)&&r>a?0:r}(t,e,this.props)),n}}])}(tG);var ei=["longitude","latitude","zoom","bearing","pitch"],eo=function(t){tQ(r,t);var e,n=(e=function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}(),function(){var t,n=t2(r);return t=e?Reflect.construct(n,arguments,t2(this).constructor):n.apply(this,arguments),t1(this,t)});function r(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return tc(this,r),t=n.call(this),Array.isArray(e)&&(e={transitionProps:e}),t.propNames=e.transitionProps||ei,e.around&&(t.around=e.around),t}return tl(r,[{key:"initializeProps",value:function(t,e){var n={},r={};if(this.around){n.around=this.around;var i=new z(t).unproject(this.around);Object.assign(r,e,{around:new z(e).project(i),aroundLngLat:i})}var o,a=en(this.propNames);try{for(a.s();!(o=a.n()).done;){var s=o.value,c=t[s],u=e[s];tT(t4(c)&&t4(u),"".concat(s," must be supplied for transition")),n[s]=c,r[s]=t3(s,c,u)}}catch(t){a.e(t)}finally{a.f()}return{start:n,end:r}}},{key:"interpolateProps",value:function(t,e,n){var r,i={},o=en(this.propNames);try{for(o.s();!(r=o.n()).done;){var a=r.value;i[a]=tS(t[a],e[a],n)}}catch(t){o.e(t)}finally{o.f()}if(e.around){var s=f(new z(Object.assign({},e,i)).getMapCenterByLngLatPosition({lngLat:e.aroundLngLat,pos:tS(t.around,e.around,n)}),2),c=s[0],u=s[1];i.longitude=c,i.latitude=u}return i}}]),r}(tG),ea=function(){},es={BREAK:1,SNAP_TO_END:2,IGNORE:3,UPDATE:4},ec={transitionDuration:0,transitionEasing:function(t){return t},transitionInterpolator:new eo,transitionInterruption:es.BREAK,onTransitionStart:ea,onTransitionInterrupt:ea,onTransitionEnd:ea},eu=function(){function t(){var e=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};tc(this,t),a(this,"_animationFrame",null),a(this,"_onTransitionFrame",function(){e._animationFrame=requestAnimationFrame(e._onTransitionFrame),e._updateViewport()}),this.props=null,this.onViewportChange=n.onViewportChange||ea,this.onStateChange=n.onStateChange||ea,this.time=n.getTime||Date.now}return tl(t,[{key:"getViewportInTransition",value:function(){return this._animationFrame?this.state.propsInTransition:null}},{key:"processViewportChange",value:function(t){var e=this.props;if(this.props=t,!e||this._shouldIgnoreViewportChange(e,t))return!1;if(this._isTransitionEnabled(t)){var n=Object.assign({},e),r=Object.assign({},t);if(this._isTransitionInProgress()&&(e.onTransitionInterrupt(),this.state.interruption===es.SNAP_TO_END?Object.assign(n,this.state.endProps):Object.assign(n,this.state.propsInTransition),this.state.interruption===es.UPDATE)){var i,o,a=this.time(),s=(a-this.state.startTime)/this.state.duration;r.transitionDuration=this.state.duration-(a-this.state.startTime),r.transitionEasing=(o=(i=this.state.easing)(s),function(t){return 1/(1-o)*(i(t*(1-s)+s)-o)}),r.transitionInterpolator=n.transitionInterpolator}return r.onTransitionStart(),this._triggerTransition(n,r),!0}return this._isTransitionInProgress()&&(e.onTransitionInterrupt(),this._endTransition()),!1}},{key:"_isTransitionInProgress",value:function(){return!!this._animationFrame}},{key:"_isTransitionEnabled",value:function(t){var e=t.transitionDuration,n=t.transitionInterpolator;return(e>0||"auto"===e)&&!!n}},{key:"_isUpdateDueToCurrentTransition",value:function(t){return!!this.state.propsInTransition&&this.state.interpolator.arePropsEqual(t,this.state.propsInTransition)}},{key:"_shouldIgnoreViewportChange",value:function(t,e){return!t||(this._isTransitionInProgress()?this.state.interruption===es.IGNORE||this._isUpdateDueToCurrentTransition(e):!this._isTransitionEnabled(e)||e.transitionInterpolator.arePropsEqual(t,e))}},{key:"_triggerTransition",value:function(t,e){tT(this._isTransitionEnabled(e)),this._animationFrame&&cancelAnimationFrame(this._animationFrame);var n=e.transitionInterpolator,r=n.getDuration?n.getDuration(t,e):e.transitionDuration;if(0!==r){var i=e.transitionInterpolator.initializeProps(t,e),o={inTransition:!0,isZooming:t.zoom!==e.zoom,isPanning:t.longitude!==e.longitude||t.latitude!==e.latitude,isRotating:t.bearing!==e.bearing||t.pitch!==e.pitch};this.state={duration:r,easing:e.transitionEasing,interpolator:e.transitionInterpolator,interruption:e.transitionInterruption,startTime:this.time(),startProps:i.start,endProps:i.end,animation:null,propsInTransition:{}},this._onTransitionFrame(),this.onStateChange(o)}}},{key:"_endTransition",value:function(){this._animationFrame&&(cancelAnimationFrame(this._animationFrame),this._animationFrame=null),this.onStateChange({inTransition:!1,isZooming:!1,isPanning:!1,isRotating:!1})}},{key:"_updateViewport",value:function(){var t=this.time(),e=this.state,n=e.startTime,r=e.duration,i=e.easing,o=e.interpolator,a=e.startProps,s=e.endProps,c=!1,u=(t-n)/r;u>=1&&(u=1,c=!0),u=i(u);var l=o.interpolateProps(a,s,u),h=new tR(Object.assign({},this.props,l));this.state.propsInTransition=h.getViewportProps(),this.onViewportChange(this.state.propsInTransition,this.props),c&&(this._endTransition(),this.props.onTransitionEnd())}}]),t}();a(eu,"defaultProps",ec);//# sourceMappingURL=transition-manager.js.map
// EXTERNAL MODULE: ./node_modules/hammerjs/hammer.js
var el=n(840),eh=/*#__PURE__*/n.n(el);const ep={mousedown:1,mousemove:2,mouseup:4};!//# sourceMappingURL=hammer-overrides.js.map
function(t){const e=t.prototype.handler;t.prototype.handler=function(t){const n=this.store;t.button>0&&"pointerdown"===t.type&&!function(t,e){for(let n=0;n<t.length;n++)if(e(t[n]))return!0;return!1}(n,e=>e.pointerId===t.pointerId)&&n.push(t),e.call(this,t)}}(eh().PointerEventInput),eh().MouseInput.prototype.handler=function(t){let e=ep[t.type];1&e&&t.button>=0&&(this.pressed=!0),2&e&&0===t.which&&(e=4),this.pressed&&(4&e&&(this.pressed=!1),this.callback(this.manager,e,{pointers:[t],changedPointers:[t],pointerType:"mouse",srcEvent:t}))};const ef=eh().Manager;/* harmony default export */var ed=eh();// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/constants.js
//# sourceMappingURL=hammer.browser.js.map
const ev=ed?[[ed.Pan,{event:"tripan",pointers:3,threshold:0,enable:!1}],[ed.Rotate,{enable:!1}],[ed.Pinch,{enable:!1}],[ed.Swipe,{enable:!1}],[ed.Pan,{threshold:0,enable:!1}],[ed.Press,{enable:!1}],[ed.Tap,{event:"doubletap",taps:2,enable:!1}],[ed.Tap,{event:"anytap",enable:!1}],[ed.Tap,{enable:!1}]]:null,eg={tripan:["rotate","pinch","pan"],rotate:["pinch"],pinch:["pan"],pan:["press","doubletap","anytap","tap"],doubletap:["anytap"],anytap:["tap"]},em={doubletap:["tap"]},eb={pointerdown:"pointerdown",pointermove:"pointermove",pointerup:"pointerup",touchstart:"pointerdown",touchmove:"pointermove",touchend:"pointerup",mousedown:"pointerdown",mousemove:"pointermove",mouseup:"pointerup"},ey={KEY_EVENTS:["keydown","keyup"],MOUSE_EVENTS:["mousedown","mousemove","mouseup","mouseover","mouseout","mouseleave"],WHEEL_EVENTS:["wheel","mousewheel"]},ew={tap:"tap",anytap:"anytap",doubletap:"doubletap",press:"press",pinch:"pinch",pinchin:"pinch",pinchout:"pinch",pinchstart:"pinch",pinchmove:"pinch",pinchend:"pinch",pinchcancel:"pinch",rotate:"rotate",rotatestart:"rotate",rotatemove:"rotate",rotateend:"rotate",rotatecancel:"rotate",tripan:"tripan",tripanstart:"tripan",tripanmove:"tripan",tripanup:"tripan",tripandown:"tripan",tripanleft:"tripan",tripanright:"tripan",tripanend:"tripan",tripancancel:"tripan",pan:"pan",panstart:"pan",panmove:"pan",panup:"pan",pandown:"pan",panleft:"pan",panright:"pan",panend:"pan",pancancel:"pan",swipe:"swipe",swipeleft:"swipe",swiperight:"swipe",swipeup:"swipe",swipedown:"swipe"},eO={click:"tap",anyclick:"anytap",dblclick:"doubletap",mousedown:"pointerdown",mousemove:"pointermove",mouseup:"pointerup",mouseover:"pointerover",mouseout:"pointerout",mouseleave:"pointerleave"},eE="undefined"!=typeof navigator&&navigator.userAgent?navigator.userAgent.toLowerCase():"",e_="undefined"!=typeof window?window:n.g;void 0!==n.g?n.g:window;let eP=!1;try{const t={get passive(){return eP=!0,!0}};e_.addEventListener("test",t,t),e_.removeEventListener("test",t,t)}catch(t){}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/inputs/wheel-input.js
//# sourceMappingURL=globals.js.map
const eM=-1!==eE.indexOf("firefox"),{WHEEL_EVENTS:ej}=ey,eS="wheel";class eT{constructor(t,e,n={}){this.element=t,this.callback=e,this.options=Object.assign({enable:!0},n),this.events=ej.concat(n.events||[]),this.handleEvent=this.handleEvent.bind(this),this.events.forEach(e=>t.addEventListener(e,this.handleEvent,!!eP&&{passive:!1}))}destroy(){this.events.forEach(t=>this.element.removeEventListener(t,this.handleEvent))}enableEventType(t,e){t===eS&&(this.options.enable=e)}handleEvent(t){if(!this.options.enable)return;let e=t.deltaY;e_.WheelEvent&&(eM&&t.deltaMode===e_.WheelEvent.DOM_DELTA_PIXEL&&(e/=e_.devicePixelRatio),t.deltaMode===e_.WheelEvent.DOM_DELTA_LINE&&(e*=40));const n={x:t.clientX,y:t.clientY};0!==e&&e%4.000244140625==0&&(e=Math.floor(e/4.000244140625)),t.shiftKey&&e&&(e*=.25),this._onWheel(t,-e,n)}_onWheel(t,e,n){this.callback({type:eS,center:n,delta:e,srcEvent:t,pointerType:"mouse",target:t.target})}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/inputs/move-input.js
//# sourceMappingURL=wheel-input.js.map
const{MOUSE_EVENTS:ek}=ey,ex="pointermove",eD="pointerover",eC="pointerout",eR="pointerleave";class eA{constructor(t,e,n={}){this.element=t,this.callback=e,this.pressed=!1,this.options=Object.assign({enable:!0},n),this.enableMoveEvent=this.options.enable,this.enableLeaveEvent=this.options.enable,this.enableOutEvent=this.options.enable,this.enableOverEvent=this.options.enable,this.events=ek.concat(n.events||[]),this.handleEvent=this.handleEvent.bind(this),this.events.forEach(e=>t.addEventListener(e,this.handleEvent))}destroy(){this.events.forEach(t=>this.element.removeEventListener(t,this.handleEvent))}enableEventType(t,e){t===ex&&(this.enableMoveEvent=e),t===eD&&(this.enableOverEvent=e),t===eC&&(this.enableOutEvent=e),t===eR&&(this.enableLeaveEvent=e)}handleEvent(t){this.handleOverEvent(t),this.handleOutEvent(t),this.handleLeaveEvent(t),this.handleMoveEvent(t)}handleOverEvent(t){this.enableOverEvent&&"mouseover"===t.type&&this.callback({type:eD,srcEvent:t,pointerType:"mouse",target:t.target})}handleOutEvent(t){this.enableOutEvent&&"mouseout"===t.type&&this.callback({type:eC,srcEvent:t,pointerType:"mouse",target:t.target})}handleLeaveEvent(t){this.enableLeaveEvent&&"mouseleave"===t.type&&this.callback({type:eR,srcEvent:t,pointerType:"mouse",target:t.target})}handleMoveEvent(t){if(this.enableMoveEvent)switch(t.type){case"mousedown":t.button>=0&&(this.pressed=!0);break;case"mousemove":0===t.which&&(this.pressed=!1),this.pressed||this.callback({type:ex,srcEvent:t,pointerType:"mouse",target:t.target});break;case"mouseup":this.pressed=!1}}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/inputs/key-input.js
//# sourceMappingURL=move-input.js.map
const{KEY_EVENTS:eI}=ey,eL="keydown",eN="keyup";class ez{constructor(t,e,n={}){this.element=t,this.callback=e,this.options=Object.assign({enable:!0},n),this.enableDownEvent=this.options.enable,this.enableUpEvent=this.options.enable,this.events=eI.concat(n.events||[]),this.handleEvent=this.handleEvent.bind(this),t.tabIndex=n.tabIndex||0,t.style.outline="none",this.events.forEach(e=>t.addEventListener(e,this.handleEvent))}destroy(){this.events.forEach(t=>this.element.removeEventListener(t,this.handleEvent))}enableEventType(t,e){t===eL&&(this.enableDownEvent=e),t===eN&&(this.enableUpEvent=e)}handleEvent(t){const e=t.target||t.srcElement;("INPUT"!==e.tagName||"text"!==e.type)&&"TEXTAREA"!==e.tagName&&(this.enableDownEvent&&"keydown"===t.type&&this.callback({type:eL,srcEvent:t,key:t.key,target:t.target}),this.enableUpEvent&&"keyup"===t.type&&this.callback({type:eN,srcEvent:t,key:t.key,target:t.target}))}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/inputs/contextmenu-input.js
//# sourceMappingURL=key-input.js.map
const eF="contextmenu";class eV{constructor(t,e,n={}){this.element=t,this.callback=e,this.options=Object.assign({enable:!0},n),this.handleEvent=this.handleEvent.bind(this),t.addEventListener("contextmenu",this.handleEvent)}destroy(){this.element.removeEventListener("contextmenu",this.handleEvent)}enableEventType(t,e){t===eF&&(this.options.enable=e)}handleEvent(t){this.options.enable&&this.callback({type:eF,center:{x:t.clientX,y:t.clientY},srcEvent:t,pointerType:"mouse",target:t.target})}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/utils/event-utils.js
const eZ={pointerdown:1,pointermove:2,pointerup:4,mousedown:1,mousemove:2,mouseup:4},eB={srcElement:"root",priority:0};class eU{constructor(t){this.eventManager=t,this.handlers=[],this.handlersByElement=new Map,this.handleEvent=this.handleEvent.bind(this),this._active=!1}isEmpty(){return!this._active}add(t,e,n,r=!1,i=!1){const{handlers:o,handlersByElement:a}=this;n&&("object"!=typeof n||n.addEventListener)&&(n={srcElement:n}),n=n?Object.assign({},eB,n):eB;let s=a.get(n.srcElement);s||(s=[],a.set(n.srcElement,s));const c={type:t,handler:e,srcElement:n.srcElement,priority:n.priority};r&&(c.once=!0),i&&(c.passive=!0),o.push(c),this._active=this._active||!c.passive;let u=s.length-1;for(;u>=0&&!(s[u].priority>=c.priority);)u--;s.splice(u+1,0,c)}remove(t,e){const{handlers:n,handlersByElement:r}=this;for(let i=n.length-1;i>=0;i--){const o=n[i];if(o.type===t&&o.handler===e){n.splice(i,1);const t=r.get(o.srcElement);t.splice(t.indexOf(o),1),0===t.length&&r.delete(o.srcElement)}}this._active=n.some(t=>!t.passive)}handleEvent(t){if(this.isEmpty())return;const e=this._normalizeEvent(t);let n=t.srcEvent.target;for(;n&&n!==e.rootElement;){if(this._emit(e,n),e.handled)return;n=n.parentNode}this._emit(e,"root")}_emit(t,e){const n=this.handlersByElement.get(e);if(n){let e=!1;const r=()=>{t.handled=!0},i=()=>{t.handled=!0,e=!0},o=[];for(let a=0;a<n.length;a++){const{type:s,handler:c,once:u}=n[a];if(c(Object.assign({},t,{type:s,stopPropagation:r,stopImmediatePropagation:i})),u&&o.push(n[a]),e)break}for(let t=0;t<o.length;t++){const{type:e,handler:n}=o[t];this.remove(e,n)}}}_normalizeEvent(t){const e=this.eventManager.element;return Object.assign({},t,function(t){const e=eZ[t.srcEvent.type];if(!e)return null;const{buttons:n,button:r,which:i}=t.srcEvent;let o=!1,a=!1,s=!1;return 4!==e&&(2!==e||Number.isFinite(n))?2===e?(o=!!(1&n),a=!!(4&n),s=!!(2&n)):1===e&&(o=0===r,a=1===r,s=2===r):(o=1===i,a=2===i,s=3===i),{leftButton:o,middleButton:a,rightButton:s}}(t),function(t,e){const{srcEvent:n}=t;if(!t.center&&!Number.isFinite(n.clientX))return null;const r=t.center||{x:n.clientX,y:n.clientY},i=e.getBoundingClientRect(),o=i.width/e.offsetWidth||1,a=i.height/e.offsetHeight||1,s={x:(r.x-i.left-e.clientLeft)/o,y:(r.y-i.top-e.clientTop)/a};return{center:r,offsetCenter:s}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/utils/event-registrar.js
(t,e),{handled:!1,rootElement:e})}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/event-manager.js
//# sourceMappingURL=event-registrar.js.map
const eq={events:null,recognizers:null,recognizerOptions:{},Manager:ef,touchAction:"none",tabIndex:0};class eW{constructor(t=null,e={}){this.options=Object.assign({},eq,e),this.events=new Map,this._onBasicInput=this._onBasicInput.bind(this),this._onOtherEvent=this._onOtherEvent.bind(this),this.setElement(t);const{events:n}=e;n&&this.on(n)}setElement(t){if(this.element&&this.destroy(),this.element=t,!t)return;const{options:e}=this,n=e.Manager;for(const r in this.manager=new n(t,{touchAction:e.touchAction,recognizers:e.recognizers||ev}).on("hammer.input",this._onBasicInput),e.recognizers||Object.keys(eg).forEach(t=>{const e=this.manager.get(t);e&&eg[t].forEach(t=>{e.recognizeWith(t)})}),e.recognizerOptions){const t=this.manager.get(r);if(t){const n=e.recognizerOptions[r];delete n.enable,t.set(n)}}for(const[n,r]of(this.wheelInput=new eT(t,this._onOtherEvent,{enable:!1}),this.moveInput=new eA(t,this._onOtherEvent,{enable:!1}),this.keyInput=new ez(t,this._onOtherEvent,{enable:!1,tabIndex:e.tabIndex}),this.contextmenuInput=new eV(t,this._onOtherEvent,{enable:!1}),this.events))r.isEmpty()||(this._toggleRecognizer(r.recognizerName,!0),this.manager.on(n,r.handleEvent))}destroy(){this.element&&(this.wheelInput.destroy(),this.moveInput.destroy(),this.keyInput.destroy(),this.contextmenuInput.destroy(),this.manager.destroy(),this.wheelInput=null,this.moveInput=null,this.keyInput=null,this.contextmenuInput=null,this.manager=null,this.element=null)}on(t,e,n){this._addEventHandler(t,e,n,!1)}once(t,e,n){this._addEventHandler(t,e,n,!0)}watch(t,e,n){this._addEventHandler(t,e,n,!1,!0)}off(t,e){this._removeEventHandler(t,e)}_toggleRecognizer(t,e){const{manager:n}=this;if(!n)return;const r=n.get(t);if(r&&r.options.enable!==e){r.set({enable:e});const i=em[t];i&&!this.options.recognizers&&i.forEach(i=>{const o=n.get(i);e?(o.requireFailure(t),r.dropRequireFailure(i)):o.dropRequireFailure(t)})}this.wheelInput.enableEventType(t,e),this.moveInput.enableEventType(t,e),this.keyInput.enableEventType(t,e),this.contextmenuInput.enableEventType(t,e)}_addEventHandler(t,e,n,r,i){if("string"!=typeof t){for(const o in n=e,t)this._addEventHandler(o,t[o],n,r,i);return}const{manager:o,events:a}=this,s=eO[t]||t;let c=a.get(s);!c&&(c=new eU(this),a.set(s,c),c.recognizerName=ew[s]||s,o&&o.on(s,c.handleEvent)),c.add(t,e,n,r,i),c.isEmpty()||this._toggleRecognizer(c.recognizerName,!0)}_removeEventHandler(t,e){if("string"!=typeof t){for(const e in t)this._removeEventHandler(e,t[e]);return}const{events:n}=this,r=eO[t]||t,i=n.get(r);if(i&&(i.remove(t,e),i.isEmpty())){const{recognizerName:t}=i;let e=!1;for(const r of n.values())if(r.recognizerName===t&&!r.isEmpty()){e=!0;break}e||this._toggleRecognizer(t,!1)}}_onBasicInput(t){const{srcEvent:e}=t,n=eb[e.type];n&&this.manager.emit(n,t)}_onOtherEvent(t){this.manager.emit(t.type,t)}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/index.js // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/map-controller.js
//# sourceMappingURL=event-manager.js.map
//# sourceMappingURL=index.js.map
function eH(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function eX(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?eH(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):eH(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var eY={transitionDuration:0},eK={transitionDuration:300,transitionEasing:function(t){return t},transitionInterpolator:new eo,transitionInterruption:es.BREAK},eG=function(t){return 1-(1-t)*(1-t)},e$=["wheel"],eJ=["panstart","panmove","panend"],eQ=["pinchstart","pinchmove","pinchend"],e0=["tripanstart","tripanmove","tripanend"],e1=["doubletap"],e2=["keydown"],e5=function(){function t(){var e=this;tc(this,t),a(this,"events",[]),a(this,"scrollZoom",!0),a(this,"dragPan",!0),a(this,"dragRotate",!0),a(this,"doubleClickZoom",!0),a(this,"touchZoom",!0),a(this,"touchRotate",!1),a(this,"keyboard",!0),a(this,"_interactionState",{isDragging:!1}),a(this,"_events",{}),a(this,"_setInteractionState",function(t){Object.assign(e._interactionState,t),e.onStateChange&&e.onStateChange(e._interactionState)}),a(this,"_onTransition",function(t,n){e.onViewportChange(t,e._interactionState,n)}),this.handleEvent=this.handleEvent.bind(this),this._transitionManager=new eu({onViewportChange:this._onTransition,onStateChange:this._setInteractionState})}return tl(t,[{key:"handleEvent",value:function(t){this.mapState=this.getMapState();var e=this._eventStartBlocked;switch(t.type){case"panstart":return!e&&this._onPanStart(t);case"panmove":return this._onPan(t);case"panend":return this._onPanEnd(t);case"pinchstart":return!e&&this._onPinchStart(t);case"pinchmove":return this._onPinch(t);case"pinchend":return this._onPinchEnd(t);case"tripanstart":return!e&&this._onTriplePanStart(t);case"tripanmove":return this._onTriplePan(t);case"tripanend":return this._onTriplePanEnd(t);case"doubletap":return this._onDoubleTap(t);case"wheel":return this._onWheel(t);case"keydown":return this._onKeyDown(t);default:return!1}}},{key:"getCenter",value:function(t){var e=t.offsetCenter;return[e.x,e.y]}},{key:"isFunctionKeyPressed",value:function(t){var e=t.srcEvent;return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}},{key:"blockEvents",value:function(t){var e=this,n=setTimeout(function(){e._eventStartBlocked===n&&(e._eventStartBlocked=null)},t);this._eventStartBlocked=n}},{key:"updateViewport",value:function(t,e,n){var r=this.mapState instanceof tR?this.mapState.getViewportProps():this.mapState,i=eX(eX({},t.getViewportProps()),e),o=Object.keys(i).some(function(t){return r[t]!==i[t]});this._state=t.getState(),this._setInteractionState(n),o&&this.onViewportChange(i,this._interactionState,r)}},{key:"getMapState",value:function(t){return new tR(eX(eX(eX({},this.mapStateProps),this._state),t))}},{key:"isDragging",value:function(){return this._interactionState.isDragging}},{key:"setOptions",value:function(t){var e=t.onViewportChange,n=t.onStateChange,r=t.eventManager,i=void 0===r?this.eventManager:r,o=t.isInteractive,a=void 0===o||o,s=t.scrollZoom,c=void 0===s?this.scrollZoom:s,u=t.dragPan,l=void 0===u?this.dragPan:u,h=t.dragRotate,p=void 0===h?this.dragRotate:h,f=t.doubleClickZoom,d=void 0===f?this.doubleClickZoom:f,v=t.touchZoom,g=void 0===v?this.touchZoom:v,m=t.touchRotate,b=void 0===m?this.touchRotate:m,y=t.keyboard,w=void 0===y?this.keyboard:y;this.onViewportChange=e,this.onStateChange=n;var O=this.mapStateProps||{},E=O.height!==t.height||O.width!==t.width;this.mapStateProps=t,E&&(this.mapState=O,this.updateViewport(new tR(t))),this._transitionManager.processViewportChange(t),this.eventManager!==i&&(this.eventManager=i,this._events={},this.toggleEvents(this.events,!0)),this.toggleEvents(e$,a&&!!c),this.toggleEvents(eJ,a&&!!(l||p)),this.toggleEvents(eQ,a&&!!(g||b)),this.toggleEvents(e0,a&&!!b),this.toggleEvents(e1,a&&!!d),this.toggleEvents(e2,a&&!!w),this.scrollZoom=c,this.dragPan=l,this.dragRotate=p,this.doubleClickZoom=d,this.touchZoom=g,this.touchRotate=b,this.keyboard=w}},{key:"toggleEvents",value:function(t,e){var n=this;this.eventManager&&t.forEach(function(t){n._events[t]!==e&&(n._events[t]=e,e?n.eventManager.on(t,n.handleEvent):n.eventManager.off(t,n.handleEvent))})}},{key:"_onPanStart",value:function(t){var e=this.getCenter(t);this._panRotate=this.isFunctionKeyPressed(t)||t.rightButton;var n=this._panRotate?this.mapState.rotateStart({pos:e}):this.mapState.panStart({pos:e});return this.updateViewport(n,eY,{isDragging:!0}),!0}},{key:"_onPan",value:function(t){return!!this.isDragging()&&(this._panRotate?this._onPanRotate(t):this._onPanMove(t))}},{key:"_onPanEnd",value:function(t){return!!this.isDragging()&&(this._panRotate?this._onPanRotateEnd(t):this._onPanMoveEnd(t))}},{key:"_onPanMove",value:function(t){if(!this.dragPan)return!1;var e=this.getCenter(t),n=this.mapState.pan({pos:e});return this.updateViewport(n,eY,{isPanning:!0}),!0}},{key:"_onPanMoveEnd",value:function(t){if(this.dragPan){var e=this.dragPan.inertia,n=void 0===e?300:e;if(n&&t.velocity){var r=this.getCenter(t),i=[r[0]+t.velocityX*n/2,r[1]+t.velocityY*n/2],o=this.mapState.pan({pos:i}).panEnd();return this.updateViewport(o,eX(eX({},eK),{},{transitionDuration:n,transitionEasing:eG}),{isDragging:!1,isPanning:!0}),!0}}var a=this.mapState.panEnd();return this.updateViewport(a,null,{isDragging:!1,isPanning:!1}),!0}},{key:"_onPanRotate",value:function(t){if(!this.dragRotate)return!1;var e=this.getCenter(t),n=this.mapState.rotate({pos:e});return this.updateViewport(n,eY,{isRotating:!0}),!0}},{key:"_onPanRotateEnd",value:function(t){if(this.dragRotate){var e=this.dragRotate.inertia,n=void 0===e?300:e;if(n&&t.velocity){var r=this.getCenter(t),i=[r[0]+t.velocityX*n/2,r[1]+t.velocityY*n/2],o=this.mapState.rotate({pos:i}).rotateEnd();return this.updateViewport(o,eX(eX({},eK),{},{transitionDuration:n,transitionEasing:eG}),{isDragging:!1,isRotating:!0}),!0}}var a=this.mapState.panEnd();return this.updateViewport(a,null,{isDragging:!1,isRotating:!1}),!0}},{key:"_onWheel",value:function(t){if(!this.scrollZoom)return!1;var e=this.scrollZoom,n=e.speed,r=e.smooth;t.preventDefault();var i=this.getCenter(t),o=t.delta,a=2/(1+Math.exp(-Math.abs(o*(void 0===n?.01:n))));o<0&&0!==a&&(a=1/a);var s=this.mapState.zoom({pos:i,scale:a});return s.getViewportProps().zoom!==this.mapStateProps.zoom&&(this.updateViewport(s,eX(eX({},eK),{},{transitionInterpolator:new eo({around:i}),transitionDuration:void 0!==r&&r?250:1}),{isPanning:!0,isZooming:!0}),!0)}},{key:"_onPinchStart",value:function(t){var e=this.getCenter(t),n=this.mapState.zoomStart({pos:e}).rotateStart({pos:e});return this._startPinchRotation=t.rotation,this._lastPinchEvent=t,this.updateViewport(n,eY,{isDragging:!0}),!0}},{key:"_onPinch",value:function(t){if(!this.isDragging()||!this.touchZoom&&!this.touchRotate)return!1;var e=this.mapState;if(this.touchZoom){var n=t.scale,r=this.getCenter(t);e=e.zoom({pos:r,scale:n})}if(this.touchRotate){var i=t.rotation;e=e.rotate({deltaAngleX:this._startPinchRotation-i})}return this.updateViewport(e,eY,{isDragging:!0,isPanning:!!this.touchZoom,isZooming:!!this.touchZoom,isRotating:!!this.touchRotate}),this._lastPinchEvent=t,!0}},{key:"_onPinchEnd",value:function(t){if(!this.isDragging())return!1;if(this.touchZoom){var e=this.touchZoom.inertia,n=void 0===e?300:e,r=this._lastPinchEvent;if(n&&r&&t.scale!==r.scale){var i=this.getCenter(t),o=this.mapState.rotateEnd(),a=Math.log2(t.scale),s=(a-Math.log2(r.scale))/(t.deltaTime-r.deltaTime),c=Math.pow(2,a+s*n/2);return o=o.zoom({pos:i,scale:c}).zoomEnd(),this.updateViewport(o,eX(eX({},eK),{},{transitionInterpolator:new eo({around:i}),transitionDuration:n,transitionEasing:eG}),{isDragging:!1,isPanning:!!this.touchZoom,isZooming:!!this.touchZoom,isRotating:!1}),this.blockEvents(n),!0}}var u=this.mapState.zoomEnd().rotateEnd();return this._state.startPinchRotation=0,this.updateViewport(u,null,{isDragging:!1,isPanning:!1,isZooming:!1,isRotating:!1}),this._startPinchRotation=null,this._lastPinchEvent=null,!0}},{key:"_onTriplePanStart",value:function(t){var e=this.getCenter(t),n=this.mapState.rotateStart({pos:e});return this.updateViewport(n,eY,{isDragging:!0}),!0}},{key:"_onTriplePan",value:function(t){if(!this.isDragging()||!this.touchRotate)return!1;var e=this.getCenter(t);e[0]-=t.deltaX;var n=this.mapState.rotate({pos:e});return this.updateViewport(n,eY,{isRotating:!0}),!0}},{key:"_onTriplePanEnd",value:function(t){if(!this.isDragging())return!1;if(this.touchRotate){var e=this.touchRotate.inertia,n=void 0===e?300:e;if(n&&t.velocityY){var r=this.getCenter(t),i=[r[0],r[1]+=t.velocityY*n/2],o=this.mapState.rotate({pos:i});return this.updateViewport(o,eX(eX({},eK),{},{transitionDuration:n,transitionEasing:eG}),{isDragging:!1,isRotating:!0}),this.blockEvents(n),!1}}var a=this.mapState.rotateEnd();return this.updateViewport(a,null,{isDragging:!1,isRotating:!1}),!0}},{key:"_onDoubleTap",value:function(t){if(!this.doubleClickZoom)return!1;var e=this.getCenter(t),n=this.isFunctionKeyPressed(t),r=this.mapState.zoom({pos:e,scale:n?.5:2});return this.updateViewport(r,Object.assign({},eK,{transitionInterpolator:new eo({around:e})}),{isZooming:!0}),!0}},{key:"_onKeyDown",value:function(t){if(!this.keyboard)return!1;var e,n=this.isFunctionKeyPressed(t),r=this.keyboard,i=r.zoomSpeed,o=void 0===i?2:i,a=r.moveSpeed,s=void 0===a?100:a,c=r.rotateSpeedX,u=void 0===c?15:c,l=r.rotateSpeedY,h=void 0===l?10:l,p=this.mapStateProps;switch(t.srcEvent.keyCode){case 189:e=n?this.getMapState({zoom:p.zoom-Math.log2(o)-1}):this.getMapState({zoom:p.zoom-Math.log2(o)});break;case 187:e=n?this.getMapState({zoom:p.zoom+Math.log2(o)+1}):this.getMapState({zoom:p.zoom+Math.log2(o)});break;case 37:e=n?this.getMapState({bearing:p.bearing-u}):this.mapState.pan({pos:[s,0],startPos:[0,0]});break;case 39:e=n?this.getMapState({bearing:p.bearing+u}):this.mapState.pan({pos:[-s,0],startPos:[0,0]});break;case 38:e=n?this.getMapState({pitch:p.pitch+h}):this.mapState.pan({pos:[0,s],startPos:[0,0]});break;case 40:e=n?this.getMapState({pitch:p.pitch-h}):this.mapState.pan({pos:[0,-s],startPos:[0,0]});break;default:return!1}return this.updateViewport(e,eK)}}]),t}();//# sourceMappingURL=map-controller.js.map
function e4(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function e3(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?e4(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):e4(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var e8=Object.assign({},tY.propTypes,{maxZoom:p.number,minZoom:p.number,maxPitch:p.number,minPitch:p.number,onViewStateChange:p.func,onViewportChange:p.func,onInteractionStateChange:p.func,transitionDuration:p.oneOfType([p.number,p.string]),transitionInterpolator:p.object,transitionInterruption:p.number,transitionEasing:p.func,onTransitionStart:p.func,onTransitionInterrupt:p.func,onTransitionEnd:p.func,scrollZoom:p.oneOfType([p.bool,p.object]),dragPan:p.oneOfType([p.bool,p.object]),dragRotate:p.oneOfType([p.bool,p.object]),doubleClickZoom:p.bool,touchZoom:p.oneOfType([p.bool,p.object]),touchRotate:p.oneOfType([p.bool,p.object]),keyboard:p.oneOfType([p.bool,p.object]),onHover:p.func,onClick:p.func,onDblClick:p.func,onContextMenu:p.func,onMouseDown:p.func,onMouseMove:p.func,onMouseUp:p.func,onTouchStart:p.func,onTouchMove:p.func,onTouchEnd:p.func,onMouseEnter:p.func,onMouseLeave:p.func,onMouseOut:p.func,onWheel:p.func,touchAction:p.string,eventRecognizerOptions:p.object,clickRadius:p.number,interactiveLayerIds:p.array,getCursor:p.func,controller:p.instanceOf(e5)}),e6=Object.assign({},tY.defaultProps,tD,eu.defaultProps,{onViewStateChange:null,onViewportChange:null,onClick:null,onNativeClick:null,onHover:null,onContextMenu:function(t){return t.preventDefault()},scrollZoom:!0,dragPan:!0,dragRotate:!0,doubleClickZoom:!0,touchZoom:!0,touchRotate:!1,keyboard:!0,touchAction:"none",eventRecognizerOptions:{},clickRadius:0,getCursor:function(t){var e=t.isDragging,n=t.isHovering;return e?"grabbing":n?"pointer":"grab"}});function e9(t){if(t.lngLat||!t.offsetCenter)return t;var e=t.offsetCenter,n=e.x,r=e.y;if(!Number.isFinite(n)||!Number.isFinite(r))return t;var i=[n,r];if(t.point=i,this.map){var o=this.map.unproject(i);t.lngLat=[o.lng,o.lat]}return t}function e7(t){var e=this.map;if(!e||!t)return null;var n={},r=this.props.clickRadius;this.props.interactiveLayerIds&&(n.layers=this.props.interactiveLayerIds);try{return e.queryRenderedFeatures(r?[[t[0]-r,t[1]+r],[t[0]+r,t[1]-r]]:t,n)}catch(t){return null}}function nt(t,e){var n=this.props[t];n&&n(e9.call(this,e))}function ne(t){nt.call(this,"touch"===t.pointerType?"onTouchStart":"onMouseDown",t)}function nn(t){nt.call(this,"touch"===t.pointerType?"onTouchEnd":"onMouseUp",t)}function nr(t){if(nt.call(this,"touch"===t.pointerType?"onTouchMove":"onMouseMove",t),!this.state.isDragging){var e,n=this.props,r=n.onHover,i=n.interactiveLayerIds;t=e9.call(this,t),(i||r)&&(e=e7.call(this,t.point));var o=!!(i&&e&&e.length>0),a=o&&!this.state.isHovering,s=!o&&this.state.isHovering;(r||a)&&(t.features=e,r&&r(t)),a&&nt.call(this,"onMouseEnter",t),s&&nt.call(this,"onMouseLeave",t),(a||s)&&this.setState({isHovering:o})}}function ni(t){var e=this.props,n=e.onClick,r=e.onNativeClick,i=e.onDblClick,o=e.doubleClickZoom,a=[],s=i||o;switch(t.type){case"anyclick":a.push(r),s||a.push(n);break;case"click":s&&a.push(n)}(a=a.filter(Boolean)).length&&((t=e9.call(this,t)).features=e7.call(this,t.point),a.forEach(function(e){return e(t)}))}var no=(0,h.forwardRef)(function(t,e){var n,a,s=(0,h.useContext)(tL),c=(0,h.useMemo)(function(){return t.controller||new e5},[]),u=(0,h.useMemo)(function(){return new eW(null,{touchAction:t.touchAction,recognizerOptions:t.eventRecognizerOptions})},[]),l=(0,h.useRef)(null),p=(0,h.useRef)(null),f=(0,h.useRef)({width:0,height:0,state:{isHovering:!1,isDragging:!1}}).current;f.props=t,f.map=p.current&&p.current.getMap(),f.setState=function(e){f.state=e3(e3({},f.state),e),l.current.style.cursor=t.getCursor(f.state)};var d=!0,v=function(t,e,r){if(d){n=[t,e,r];return}var i=f.props,o=i.onViewStateChange,a=i.onViewportChange;Object.defineProperty(t,"position",{get:function(){return[0,0,tF(f.map,t)]}}),o&&o({viewState:t,interactionState:e,oldViewState:r}),a&&a(t,e,r)};(0,h.useImperativeHandle)(e,function(){return{getMap:p.current&&p.current.getMap,queryRenderedFeatures:p.current&&p.current.queryRenderedFeatures}},[]);var g=(0,h.useMemo)(function(){return e3(e3({},s),{},{eventManager:u,container:s.container||l.current})},[s,l.current]);g.onViewportChange=v,g.viewport=s.viewport||tU(f),f.viewport=g.viewport;var m=function(t){var e=t.isDragging,n=void 0!==e&&e;if(n!==f.state.isDragging&&f.setState({isDragging:n}),d){a=t;return}var r=f.props.onInteractionStateChange;r&&r(t)},b=function(){f.width&&f.height&&c.setOptions(e3(e3(e3({},f.props),f.props.viewState),{},{isInteractive:!!(f.props.onViewStateChange||f.props.onViewportChange),onViewportChange:v,onStateChange:m,eventManager:u,width:f.width,height:f.height}))};(0,h.useEffect)(function(){return u.setElement(l.current),u.on({pointerdown:ne.bind(f),pointermove:nr.bind(f),pointerup:nn.bind(f),pointerleave:nt.bind(f,"onMouseOut"),click:ni.bind(f),anyclick:ni.bind(f),dblclick:nt.bind(f,"onDblClick"),wheel:nt.bind(f,"onWheel"),contextmenu:nt.bind(f,"onContextMenu")}),function(){u.destroy()}},[]),tz(function(){if(n){var t;v.apply(void 0,function(t){if(Array.isArray(t))return i(t)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
(t=n)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
(t)||o(t)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js
())}a&&m(a)}),b();var y=t.width,w=t.height,O=t.style,E=t.getCursor,_=(0,h.useMemo)(function(){return e3(e3({position:"relative"},O),{},{width:y,height:w,cursor:E(f.state)})},[O,y,w,E,f.state]);return n&&f._child||(f._child=h.createElement(tN,{value:g},h.createElement("div",{key:"event-canvas",ref:l,style:_},h.createElement(tY,r({},t,{width:"100%",height:"100%",style:null,onResize:function(t){var e=t.width,n=t.height;f.width=e,f.height=n,b(),f.props.onResize({width:e,height:n})},ref:p}))))),d=!1,f._child});no.supported=tY.supported,no.propTypes=e8,no.defaultProps=e6;/* harmony default export */var na=no;// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/deep-equal.js
p.string.isRequired,p.string,p.oneOf(["fill","line","symbol","circle","fill-extrusion","raster","background","heatmap","hillshade","sky"]).isRequired,p.string,p.string,p.string;//# sourceMappingURL=layer.js.map
var ns={captureScroll:!1,captureDrag:!0,captureClick:!0,captureDoubleClick:!0,capturePointerMove:!1},nc={captureScroll:p.bool,captureDrag:p.bool,captureClick:p.bool,captureDoubleClick:p.bool,capturePointerMove:p.bool};function nu(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=(0,h.useContext)(tL),n=(0,h.useRef)(null),r=(0,h.useRef)({props:t,state:{},context:e,containerRef:n}).current;return r.props=t,r.context=e,(0,h.useEffect)(function(){return function(t){var e=t.containerRef.current,n=t.context.eventManager;if(e&&n){var r={wheel:function(e){var n=t.props;n.captureScroll&&e.stopPropagation(),n.onScroll&&n.onScroll(e,t)},panstart:function(e){var n=t.props;n.captureDrag&&e.stopPropagation(),n.onDragStart&&n.onDragStart(e,t)},anyclick:function(e){var n=t.props;n.captureClick&&e.stopPropagation(),n.onNativeClick&&n.onNativeClick(e,t)},click:function(e){var n=t.props;n.captureClick&&e.stopPropagation(),n.onClick&&n.onClick(e,t)},dblclick:function(e){var n=t.props;n.captureDoubleClick&&e.stopPropagation(),n.onDoubleClick&&n.onDoubleClick(e,t)},pointermove:function(e){var n=t.props;n.capturePointerMove&&e.stopPropagation(),n.onPointerMove&&n.onPointerMove(e,t)}};return n.watch(r,e),function(){n.off(r)}}}(r)},[e.eventManager]),r}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/base-control.js
function nl(t){var e=t.instance,n=nu(t),r=n.context,i=n.containerRef;return e._context=r,e._containerRef=i,e._render()}var nh=function(t){tQ(i,t);var e,n=(e=function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}(),function(){var t,n=t2(i);return t=e?Reflect.construct(n,arguments,t2(this).constructor):n.apply(this,arguments),t1(this,t)});function i(){var t;tc(this,i);for(var e=arguments.length,r=Array(e),o=0;o<e;o++)r[o]=arguments[o];return a(t$(t=n.call.apply(n,[this].concat(r))),"_context",{}),a(t$(t),"_containerRef",(0,h.createRef)()),a(t$(t),"_onScroll",function(t){}),a(t$(t),"_onDragStart",function(t){}),a(t$(t),"_onDblClick",function(t){}),a(t$(t),"_onClick",function(t){}),a(t$(t),"_onPointerMove",function(t){}),t}return tl(i,[{key:"_render",value:function(){throw Error("_render() not implemented")}},{key:"render",value:function(){return h.createElement(nl,r({instance:this},this.props,{onScroll:this._onScroll,onDragStart:this._onDragStart,onDblClick:this._onDblClick,onClick:this._onClick,onPointerMove:this._onPointerMove}))}}]),i}(h.PureComponent);//# sourceMappingURL=base-control.js.map
function np(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function nf(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?np(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):np(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}a(nh,"propTypes",nc),a(nh,"defaultProps",ns);var nd=Object.assign({},nc,{draggable:p.bool,onDrag:p.func,onDragEnd:p.func,onDragStart:p.func,offsetLeft:p.number,offsetTop:p.number}),nv=Object.assign({},ns,{draggable:!1,offsetLeft:0,offsetTop:0});function ng(t){var e=t.offsetCenter;return[e.x,e.y]}function nm(t,e,n,r){var i=t[0]+e[0]-n.offsetLeft,o=t[1]+e[1]-n.offsetTop;return r.viewport.unproject([i,o])}function nb(t,e){var n=e.props,r=e.callbacks,i=e.state,o=e.context,a=e.containerRef;if(n.draggable){t.stopPropagation();var s=ng(t),c=function(t,e){var n=t.center,r=n.x,i=n.y;if(e){var o=e.getBoundingClientRect();return[o.left-r,o.top-i]}return null}(t,a.current);if(i.setDragPos(s),i.setDragOffset(c),r.onDragStart&&c){var u=Object.assign({},t);u.lngLat=nm(s,c,n,o),r.onDragStart(u)}}}//# sourceMappingURL=draggable-control.js.map
var ny="undefined"!=typeof window&&window.devicePixelRatio||1,nw=function(t){return Math.round(t*ny)/ny},nO=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"x";if(null===t)return e;var r="x"===n?t.offsetWidth:t.offsetHeight;return nw(e/100*r)/r*100};//# sourceMappingURL=crisp-pixel.js.map
function nE(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}var n_=Object.assign({},nd,{className:p.string,longitude:p.number.isRequired,latitude:p.number.isRequired,style:p.object}),nP=Object.assign({},nv,{className:""});function nM(t){var e,n,r,i,o,s,c,u=(n=(e=f((0,h.useState)(null),2))[0],r=e[1],o=(i=f((0,h.useState)(null),2))[0],s=i[1],(c=nu(nf(nf({},t),{},{onDragStart:nb}))).callbacks=t,c.state.dragPos=n,c.state.setDragPos=r,c.state.dragOffset=o,c.state.setDragOffset=s,(0,h.useEffect)(function(){return function(t){var e=t.context.eventManager;if(e&&t.state.dragPos){var n={panmove:function(e){return function(t,e){var n=e.props,r=e.callbacks,i=e.state,o=e.context;t.stopPropagation();var a=ng(t);i.setDragPos(a);var s=i.dragOffset;if(r.onDrag&&s){var c=Object.assign({},t);c.lngLat=nm(a,s,n,o),r.onDrag(c)}}(e,t)},panend:function(e){return function(t,e){var n=e.props,r=e.callbacks,i=e.state,o=e.context;t.stopPropagation();var a=i.dragPos,s=i.dragOffset;if(i.setDragPos(null),i.setDragOffset(null),r.onDragEnd&&a&&s){var c=Object.assign({},t);c.lngLat=nm(a,s,n,o),r.onDragEnd(c)}}(e,t)},pancancel:function(e){var n;return n=t.state,void(e.stopPropagation(),n.setDragPos(null),n.setDragOffset(null))}};return e.watch(n),function(){e.off(n)}}}(c)},[c.context.eventManager,!!n]),c),l=u.state,p=u.containerRef,d=t.children,v=t.className,g=t.draggable,m=t.style,b=l.dragPos,y=function(t){var e=t.props,n=t.state,r=t.context,i=e.longitude,o=e.latitude,a=e.offsetLeft,s=e.offsetTop,c=n.dragPos,u=n.dragOffset,l=r.viewport,h=r.map;if(c&&u)return[c[0]+u[0],c[1]+u[1]];var p=tF(h,{longitude:i,latitude:o}),d=f(l.project([i,o,p]),2),v=d[0],g=d[1];return[v+=a,g+=s]}(u),w=f(y,2),O=w[0],E=w[1],_="translate(".concat(nw(O),"px, ").concat(nw(E),"px)"),P=g?b?"grabbing":"grab":"auto",M=(0,h.useMemo)(function(){var t=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nE(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):nE(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute",left:0,top:0,transform:_,cursor:P},m);return h.createElement("div",{className:"mapboxgl-marker ".concat(v),ref:u.containerRef,style:t},d)},[d,v]),j=p.current;return j&&(j.style.transform=_,j.style.cursor=P),M}nM.defaultProps=nP,nM.propTypes=n_,h.memo(nM);//# sourceMappingURL=marker.js.map
var nj={top:{x:.5,y:0},"top-left":{x:0,y:0},"top-right":{x:1,y:0},bottom:{x:.5,y:1},"bottom-left":{x:0,y:1},"bottom-right":{x:1,y:1},left:{x:0,y:.5},right:{x:1,y:.5}},nS=Object.keys(nj),nT=Object.assign({},nc,{className:p.string,longitude:p.number.isRequired,latitude:p.number.isRequired,altitude:p.number,offsetLeft:p.number,offsetTop:p.number,tipSize:p.number,closeButton:p.bool,closeOnClick:p.bool,anchor:p.oneOf(Object.keys(nj)),dynamicPosition:p.bool,sortByDepth:p.bool,onClose:p.func}),nk=Object.assign({},ns,{className:"",offsetLeft:0,offsetTop:0,tipSize:10,anchor:"bottom",dynamicPosition:!0,sortByDepth:!1,closeButton:!0,closeOnClick:!0,onClose:function(){}});function nx(t){var e,n,r,i,o,a,s,c,u,l,p,d,v,g,m,b,y,w,O,E=(0,h.useRef)(null),_=nu(t),P=_.context,M=_.containerRef,j=f((0,h.useState)(!1),2)[1];(0,h.useEffect)(function(){j(!0)},[E.current]),(0,h.useEffect)(function(){if(P.eventManager&&t.closeOnClick){var e=function(){return _.props.onClose()};return P.eventManager.on("anyclick",e),function(){P.eventManager.off("anyclick",e)}}},[P.eventManager,t.closeOnClick]);var S=P.viewport,T=P.map,k=t.className,x=t.longitude,D=t.latitude,C=t.tipSize,R=t.closeButton,A=t.children,I=t.altitude;void 0===I&&(I=tF(T,{longitude:x,latitude:D}));var L=S.project([x,D,I]),N=(e=E.current,r=(n=f(L,2))[0],i=n[1],o=t.anchor,a=t.dynamicPosition,s=t.tipSize,e&&a?function(t){var e=t.x,n=t.y,r=t.width,i=t.height,o=t.selfWidth,a=t.selfHeight,s=t.anchor,c=t.padding,u=void 0===c?0:c,l=nj[s],h=l.x,p=l.y,f=n-p*a,d=f+a,v=Math.max(0,u-f)+Math.max(0,d-i+u);if(v>0){var g=p,m=v;for(p=0;p<=1;p+=.5)d=(f=n-p*a)+a,(v=Math.max(0,u-f)+Math.max(0,d-i+u))<m&&(m=v,g=p);p=g}var b=.5;.5===p&&(h=Math.floor(h),b=1);var y=e-h*o,w=y+o,O=Math.max(0,u-y)+Math.max(0,w-r+u);if(O>0){var E=h,_=O;for(h=0;h<=1;h+=b)w=(y=e-h*o)+o,(O=Math.max(0,u-y)+Math.max(0,w-r+u))<_&&(_=O,E=h);h=E}return nS.find(function(t){var e=nj[t];return e.x===h&&e.y===p})||s}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/popup.js
({x:r,y:i,anchor:o,padding:s,width:S.width,height:S.height,selfWidth:e.clientWidth,selfHeight:e.clientHeight}):o),z=(c=M.current,l=(u=f(L,3))[0],p=u[1],d=u[2],v=t.offsetLeft,g=t.offsetTop,m=t.sortByDepth,y=nO(c,-(100*(b=nj[N]).x)),w=nO(c,-(100*b.y),"y"),O={position:"absolute",transform:"\n      translate(".concat(y,"%, ").concat(w,"%)\n      translate(").concat(nw(l+v),"px, ").concat(nw(p+g),"px)\n    "),display:void 0,zIndex:void 0},m&&(d>1||d<-1||l<0||l>S.width||p<0||p>S.height?O.display="none":O.zIndex=Math.floor((1-d)/2*1e5)),O),F=(0,h.useCallback)(function(t){_.props.onClose();var e=_.context.eventManager;e&&e.once("click",function(t){return t.stopPropagation()},t.target)},[]);return h.createElement("div",{className:"mapboxgl-popup mapboxgl-popup-anchor-".concat(N," ").concat(k),style:z,ref:M},h.createElement("div",{key:"tip",className:"mapboxgl-popup-tip",style:{borderWidth:C}}),h.createElement("div",{key:"content",ref:E,className:"mapboxgl-popup-content"},R&&h.createElement("button",{key:"close-button",className:"mapboxgl-popup-close-button",type:"button",onClick:F},"×"),A))}//# sourceMappingURL=popup.js.map
function nD(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}nx.propTypes=nT,nx.defaultProps=nk,h.memo(nx);var nC=Object.assign({},nc,{toggleLabel:p.string,className:p.string,style:p.object,compact:p.bool,customAttribution:p.oneOfType([p.string,p.arrayOf(p.string)])}),nR=Object.assign({},ns,{className:"",toggleLabel:"Toggle Attribution"});function nA(t){var e=nu(t),n=e.context,r=e.containerRef,i=(0,h.useRef)(null),o=f((0,h.useState)(!1),2),s=o[0],c=o[1];(0,h.useEffect)(function(){var e,o,a,s,c,u;return n.map&&(o={customAttribution:t.customAttribution},a=n.map,s=r.current,c=i.current,(u=new(tP()).AttributionControl(o))._map=a,u._container=s,u._innerContainer=c,u._updateAttributions(),u._updateEditLink(),a.on("styledata",u._updateData),a.on("sourcedata",u._updateData),e=u),function(){var t;return e&&void((t=e)._map.off("styledata",t._updateData),t._map.off("sourcedata",t._updateData))}},[n.map]);var u=void 0===t.compact?n.viewport.width<=640:t.compact;(0,h.useEffect)(function(){!u&&s&&c(!1)},[u]);var l=(0,h.useCallback)(function(){return c(function(t){return!t})},[]),p=(0,h.useMemo)(function(){return function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nD(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):nD(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute"},t.style)},[t.style]);return h.createElement("div",{style:p,className:t.className},h.createElement("div",{ref:r,"aria-pressed":s,className:"mapboxgl-ctrl mapboxgl-ctrl-attrib ".concat(u?"mapboxgl-compact":""," ").concat(s?"mapboxgl-compact-show":"")},h.createElement("button",{type:"button",className:"mapboxgl-ctrl-attrib-button",title:t.toggleLabel,onClick:l}),h.createElement("div",{ref:i,className:"mapboxgl-ctrl-attrib-inner",role:"list"})))}//# sourceMappingURL=attribution-control.js.map
function nI(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}nA.propTypes=nC,nA.defaultProps=nR,h.memo(nA);var nL=Object.assign({},nc,{className:p.string,style:p.object,container:p.object,label:p.string}),nN=Object.assign({},ns,{className:"",container:null,label:"Toggle fullscreen"});function nz(t){var e=nu(t),n=e.context,r=e.containerRef,i=f((0,h.useState)(!1),2),o=i[0],s=i[1],c=f((0,h.useState)(!1),2),u=c[0],l=c[1],p=f((0,h.useState)(null),2),d=p[0],v=p[1];(0,h.useEffect)(function(){var t=new(tP()).FullscreenControl;v(t),l(t._checkFullscreenSupport());var e=function(){var e=!t._fullscreen;t._fullscreen=e,s(e)};return th.addEventListener(t._fullscreenchange,e),function(){th.removeEventListener(t._fullscreenchange,e)}},[]);var g=(0,h.useMemo)(function(){return function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nI(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):nI(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute"},t.style)},[t.style]);if(!u)return null;var m=t.className,b=t.label,y=o?"shrink":"fullscreen";return h.createElement("div",{style:g,className:m},h.createElement("div",{className:"mapboxgl-ctrl mapboxgl-ctrl-group",ref:r},h.createElement("button",{key:y,className:"mapboxgl-ctrl-icon mapboxgl-ctrl-".concat(y),type:"button",title:b,onClick:function(){d&&(d._container=t.container||n.container,d._onClickFullscreen())}},h.createElement("span",{className:"mapboxgl-ctrl-icon","aria-hidden":"true"}))))}//# sourceMappingURL=geolocate-utils.js.map
function nF(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}nz.propTypes=nL,nz.defaultProps=nN,h.memo(nz);var nV=function(){},nZ=Object.assign({},nc,{className:p.string,style:p.object,label:p.string,disabledLabel:p.string,auto:p.bool,positionOptions:p.object,fitBoundsOptions:p.object,trackUserLocation:p.bool,showUserLocation:p.bool,showAccuracyCircle:p.bool,showUserHeading:p.bool,onViewStateChange:p.func,onViewportChange:p.func,onGeolocate:p.func}),nB=Object.assign({},ns,{className:"",label:"Find My Location",disabledLabel:"Location Not Available",auto:!1,positionOptions:{enableHighAccuracy:!1,timeout:6e3},fitBoundsOptions:{maxZoom:15},trackUserLocation:!1,showUserLocation:!0,showUserHeading:!1,showAccuracyCircle:!0,onGeolocate:function(){}});function nU(t){var e=nu(t),n=e.context,r=e.containerRef,i=(0,h.useRef)(null),o=f((0,h.useState)(null),2),s=o[0],c=o[1],u=f((0,h.useState)(!1),2),p=u[0],d=u[1];(0,h.useEffect)(function(){var r;return n.map&&(void 0!==l?Promise.resolve(l):void 0!==window.navigator.permissions?window.navigator.permissions.query({name:"geolocation"}).then(function(t){return l="denied"!==t.state}):Promise.resolve(l=!!window.navigator.geolocation)).then(function(o){if(d(o),i.current){var a,s,u;a=i.current,(s=new(tP()).GeolocateControl(t))._container=th.createElement("div"),s._map={on:function(){},_getUIString:function(){return""}},s._setupUI(!0),s._map=n.map,s._geolocateButton=a,u=n.eventManager,s.options.trackUserLocation&&u&&u.on("panstart",function(){"ACTIVE_LOCK"===s._watchState&&(s._watchState="BACKGROUND",a.classList.add("mapboxgl-ctrl-geolocate-background"),a.classList.remove("mapboxgl-ctrl-geolocate-active"))}),s.on("geolocate",t.onGeolocate),(r=s)._updateCamera=function(t){var n,r,i,o,a,s,c,u,l,h,p,f;return n=e.context,r=e.props,i=new(tP()).LngLat(t.coords.longitude,t.coords.latitude),o=t.coords.accuracy,s=[[(a=i.toBounds(o))._ne.lng,a._ne.lat],[a._sw.lng,a._sw.lat]],u=(c=n.viewport.fitBounds(s,r.fitBoundsOptions)).longitude,l=c.latitude,h=c.zoom,p=Object.assign({},new tR(Object.assign({},n.viewport,{longitude:u,latitude:l,zoom:h})).getViewportProps(),eK),f=r.onViewportChange||n.onViewportChange||nV,void((r.onViewStateChange||n.onViewStateChange||nV)({viewState:p}),f(p))},c(r)}}),function(){r&&r._clearWatch()}},[n.map]);var v=(0,h.useCallback)(function(){s&&(s.options=e.props,s.trigger())},[s]);(0,h.useEffect)(function(){t.auto&&v()},[s,t.auto]),(0,h.useEffect)(function(){s&&s._onZoom()},[n.viewport.zoom]);var g=t.className,m=t.label,b=t.disabledLabel,y=t.trackUserLocation,w=(0,h.useMemo)(function(){return function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nF(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):nF(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute"},t.style)},[t.style]);return h.createElement("div",{style:w,className:g},h.createElement("div",{key:"geolocate-control",className:"mapboxgl-ctrl mapboxgl-ctrl-group",ref:r},h.createElement("button",{key:"geolocate",className:"mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate",ref:i,disabled:!p,"aria-pressed":!y,type:"button",title:p?m:b,"aria-label":p?m:b,onClick:v},h.createElement("span",{className:"mapboxgl-ctrl-icon","aria-hidden":"true"}))))}//# sourceMappingURL=version.js.map
function nq(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}nU.propTypes=nZ,nU.defaultProps=nB,h.memo(nU);var nW=function(){},nH=Object.assign({},nc,{className:p.string,style:p.object,onViewStateChange:p.func,onViewportChange:p.func,showCompass:p.bool,showZoom:p.bool,zoomInLabel:p.string,zoomOutLabel:p.string,compassLabel:p.string}),nX=Object.assign({},ns,{className:"",showCompass:!0,showZoom:!0,zoomInLabel:"Zoom In",zoomOutLabel:"Zoom Out",compassLabel:"Reset North"});function nY(t,e,n){var r=Object.assign({},new tR(Object.assign({},t.viewport,n)).getViewportProps(),eK),i=e.onViewportChange||t.onViewportChange||nW;(e.onViewStateChange||t.onViewStateChange||nW)({viewState:r}),i(r)}function nK(t,e,n,r){return h.createElement("button",{key:t,className:"mapboxgl-ctrl-icon mapboxgl-ctrl-".concat(t),type:"button",title:e,onClick:n},r||h.createElement("span",{className:"mapboxgl-ctrl-icon","aria-hidden":"true"}))}function nG(t){var e,n,r,i=nu(t),o=i.context,s=i.containerRef,c=t.className,u=t.showCompass,l=t.showZoom,p=t.zoomInLabel,f=t.zoomOutLabel,d=t.compassLabel,v=(0,h.useMemo)(function(){return function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nq(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):nq(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute"},t.style)},[t.style]);return h.createElement("div",{style:v,className:c},h.createElement("div",{className:"mapboxgl-ctrl mapboxgl-ctrl-group",ref:s},l&&nK("zoom-in",p,function(){nY(o,t,{zoom:o.viewport.zoom+1})}),l&&nK("zoom-out",f,function(){nY(o,t,{zoom:o.viewport.zoom-1})}),u&&nK("compass",d,function(){nY(o,t,{bearing:0,pitch:0})},(e=(0,h.useMemo)(function(){return o.map?//# sourceMappingURL=geolocate-control.js.map
function(t,e){for(var n=(t||"").split(".").map(Number),r=(e||"").split(".").map(Number),i=0;i<3;i++){var o=n[i]||0,a=r[i]||0;if(o<a)return -1;if(o>a)return 1}return 0}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/navigation-control.js
(o.map.version,"1.6.0")>=0?2:1:2},[o.map]),n=o.viewport.bearing,r={transform:"rotate(".concat(-n,"deg)")},2===e?h.createElement("span",{className:"mapboxgl-ctrl-icon","aria-hidden":"true",style:r}):h.createElement("span",{className:"mapboxgl-ctrl-compass-arrow",style:r})))))}//# sourceMappingURL=navigation-control.js.map
function n$(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}nG.propTypes=nH,nG.defaultProps=nX,h.memo(nG);var nJ=Object.assign({},nc,{className:p.string,style:p.object,maxWidth:p.number,unit:p.oneOf(["imperial","metric","nautical"])}),nQ=Object.assign({},ns,{className:"",maxWidth:100,unit:"metric"});function n0(t){var e=nu(t),n=e.context,r=e.containerRef,i=f((0,h.useState)(null),2),o=i[0],s=i[1];(0,h.useEffect)(function(){if(n.map){var t=new(tP()).ScaleControl;t._map=n.map,t._container=r.current,s(t)}},[n.map]),o&&(o.options=t,o._onMove());var c=(0,h.useMemo)(function(){return function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?n$(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):n$(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute"},t.style)},[t.style]);return h.createElement("div",{style:c,className:t.className},h.createElement("div",{ref:r,className:"mapboxgl-ctrl mapboxgl-ctrl-scale"}))}n0.propTypes=nJ,n0.defaultProps=nQ,h.memo(n0);//# sourceMappingURL=scale-control.js.map
var n1="undefined"!=typeof window&&window.devicePixelRatio||1,n2=Object.assign({},nc,{redraw:p.func.isRequired});function n5(t){var e=nu(t),n=e.context,r=e.containerRef,i=f((0,h.useState)(null),2),o=i[0],a=i[1];(0,h.useEffect)(function(){a(r.current.getContext("2d"))},[]);var s=n.viewport,c=n.isDragging;return o&&(o.save(),o.scale(n1,n1),t.redraw({width:s.width,height:s.height,ctx:o,isDragging:c,project:s.project,unproject:s.unproject}),o.restore()),h.createElement("canvas",{ref:r,width:s.width*n1,height:s.height*n1,style:{width:"".concat(s.width,"px"),height:"".concat(s.height,"px"),position:"absolute",left:0,top:0}})}//# sourceMappingURL=canvas-overlay.js.map
function n4(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}n5.propTypes=n2,n5.defaultProps={captureScroll:!1,captureDrag:!1,captureClick:!1,captureDoubleClick:!1,capturePointerMove:!1};var n3=Object.assign({},nc,{redraw:p.func.isRequired,style:p.object});function n8(t){var e=nu(t),n=e.context,r=e.containerRef,i=n.viewport,o=n.isDragging,s=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?n4(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):n4(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute",left:0,top:0,width:i.width,height:i.height},t.style);return h.createElement("div",{ref:r,style:s},t.redraw({width:i.width,height:i.height,isDragging:o,project:i.project,unproject:i.unproject}))}//# sourceMappingURL=html-overlay.js.map
function n6(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}n8.propTypes=n3,n8.defaultProps={captureScroll:!1,captureDrag:!1,captureClick:!1,captureDoubleClick:!1,capturePointerMove:!1};var n9=Object.assign({},nc,{redraw:p.func.isRequired,style:p.object});function n7(t){var e=nu(t),n=e.context,r=e.containerRef,i=n.viewport,o=n.isDragging,s=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?n6(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):n6(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute",left:0,top:0},t.style);return h.createElement("svg",{width:i.width,height:i.height,ref:r,style:s},t.redraw({width:i.width,height:i.height,isDragging:o,project:i.project,unproject:i.unproject}))}n7.propTypes=n9,n7.defaultProps={captureScroll:!1,captureDrag:!1,captureClick:!1,captureDoubleClick:!1,capturePointerMove:!1},tP()&&tP().setRTLTextPlugin;//# sourceMappingURL=set-rtl-text-plugin.js.map // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/index.js
//# sourceMappingURL=index.js.map
/***/}}]);
