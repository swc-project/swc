(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[785],{/***/840:/***/function(t,e,n){var r;!/*! Hammer.JS - v2.0.7 - 2016-04-22
             * http://hammerjs.github.io/
             *
             * Copyright (c) 2016 Jorik Tangelder;
             * Licensed under the MIT license */function(a,S,B,h){"use strict";var p,U=["","webkit","Moz","MS","ms","o"],T=S.createElement("div"),q=Math.round,W=Math.abs,H=Date.now;/**
                 * set a timeout with a given scope
                 * @param {Function} fn
                 * @param {Number} timeout
                 * @param {Object} context
                 * @returns {number}
                 */function X(t,e,n){return setTimeout(C(t,n),e)}/**
                 * if the argument is an array, we want to execute the fn on each entry
                 * if it aint an array we don't want to do a thing.
                 * this is used by all the methods that accept a single and array argument.
                 * @param {*|Array} arg
                 * @param {String} fn
                 * @param {Object} [context]
                 * @returns {Boolean}
                 */function Y(t,n,e){return!!Array.isArray(t)&&(k(t,e[n],e),!0)}/**
                 * walk objects and arrays
                 * @param {Object} obj
                 * @param {Function} iterator
                 * @param {Object} context
                 */function k(t,e,n){var r;if(t){if(t.forEach)t.forEach(e,n);else if(t.length!==h)for(r=0;r<t.length;)e.call(n,t[r],r,t),r++;else for(r in t)t.hasOwnProperty(r)&&e.call(n,t[r],r,t)}}/**
                 * wrap a method with a deprecation warning and stack trace
                 * @param {Function} method
                 * @param {String} name
                 * @param {String} message
                 * @returns {Function} A new function wrapping the supplied method.
                 */function y(n,t,e){var r="DEPRECATED METHOD: "+t+"\n"+e+" AT \n";return function(){var t=Error("get-stack-trace"),i=t&&t.stack?t.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",e=a.console&&(a.console.warn||a.console.log);return e&&e.call(a.console,r,i),n.apply(this,arguments)}}p="function"!=typeof Object.assign?function(t){if(null==t)throw TypeError("Cannot convert undefined or null to object");for(var e=Object(t),n=1;n<arguments.length;n++){var r=arguments[n];if(null!=r)for(var i in r)r.hasOwnProperty(i)&&(e[i]=r[i])}return e}:Object.assign;/**
                 * extend object.
                 * means that properties in dest will be overwritten by the ones in src.
                 * @param {Object} dest
                 * @param {Object} src
                 * @param {Boolean} [merge=false]
                 * @returns {Object} dest
                 */var x=y(function(t,e,n){for(var r=Object.keys(e),i=0;i<r.length;)(!n||n&&t[r[i]]===h)&&(t[r[i]]=e[r[i]]),i++;return t},"extend","Use `assign`."),D=y(function(t,e){return x(t,e,!0)},"merge","Use `assign`.");/**
                 * simple class inheritance
                 * @param {Function} child
                 * @param {Function} base
                 * @param {Object} [properties]
                 */function i(e,i,n){var t,r=i.prototype;(t=e.prototype=Object.create(r)).constructor=e,t._super=r,n&&p(t,n)}/**
                 * simple function bind
                 * @param {Function} fn
                 * @param {Object} context
                 * @returns {Function}
                 */function C(t,e){return function(){return t.apply(e,arguments)}}/**
                 * let a boolean value also be a function that must return a boolean
                 * this first item in args will be used as the context
                 * @param {Boolean|Function} val
                 * @param {Array} [args]
                 * @returns {Boolean}
                 */function K(t,e){return"function"==typeof t?t.apply(e&&e[0]||h,e):t}/**
                 * addEventListener with multiple events at once
                 * @param {EventTarget} target
                 * @param {String} types
                 * @param {Function} handler
                 */function R(e,t,n){k(J(t),function(t){e.addEventListener(t,n,!1)})}/**
                 * removeEventListener with multiple events at once
                 * @param {EventTarget} target
                 * @param {String} types
                 * @param {Function} handler
                 */function A(e,t,n){k(J(t),function(t){e.removeEventListener(t,n,!1)})}/**
                 * find if a node is in the given parent
                 * @method hasParent
                 * @param {HTMLElement} node
                 * @param {HTMLElement} parent
                 * @return {Boolean} found
                 */function G(t,e){for(;t;){if(t==e)return!0;t=t.parentNode}return!1}/**
                 * small indexOf wrapper
                 * @param {String} str
                 * @param {String} find
                 * @returns {Boolean} found
                 */function $(t,e){return t.indexOf(e)>-1}/**
                 * split string on whitespace
                 * @param {String} str
                 * @returns {Array} words
                 */function J(t){return t.trim().split(/\s+/g)}/**
                 * find if a array contains the object using indexOf or a simple polyFill
                 * @param {Array} src
                 * @param {String} find
                 * @param {String} [findByKey]
                 * @return {Boolean|Number} false when not found, or the index
                 */function Q(t,e,n){if(t.indexOf&&!n)return t.indexOf(e);for(var r=0;r<t.length;){if(n&&t[r][n]==e||!n&&t[r]===e)return r;r++}return -1}/**
                 * convert array-like objects to real arrays
                 * @param {Object} obj
                 * @returns {Array}
                 */function tt(t){return Array.prototype.slice.call(t,0)}/**
                 * unique array with objects based on a key (like 'id') or just by the array's value
                 * @param {Array} src [{id:1},{id:2},{id:1}]
                 * @param {String} [key]
                 * @param {Boolean} [sort=False]
                 * @returns {Array} [{id:1},{id:2}]
                 */function te(r,e,n){for(var t=[],i=[],o=0;o<r.length;){var a=e?r[o][e]:r[o];0>Q(i,a)&&t.push(r[o]),i[o]=a,o++}return n&&(t=e?t.sort(function(t,n){return t[e]>n[e]}):t.sort()),t}/**
                 * get the prefixed property
                 * @param {Object} obj
                 * @param {String} property
                 * @returns {String|Undefined} prefixed
                 */function f(t,e){for(var n,r,i=e[0].toUpperCase()+e.slice(1),o=0;o<U.length;){if((r=(n=U[o])?n+i:e)in t)return r;o++}return h}/**
                 * get a unique id
                 * @returns {number} uniqueId
                 */var tn=1;/**
                 * get the window object of an element
                 * @param {HTMLElement} element
                 * @returns {DocumentView|Window}
                 */function tr(t){var e=t.ownerDocument||t;return e.defaultView||e.parentWindow||a}var I="ontouchstart"in a,ti=f(a,"PointerEvent")!==h,to=I&&/mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent),L="touch",N="mouse",ta=["x","y"],ts=["clientX","clientY"];/**
                 * create new input type manager
                 * @param {Manager} manager
                 * @param {Function} callback
                 * @returns {Input}
                 * @constructor
                 */function o(t,e){var n=this;this.manager=t,this.callback=e,this.element=t.element,this.target=t.options.inputTarget,// smaller wrapper around the handler, for the scope and the enabled state of the manager,
// so when disabled the input events are completely bypassed.
this.domHandler=function(e){K(t.options.enable,[t])&&n.handler(e)},this.init()}/**
                 * handle input events
                 * @param {Manager} manager
                 * @param {String} eventType
                 * @param {Object} input
                 */function tc(n,p,t){var e,r,f,d,i,v,g,a,s,c,u,o,m,b,l,y=t.pointers.length,w=t.changedPointers.length,O=1&p&&y-w==0,E=12&p&&y-w==0;t.isFirst=!!O,t.isFinal=!!E,O&&(n.session={}),// source event is the normalized value of the domEvents
// like 'touchstart, mouseup, pointerdown'
t.eventType=p,e=n.session,f=(r=t.pointers).length,e.firstInput||(e.firstInput=tu(t)),f>1&&!e.firstMultiple?e.firstMultiple=tu(t):1===f&&(e.firstMultiple=!1),d=e.firstInput,v=(i=e.firstMultiple)?i.center:d.center,g=t.center=tl(r),t.timeStamp=H(),t.deltaTime=t.timeStamp-d.timeStamp,t.angle=td(v,g),t.distance=tf(v,g),a=t.center,s=e.offsetDelta||{},c=e.prevDelta||{},u=e.prevInput||{},(1===t.eventType||4===u.eventType)&&(c=e.prevDelta={x:u.deltaX||0,y:u.deltaY||0},s=e.offsetDelta={x:a.x,y:a.y}),t.deltaX=c.x+(a.x-s.x),t.deltaY=c.y+(a.y-s.y),t.offsetDirection=tp(t.deltaX,t.deltaY),t.overallVelocityX=(o=th(t.deltaTime,t.deltaX,t.deltaY)).x,t.overallVelocityY=o.y,t.overallVelocity=W(o.x)>W(o.y)?o.x:o.y,t.scale=i?(m=i.pointers,tf(r[0],r[1],ts)/tf(m[0],m[1],ts)):1,t.rotation=i?(b=i.pointers,td(r[1],r[0],ts)+td(b[1],b[0],ts)):0,t.maxPointers=e.prevInput?t.pointers.length>e.prevInput.maxPointers?t.pointers.length:e.prevInput.maxPointers:t.pointers.length,/**
                 * velocity is calculated every x ms
                 * @param {Object} session
                 * @param {Object} input
                 */function(a,t){var n,r,i,o,e=a.lastInterval||t,s=t.timeStamp-e.timeStamp;if(8!=t.eventType&&(s>25||e.velocity===h)){var c=t.deltaX-e.deltaX,u=t.deltaY-e.deltaY,l=th(s,c,u);r=l.x,i=l.y,n=W(l.x)>W(l.y)?l.x:l.y,o=tp(c,u),a.lastInterval=t}else // use latest velocity info if it doesn't overtake a minimum period
n=e.velocity,r=e.velocityX,i=e.velocityY,o=e.direction;t.velocity=n,t.velocityX=r,t.velocityY=i,t.direction=o}(e,t),l=n.element,G(t.srcEvent.target,l)&&(l=t.srcEvent.target),t.target=l,// emit secret event
n.emit("hammer.input",t),n.recognize(t),n.session.prevInput=t}/**
                 * create a simple clone from the input used for storage of firstInput and firstMultiple
                 * @param {Object} input
                 * @returns {Object} clonedInputData
                 */function tu(t){for(// make a simple copy of the pointers because we will get a reference if we don't
// we only need clientXY for the calculations
var e=[],n=0;n<t.pointers.length;)e[n]={clientX:q(t.pointers[n].clientX),clientY:q(t.pointers[n].clientY)},n++;return{timeStamp:H(),pointers:e,center:tl(e),deltaX:t.deltaX,deltaY:t.deltaY}}/**
                 * get the center of all the pointers
                 * @param {Array} pointers
                 * @return {Object} center contains `x` and `y` properties
                 */function tl(t){var e=t.length;// no need to loop when only one touch
if(1===e)return{x:q(t[0].clientX),y:q(t[0].clientY)};for(var n=0,r=0,i=0;i<e;)n+=t[i].clientX,r+=t[i].clientY,i++;return{x:q(n/e),y:q(r/e)}}/**
                 * calculate the velocity between two points. unit is in px per ms.
                 * @param {Number} deltaTime
                 * @param {Number} x
                 * @param {Number} y
                 * @return {Object} velocity `x` and `y`
                 */function th(t,e,n){return{x:e/t||0,y:n/t||0}}/**
                 * get the direction between two points
                 * @param {Number} x
                 * @param {Number} y
                 * @return {Number} direction
                 */function tp(t,e){return t===e?1:W(t)>=W(e)?t<0?2:4:e<0?8:16}/**
                 * calculate the absolute distance between two points
                 * @param {Object} p1 {x, y}
                 * @param {Object} p2 {x, y}
                 * @param {Array} [props] containing x and y keys
                 * @return {Number} distance
                 */function tf(e,n,t){t||(t=ta);var r=n[t[0]]-e[t[0]],i=n[t[1]]-e[t[1]];return Math.sqrt(r*r+i*i)}/**
                 * calculate the angle between two coordinates
                 * @param {Object} p1
                 * @param {Object} p2
                 * @param {Array} [props] containing x and y keys
                 * @return {Number} angle
                 */function td(e,n,t){t||(t=ta);var r=n[t[0]]-e[t[0]];return 180*Math.atan2(n[t[1]]-e[t[1]],r)/Math.PI}o.prototype={/**
                     * should handle the inputEvent data and trigger the callback
                     * @virtual
                     */handler:function(){},/**
                     * bind the events
                     */init:function(){this.evEl&&R(this.element,this.evEl,this.domHandler),this.evTarget&&R(this.target,this.evTarget,this.domHandler),this.evWin&&R(tr(this.element),this.evWin,this.domHandler)},/**
                     * unbind the events
                     */destroy:function(){this.evEl&&A(this.element,this.evEl,this.domHandler),this.evTarget&&A(this.target,this.evTarget,this.domHandler),this.evWin&&A(tr(this.element),this.evWin,this.domHandler)}};var tv={mousedown:1,mousemove:2,mouseup:4};/**
                 * Mouse events input
                 * @constructor
                 * @extends Input
                 */function w(){this.evEl="mousedown",this.evWin="mousemove mouseup",this.pressed=!1,o.apply(this,arguments)}i(w,o,{/**
                     * handle mouse events
                     * @param {Object} ev
                     */handler:function(t){var e=tv[t.type];// mouse must be down
1&e&&0===t.button&&(this.pressed=!0),2&e&&1!==t.which&&(e=4),this.pressed&&(4&e&&(this.pressed=!1),this.callback(this.manager,e,{pointers:[t],changedPointers:[t],pointerType:N,srcEvent:t}))}});var tg={pointerdown:1,pointermove:2,pointerup:4,pointercancel:8,pointerout:8},tm={2:L,3:"pen",4:N,5:"kinect"},z="pointerdown",F="pointermove pointerup pointercancel";/**
                 * Pointer events input
                 * @constructor
                 * @extends Input
                 */function O(){this.evEl=z,this.evWin=F,o.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}a.MSPointerEvent&&!a.PointerEvent&&(z="MSPointerDown",F="MSPointerMove MSPointerUp MSPointerCancel"),i(O,o,{/**
                     * handle mouse events
                     * @param {Object} ev
                     */handler:function(t){var e=this.store,i=!1,r=tg[t.type.toLowerCase().replace("ms","")],o=tm[t.pointerType]||t.pointerType,a=o==L,n=Q(e,t.pointerId,"pointerId");// it not found, so the pointer hasn't been down (so it's probably a hover)
1&r&&(0===t.button||a)?n<0&&(e.push(t),n=e.length-1):12&r&&(i=!0),!(n<0)&&(// update the event in the store
e[n]=t,this.callback(this.manager,r,{pointers:e,changedPointers:[t],pointerType:o,srcEvent:t}),i&&// remove from the store
e.splice(n,1))}});var tb={touchstart:1,touchmove:2,touchend:4,touchcancel:8};/**
                 * Touch events input
                 * @constructor
                 * @extends Input
                 */function E(){this.evTarget="touchstart",this.evWin="touchstart touchmove touchend touchcancel",this.started=!1,o.apply(this,arguments)}/**
                 * @this {TouchInput}
                 * @param {Object} ev
                 * @param {Number} type flag
                 * @returns {undefined|Array} [all, changed]
                 */function ty(e,r){var t=tt(e.touches),n=tt(e.changedTouches);return 12&r&&(t=te(t.concat(n),"identifier",!0)),[t,n]}i(E,o,{handler:function(t){var e=tb[t.type];if(1===e&&(this.started=!0),this.started){var n=ty.call(this,t,e);12&e&&n[0].length-n[1].length==0&&(this.started=!1),this.callback(this.manager,e,{pointers:n[0],changedPointers:n[1],pointerType:L,srcEvent:t})}}});var tw={touchstart:1,touchmove:2,touchend:4,touchcancel:8};/**
                 * Multi-user touch events input
                 * @constructor
                 * @extends Input
                 */function _(){this.evTarget="touchstart touchmove touchend touchcancel",this.targetIds={},o.apply(this,arguments)}/**
                 * @this {TouchInput}
                 * @param {Object} ev
                 * @param {Number} type flag
                 * @returns {undefined|Array} [all, changed]
                 */function tO(n,r){var t=tt(n.touches),o=this.targetIds;// when there is only one touch, the process can be simplified
if(3&r&&1===t.length)return o[t[0].identifier]=!0,[t,t];var a,i,s=tt(n.changedTouches),e=[],c=this.target;// collect touches
if(// get target touches from touches
i=t.filter(function(t){return G(t.target,c)}),1===r)for(a=0;a<i.length;)o[i[a].identifier]=!0,a++;for(// filter changed touches to only contain touches that exist in the collected target ids
a=0;a<s.length;)o[s[a].identifier]&&e.push(s[a]),12&r&&delete o[s[a].identifier],a++;if(e.length)return[// merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
te(i.concat(e),"identifier",!0),e]}function P(){o.apply(this,arguments);var t=C(this.handler,this);this.touch=new _(this.manager,t),this.mouse=new w(this.manager,t),this.primaryTouch=null,this.lastTouches=[]}function tE(e,t){1&e?(this.primaryTouch=t.changedPointers[0].identifier,t_.call(this,t)):12&e&&t_.call(this,t)}function t_(t){var e=t.changedPointers[0];if(e.identifier===this.primaryTouch){var n={x:e.clientX,y:e.clientY};this.lastTouches.push(n);var r=this.lastTouches;setTimeout(function(){var t=r.indexOf(n);t>-1&&r.splice(t,1)},2500)}}function tP(t){for(var e=t.srcEvent.clientX,n=t.srcEvent.clientY,r=0;r<this.lastTouches.length;r++){var i=this.lastTouches[r],o=Math.abs(e-i.x),a=Math.abs(n-i.y);if(o<=25&&a<=25)return!0}return!1}i(_,o,{handler:function(t){var n=tw[t.type],e=tO.call(this,t,n);e&&this.callback(this.manager,n,{pointers:e[0],changedPointers:e[1],pointerType:L,srcEvent:t})}}),i(P,o,{/**
                     * handle mouse and touch events
                     * @param {Hammer} manager
                     * @param {String} inputEvent
                     * @param {Object} inputData
                     */handler:function(n,r,t){var i=t.pointerType==L,e=t.pointerType==N;if(!e||!t.sourceCapabilities||!t.sourceCapabilities.firesTouchEvents){// when we're in a touch event, record touches to  de-dupe synthetic mouse event
if(i)tE.call(this,r,t);else if(e&&tP.call(this,t))return;this.callback(n,r,t)}},/**
                     * remove the event listeners
                     */destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var V=f(T.style,"touchAction"),tM=h!==V,Z="compute",tj="auto",tS="manipulation",tT="none",tk="pan-x",tx="pan-y",tD=function(){if(!tM)return!1;var t={},e=a.CSS&&a.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(n){// If css.supports is not supported but there is native touch-action assume it supports
// all values. This is the case for IE 10 and 11.
t[n]=!e||a.CSS.supports("touch-action",n)}),t}();/**
                 * Touch Action
                 * sets the touchAction property or uses the js alternative
                 * @param {Manager} manager
                 * @param {String} value
                 * @constructor
                 */function M(t,e){this.manager=t,this.set(e)}/**
                 * Recognizer
                 * Every recognizer needs to extend from this class.
                 * @constructor
                 * @param {Object} options
                 */function c(e){var t;this.options=p({},this.defaults,e||{}),this.id=tn++,this.manager=null,// default is enable true
this.options.enable=h===(t=this.options.enable)||t,this.state=1,this.simultaneous={},this.requireFail=[]}/**
                 * get a usable string, used as event postfix
                 * @param {Const} state
                 * @returns {String} state
                 */function tC(t){return 16&t?"cancel":8&t?"end":4&t?"move":2&t?"start":""}/**
                 * direction cons to string
                 * @param {Const} direction
                 * @returns {String}
                 */function tR(t){return 16==t?"down":8==t?"up":2==t?"left":4==t?"right":""}/**
                 * get a recognizer by name if it is bound to a manager
                 * @param {Recognizer|String} otherRecognizer
                 * @param {Recognizer} recognizer
                 * @returns {Recognizer}
                 */function tA(t,n){var e=n.manager;return e?e.get(t):t}/**
                 * This recognizer is just used as a base for the simple attribute recognizers.
                 * @constructor
                 * @extends Recognizer
                 */function s(){c.apply(this,arguments)}/**
                 * Pan
                 * Recognized when the pointer is down and moved in the allowed direction.
                 * @constructor
                 * @extends AttrRecognizer
                 */function d(){s.apply(this,arguments),this.pX=null,this.pY=null}/**
                 * Pinch
                 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
                 * @constructor
                 * @extends AttrRecognizer
                 */function v(){s.apply(this,arguments)}/**
                 * Press
                 * Recognized when the pointer is down for x ms without any movement.
                 * @constructor
                 * @extends Recognizer
                 */function g(){c.apply(this,arguments),this._timer=null,this._input=null}/**
                 * Rotate
                 * Recognized when two or more pointer are moving in a circular motion.
                 * @constructor
                 * @extends AttrRecognizer
                 */function m(){s.apply(this,arguments)}/**
                 * Swipe
                 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
                 * @constructor
                 * @extends AttrRecognizer
                 */function b(){s.apply(this,arguments)}/**
                 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
                 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
                 * a single tap.
                 *
                 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
                 * multi-taps being recognized.
                 * @constructor
                 * @extends Recognizer
                 */function u(){c.apply(this,arguments),// previous time and center,
// used for tap counting
this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}/**
                 * Simple way to create a manager with a default set of recognizers.
                 * @param {HTMLElement} element
                 * @param {Object} [options]
                 * @constructor
                 */function l(r,t){var e,n;return(t=t||{}).recognizers=(e=t.recognizers,n=l.defaults.preset,h===e?n:e),new j(r,t)}/**
                 * Manager
                 * @param {HTMLElement} element
                 * @param {Object} [options]
                 * @constructor
                 */function j(t,n){var e;this.options=p({},l.defaults,n||{}),this.options.inputTarget=this.options.inputTarget||t,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=t,this.input=new((e=this.options.inputClass)?e:ti?O:to?_:I?P:w)(this,tc),this.touchAction=new M(this,this.options.touchAction),tI(this,!0),k(this.options.recognizers,function(t){var e=this.add(new t[0](t[1]));t[2]&&e.recognizeWith(t[2]),t[3]&&e.requireFailure(t[3])},this)}/**
                 * add/remove the css properties as defined in manager.options.cssProps
                 * @param {Manager} manager
                 * @param {Boolean} add
                 */function tI(t,e){var r,n=t.element;n.style&&(k(t.options.cssProps,function(i,o){r=f(n.style,o),e?(t.oldCssProps[r]=n.style[r],n.style[r]=i):n.style[r]=t.oldCssProps[r]||""}),e||(t.oldCssProps={}))}M.prototype={/**
                     * set the touchAction value on the element or enable the polyfill
                     * @param {String} value
                     */set:function(t){t==Z&&(t=this.compute()),tM&&this.manager.element.style&&tD[t]&&(this.manager.element.style[V]=t),this.actions=t.toLowerCase().trim()},/**
                     * just re-set the touchAction value
                     */update:function(){this.set(this.manager.options.touchAction)},/**
                     * compute the value for the touchAction property based on the recognizer's settings
                     * @returns {String} value
                     */compute:function(){var t=[];return k(this.manager.recognizers,function(e){K(e.options.enable,[e])&&(t=t.concat(e.getTouchAction()))}),/**
                 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
                 * @param {String} actions
                 * @returns {*}
                 */function(t){// none
if($(t,tT))return tT;var e=$(t,tk),n=$(t,tx);return(// if both pan-x and pan-y are set (different recognizers
// for different directions, e.g. horizontal pan but vertical swipe?)
// we need none (as otherwise with pan-x pan-y combined none of these
// recognizers will work, since the browser would handle all panning
e&&n?tT:e||n?e?tk:tx:$(t,tS)?tS:tj)}(t.join(" "))},/**
                     * this method is called on each input cycle and provides the preventing of the browser behavior
                     * @param {Object} input
                     */preventDefaults:function(e){var a=e.srcEvent,n=e.offsetDirection;// if the touch action did prevented once this session
if(this.manager.session.prevented){a.preventDefault();return}var t=this.actions,r=$(t,tT)&&!tD[tT],i=$(t,tx)&&!tD[tx],o=$(t,tk)&&!tD[tk];if(r){//do not prevent defaults if this is a tap gesture
var s=1===e.pointers.length,c=e.distance<2,u=e.deltaTime<250;if(s&&c&&u)return}if((!o||!i)&&(r||i&&6&n||o&&24&n))return this.preventSrc(a)},/**
                     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
                     * @param {Object} srcEvent
                     */preventSrc:function(t){this.manager.session.prevented=!0,t.preventDefault()}},c.prototype={/**
                     * @virtual
                     * @type {Object}
                     */defaults:{},/**
                     * set options
                     * @param {Object} options
                     * @return {Recognizer}
                     */set:function(t){return p(this.options,t),// also update the touchAction, in case something changed about the directions/enabled state
this.manager&&this.manager.touchAction.update(),this},/**
                     * recognize simultaneous with an other recognizer.
                     * @param {Recognizer} otherRecognizer
                     * @returns {Recognizer} this
                     */recognizeWith:function(t){if(Y(t,"recognizeWith",this))return this;var e=this.simultaneous;return e[(t=tA(t,this)).id]||(e[t.id]=t,t.recognizeWith(this)),this},/**
                     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
                     * @param {Recognizer} otherRecognizer
                     * @returns {Recognizer} this
                     */dropRecognizeWith:function(t){return Y(t,"dropRecognizeWith",this)||(t=tA(t,this),delete this.simultaneous[t.id]),this},/**
                     * recognizer can only run when an other is failing
                     * @param {Recognizer} otherRecognizer
                     * @returns {Recognizer} this
                     */requireFailure:function(t){if(Y(t,"requireFailure",this))return this;var e=this.requireFail;return -1===Q(e,t=tA(t,this))&&(e.push(t),t.requireFailure(this)),this},/**
                     * drop the requireFailure link. it does not remove the link on the other recognizer.
                     * @param {Recognizer} otherRecognizer
                     * @returns {Recognizer} this
                     */dropRequireFailure:function(t){if(Y(t,"dropRequireFailure",this))return this;t=tA(t,this);var e=Q(this.requireFail,t);return e>-1&&this.requireFail.splice(e,1),this},/**
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
                     */emit:function(r){var n=this,t=this.state;function e(t){n.manager.emit(t,r)}t<8&&e(n.options.event+tC(t)),e(n.options.event),r.additionalEvent&&// additional event(panleft, panright, pinchin, pinchout...)
e(r.additionalEvent),t>=8&&e(n.options.event+tC(t))},/**
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
                     */recognize:function(e){// make a new copy of the inputData
// so we can change the inputData without messing up the other recognizers
var t=p({},e);// is is enabled and allow recognizing?
if(!K(this.options.enable,[this,t])){this.reset(),this.state=32;return}56&this.state&&(this.state=1),this.state=this.process(t),30&this.state&&this.tryEmit(t)},/**
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
                     */reset:function(){}},i(s,c,{/**
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
                     */attrTest:function(e){var t=this.options.pointers;return 0===t||e.pointers.length===t},/**
                     * Process the input and return the state for the recognizer
                     * @memberof AttrRecognizer
                     * @param {Object} input
                     * @returns {*} State
                     */process:function(e){var t=this.state,n=e.eventType,r=6&t,i=this.attrTest(e);return(// on cancel input and we've recognized before, return STATE_CANCELLED
r&&(8&n||!i)?16|t:r||i?4&n?8|t:2&t?4|t:2:32)}}),i(d,s,{/**
                     * @namespace
                     * @memberof PanRecognizer
                     */defaults:{event:"pan",threshold:10,pointers:1,direction:30},getTouchAction:function(){var e=this.options.direction,t=[];return 6&e&&t.push(tx),24&e&&t.push(tk),t},directionTest:function(t){var n=this.options,r=!0,i=t.distance,e=t.direction,o=t.deltaX,a=t.deltaY;return e&n.direction||(6&n.direction?(e=0===o?1:o<0?2:4,r=o!=this.pX,i=Math.abs(t.deltaX)):(e=0===a?1:a<0?8:16,r=a!=this.pY,i=Math.abs(t.deltaY))),t.direction=e,r&&i>n.threshold&&e&n.direction},attrTest:function(t){return s.prototype.attrTest.call(this,t)&&(2&this.state||!(2&this.state)&&this.directionTest(t))},emit:function(t){this.pX=t.deltaX,this.pY=t.deltaY;var e=tR(t.direction);e&&(t.additionalEvent=this.options.event+e),this._super.emit.call(this,t)}}),i(v,s,{/**
                     * @namespace
                     * @memberof PinchRecognizer
                     */defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[tT]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.scale-1)>this.options.threshold||2&this.state)},emit:function(t){if(1!==t.scale){var e=t.scale<1?"in":"out";t.additionalEvent=this.options.event+e}this._super.emit.call(this,t)}}),i(g,c,{/**
                     * @namespace
                     * @memberof PressRecognizer
                     */defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[tj]},process:function(t){var e=this.options,n=t.pointers.length===e.pointers,r=t.distance<e.threshold,i=t.deltaTime>e.time;// we only allow little movement
// and we've reached an end event, so a tap is possible
if(this._input=t,r&&n&&(!(12&t.eventType)||i)){if(1&t.eventType)this.reset(),this._timer=X(function(){this.state=8,this.tryEmit()},e.time,this);else if(4&t.eventType)return 8}else this.reset();return 32},reset:function(){clearTimeout(this._timer)},emit:function(t){8===this.state&&(t&&4&t.eventType?this.manager.emit(this.options.event+"up",t):(this._input.timeStamp=H(),this.manager.emit(this.options.event,this._input)))}}),i(m,s,{/**
                     * @namespace
                     * @memberof RotateRecognizer
                     */defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[tT]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.rotation)>this.options.threshold||2&this.state)}}),i(b,s,{/**
                     * @namespace
                     * @memberof SwipeRecognizer
                     */defaults:{event:"swipe",threshold:10,velocity:.3,direction:30,pointers:1},getTouchAction:function(){return d.prototype.getTouchAction.call(this)},attrTest:function(t){var e,n=this.options.direction;return 30&n?e=t.overallVelocity:6&n?e=t.overallVelocityX:24&n&&(e=t.overallVelocityY),this._super.attrTest.call(this,t)&&n&t.offsetDirection&&t.distance>this.options.threshold&&t.maxPointers==this.options.pointers&&W(e)>this.options.velocity&&4&t.eventType},emit:function(t){var e=tR(t.offsetDirection);e&&this.manager.emit(this.options.event+e,t),this.manager.emit(this.options.event,t)}}),i(u,c,{/**
                     * @namespace
                     * @memberof PinchRecognizer
                     */defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[tS]},process:function(t){var e=this.options,n=t.pointers.length===e.pointers,r=t.distance<e.threshold,i=t.deltaTime<e.time;if(this.reset(),1&t.eventType&&0===this.count)return this.failTimeout();// we only allow little movement
// and we've reached an end event, so a tap is possible
if(r&&i&&n){if(4!=t.eventType)return this.failTimeout();var o=!this.pTime||t.timeStamp-this.pTime<e.interval,a=!this.pCenter||tf(this.pCenter,t.center)<e.posThreshold;if(this.pTime=t.timeStamp,this.pCenter=t.center,a&&o?this.count+=1:this.count=1,this._input=t,0==this.count%e.taps)return(// no failing requirements, immediately trigger the tap event
// or wait as long as the multitap interval to trigger
this.hasRequireFailures()?(this._timer=X(function(){this.state=8,this.tryEmit()},e.interval,this),2):8)}return 32},failTimeout:function(){return this._timer=X(function(){this.state=32},this.options.interval,this),32},reset:function(){clearTimeout(this._timer)},emit:function(){8==this.state&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),/**
                 * @const {string}
                 */l.VERSION="2.0.7",/**
                 * default settings
                 * @namespace
                 */l.defaults={/**
                     * set if DOM events are being triggered.
                     * But this is slower and unused by simple implementations, so disabled by default.
                     * @type {Boolean}
                     * @default false
                     */domEvents:!1,/**
                     * The value for the touchAction property/fallback.
                     * When set to `compute` it will magically set the correct value based on the added recognizers.
                     * @type {String}
                     * @default compute
                     */touchAction:Z,/**
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
[m,{enable:!1}],[v,{enable:!1},["rotate"]],[b,{direction:6}],[d,{direction:6},["swipe"]],[u],[u,{event:"doubletap",taps:2},["tap"]],[g]],/**
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
                         */tapHighlightColor:"rgba(0,0,0,0)"}},j.prototype={/**
                     * set options
                     * @param {Object} options
                     * @returns {Manager}
                     */set:function(t){return p(this.options,t),t.touchAction&&this.touchAction.update(),t.inputTarget&&(// Clean up existing event listeners and reinitialize
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
                     */recognize:function(e){var n,t=this.session;if(!t.stopped){// run the touch-action polyfill
this.touchAction.preventDefaults(e);var r=this.recognizers,i=t.curRecognizer;// reset when the last recognizer is recognized
// or when we're in a new session
(!i||i&&8&i.state)&&(i=t.curRecognizer=null);for(var o=0;o<r.length;)n=r[o],2!==t.stopped&&// 1
(!i||n==i||// 2
n.canRecognizeWith(i))?// 3
n.recognize(e):n.reset(),!i&&14&n.state&&(i=t.curRecognizer=n),o++}},/**
                     * get a recognizer by its event name.
                     * @param {Recognizer|String} recognizer
                     * @returns {Recognizer|Null}
                     */get:function(t){if(t instanceof c)return t;for(var e=this.recognizers,n=0;n<e.length;n++)if(e[n].options.event==t)return e[n];return null},/**
                     * add a recognizer to the manager
                     * existing recognizers with the same event name will be removed
                     * @param {Recognizer} recognizer
                     * @returns {Recognizer|Manager}
                     */add:function(t){if(Y(t,"add",this))return this;// remove existing
var e=this.get(t.options.event);return e&&this.remove(e),this.recognizers.push(t),t.manager=this,this.touchAction.update(),t},/**
                     * remove a recognizer by name or instance
                     * @param {Recognizer|String} recognizer
                     * @returns {Manager}
                     */remove:function(t){if(Y(t,"remove",this))return this;// let's make sure this recognizer exists
if(t=this.get(t)){var e=this.recognizers,n=Q(e,t);-1!==n&&(e.splice(n,1),this.touchAction.update())}return this},/**
                     * bind event
                     * @param {String} events
                     * @param {Function} handler
                     * @returns {EventEmitter} this
                     */on:function(t,e){if(h!==t&&h!==e){var n=this.handlers;return k(J(t),function(t){n[t]=n[t]||[],n[t].push(e)}),this}},/**
                     * unbind event, leave emit blank to remove all handlers
                     * @param {String} events
                     * @param {Function} [handler]
                     * @returns {EventEmitter} this
                     */off:function(t,e){if(h!==t){var n=this.handlers;return k(J(t),function(t){e?n[t]&&n[t].splice(Q(n[t],e),1):delete n[t]}),this}},/**
                     * emit event to the listeners
                     * @param {String} event
                     * @param {Object} data
                     */emit:function(t,n){this.options.domEvents&&((e=S.createEvent("Event")).initEvent(t,!0,!0),e.gesture=n,n.target.dispatchEvent(e));// no handlers, so skip it all
var e,r=this.handlers[t]&&this.handlers[t].slice();if(r&&r.length){n.type=t,n.preventDefault=function(){n.srcEvent.preventDefault()};for(var i=0;i<r.length;)r[i](n),i++}},/**
                     * destroy the manager and unbinds all events
                     * it doesn't unbind dom events, that is the user own responsibility
                     */destroy:function(){this.element&&tI(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},p(l,{INPUT_START:1,INPUT_MOVE:2,INPUT_END:4,INPUT_CANCEL:8,STATE_POSSIBLE:1,STATE_BEGAN:2,STATE_CHANGED:4,STATE_ENDED:8,STATE_RECOGNIZED:8,STATE_CANCELLED:16,STATE_FAILED:32,DIRECTION_NONE:1,DIRECTION_LEFT:2,DIRECTION_RIGHT:4,DIRECTION_UP:8,DIRECTION_DOWN:16,DIRECTION_HORIZONTAL:6,DIRECTION_VERTICAL:24,DIRECTION_ALL:30,Manager:j,Input:o,TouchAction:M,TouchInput:_,MouseInput:w,PointerEventInput:O,TouchMouseInput:P,SingleTouchInput:E,Recognizer:c,AttrRecognizer:s,Tap:u,Pan:d,Swipe:b,Pinch:v,Rotate:m,Press:g,on:R,off:A,each:k,merge:D,extend:x,assign:p,inherit:i,bindFn:C,prefixed:f}),(void 0!==a?a:"undefined"!=typeof self?self:{}).Hammer=l,h!==(r=(function(){return l}).call(e,n,e,t))&&(t.exports=r)}(window,document,0);/***/},/***/3454:/***/function(r,i,t){"use strict";var e,n;r.exports=(null===(e=t.g.process)||void 0===e?void 0:e.env)&&"object"==typeof(null===(n=t.g.process)||void 0===n?void 0:n.env)?t.g.process:t(7663);//# sourceMappingURL=process.js.map
/***/},/***/7663:/***/function(t){!function(){var n={162:function(n){var i,o,a,t=n.exports={};function s(){throw Error("setTimeout has not been defined")}function c(){throw Error("clearTimeout has not been defined")}function u(t){if(i===setTimeout)return setTimeout(t,0);if((i===s||!i)&&setTimeout)return i=setTimeout,setTimeout(t,0);try{return i(t,0)}catch(e){try{return i.call(null,t,0)}catch(e){return i.call(this,t,0)}}}!function(){try{i="function"==typeof setTimeout?setTimeout:s}catch(t){i=s}try{o="function"==typeof clearTimeout?clearTimeout:c}catch(t){o=c}}();var l=[],h=!1,p=-1;function f(){h&&a&&(h=!1,a.length?l=a.concat(l):p=-1,l.length&&d())}function d(){if(!h){var t=u(f);h=!0;for(var e=l.length;e;){for(a=l,l=[];++p<e;)a&&a[p].run();p=-1,e=l.length}a=null,h=!1,function(t){if(o===clearTimeout)return clearTimeout(t);if((o===c||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(t);try{o(t)}catch(e){try{return o.call(null,t)}catch(e){return o.call(this,t)}}}(t)}}function r(t,e){this.fun=t,this.array=e}function e(){}t.nextTick=function(t){var e=Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];l.push(new r(t,e)),1!==l.length||h||u(d)},r.prototype.run=function(){this.fun.apply(null,this.array)},t.title="browser",t.browser=!0,t.env={},t.argv=[],t.version="",t.versions={},t.on=e,t.addListener=e,t.once=e,t.off=e,t.removeListener=e,t.removeAllListeners=e,t.emit=e,t.prependListener=e,t.prependOnceListener=e,t.listeners=function(t){return[]},t.binding=function(t){throw Error("process.binding is not supported")},t.cwd=function(){return"/"},t.chdir=function(t){throw Error("process.chdir is not supported")},t.umask=function(){return 0}}},r={};function e(t){var i=r[t];if(void 0!==i)return i.exports;var o=r[t]={exports:{}},a=!0;try{n[t](o,o.exports,e),a=!1}finally{a&&delete r[t]}return o.exports}e.ab="//",t.exports=e(162)}();/***/},/***/2703:/***/function(t,i,e){"use strict";/**
             * Copyright (c) 2013-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */var o=e(414);function n(){}function r(){}r.resetWarningCache=n,t.exports=function(){function t(e,n,r,i,a,t){if(t!==o){var s=Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function e(){return t}t.isRequired=t;// Important!
// Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
var i={array:t,bigint:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:r,resetWarningCache:n};return i.PropTypes=i,i};/***/},/***/5697:/***/function(t,n,e){// By explicitly using `prop-types` you are opting into new production behavior.
// http://fb.me/prop-types-in-prod
t.exports=e(2703)();/***/},/***/414:/***/function(t){"use strict";t.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";/***/},/***/6785:/***/function(tm,z,e){"use strict";// UNUSED EXPORTS: AttributionControl, BaseControl, CanvasOverlay, FlyToInterpolator, FullscreenControl, GeolocateControl, HTMLOverlay, InteractiveMap, Layer, LinearInterpolator, MapContext, MapController, Marker, NavigationControl, Popup, SVGOverlay, ScaleControl, Source, StaticMap, TRANSITION_EVENTS, TransitionInterpolator, WebMercatorViewport, _MapContext, _useMapControl, setRTLTextPlugin
function tb(){return(tb=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function ty(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js
function tw(t,e){if(t){if("string"==typeof t)return ty(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);if("Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return ty(t,e)}}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}// EXPORTS
e.d(z,{ZP:function(){return /* reexport */nI}});// EXTERNAL MODULE: ./node_modules/react/index.js
var l,d,h,tO,n=e(7294),t=e(5697);function tE(t,e){return function(t){if(Array.isArray(t))return t}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
(t)||function(t,n){var r,i,e=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=e){var o=[],a=!0,s=!1;try{for(e=e.call(t);!(a=(r=e.next()).done)&&(o.push(r.value),!n||o.length!==n);a=!0);}catch(t){s=!0,i=t}finally{try{a||null==e.return||e.return()}finally{if(s)throw i}}return o}}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
(t,e)||tw(t,e)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js
()}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/node_modules/gl-matrix/esm/common.js
var s="undefined"!=typeof Float32Array?Float32Array:Array;function t_(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}function tP(t,c){var n,r,i,o,a,s;const e=(n=[],r=c[0],i=c[1],o=c[2],a=c[3],n[0]=t[0]*r+t[4]*i+t[8]*o+t[12]*a,n[1]=t[1]*r+t[5]*i+t[9]*o+t[13]*a,n[2]=t[2]*r+t[6]*i+t[10]*o+t[14]*a,n[3]=t[3]*r+t[7]*i+t[11]*o+t[15]*a,n);return s=1/e[3],e[0]=e[0]*s,e[1]=e[1]*s,e[2]=e[2]*s,e[3]=e[3]*s,e}function tM(n,e){const t=n%e;return t<0?e+t:t}Math.hypot||(Math.hypot=function(){for(var t=0,e=arguments.length;e--;)t+=arguments[e]*arguments[e];return Math.sqrt(t)}),l=new s(4),s!=Float32Array&&(l[0]=0,l[1]=0,l[2]=0,l[3]=0);const tj=Math.log2||function(t){return Math.log(t)*Math.LOG2E};// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/node_modules/gl-matrix/esm/mat4.js
/**
             * Multiplies two mat4s
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the first operand
             * @param {ReadonlyMat4} b the second operand
             * @returns {mat4} out
             */function tS(i,o,a){var s=o[0],c=o[1],u=o[2],l=o[3],h=o[4],p=o[5],f=o[6],d=o[7],v=o[8],g=o[9],m=o[10],b=o[11],y=o[12],w=o[13],O=o[14],E=o[15],t=a[0],e=a[1],n=a[2],r=a[3];return i[0]=t*s+e*h+n*v+r*y,i[1]=t*c+e*p+n*g+r*w,i[2]=t*u+e*f+n*m+r*O,i[3]=t*l+e*d+n*b+r*E,t=a[4],e=a[5],n=a[6],r=a[7],i[4]=t*s+e*h+n*v+r*y,i[5]=t*c+e*p+n*g+r*w,i[6]=t*u+e*f+n*m+r*O,i[7]=t*l+e*d+n*b+r*E,t=a[8],e=a[9],n=a[10],r=a[11],i[8]=t*s+e*h+n*v+r*y,i[9]=t*c+e*p+n*g+r*w,i[10]=t*u+e*f+n*m+r*O,i[11]=t*l+e*d+n*b+r*E,t=a[12],e=a[13],n=a[14],r=a[15],i[12]=t*s+e*h+n*v+r*y,i[13]=t*c+e*p+n*g+r*w,i[14]=t*u+e*f+n*m+r*O,i[15]=t*l+e*d+n*b+r*E,i}/**
             * Translate a mat4 by the given vector
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the matrix to translate
             * @param {ReadonlyVec3} v vector to translate by
             * @returns {mat4} out
             */function tT(e,t,o){var a,s,c,u,l,h,p,f,d,v,g,m,n=o[0],r=o[1],i=o[2];return t===e?(e[12]=t[0]*n+t[4]*r+t[8]*i+t[12],e[13]=t[1]*n+t[5]*r+t[9]*i+t[13],e[14]=t[2]*n+t[6]*r+t[10]*i+t[14],e[15]=t[3]*n+t[7]*r+t[11]*i+t[15]):(a=t[0],s=t[1],c=t[2],u=t[3],l=t[4],h=t[5],p=t[6],f=t[7],d=t[8],v=t[9],g=t[10],m=t[11],e[0]=a,e[1]=s,e[2]=c,e[3]=u,e[4]=l,e[5]=h,e[6]=p,e[7]=f,e[8]=d,e[9]=v,e[10]=g,e[11]=m,e[12]=a*n+l*r+d*i+t[12],e[13]=s*n+h*r+v*i+t[13],e[14]=c*n+p*r+g*i+t[14],e[15]=u*n+f*r+m*i+t[15]),e}/**
             * Scales the mat4 by the dimensions in the given vec3 not using vectorization
             *
             * @param {mat4} out the receiving matrix
             * @param {ReadonlyMat4} a the matrix to scale
             * @param {ReadonlyVec3} v the vec3 to scale the matrix by
             * @returns {mat4} out
             **/function tk(t,e,o){var n=o[0],r=o[1],i=o[2];return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*r,t[5]=e[5]*r,t[6]=e[6]*r,t[7]=e[7]*r,t[8]=e[8]*i,t[9]=e[9]*i,t[10]=e[10]*i,t[11]=e[11]*i,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}/**
             * Returns whether or not the matrices have approximately the same elements in the same position.
             *
             * @param {ReadonlyMat4} a The first matrix.
             * @param {ReadonlyMat4} b The second matrix.
             * @returns {Boolean} True if the matrices are equal, false otherwise.
             */function tx(t,e){var n=t[0],r=t[1],i=t[2],o=t[3],a=t[4],s=t[5],c=t[6],u=t[7],l=t[8],h=t[9],p=t[10],f=t[11],d=t[12],v=t[13],g=t[14],m=t[15],b=e[0],y=e[1],w=e[2],O=e[3],E=e[4],_=e[5],P=e[6],M=e[7],j=e[8],S=e[9],T=e[10],k=e[11],x=e[12],D=e[13],C=e[14],R=e[15];return Math.abs(n-b)<=1e-6*Math.max(1,Math.abs(n),Math.abs(b))&&Math.abs(r-y)<=1e-6*Math.max(1,Math.abs(r),Math.abs(y))&&Math.abs(i-w)<=1e-6*Math.max(1,Math.abs(i),Math.abs(w))&&Math.abs(o-O)<=1e-6*Math.max(1,Math.abs(o),Math.abs(O))&&Math.abs(a-E)<=1e-6*Math.max(1,Math.abs(a),Math.abs(E))&&Math.abs(s-_)<=1e-6*Math.max(1,Math.abs(s),Math.abs(_))&&Math.abs(c-P)<=1e-6*Math.max(1,Math.abs(c),Math.abs(P))&&Math.abs(u-M)<=1e-6*Math.max(1,Math.abs(u),Math.abs(M))&&Math.abs(l-j)<=1e-6*Math.max(1,Math.abs(l),Math.abs(j))&&Math.abs(h-S)<=1e-6*Math.max(1,Math.abs(h),Math.abs(S))&&Math.abs(p-T)<=1e-6*Math.max(1,Math.abs(p),Math.abs(T))&&Math.abs(f-k)<=1e-6*Math.max(1,Math.abs(f),Math.abs(k))&&Math.abs(d-x)<=1e-6*Math.max(1,Math.abs(d),Math.abs(x))&&Math.abs(v-D)<=1e-6*Math.max(1,Math.abs(v),Math.abs(D))&&Math.abs(g-C)<=1e-6*Math.max(1,Math.abs(g),Math.abs(C))&&Math.abs(m-R)<=1e-6*Math.max(1,Math.abs(m),Math.abs(R))}/**
             * Adds two vec2's
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @returns {vec2} out
             */function tD(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t}/**
             * Performs a linear interpolation between two vec2's
             *
             * @param {vec2} out the receiving vector
             * @param {ReadonlyVec2} a the first operand
             * @param {ReadonlyVec2} b the second operand
             * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
             * @returns {vec2} out
             */function tC(t,e,n,r){var i=e[0],o=e[1];return t[0]=i+r*(n[0]-i),t[1]=o+r*(n[1]-o),t}function tR(t,e){if(!t)throw Error(e||"@math.gl/web-mercator: assertion failed.")}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/web-mercator-utils.js
d=new s(2),s!=Float32Array&&(d[0]=0,d[1]=0),h=new s(3),s!=Float32Array&&(h[0]=0,h[1]=0,h[2]=0);//# sourceMappingURL=assert.js.map
const v=Math.PI,tA=v/4,tI=v/180,tL=180/v;function tN(t){return Math.pow(2,t)}function tz([e,t]){tR(Number.isFinite(e)),tR(Number.isFinite(t)&&t>=-90&&t<=90,"invalid latitude");const n=512*(v+Math.log(Math.tan(tA+t*tI*.5)))/(2*v);return[512*(e*tI+v)/(2*v),n]}function tF([t,e]){const n=2*(Math.atan(Math.exp(e/512*(2*v)-v))-tA);return[(t/512*(2*v)-v)*tL,n*tL]}function tV(t){return 2*Math.atan(.5/t)*tL}function tZ(t){return .5/Math.tan(.5*t*tI)}function F(c,n,u=0){const[t,e,i]=c;if(tR(Number.isFinite(t)&&Number.isFinite(e),"invalid pixel coordinate"),Number.isFinite(i))return tP(n,[t,e,i,1]);const o=tP(n,[t,e,0,1]),a=tP(n,[t,e,1,1]),r=o[2],s=a[2];return tC([],o,a,r===s?0:((u||0)-r)/(s-r))}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/fit-bounds.js
//# sourceMappingURL=fit-bounds.js.map
const tB=Math.PI/180;function tU(t,n,r){const{pixelUnprojectionMatrix:i}=t,e=tP(i,[n,0,1,1]),o=tP(i,[n,t.height,1,1]),s=(r*t.distanceScales.unitsPerMeter[2]-e[2])/(o[2]-e[2]),a=tF(tC([],e,o,s));return a[2]=r,a}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/web-mercator-viewport.js
//# sourceMappingURL=get-bounds.js.map
class tq{constructor({width:r,height:n,latitude:i=0,longitude:o=0,zoom:c=0,pitch:a=0,bearing:u=0,altitude:t=null,fovy:e=null,position:l=null,nearZMultiplier:p=.02,farZMultiplier:f=1.01}={width:1,height:1}){r=r||1,n=n||1,null===e&&null===t?e=tV(t=1.5):null===e?e=tV(t):null===t&&(t=tZ(e));const h=tN(c);t=Math.max(.75,t);const d=function({latitude:n,longitude:a,highPrecision:s=!1}){tR(Number.isFinite(n)&&Number.isFinite(a));const e={},r=Math.cos(n*tI),i=512/360,o=512/360/r,t=512/4003e4/r;if(e.unitsPerMeter=[t,t,t],e.metersPerUnit=[1/t,1/t,1/t],e.unitsPerDegree=[i,o,t],e.degreesPerUnit=[1/i,1/o,1/t],s){const a=tI*Math.tan(n*tI)/r,s=512/4003e4*a,c=s/o*t;e.unitsPerDegree2=[0,i*a/2,s],e.unitsPerMeter2=[c,0,c]}return e}({longitude:o,latitude:i}),s=tz([o,i]);if(s[2]=0,l){var v,g;v=[],g=d.unitsPerMeter,v[0]=l[0]*g[0],v[1]=l[1]*g[1],v[2]=l[2]*g[2],s[0]=s[0]+v[0],s[1]=s[1]+v[1],s[2]=s[2]+v[2]}this.projectionMatrix=function({width:o,height:a,pitch:s,altitude:c,fovy:u,nearZMultiplier:l,farZMultiplier:h}){var t,r,i;const{fov:p,aspect:f,near:n,far:e}=function({width:o,height:a,fovy:t=tV(1.5),altitude:r,pitch:s=0,nearZMultiplier:c=1,farZMultiplier:u=1}){void 0!==r&&(t=tV(r));const e=.5*t*tI,n=tZ(t),i=s*tI,l=Math.sin(e)*n/Math.sin(Math.min(Math.max(Math.PI/2-i-e,.01),Math.PI-.01)),h=Math.sin(i)*l+n;return{fov:2*e,aspect:o/a,focalDistance:n,near:c,far:h*u}}({width:o,height:a,altitude:c,fovy:u,pitch:s,nearZMultiplier:l,farZMultiplier:h});return t=[],i=1/Math.tan(p/2),t[0]=i/f,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=i,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,null!=e&&e!==1/0?(r=1/(n-e),t[10]=(e+n)*r,t[14]=2*e*n*r):(t[10]=-1,t[14]=-2*n),t}({width:r,height:n,pitch:a,fovy:e,nearZMultiplier:p,farZMultiplier:f}),this.viewMatrix=function({height:j,pitch:S,bearing:T,altitude:k,scale:s,center:o=null}){var P,e,n,c,u,l,h,p,f,d,v,M,r,i,g,m,b,y,w,O,E,_,a;const t=t_();return tT(t,t,[0,0,-k]),e=Math.sin(P=-S*tI),n=Math.cos(P),c=t[4],u=t[5],l=t[6],h=t[7],p=t[8],f=t[9],d=t[10],v=t[11],t!=t&&(// If the source and destination differ, copy the unchanged rows
t[0]=t[0],t[1]=t[1],t[2]=t[2],t[3]=t[3],t[12]=t[12],t[13]=t[13],t[14]=t[14],t[15]=t[15]),t[4]=c*n+p*e,t[5]=u*n+f*e,t[6]=l*n+d*e,t[7]=h*n+v*e,t[8]=p*n-c*e,t[9]=f*n-u*e,t[10]=d*n-l*e,t[11]=v*n-h*e,r=Math.sin(M=T*tI),i=Math.cos(M),g=t[0],m=t[1],b=t[2],y=t[3],w=t[4],O=t[5],E=t[6],_=t[7],t!=t&&(// If the source and destination differ, copy the unchanged last row
t[8]=t[8],t[9]=t[9],t[10]=t[10],t[11]=t[11],t[12]=t[12],t[13]=t[13],t[14]=t[14],t[15]=t[15]),t[0]=g*i+w*r,t[1]=m*i+O*r,t[2]=b*i+E*r,t[3]=y*i+_*r,t[4]=w*i-g*r,t[5]=O*i-m*r,t[6]=E*i-b*r,t[7]=_*i-y*r,tk(t,t,[s/=j,s,s]),o&&tT(t,t,((a=[])[0]=-o[0],a[1]=-o[1],a[2]=-o[2],a)),t}({height:n,scale:h,center:s,pitch:a,bearing:u,altitude:t}),this.width=r,this.height=n,this.scale=h,this.latitude=i,this.longitude=o,this.zoom=c,this.pitch=a,this.bearing=u,this.altitude=t,this.fovy=e,this.center=s,this.meterOffset=l||[0,0,0],this.distanceScales=d,this._initMatrices(),this.equals=this.equals.bind(this),this.project=this.project.bind(this),this.unproject=this.unproject.bind(this),this.projectPosition=this.projectPosition.bind(this),this.unprojectPosition=this.unprojectPosition.bind(this),Object.freeze(this)}_initMatrices(){var n,r,i,o,a,s,c,u,l,h,p,f,d,v,g,m,b,y,w,O,E,_,P,M,j,S,T,k,D,e;const{width:R,height:A,projectionMatrix:I,viewMatrix:L}=this,x=t_();tS(x,x,I),tS(x,x,L),this.viewProjectionMatrix=x;const t=t_();tk(t,t,[R/2,-A/2,1]),tT(t,t,[1,-1,0]),tS(t,t,x);const C=(n=t_(),r=t[0],i=t[1],o=t[2],a=t[3],s=t[4],c=t[5],u=t[6],l=t[7],h=t[8],p=t[9],f=t[10],d=t[11],v=t[12],g=t[13],m=t[14],b=t[15],y=r*c-i*s,w=r*u-o*s,O=r*l-a*s,E=i*u-o*c,_=i*l-a*c,P=o*l-a*u,M=h*g-p*v,j=h*m-f*v,S=h*b-d*v,T=p*m-f*g,k=p*b-d*g,(e=y*(D=f*b-d*m)-w*k+O*T+E*S-_*j+P*M)?(e=1/e,n[0]=(c*D-u*k+l*T)*e,n[1]=(o*k-i*D-a*T)*e,n[2]=(g*P-m*_+b*E)*e,n[3]=(f*_-p*P-d*E)*e,n[4]=(u*S-s*D-l*j)*e,n[5]=(r*D-o*S+a*j)*e,n[6]=(m*O-v*P-b*w)*e,n[7]=(h*P-f*O+d*w)*e,n[8]=(s*k-c*S+l*M)*e,n[9]=(i*S-r*k-a*M)*e,n[10]=(v*_-g*O+b*y)*e,n[11]=(p*O-h*_-d*y)*e,n[12]=(c*j-s*T-u*M)*e,n[13]=(r*T-i*j+o*M)*e,n[14]=(g*w-v*E-m*y)*e,n[15]=(h*E-p*w+f*y)*e,n):null);if(!C)throw Error("Pixel project matrix not invertible");this.pixelProjectionMatrix=t,this.pixelUnprojectionMatrix=C}equals(t){return t instanceof tq&&t.width===this.width&&t.height===this.height&&tx(t.projectionMatrix,this.projectionMatrix)&&tx(t.viewMatrix,this.viewMatrix)}project(t,{topLeft:o=!0}={}){const e=function(r,i){const[t,e,n=0]=r;return tR(Number.isFinite(t)&&Number.isFinite(e)&&Number.isFinite(n)),tP(i,[t,e,n,1])}(this.projectPosition(t),this.pixelProjectionMatrix),[n,r]=e,i=o?r:this.height-r;return 2===t.length?[n,i]:[n,i,e[2]]}unproject(o,{topLeft:a=!0,targetZ:t}={}){const[s,r,i]=o,c=a?r:this.height-r,u=t&&t*this.distanceScales.unitsPerMeter[2],l=F([s,c,i],this.pixelUnprojectionMatrix,u),[e,n,h]=this.unprojectPosition(l);return Number.isFinite(i)?[e,n,h]:Number.isFinite(t)?[e,n,t]:[e,n]}projectPosition(t){const[e,n]=tz(t);return[e,n,(t[2]||0)*this.distanceScales.unitsPerMeter[2]]}unprojectPosition(t){const[e,n]=tF(t);return[e,n,(t[2]||0)*this.distanceScales.metersPerUnit[2]]}projectFlat(t){return tz(t)}unprojectFlat(t){return tF(t)}getMapCenterByLngLatPosition({lngLat:n,pos:r}){var t;const e=F(r,this.pixelUnprojectionMatrix),i=tD([],tz(n),((t=[])[0]=-e[0],t[1]=-e[1],t));return tF(tD([],this.center,i))}getLocationAtPoint({lngLat:t,pos:e}){return this.getMapCenterByLngLatPosition({lngLat:t,pos:e})}fitBounds(n,r={}){const{width:t,height:e}=this,{longitude:i,latitude:o,zoom:a}=//# sourceMappingURL=web-mercator-utils.js.map
function({width:f,height:d,bounds:v,minExtent:a=0,maxZoom:g=24,padding:t=0,offset:s=[0,0]}){const[[m,i],[b,o]]=v;if(Number.isFinite(t)){const e=t;t={top:e,bottom:e,left:e,right:e}}else tR(Number.isFinite(t.top)&&Number.isFinite(t.bottom)&&Number.isFinite(t.left)&&Number.isFinite(t.right));const e=tz([m,o<-85.051129?-85.051129:o>85.051129?85.051129:o]),n=tz([b,i<-85.051129?-85.051129:i>85.051129?85.051129:i]),c=[Math.max(Math.abs(n[0]-e[0]),a),Math.max(Math.abs(n[1]-e[1]),a)],r=[f-t.left-t.right-2*Math.abs(s[0]),d-t.top-t.bottom-2*Math.abs(s[1])];tR(r[0]>0&&r[1]>0);const u=r[0]/c[0],l=r[1]/c[1],y=(t.right-t.left)/2/u,w=(t.bottom-t.top)/2/l,h=tF([(n[0]+e[0])/2+y,(n[1]+e[1])/2+w]),p=Math.min(g,tj(Math.abs(Math.min(u,l))));return tR(Number.isFinite(p)),{longitude:h[0],latitude:h[1],zoom:p}}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/get-bounds.js
(Object.assign({width:t,height:e,bounds:n},r));return new tq({width:t,height:e,longitude:i,latitude:o,zoom:a})}getBounds(e){const t=this.getBoundingRegion(e),n=Math.min(...t.map(t=>t[0])),r=Math.max(...t.map(t=>t[0]));return[[n,Math.min(...t.map(t=>t[1]))],[r,Math.max(...t.map(t=>t[1]))]]}getBoundingRegion(t={}){return function(t,r=0){let i,o;const{width:a,height:s,unproject:e}=t,n={targetZ:r},c=e([0,s],n),u=e([a,s],n);return(t.fovy?.5*t.fovy*tB:Math.atan(.5/t.altitude))>(90-t.pitch)*tB-.01?(i=tU(t,0,r),o=tU(t,a,r)):(i=e([0,0],n),o=e([a,0],n)),[c,u,o,i]}(this,t.z||0)}}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/normalize-viewport-props.js
const tW=["longitude","latitude","zoom"],tH={curve:1.414,speed:1.2};function tX(r,s,d){var o,c;const a=(d=Object.assign({},tH,d)).curve,u=r.zoom,b=[r.longitude,r.latitude],y=tN(u),w=s.zoom,O=[s.longitude,s.latitude],E=tN(w-u),l=tz(b),h=(o=[],c=tz(O),o[0]=c[0]-l[0],o[1]=c[1]-l[1],o),t=Math.max(r.width,r.height),i=t/E,v=Math.hypot(h[0],h[1])*y,n=Math.max(v,.01),e=a*a,p=(i*i-t*t+e*e*n*n)/(2*t*e*n),f=(i*i-t*t-e*e*n*n)/(2*i*e*n),g=Math.log(Math.sqrt(p*p+1)-p),m=Math.log(Math.sqrt(f*f+1)-f);return{startZoom:u,startCenterXY:l,uDelta:h,w0:t,u1:v,S:(m-g)/a,rho:a,rho2:e,r0:g,r1:m}}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/index.js // CONCATENATED MODULE: ./node_modules/viewport-mercator-project/module.js // CONCATENATED MODULE: ./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js
//# sourceMappingURL=fly-to-viewport.js.map
//# sourceMappingURL=index.js.map
/**
             * A collection of shims that provide minimal functionality of the ES6 collections.
             *
             * These implementations are not meant to be used outside of the ResizeObserver
             * modules as they cover only a limited range of use cases.
             *//* eslint-disable require-jsdoc, valid-jsdoc */var V=function(){if("undefined"!=typeof Map)return Map;/**
                 * Returns index in provided array that matches the specified key.
                 *
                 * @param {Array<Array>} arr
                 * @param {*} key
                 * @returns {number}
                 */function t(t,n){var e=-1;return t.some(function(t,r){return t[0]===n&&(e=r,!0)}),e}return /** @class */function(){function e(){this.__entries__=[]}return Object.defineProperty(e.prototype,"size",{/**
                         * @returns {boolean}
                         */get:function(){return this.__entries__.length},enumerable:!0,configurable:!0}),/**
                     * @param {*} key
                     * @returns {*}
                     */e.prototype.get=function(n){var r=t(this.__entries__,n),e=this.__entries__[r];return e&&e[1]},/**
                     * @param {*} key
                     * @param {*} value
                     * @returns {void}
                     */e.prototype.set=function(e,n){var r=t(this.__entries__,e);~r?this.__entries__[r][1]=n:this.__entries__.push([e,n])},/**
                     * @param {*} key
                     * @returns {void}
                     */e.prototype.delete=function(r){var e=this.__entries__,n=t(e,r);~n&&e.splice(n,1)},/**
                     * @param {*} key
                     * @returns {void}
                     */e.prototype.has=function(e){return!!~t(this.__entries__,e)},/**
                     * @returns {void}
                     */e.prototype.clear=function(){this.__entries__.splice(0)},/**
                     * @param {Function} callback
                     * @param {*} [ctx=null]
                     * @returns {void}
                     */e.prototype.forEach=function(e,t){void 0===t&&(t=null);for(var n=0,r=this.__entries__;n<r.length;n++){var i=r[n];e.call(t,i[1],i[0])}},e}()}(),tY="undefined"!=typeof window&&"undefined"!=typeof document&&window.document===document,g=void 0!==e.g&&e.g.Math===Math?e.g:"undefined"!=typeof self&&self.Math===Math?self:"undefined"!=typeof window&&window.Math===Math?window:Function("return this")(),tK="function"==typeof requestAnimationFrame?requestAnimationFrame.bind(g):function(t){return setTimeout(function(){return t(Date.now())},1e3/60)},tG=["top","right","bottom","left","width","height","size","weight"],t$="undefined"!=typeof MutationObserver,tJ=/** @class */function(){/**
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
             */function(e,n){var r=!1,i=!1,o=0;/**
                 * Invokes the original callback function and schedules new invocation if
                 * the "proxy" was called during current request.
                 *
                 * @returns {void}
                 */function a(){r&&(r=!1,e()),i&&t()}/**
                 * Callback invoked after the specified delay. It will further postpone
                 * invocation of the original function delegating it to the
                 * requestAnimationFrame.
                 *
                 * @returns {void}
                 */function s(){tK(a)}/**
                 * Schedules invocation of the original function.
                 *
                 * @returns {void}
                 */function t(){var t=Date.now();if(r){// Reject immediately following calls.
if(t-o<2)return;// Schedule new call to be in invoked when the pending one is resolved.
// This is important for "transitions" which never actually start
// immediately so there is a chance that we might miss one if change
// happens amids the pending invocation.
i=!0}else r=!0,i=!1,setTimeout(s,20);o=t}return t}(this.refresh.bind(this),0)}return(/**
                 * Adds observer to observers list.
                 *
                 * @param {ResizeObserverSPI} observer - Observer to be added.
                 * @returns {void}
                 */t.prototype.addObserver=function(t){~this.observers_.indexOf(t)||this.observers_.push(t),this.connected_||this.connect_()},/**
                 * Removes observer from observers list.
                 *
                 * @param {ResizeObserverSPI} observer - Observer to be removed.
                 * @returns {void}
                 */t.prototype.removeObserver=function(n){var t=this.observers_,e=t.indexOf(n);~e&&t.splice(e,1),!t.length&&this.connected_&&this.disconnect_()},/**
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
tY&&!this.connected_&&(// Subscription to the "Transitionend" event is used as a workaround for
// delayed transitions. This way it's possible to capture at least the
// final state of an element.
document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),t$?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},/**
                 * Removes DOM listeners.
                 *
                 * @private
                 * @returns {void}
                 */t.prototype.disconnect_=function(){// Do nothing if running in a non-browser environment or if listeners
// have been already removed.
tY&&this.connected_&&(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},/**
                 * "Transitionend" event handler.
                 *
                 * @private
                 * @param {TransitionEvent} event
                 * @returns {void}
                 */t.prototype.onTransitionEnd_=function(e){var t=e.propertyName,n=void 0===t?"":t;tG.some(function(t){return!!~n.indexOf(t)})&&this.refresh()},/**
                 * Returns instance of the ResizeObserverController.
                 *
                 * @returns {ResizeObserverController}
                 */t.getInstance=function(){return this.instance_||(this.instance_=new t),this.instance_},/**
                 * Holds reference to the controller's instance.
                 *
                 * @private {ResizeObserverController}
                 */t.instance_=null,t)}(),tQ=function(t,e){for(var n=0,r=Object.keys(e);n<r.length;n++){var i=r[n];Object.defineProperty(t,i,{value:e[i],enumerable:!1,writable:!1,configurable:!0})}return t},t0=function(t){// Return the local global object if it's not possible extract one from
// provided element.
return t&&t.ownerDocument&&t.ownerDocument.defaultView||g},t1=Z(0,0,0,0);/**
             * Converts provided string to a number.
             *
             * @param {number|string} value
             * @returns {number}
             */function t2(t){return parseFloat(t)||0}/**
             * Extracts borders size from provided styles.
             *
             * @param {CSSStyleDeclaration} styles
             * @param {...string} positions - Borders positions (top, right, ...)
             * @returns {number}
             */function t5(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return t.reduce(function(t,n){return t+t2(e["border-"+n+"-width"])},0)}/**
             * Checks whether provided element is an instance of the SVGGraphicsElement.
             *
             * @param {Element} target - Element to be checked.
             * @returns {boolean}
             */var t4=// Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
// interface.
"undefined"!=typeof SVGGraphicsElement?function(t){return t instanceof t0(t).SVGGraphicsElement}:function(t){return t instanceof t0(t).SVGElement&&"function"==typeof t.getBBox};/**
             * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
             * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
             *
             * @param {number} x - X coordinate.
             * @param {number} y - Y coordinate.
             * @param {number} width - Rectangle's width.
             * @param {number} height - Rectangle's height.
             * @returns {DOMRectInit}
             */function Z(t,e,n,r){return{x:t,y:e,width:n,height:r}}/**
             * Class that is responsible for computations of the content rectangle of
             * provided DOM element and for keeping track of it's changes.
             */var t3=/** @class */function(){/**
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
                     */this.contentRect_=Z(0,0,0,0),this.target=t}return(/**
                 * Updates content rectangle and tells whether it's width or height properties
                 * have changed since the last broadcast.
                 *
                 * @returns {boolean}
                 */t.prototype.isActive=function(){var t=/**
             * Calculates an appropriate content rectangle for provided html or svg element.
             *
             * @param {Element} target - Element content rectangle of which needs to be calculated.
             * @returns {DOMRectInit}
             */function(t){if(!tY)return t1;if(t4(t)){var e;return Z(0,0,(e=t.getBBox()).width,e.height)}return(/**
             * Calculates content rectangle of provided HTMLElement.
             *
             * @param {HTMLElement} target - Element for which to calculate the content rectangle.
             * @returns {DOMRectInit}
             */function(t){// Client width & height properties can't be
// used exclusively as they provide rounded values.
var o=t.clientWidth,a=t.clientHeight;// By this condition we can catch all non-replaced inline, hidden and
// detached elements. Though elements with width & height properties less
// than 0.5 will be discarded as well.
//
// Without it we would need to implement separate methods for each of
// those cases and it's not possible to perform a precise and performance
// effective test for hidden elements. E.g. even jQuery's ':visible' filter
// gives wrong results for elements with width & height less than 0.5.
if(!o&&!a)return t1;var e=t0(t).getComputedStyle(t),n=/**
             * Extracts paddings sizes from provided styles.
             *
             * @param {CSSStyleDeclaration} styles
             * @returns {Object} Paddings box.
             */function(e){for(var t={},n=0,r=["top","right","bottom","left"];n<r.length;n++){var i=r[n],o=e["padding-"+i];t[i]=t2(o)}return t}(e),s=n.left+n.right,c=n.top+n.bottom,r=t2(e.width),i=t2(e.height);// Following steps can't be applied to the document's root element as its
// client[Width/Height] properties represent viewport area of the window.
// Besides, it's as well not necessary as the <html> itself neither has
// rendered scroll bars nor it can be clipped.
if("border-box"===e.boxSizing&&(Math.round(r+s)!==o&&(r-=t5(e,"left","right")+s),Math.round(i+c)!==a&&(i-=t5(e,"top","bottom")+c)),t!==t0(t).document.documentElement){// In some browsers (only in Firefox, actually) CSS width & height
// include scroll bars size which can be removed at this step as scroll
// bars are the only difference between rounded dimensions + paddings
// and "client" properties, though that is not always true in Chrome.
var u=Math.round(r+s)-o,l=Math.round(i+c)-a;1!==Math.abs(u)&&(r-=u),1!==Math.abs(l)&&(i-=l)}return Z(n.left,n.top,r,i)}(t))}(this.target);return this.contentRect_=t,t.width!==this.broadcastWidth||t.height!==this.broadcastHeight},/**
                 * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
                 * from the corresponding properties of the last observed content rectangle.
                 *
                 * @returns {DOMRectInit} Last observed content rectangle.
                 */t.prototype.broadcastRect=function(){var t=this.contentRect_;return this.broadcastWidth=t.width,this.broadcastHeight=t.height,t},t)}(),t8=/**
                 * Creates an instance of ResizeObserverEntry.
                 *
                 * @param {Element} target - Element that is being observed.
                 * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
                 */function(a,t){var e,n,r,i,o,s=(e=t.x,n=t.y,r=t.width,i=t.height,// Rectangle's properties are not writable and non-enumerable.
tQ(o=Object.create(("undefined"!=typeof DOMRectReadOnly?DOMRectReadOnly:Object).prototype),{x:e,y:n,width:r,height:i,top:n,right:e+r,bottom:i+n,left:e}),o);// According to the specification following properties are not writable
// and are also not enumerable in the native implementation.
//
// Property accessors are not being used as they'd require to define a
// private WeakMap storage which may cause memory leaks in browsers that
// don't support this type of collections.
tQ(this,{target:a,contentRect:s})},t6=/** @class */function(){/**
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
                     */this.observations_=new V,"function"!=typeof t)throw TypeError("The callback provided as parameter 1 is not a function.");this.callback_=t,this.controller_=e,this.callbackCtx_=n}return(/**
                 * Starts observing provided element.
                 *
                 * @param {Element} target - Element to be observed.
                 * @returns {void}
                 */t.prototype.observe=function(t){if(!arguments.length)throw TypeError("1 argument required, but only 0 present.");// Do nothing if current environment doesn't have the Element interface.
if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof t0(t).Element))throw TypeError('parameter 1 is not of type "Element".');var e=this.observations_;// Do nothing if element is already being observed.
e.has(t)||(e.set(t,new t3(t)),this.controller_.addObserver(this),// Force the update of observations.
this.controller_.refresh())}},/**
                 * Stops observing provided element.
                 *
                 * @param {Element} target - Element to stop observing.
                 * @returns {void}
                 */t.prototype.unobserve=function(t){if(!arguments.length)throw TypeError("1 argument required, but only 0 present.");// Do nothing if current environment doesn't have the Element interface.
if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof t0(t).Element))throw TypeError('parameter 1 is not of type "Element".');var e=this.observations_;// Do nothing if element is not being observed.
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
if(this.hasActive()){var t=this.callbackCtx_,e=this.activeObservations_.map(function(t){return new t8(t.target,t.broadcastRect())});this.callback_.call(t,e,t),this.clearActive()}},/**
                 * Clears the collection of active observations.
                 *
                 * @returns {void}
                 */t.prototype.clearActive=function(){this.activeObservations_.splice(0)},/**
                 * Tells whether observer has active observations.
                 *
                 * @returns {boolean}
                 */t.prototype.hasActive=function(){return this.activeObservations_.length>0},t)}(),t9="undefined"!=typeof WeakMap?new WeakMap:new V,B=/**
                 * Creates a new instance of ResizeObserver.
                 *
                 * @param {ResizeObserverCallback} callback - Callback that is invoked when
                 *      dimensions of the observed elements change.
                 */function t(e){if(!(this instanceof t))throw TypeError("Cannot call a class as a function.");if(!arguments.length)throw TypeError("1 argument required, but only 0 present.");var n=new t6(e,tJ.getInstance(),this);t9.set(this,n)};// Expose public methods of ResizeObserver.
["observe","unobserve","disconnect"].forEach(function(t){B.prototype[t]=function(){var e;return(e=t9.get(this))[t].apply(e,arguments)}});var t7=// Export existing implementation if available.
void 0!==g.ResizeObserver?g.ResizeObserver:B;function et(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
function ee(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function en(t,e,n){return e&&ee(t.prototype,e),n&&ee(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/globals.js
"undefined"!=typeof window?window:e.g,void 0!==e.g?e.g:window;var U="undefined"!=typeof document?document:{};// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/style-utils.js
//# sourceMappingURL=globals.js.map
function er(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}function ei(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?er(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):er(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}function eo(t,e){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(i=function(t,e){if(t){if("string"==typeof t)return ea(t,void 0);var n=Object.prototype.toString.call(t).slice(8,-1);if("Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return ea(t,void 0)}}(t))||e&&t&&"number"==typeof t.length){i&&(t=i);var n=0,r=function(){};return{s:r,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:r}}throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o,a=!0,s=!1;return{s:function(){i=t[Symbol.iterator]()},n:function(){var t=i.next();return a=t.done,t},e:function(t){s=!0,o=t},f:function(){try{a||null==i.return||i.return()}finally{if(s)throw o}}}}function ea(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}var es=["type","source","source-layer","minzoom","maxzoom","filter","layout"];function ec(t){if(!t)return null;if("string"==typeof t)return t;t.toJS&&(t=t.toJS());var n,r={},i=eo(t.layers);try{for(i.s();!(n=i.n()).done;){var o=n.value;r[o.id]=o}}catch(t){i.e(t)}finally{i.f()}var e=t.layers.map(function(t){var n=r[t.ref],e=null;if("interactive"in t&&(e=ei({},t),delete e.interactive),n){e=e||ei({},t),delete e.ref;var i,o=eo(es);try{for(o.s();!(i=o.n()).done;){var a=i.value;a in n&&(e[a]=n[a])}}catch(t){o.e(t)}finally{o.f()}}return e||t});return ei(ei({},t),{},{layers:e})}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/mapbox/mapbox.js
//# sourceMappingURL=style-utils.js.map
/* provided dependency */var eu=e(3454),q={container:t.object,gl:t.object,mapboxApiAccessToken:t.string,mapboxApiUrl:t.string,attributionControl:t.bool,preserveDrawingBuffer:t.bool,reuseMaps:t.bool,transformRequest:t.func,mapOptions:t.object,mapStyle:t.oneOfType([t.string,t.object]),preventStyleDiffing:t.bool,visible:t.bool,asyncRender:t.bool,onLoad:t.func,onError:t.func,width:t.number,height:t.number,viewState:t.object,longitude:t.number,latitude:t.number,zoom:t.number,bearing:t.number,pitch:t.number,altitude:t.number},W={container:U.body,mapboxApiAccessToken:function(){var t=null;if("undefined"!=typeof window&&window.location){var e=window.location.search.match(/access_token=([^&\/]*)/);t=e&&e[1]}return t||void 0===eu||(t=t||eu.env.MapboxAccessToken||eu.env.REACT_APP_MAPBOX_ACCESS_TOKEN),t||"no-token"}(),mapboxApiUrl:"https://api.mapbox.com",preserveDrawingBuffer:!1,attributionControl:!0,reuseMaps:!1,mapOptions:{},mapStyle:"mapbox://styles/mapbox/light-v8",preventStyleDiffing:!1,visible:!0,asyncRender:!1,onLoad:function(){},onError:function(t){t&&console.error(t.error)},width:0,height:0,longitude:0,latitude:0,zoom:0,bearing:0,pitch:0,altitude:1.5};function el(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"component";e.debug&&t.checkPropTypes(q,e,"prop",n)}var c=function(){function t(e){var n=this;if(et(this,t),a(this,"props",W),a(this,"width",0),a(this,"height",0),a(this,"_fireLoadEvent",function(){n.props.onLoad({type:"load",target:n._map})}),a(this,"_handleError",function(t){n.props.onError(t)}),!e.mapboxgl)throw Error("Mapbox not available");this.mapboxgl=e.mapboxgl,t.initialized||(t.initialized=!0,this._checkStyleSheet(this.mapboxgl.version)),this._initialize(e)}return en(t,[{key:"finalize",value:function(){return this._destroy(),this}},{key:"setProps",value:function(t){return this._update(this.props,t),this}},{key:"redraw",value:function(){var t=this._map;t.style&&(t._frame&&(t._frame.cancel(),t._frame=null),t._render())}},{key:"getMap",value:function(){return this._map}},{key:"_reuse",value:function(e){this._map=t.savedMap;var r=this._map.getContainer(),n=e.container;for(n.classList.add("mapboxgl-map");r.childNodes.length>0;)n.appendChild(r.childNodes[0]);this._map._container=n,t.savedMap=null,e.mapStyle&&this._map.setStyle(ec(e.mapStyle),{diff:!1}),this._map.isStyleLoaded()?this._fireLoadEvent():this._map.once("styledata",this._fireLoadEvent)}},{key:"_create",value:function(e){if(e.reuseMaps&&t.savedMap)this._reuse(e);else{if(e.gl){var n=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(){return HTMLCanvasElement.prototype.getContext=n,e.gl}}var r={container:e.container,center:[0,0],zoom:8,pitch:0,bearing:0,maxZoom:24,style:ec(e.mapStyle),interactive:!1,trackResize:!1,attributionControl:e.attributionControl,preserveDrawingBuffer:e.preserveDrawingBuffer};e.transformRequest&&(r.transformRequest=e.transformRequest),this._map=new this.mapboxgl.Map(Object.assign({},r,e.mapOptions)),this._map.once("load",this._fireLoadEvent),this._map.on("error",this._handleError)}return this}},{key:"_destroy",value:function(){this._map&&(this.props.reuseMaps&&!t.savedMap?(t.savedMap=this._map,this._map.off("load",this._fireLoadEvent),this._map.off("error",this._handleError),this._map.off("styledata",this._fireLoadEvent)):this._map.remove(),this._map=null)}},{key:"_initialize",value:function(t){var r=this;el(t=Object.assign({},W,t),"Mapbox"),this.mapboxgl.accessToken=t.mapboxApiAccessToken||W.mapboxApiAccessToken,this.mapboxgl.baseApiUrl=t.mapboxApiUrl,this._create(t);var e=t.container;Object.defineProperty(e,"offsetWidth",{configurable:!0,get:function(){return r.width}}),Object.defineProperty(e,"clientWidth",{configurable:!0,get:function(){return r.width}}),Object.defineProperty(e,"offsetHeight",{configurable:!0,get:function(){return r.height}}),Object.defineProperty(e,"clientHeight",{configurable:!0,get:function(){return r.height}});var n=this._map.getCanvas();n&&(n.style.outline="none"),this._updateMapViewport({},t),this._updateMapSize({},t),this.props=t}},{key:"_update",value:function(t,e){if(this._map){el(e=Object.assign({},this.props,e),"Mapbox");var n=this._updateMapViewport(t,e),r=this._updateMapSize(t,e);this._updateMapStyle(t,e),!e.asyncRender&&(n||r)&&this.redraw(),this.props=e}}},{key:"_updateMapStyle",value:function(e,t){e.mapStyle!==t.mapStyle&&this._map.setStyle(ec(t.mapStyle),{diff:!t.preventStyleDiffing})}},{key:"_updateMapSize",value:function(e,t){var n=e.width!==t.width||e.height!==t.height;return n&&(this.width=t.width,this.height=t.height,this._map.resize()),n}},{key:"_updateMapViewport",value:function(r,i){var e=this._getViewState(r),t=this._getViewState(i),n=t.latitude!==e.latitude||t.longitude!==e.longitude||t.zoom!==e.zoom||t.pitch!==e.pitch||t.bearing!==e.bearing||t.altitude!==e.altitude;return n&&(this._map.jumpTo(this._viewStateToMapboxProps(t)),t.altitude!==e.altitude&&(this._map.transform.altitude=t.altitude)),n}},{key:"_getViewState",value:function(e){var t=e.viewState||e,o=t.longitude,a=t.latitude,s=t.zoom,n=t.pitch,r=t.bearing,i=t.altitude;return{longitude:o,latitude:a,zoom:s,pitch:void 0===n?0:n,bearing:void 0===r?0:r,altitude:void 0===i?1.5:i}}},{key:"_checkStyleSheet",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"0.47.0";if(void 0!==U)try{var e=U.createElement("div");if(e.className="mapboxgl-map",e.style.display="none",U.body.appendChild(e),"static"===window.getComputedStyle(e).position){var n=U.createElement("link");n.setAttribute("rel","stylesheet"),n.setAttribute("type","text/css"),n.setAttribute("href","https://api.tiles.mapbox.com/mapbox-gl-js/v".concat(t,"/mapbox-gl.css")),U.head.appendChild(n)}}catch(t){}}},{key:"_viewStateToMapboxProps",value:function(t){return{center:[t.longitude,t.latitude],zoom:t.zoom,bearing:t.bearing,pitch:t.pitch}}}]),t}();a(c,"initialized",!1),a(c,"propTypes",q),a(c,"defaultProps",W),a(c,"savedMap",null);//# sourceMappingURL=mapbox.js.map
// EXTERNAL MODULE: ./node_modules/mapbox-gl/dist/mapbox-gl.js
var H=e(6158),j=/*#__PURE__*/e.n(H);function eh(t){return Array.isArray(t)||ArrayBuffer.isView(t)}function ep(t,e,n){return Math.max(e,Math.min(n,t))}function ef(t,n,e){return eh(t)?t.map(function(t,r){return ef(t,n[r],e)}):e*n+(1-e)*t}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/assert.js
//# sourceMappingURL=math-utils.js.map
function ed(t,e){if(!t)throw Error(e||"react-map-gl: assertion failed.")}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/map-state.js
//# sourceMappingURL=assert.js.map
function ev(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}function eg(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?ev(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):ev(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var S={minZoom:0,maxZoom:24,minPitch:0,maxPitch:85},em={pitch:0,bearing:0,altitude:1.5},eb=function(){function t(e){var n=e.width,r=e.height,i=e.latitude,o=e.longitude,a=e.zoom,s=e.bearing,d=void 0===s?em.bearing:s,c=e.pitch,v=void 0===c?em.pitch:c,u=e.altitude,g=void 0===u?em.altitude:u,l=e.maxZoom,m=void 0===l?S.maxZoom:l,h=e.minZoom,b=void 0===h?S.minZoom:h,p=e.maxPitch,y=void 0===p?S.maxPitch:p,f=e.minPitch,w=void 0===f?S.minPitch:f,O=e.transitionDuration,E=e.transitionEasing,_=e.transitionInterpolator,P=e.transitionInterruption,M=e.startPanLngLat,j=e.startZoomLngLat,T=e.startRotatePos,k=e.startBearing,x=e.startPitch,D=e.startZoom;et(this,t),ed(Number.isFinite(n),"`width` must be supplied"),ed(Number.isFinite(r),"`height` must be supplied"),ed(Number.isFinite(o),"`longitude` must be supplied"),ed(Number.isFinite(i),"`latitude` must be supplied"),ed(Number.isFinite(a),"`zoom` must be supplied"),this._viewportProps=this._applyConstraints({width:n,height:r,latitude:i,longitude:o,zoom:a,bearing:d,pitch:v,altitude:g,maxZoom:m,minZoom:b,maxPitch:y,minPitch:w,transitionDuration:O,transitionEasing:E,transitionInterpolator:_,transitionInterruption:P}),this._state={startPanLngLat:M,startZoomLngLat:j,startRotatePos:T,startBearing:k,startPitch:x,startZoom:D}}return en(t,[{key:"getViewportProps",value:function(){return this._viewportProps}},{key:"getState",value:function(){return this._state}},{key:"panStart",value:function(t){var e=t.pos;return this._getUpdatedMapState({startPanLngLat:this._unproject(e)})}},{key:"pan",value:function(t){var r=t.pos,i=t.startPos,e=this._state.startPanLngLat||this._unproject(i);if(!e)return this;var n=tE(this._calculateNewLngLat({startPanLngLat:e,pos:r}),2),o=n[0],a=n[1];return this._getUpdatedMapState({longitude:o,latitude:a})}},{key:"panEnd",value:function(){return this._getUpdatedMapState({startPanLngLat:null})}},{key:"rotateStart",value:function(t){var e=t.pos;return this._getUpdatedMapState({startRotatePos:e,startBearing:this._viewportProps.bearing,startPitch:this._viewportProps.pitch})}},{key:"rotate",value:function(t){var i,o=t.pos,a=t.deltaAngleX,s=t.deltaAngleY,e=this._state,c=e.startRotatePos,n=e.startBearing,r=e.startPitch;return Number.isFinite(n)&&Number.isFinite(r)?(i=o?this._calculateNewPitchAndBearing(eg(eg({},this._getRotationParams(o,c)),{},{startBearing:n,startPitch:r})):{bearing:n+(void 0===a?0:a),pitch:r+(void 0===s?0:s)},this._getUpdatedMapState(i)):this}},{key:"rotateEnd",value:function(){return this._getUpdatedMapState({startBearing:null,startPitch:null})}},{key:"zoomStart",value:function(t){var e=t.pos;return this._getUpdatedMapState({startZoomLngLat:this._unproject(e),startZoom:this._viewportProps.zoom})}},{key:"zoom",value:function(t){var r=t.pos,c=t.startPos,i=t.scale;ed(i>0,"`scale` must be a positive number");var o=this._state,e=o.startZoom,n=o.startZoomLngLat;Number.isFinite(e)||(e=this._viewportProps.zoom,n=this._unproject(c)||this._unproject(r)),ed(n,"`startZoomLngLat` prop is required for zoom behavior to calculate where to position the map.");var a=this._calculateNewZoom({scale:i,startZoom:e||0}),s=tE(new tq(Object.assign({},this._viewportProps,{zoom:a})).getMapCenterByLngLatPosition({lngLat:n,pos:r}),2),u=s[0],l=s[1];return this._getUpdatedMapState({zoom:a,longitude:u,latitude:l})}},{key:"zoomEnd",value:function(){return this._getUpdatedMapState({startZoomLngLat:null,startZoom:null})}},{key:"_getUpdatedMapState",value:function(e){return new t(Object.assign({},this._viewportProps,this._state,e))}},{key:"_applyConstraints",value:function(t){var e=t.maxZoom,n=t.minZoom;t.zoom=ep(t.zoom,n,e);var r=t.maxPitch,i=t.minPitch;return t.pitch=ep(t.pitch,i,r),Object.assign(t,function({width:a,height:r,longitude:t,latitude:i,zoom:n,pitch:s=0,bearing:e=0}){(t<-180||t>180)&&(t=tM(t+180,360)-180),(e<-180||e>180)&&(e=tM(e+180,360)-180);const o=tj(r/512);if(n<=o)n=o,i=0;else{const e=r/2/Math.pow(2,n),t=tF([0,e])[1];if(i<t)i=t;else{const t=tF([0,512-e])[1];i>t&&(i=t)}}return{width:a,height:r,longitude:t,latitude:i,zoom:n,pitch:s,bearing:e}}// CONCATENATED MODULE: ./node_modules/@math.gl/web-mercator/dist/esm/fly-to-viewport.js
(t)),t}},{key:"_unproject",value:function(t){var e=new tq(this._viewportProps);return t&&e.unproject(t)}},{key:"_calculateNewLngLat",value:function(t){var e=t.startPanLngLat,n=t.pos;return new tq(this._viewportProps).getMapCenterByLngLatPosition({lngLat:e,pos:n})}},{key:"_calculateNewZoom",value:function(t){var n=t.scale,r=t.startZoom,e=this._viewportProps,i=e.maxZoom;return ep(r+Math.log2(n),e.minZoom,i)}},{key:"_calculateNewPitchAndBearing",value:function(n){var o=n.deltaScaleX,t=n.deltaScaleY,a=n.startBearing,e=n.startPitch;t=ep(t,-1,1);var i=this._viewportProps,s=i.minPitch,c=i.maxPitch,r=e;return t>0?r=e+t*(c-e):t<0&&(r=e-t*(s-e)),{pitch:r,bearing:a+180*o}}},{key:"_getRotationParams",value:function(n,r){var s=n[0]-r[0],i=n[1]-r[1],c=n[1],t=r[1],o=this._viewportProps,u=o.width,a=o.height,e=0;return i>0?Math.abs(a-t)>5&&(e=i/(t-a)*1.2):i<0&&t>5&&(e=1-c/t),{deltaScaleX:s/u,deltaScaleY:e=Math.min(1,Math.max(-1,e))}}}]),t}();//# sourceMappingURL=map-constraints.js.map
function ey(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}function ew(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?ey(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):ey(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var T=(0,n.createContext)({viewport:null,map:null,container:null,onViewportChange:null,onViewStateChange:null,eventManager:null}),eO=T.Provider;T.Provider=function(r){var t=r.value,o=r.children,i=tE((0,n.useState)(null),2),a=i[0],s=i[1],e=(0,n.useContext)(T);return t=ew(ew({setMap:s},e),{},{map:e&&e.map||a},t),n.createElement(eO,{value:t},o)};//# sourceMappingURL=map-context.js.map
var eE="undefined"!=typeof window?n.useLayoutEffect:n.useEffect;//# sourceMappingURL=use-isomorphic-layout-effect.js.map
function e_(t,e){var n=e.longitude,r=e.latitude;return t&&t.queryTerrainElevation&&t.queryTerrainElevation([n,r])||0}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/static-map.js
//# sourceMappingURL=terrain.js.map
function eP(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}function eM(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?eP(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):eP(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var ej="A valid API access token is required to use Mapbox data";function eS(t){var r=t.map,n=t.props,i=t.width,o=t.height,e=eM(eM(eM({},n),n.viewState),{},{width:i,height:o});return e.position=[0,0,e_(r,e)],new tq(e)}var eT={position:"absolute",width:"100%",height:"100%",overflow:"hidden"},X=Object.assign({},c.propTypes,{width:t.oneOfType([t.number,t.string]),height:t.oneOfType([t.number,t.string]),onResize:t.func,disableTokenWarning:t.bool,visible:t.bool,className:t.string,style:t.object,visibilityConstraints:t.object}),Y=Object.assign({},c.defaultProps,{disableTokenWarning:!1,visible:!0,onResize:function(){},className:"",style:null,visibilityConstraints:S});function ek(){return n.createElement("div",{key:"warning",id:"no-token-warning",style:{position:"absolute",left:0,top:0}},n.createElement("h3",{key:"header"},ej),n.createElement("div",{key:"text"},"For information on setting up your basemap, read"),n.createElement("a",{key:"link",href:"https://visgl.github.io/react-map-gl/docs/get-started/mapbox-tokens"},"Note on Map Tokens"))}var u=(0,n.forwardRef)(function(t,l){var i=tE((0,n.useState)(!0),2),h=i[0],P=i[1],o=tE((0,n.useState)({width:0,height:0}),2),p=o[0],M=o[1],a=(0,n.useRef)(null),f=(0,n.useRef)(null),s=(0,n.useRef)(null),d=(0,n.useRef)(null),e=(0,n.useContext)(T);eE(function(){if(u.supported()){var n=new c(eM(eM(eM({},t),p),{},{mapboxgl:j(),container:f.current,onError:function(e){401===(e.error&&e.error.status||e.status)&&h&&(console.error(ej),P(!1)),t.onError(e)}}));a.current=n,e&&e.setMap&&e.setMap(n.getMap());var r=new t7(function(e){if(e[0].contentRect){var n=e[0].contentRect,r=n.width,i=n.height;M({width:r,height:i}),t.onResize({width:r,height:i})}});return r.observe(s.current),function(){n.finalize(),a.current=null,r.disconnect()}}},[]),eE(function(){a.current&&a.current.setProps(eM(eM({},t),p))});var r=a.current&&a.current.getMap();(0,n.useImperativeHandle)(l,function(){return{getMap:function(){return a.current&&a.current.getMap()},queryRenderedFeatures:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=a.current&&a.current.getMap();return t&&t.queryRenderedFeatures(e,n)}}},[]);var v=(0,n.useCallback)(function(e){var t=e.target;t===d.current&&t.scrollTo(0,0)},[]),g=r&&n.createElement(eO,{value:eM(eM({},e),{},{viewport:e.viewport||eS(eM({map:r,props:t},p)),map:r,container:e.container||s.current})},n.createElement("div",{key:"map-overlays",className:"overlays",ref:d,style:eT,onScroll:v},t.children)),m=t.className,b=t.width,y=t.height,w=t.style,O=t.visibilityConstraints,E=Object.assign({position:"relative"},w,{width:b,height:y}),_=Object.assign({},eT,{visibility:t.visible&&function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:S;for(var n in e){var r,i=n.slice(0,3),o=(r=n.slice(3))[0].toLowerCase()+r.slice(1);if("min"===i&&t[o]<e[n]||"max"===i&&t[o]>e[n])return!1}return!0}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/map-context.js
(t.viewState||t,O)?"inherit":"hidden"});return n.createElement("div",{key:"map-container",ref:s,style:E},n.createElement("div",{key:"map-mapbox",ref:f,style:_,className:m}),g,!h&&!t.disableTokenWarning&&n.createElement(ek,null))});function ex(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}u.supported=function(){return j()&&j().supported()},u.propTypes=X,u.defaultProps=Y;var k=function(){function t(){et(this,t),a(this,"propNames",[])}return en(t,[{key:"arePropsEqual",value:function(t,e){var n,r=//# sourceMappingURL=static-map.js.map
function(t,e){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(i=function(t,e){if(t){if("string"==typeof t)return ex(t,void 0);var n=Object.prototype.toString.call(t).slice(8,-1);if("Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return ex(t,void 0)}}(t))){i&&(t=i);var n=0,r=function(){};return{s:r,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:r}}throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o,a=!0,s=!1;return{s:function(){i=t[Symbol.iterator]()},n:function(){var t=i.next();return a=t.done,t},e:function(t){s=!0,o=t},f:function(){try{a||null==i.return||i.return()}finally{if(s)throw o}}}}(this.propNames||[]);try{for(r.s();!(n=r.n()).done;){var i=n.value;if(!function t(e,n){if(e===n)return!0;if(eh(e)&&eh(n)){if(e.length!==n.length)return!1;for(var r=0;r<e.length;++r)if(!t(e[r],n[r]))return!1;return!0}return 1e-7>=Math.abs(e-n)}(t[i],e[i]))return!1}}catch(t){r.e(t)}finally{r.f()}return!0}},{key:"initializeProps",value:function(t,e){return{start:t,end:e}}},{key:"interpolateProps",value:function(t,e,n){ed(!1,"interpolateProps is not implemented")}},{key:"getDuration",value:function(e,t){return t.transitionDuration}}]),t}();// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
//# sourceMappingURL=transition-interpolator.js.map
function eD(t){if(void 0===t)throw ReferenceError("this hasn't been initialised - super() hasn't been called");return t}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function eC(t,e){return(eC=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js
function eR(e,t){if("function"!=typeof t&&null!==t)throw TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&eC(e,t)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function eA(t){return(eA="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js
function eI(e,t){if(t&&("object"===eA(t)||"function"==typeof t))return t;if(void 0!==t)throw TypeError("Derived constructors may only return object or undefined");return eD(e)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function eL(t){return(eL=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/transition/transition-utils.js
var eN={longitude:1,bearing:1};function ez(t){return Number.isFinite(t)||Array.isArray(t)}function eF(e,n,t){return e in eN&&Math.abs(t-n)>180&&(t=t<0?t+360:t-360),t}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/transition/viewport-fly-to-interpolator.js
//# sourceMappingURL=transition-utils.js.map
function eV(t,e){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(i=function(t,e){if(t){if("string"==typeof t)return eZ(t,void 0);var n=Object.prototype.toString.call(t).slice(8,-1);if("Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return eZ(t,void 0)}}(t))||e&&t&&"number"==typeof t.length){i&&(t=i);var n=0,r=function(){};return{s:r,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:r}}throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o,a=!0,s=!1;return{s:function(){i=t[Symbol.iterator]()},n:function(){var t=i.next();return a=t.done,t},e:function(t){s=!0,o=t},f:function(){try{a||null==i.return||i.return()}finally{if(s)throw o}}}}function eZ(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}var eB=["longitude","latitude","zoom","bearing","pitch"],eU=["latitude","longitude","zoom","width","height"],eq=["bearing","pitch"],eW={speed:1.2,curve:1.414};//# sourceMappingURL=viewport-fly-to-interpolator.js.map
function eH(t,e){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(i=function(t,e){if(t){if("string"==typeof t)return eX(t,void 0);var n=Object.prototype.toString.call(t).slice(8,-1);if("Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return eX(t,void 0)}}(t))||e&&t&&"number"==typeof t.length){i&&(t=i);var n=0,r=function(){};return{s:r,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:r}}throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o,a=!0,s=!1;return{s:function(){i=t[Symbol.iterator]()},n:function(){var t=i.next();return a=t.done,t},e:function(t){s=!0,o=t},f:function(){try{a||null==i.return||i.return()}finally{if(s)throw o}}}}function eX(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}!function(e){eR(t,e);var n,r=(n=function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}(),function(){var e,r=eL(t);return e=n?Reflect.construct(r,arguments,eL(this).constructor):r.apply(this,arguments),eI(this,e)});function t(){var e,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return et(this,t),a(eD(e=r.call(this)),"propNames",eB),e.props=Object.assign({},eW,n),e}en(t,[{key:"initializeProps",value:function(n,r){var i,t={},e={},o=eV(eU);try{for(o.s();!(i=o.n()).done;){var a=i.value,s=n[a],c=r[a];ed(ez(s)&&ez(c),"".concat(a," must be supplied for transition")),t[a]=s,e[a]=eF(a,s,c)}}catch(t){o.e(t)}finally{o.f()}var u,l=eV(eq);try{for(l.s();!(u=l.n()).done;){var h=u.value,p=n[h]||0,f=r[h]||0;t[h]=p,e[h]=eF(h,p,f)}}catch(t){l.e(t)}finally{l.f()}return{start:t,end:e}}},{key:"interpolateProps",value:function(t,e,n){var i,r=function(l,h,p,f={}){var n;const e={},{startZoom:d,startCenterXY:v,uDelta:i,w0:g,u1:o,S:m,rho:a,rho2:b,r0:t}=tX(l,h,f);if(o<.01){for(const t of tW){const n=l[t],r=h[t];e[t]=p*r+(1-p)*n}return e}const s=p*m,y=Math.cosh(t)/Math.cosh(t+a*s),c=g*((Math.cosh(t)*Math.tanh(t+a*s)-Math.sinh(t))/b)/o,w=d+tj(1/y),r=((n=[])[0]=i[0]*c,n[1]=i[1]*c,n);tD(r,r,v);const u=tF(r);return e.longitude=u[0],e.latitude=u[1],e.zoom=w,e}(t,e,n,this.props),o=eV(eq);try{for(o.s();!(i=o.n()).done;){var a=i.value;r[a]=ef(t[a],e[a],n)}}catch(t){o.e(t)}finally{o.f()}return r}},{key:"getDuration",value:function(n,e){var t=e.transitionDuration;return"auto"===t&&(t=function(o,a,t={}){let e;const{screenSpeed:n,speed:s,maxDuration:r}=t=Object.assign({},tH,t),{S:c,rho:u}=tX(o,a,t),i=1e3*c;return e=Number.isFinite(n)?i/(n/u):i/s,Number.isFinite(r)&&e>r?0:e}(n,e,this.props)),t}}])}(k);var eY=["longitude","latitude","zoom","bearing","pitch"],x=function(e){eR(t,e);var n,r=(n=function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}(),function(){var e,r=eL(t);return e=n?Reflect.construct(r,arguments,eL(this).constructor):r.apply(this,arguments),eI(this,e)});function t(){var n,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return et(this,t),n=r.call(this),Array.isArray(e)&&(e={transitionProps:e}),n.propNames=e.transitionProps||eY,e.around&&(n.around=e.around),n}return en(t,[{key:"initializeProps",value:function(n,r){var t={},e={};if(this.around){t.around=this.around;var i=new tq(n).unproject(this.around);Object.assign(e,r,{around:new tq(r).project(i),aroundLngLat:i})}var o,a=eH(this.propNames);try{for(a.s();!(o=a.n()).done;){var s=o.value,c=n[s],u=r[s];ed(ez(c)&&ez(u),"".concat(s," must be supplied for transition")),t[s]=c,e[s]=eF(s,c,u)}}catch(t){a.e(t)}finally{a.f()}return{start:t,end:e}}},{key:"interpolateProps",value:function(n,t,r){var i,e={},o=eH(this.propNames);try{for(o.s();!(i=o.n()).done;){var a=i.value;e[a]=ef(n[a],t[a],r)}}catch(t){o.e(t)}finally{o.f()}if(t.around){var s=tE(new tq(Object.assign({},t,e)).getMapCenterByLngLatPosition({lngLat:t.aroundLngLat,pos:ef(n.around,t.around,r)}),2),c=s[0],u=s[1];e.longitude=c,e.latitude=u}return e}}]),t}(k),m=function(){},D={BREAK:1,SNAP_TO_END:2,IGNORE:3,UPDATE:4},K={transitionDuration:0,transitionEasing:function(t){return t},transitionInterpolator:new x,transitionInterruption:D.BREAK,onTransitionStart:m,onTransitionInterrupt:m,onTransitionEnd:m},C=function(){function t(){var n=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};et(this,t),a(this,"_animationFrame",null),a(this,"_onTransitionFrame",function(){n._animationFrame=requestAnimationFrame(n._onTransitionFrame),n._updateViewport()}),this.props=null,this.onViewportChange=e.onViewportChange||m,this.onStateChange=e.onStateChange||m,this.time=e.getTime||Date.now}return en(t,[{key:"getViewportInTransition",value:function(){return this._animationFrame?this.state.propsInTransition:null}},{key:"processViewportChange",value:function(t){var e=this.props;if(this.props=t,!e||this._shouldIgnoreViewportChange(e,t))return!1;if(this._isTransitionEnabled(t)){var n=Object.assign({},e),r=Object.assign({},t);if(this._isTransitionInProgress()&&(e.onTransitionInterrupt(),this.state.interruption===D.SNAP_TO_END?Object.assign(n,this.state.endProps):Object.assign(n,this.state.propsInTransition),this.state.interruption===D.UPDATE)){var i,o,a=this.time(),s=(a-this.state.startTime)/this.state.duration;r.transitionDuration=this.state.duration-(a-this.state.startTime),o=(i=this.state.easing)(s),r.transitionEasing=function(t){return 1/(1-o)*(i(t*(1-s)+s)-o)},r.transitionInterpolator=n.transitionInterpolator}return r.onTransitionStart(),this._triggerTransition(n,r),!0}return this._isTransitionInProgress()&&(e.onTransitionInterrupt(),this._endTransition()),!1}},{key:"_isTransitionInProgress",value:function(){return!!this._animationFrame}},{key:"_isTransitionEnabled",value:function(t){var e=t.transitionDuration,n=t.transitionInterpolator;return(e>0||"auto"===e)&&!!n}},{key:"_isUpdateDueToCurrentTransition",value:function(t){return!!this.state.propsInTransition&&this.state.interpolator.arePropsEqual(t,this.state.propsInTransition)}},{key:"_shouldIgnoreViewportChange",value:function(e,t){return!e||(this._isTransitionInProgress()?this.state.interruption===D.IGNORE||this._isUpdateDueToCurrentTransition(t):!this._isTransitionEnabled(t)||t.transitionInterpolator.arePropsEqual(e,t))}},{key:"_triggerTransition",value:function(n,t){ed(this._isTransitionEnabled(t)),this._animationFrame&&cancelAnimationFrame(this._animationFrame);var e=t.transitionInterpolator,r=e.getDuration?e.getDuration(n,t):t.transitionDuration;if(0!==r){var i=t.transitionInterpolator.initializeProps(n,t),o={inTransition:!0,isZooming:n.zoom!==t.zoom,isPanning:n.longitude!==t.longitude||n.latitude!==t.latitude,isRotating:n.bearing!==t.bearing||n.pitch!==t.pitch};this.state={duration:r,easing:t.transitionEasing,interpolator:t.transitionInterpolator,interruption:t.transitionInterruption,startTime:this.time(),startProps:i.start,endProps:i.end,animation:null,propsInTransition:{}},this._onTransitionFrame(),this.onStateChange(o)}}},{key:"_endTransition",value:function(){this._animationFrame&&(cancelAnimationFrame(this._animationFrame),this._animationFrame=null),this.onStateChange({inTransition:!1,isZooming:!1,isPanning:!1,isRotating:!1})}},{key:"_updateViewport",value:function(){var r=this.time(),t=this.state,i=t.startTime,o=t.duration,a=t.easing,s=t.interpolator,c=t.startProps,u=t.endProps,n=!1,e=(r-i)/o;e>=1&&(e=1,n=!0),e=a(e);var l=s.interpolateProps(c,u,e),h=new eb(Object.assign({},this.props,l));this.state.propsInTransition=h.getViewportProps(),this.onViewportChange(this.state.propsInTransition,this.props),n&&(this._endTransition(),this.props.onTransitionEnd())}}]),t}();a(C,"defaultProps",K);//# sourceMappingURL=transition-manager.js.map
// EXTERNAL MODULE: ./node_modules/hammerjs/hammer.js
var G=e(840),p=/*#__PURE__*/e.n(G);const eK={mousedown:1,mousemove:2,mouseup:4};!//# sourceMappingURL=hammer-overrides.js.map
function(t){const e=t.prototype.handler;t.prototype.handler=function(t){const n=this.store;t.button>0&&"pointerdown"===t.type&&!function(t,e){for(let n=0;n<t.length;n++)if(e(t[n]))return!0;return!1}(n,e=>e.pointerId===t.pointerId)&&n.push(t),e.call(this,t)}}(p().PointerEventInput),p().MouseInput.prototype.handler=function(t){let e=eK[t.type];1&e&&t.button>=0&&(this.pressed=!0),2&e&&0===t.which&&(e=4),this.pressed&&(4&e&&(this.pressed=!1),this.callback(this.manager,e,{pointers:[t],changedPointers:[t],pointerType:"mouse",srcEvent:t}))};const $=p().Manager;/* harmony default export */var i=p();// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/constants.js
//# sourceMappingURL=hammer.browser.js.map
const eG=i?[[i.Pan,{event:"tripan",pointers:3,threshold:0,enable:!1}],[i.Rotate,{enable:!1}],[i.Pinch,{enable:!1}],[i.Swipe,{enable:!1}],[i.Pan,{threshold:0,enable:!1}],[i.Press,{enable:!1}],[i.Tap,{event:"doubletap",taps:2,enable:!1}],[i.Tap,{event:"anytap",enable:!1}],[i.Tap,{enable:!1}]]:null,e$={tripan:["rotate","pinch","pan"],rotate:["pinch"],pinch:["pan"],pan:["press","doubletap","anytap","tap"],doubletap:["anytap"],anytap:["tap"]},eJ={doubletap:["tap"]},eQ={pointerdown:"pointerdown",pointermove:"pointermove",pointerup:"pointerup",touchstart:"pointerdown",touchmove:"pointermove",touchend:"pointerup",mousedown:"pointerdown",mousemove:"pointermove",mouseup:"pointerup"},b={KEY_EVENTS:["keydown","keyup"],MOUSE_EVENTS:["mousedown","mousemove","mouseup","mouseover","mouseout","mouseleave"],WHEEL_EVENTS:["wheel","mousewheel"]},e0={tap:"tap",anytap:"anytap",doubletap:"doubletap",press:"press",pinch:"pinch",pinchin:"pinch",pinchout:"pinch",pinchstart:"pinch",pinchmove:"pinch",pinchend:"pinch",pinchcancel:"pinch",rotate:"rotate",rotatestart:"rotate",rotatemove:"rotate",rotateend:"rotate",rotatecancel:"rotate",tripan:"tripan",tripanstart:"tripan",tripanmove:"tripan",tripanup:"tripan",tripandown:"tripan",tripanleft:"tripan",tripanright:"tripan",tripanend:"tripan",tripancancel:"tripan",pan:"pan",panstart:"pan",panmove:"pan",panup:"pan",pandown:"pan",panleft:"pan",panright:"pan",panend:"pan",pancancel:"pan",swipe:"swipe",swipeleft:"swipe",swiperight:"swipe",swipeup:"swipe",swipedown:"swipe"},e1={click:"tap",anyclick:"anytap",dblclick:"doubletap",mousedown:"pointerdown",mousemove:"pointermove",mouseup:"pointerup",mouseover:"pointerover",mouseout:"pointerout",mouseleave:"pointerleave"},J="undefined"!=typeof navigator&&navigator.userAgent?navigator.userAgent.toLowerCase():"",e2="undefined"!=typeof window?window:e.g;void 0!==e.g?e.g:window;let e5=!1;try{const t={get passive(){return e5=!0,!0}};e2.addEventListener("test",t,t),e2.removeEventListener("test",t,t)}catch(t){}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/inputs/wheel-input.js
//# sourceMappingURL=globals.js.map
const e4=-1!==J.indexOf("firefox"),{WHEEL_EVENTS:e3}=b,e8="wheel";class e6{constructor(e,n,t={}){this.element=e,this.callback=n,this.options=Object.assign({enable:!0},t),this.events=e3.concat(t.events||[]),this.handleEvent=this.handleEvent.bind(this),this.events.forEach(t=>e.addEventListener(t,this.handleEvent,!!e5&&{passive:!1}))}destroy(){this.events.forEach(t=>this.element.removeEventListener(t,this.handleEvent))}enableEventType(t,e){t===e8&&(this.options.enable=e)}handleEvent(e){if(!this.options.enable)return;let t=e.deltaY;e2.WheelEvent&&(e4&&e.deltaMode===e2.WheelEvent.DOM_DELTA_PIXEL&&(t/=e2.devicePixelRatio),e.deltaMode===e2.WheelEvent.DOM_DELTA_LINE&&(t*=40));const n={x:e.clientX,y:e.clientY};0!==t&&t%4.000244140625==0&&(t=Math.floor(t/4.000244140625)),e.shiftKey&&t&&(t*=.25),this._onWheel(e,-t,n)}_onWheel(t,e,n){this.callback({type:e8,center:n,delta:e,srcEvent:t,pointerType:"mouse",target:t.target})}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/inputs/move-input.js
//# sourceMappingURL=wheel-input.js.map
const{MOUSE_EVENTS:e9}=b,e7="pointermove",nt="pointerover",ne="pointerout",nn="pointerleave";class nr{constructor(e,n,t={}){this.element=e,this.callback=n,this.pressed=!1,this.options=Object.assign({enable:!0},t),this.enableMoveEvent=this.options.enable,this.enableLeaveEvent=this.options.enable,this.enableOutEvent=this.options.enable,this.enableOverEvent=this.options.enable,this.events=e9.concat(t.events||[]),this.handleEvent=this.handleEvent.bind(this),this.events.forEach(t=>e.addEventListener(t,this.handleEvent))}destroy(){this.events.forEach(t=>this.element.removeEventListener(t,this.handleEvent))}enableEventType(t,e){t===e7&&(this.enableMoveEvent=e),t===nt&&(this.enableOverEvent=e),t===ne&&(this.enableOutEvent=e),t===nn&&(this.enableLeaveEvent=e)}handleEvent(t){this.handleOverEvent(t),this.handleOutEvent(t),this.handleLeaveEvent(t),this.handleMoveEvent(t)}handleOverEvent(t){this.enableOverEvent&&"mouseover"===t.type&&this.callback({type:nt,srcEvent:t,pointerType:"mouse",target:t.target})}handleOutEvent(t){this.enableOutEvent&&"mouseout"===t.type&&this.callback({type:ne,srcEvent:t,pointerType:"mouse",target:t.target})}handleLeaveEvent(t){this.enableLeaveEvent&&"mouseleave"===t.type&&this.callback({type:nn,srcEvent:t,pointerType:"mouse",target:t.target})}handleMoveEvent(t){if(this.enableMoveEvent)switch(t.type){case"mousedown":t.button>=0&&(this.pressed=!0);break;case"mousemove":0===t.which&&(this.pressed=!1),this.pressed||this.callback({type:e7,srcEvent:t,pointerType:"mouse",target:t.target});break;case"mouseup":this.pressed=!1}}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/inputs/key-input.js
//# sourceMappingURL=move-input.js.map
const{KEY_EVENTS:ni}=b,no="keydown",na="keyup";class ns{constructor(t,n,e={}){this.element=t,this.callback=n,this.options=Object.assign({enable:!0},e),this.enableDownEvent=this.options.enable,this.enableUpEvent=this.options.enable,this.events=ni.concat(e.events||[]),this.handleEvent=this.handleEvent.bind(this),t.tabIndex=e.tabIndex||0,t.style.outline="none",this.events.forEach(e=>t.addEventListener(e,this.handleEvent))}destroy(){this.events.forEach(t=>this.element.removeEventListener(t,this.handleEvent))}enableEventType(t,e){t===no&&(this.enableDownEvent=e),t===na&&(this.enableUpEvent=e)}handleEvent(t){const e=t.target||t.srcElement;("INPUT"!==e.tagName||"text"!==e.type)&&"TEXTAREA"!==e.tagName&&(this.enableDownEvent&&"keydown"===t.type&&this.callback({type:no,srcEvent:t,key:t.key,target:t.target}),this.enableUpEvent&&"keyup"===t.type&&this.callback({type:na,srcEvent:t,key:t.key,target:t.target}))}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/inputs/contextmenu-input.js
//# sourceMappingURL=key-input.js.map
const nc="contextmenu";class nu{constructor(t,e,n={}){this.element=t,this.callback=e,this.options=Object.assign({enable:!0},n),this.handleEvent=this.handleEvent.bind(this),t.addEventListener("contextmenu",this.handleEvent)}destroy(){this.element.removeEventListener("contextmenu",this.handleEvent)}enableEventType(t,e){t===nc&&(this.options.enable=e)}handleEvent(t){this.options.enable&&this.callback({type:nc,center:{x:t.clientX,y:t.clientY},srcEvent:t,pointerType:"mouse",target:t.target})}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/utils/event-utils.js
const nl={pointerdown:1,pointermove:2,pointerup:4,mousedown:1,mousemove:2,mouseup:4},nh={srcElement:"root",priority:0};class np{constructor(t){this.eventManager=t,this.handlers=[],this.handlersByElement=new Map,this.handleEvent=this.handleEvent.bind(this),this._active=!1}isEmpty(){return!this._active}add(i,o,t,a=!1,s=!1){const{handlers:c,handlersByElement:r}=this;t&&("object"!=typeof t||t.addEventListener)&&(t={srcElement:t}),t=t?Object.assign({},nh,t):nh;let e=r.get(t.srcElement);e||(e=[],r.set(t.srcElement,e));const n={type:i,handler:o,srcElement:t.srcElement,priority:t.priority};a&&(n.once=!0),s&&(n.passive=!0),c.push(n),this._active=this._active||!n.passive;let u=e.length-1;for(;u>=0&&!(e[u].priority>=n.priority);)u--;e.splice(u+1,0,n)}remove(e,n){const{handlers:t,handlersByElement:r}=this;for(let i=t.length-1;i>=0;i--){const o=t[i];if(o.type===e&&o.handler===n){t.splice(i,1);const e=r.get(o.srcElement);e.splice(e.indexOf(o),1),0===e.length&&r.delete(o.srcElement)}}this._active=t.some(t=>!t.passive)}handleEvent(t){if(this.isEmpty())return;const e=this._normalizeEvent(t);let n=t.srcEvent.target;for(;n&&n!==e.rootElement;){if(this._emit(e,n),e.handled)return;n=n.parentNode}this._emit(e,"root")}_emit(n,t){const e=this.handlersByElement.get(t);if(e){let t=!1;const r=()=>{n.handled=!0},i=()=>{n.handled=!0,t=!0},o=[];for(let a=0;a<e.length;a++){const{type:s,handler:c,once:u}=e[a];if(c(Object.assign({},n,{type:s,stopPropagation:r,stopImmediatePropagation:i})),u&&o.push(e[a]),t)break}for(let t=0;t<o.length;t++){const{type:e,handler:n}=o[t];this.remove(e,n)}}}_normalizeEvent(t){const e=this.eventManager.element;return Object.assign({},t,function(s){const t=nl[s.srcEvent.type];if(!t)return null;const{buttons:e,button:o,which:a}=s.srcEvent;let n=!1,r=!1,i=!1;return 4!==t&&(2!==t||Number.isFinite(e))?2===t?(n=!!(1&e),r=!!(4&e),i=!!(2&e)):1===t&&(n=0===o,r=1===o,i=2===o):(n=1===a,r=2===a,i=3===a),{leftButton:n,middleButton:r,rightButton:i}}(t),function(n,t){const{srcEvent:r}=n;if(!n.center&&!Number.isFinite(r.clientX))return null;const i=n.center||{x:r.clientX,y:r.clientY},e=t.getBoundingClientRect(),o=e.width/t.offsetWidth||1,a=e.height/t.offsetHeight||1,s={x:(i.x-e.left-t.clientLeft)/o,y:(i.y-e.top-t.clientTop)/a};return{center:i,offsetCenter:s}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/utils/event-registrar.js
(t,e),{handled:!1,rootElement:e})}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/event-manager.js
//# sourceMappingURL=event-registrar.js.map
const nf={events:null,recognizers:null,recognizerOptions:{},Manager:$,touchAction:"none",tabIndex:0};class nd{constructor(n=null,t={}){this.options=Object.assign({},nf,t),this.events=new Map,this._onBasicInput=this._onBasicInput.bind(this),this._onOtherEvent=this._onOtherEvent.bind(this),this.setElement(n);const{events:e}=t;e&&this.on(e)}setElement(t){if(this.element&&this.destroy(),this.element=t,!t)return;const{options:e}=this,n=e.Manager;for(const r in this.manager=new n(t,{touchAction:e.touchAction,recognizers:e.recognizers||eG}).on("hammer.input",this._onBasicInput),e.recognizers||Object.keys(e$).forEach(t=>{const e=this.manager.get(t);e&&e$[t].forEach(t=>{e.recognizeWith(t)})}),e.recognizerOptions){const t=this.manager.get(r);if(t){const n=e.recognizerOptions[r];delete n.enable,t.set(n)}}for(const[n,r]of(this.wheelInput=new e6(t,this._onOtherEvent,{enable:!1}),this.moveInput=new nr(t,this._onOtherEvent,{enable:!1}),this.keyInput=new ns(t,this._onOtherEvent,{enable:!1,tabIndex:e.tabIndex}),this.contextmenuInput=new nu(t,this._onOtherEvent,{enable:!1}),this.events))r.isEmpty()||(this._toggleRecognizer(r.recognizerName,!0),this.manager.on(n,r.handleEvent))}destroy(){this.element&&(this.wheelInput.destroy(),this.moveInput.destroy(),this.keyInput.destroy(),this.contextmenuInput.destroy(),this.manager.destroy(),this.wheelInput=null,this.moveInput=null,this.keyInput=null,this.contextmenuInput=null,this.manager=null,this.element=null)}on(t,e,n){this._addEventHandler(t,e,n,!1)}once(t,e,n){this._addEventHandler(t,e,n,!0)}watch(t,e,n){this._addEventHandler(t,e,n,!1,!0)}off(t,e){this._removeEventHandler(t,e)}_toggleRecognizer(t,e){const{manager:n}=this;if(!n)return;const r=n.get(t);if(r&&r.options.enable!==e){r.set({enable:e});const i=eJ[t];i&&!this.options.recognizers&&i.forEach(i=>{const o=n.get(i);e?(o.requireFailure(t),r.dropRequireFailure(i)):o.dropRequireFailure(t)})}this.wheelInput.enableEventType(t,e),this.moveInput.enableEventType(t,e),this.keyInput.enableEventType(t,e),this.contextmenuInput.enableEventType(t,e)}_addEventHandler(n,o,a,s,c){if("string"!=typeof n){for(const t in a=o,n)this._addEventHandler(t,n[t],a,s,c);return}const{manager:r,events:i}=this,e=e1[n]||n;let t=i.get(e);!t&&(t=new np(this),i.set(e,t),t.recognizerName=e0[e]||e,r&&r.on(e,t.handleEvent)),t.add(n,o,a,s,c),t.isEmpty()||this._toggleRecognizer(t.recognizerName,!0)}_removeEventHandler(t,n){if("string"!=typeof t){for(const e in t)this._removeEventHandler(e,t[e]);return}const{events:r}=this,i=e1[t]||t,e=r.get(i);if(e&&(e.remove(t,n),e.isEmpty())){const{recognizerName:t}=e;let n=!1;for(const e of r.values())if(e.recognizerName===t&&!e.isEmpty()){n=!0;break}n||this._toggleRecognizer(t,!1)}}_onBasicInput(t){const{srcEvent:n}=t,e=eQ[n.type];e&&this.manager.emit(e,t)}_onOtherEvent(t){this.manager.emit(t.type,t)}}// CONCATENATED MODULE: ./node_modules/mjolnir.js/dist/esm/index.js // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/map-controller.js
//# sourceMappingURL=event-manager.js.map
//# sourceMappingURL=index.js.map
function nv(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}function ng(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nv(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):nv(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var nm={transitionDuration:0},nb={transitionDuration:300,transitionEasing:function(t){return t},transitionInterpolator:new x,transitionInterruption:D.BREAK},ny=function(t){return 1-(1-t)*(1-t)},nw=["wheel"],nO=["panstart","panmove","panend"],nE=["pinchstart","pinchmove","pinchend"],n_=["tripanstart","tripanmove","tripanend"],nP=["doubletap"],nM=["keydown"],Q=function(){function t(){var e=this;et(this,t),a(this,"events",[]),a(this,"scrollZoom",!0),a(this,"dragPan",!0),a(this,"dragRotate",!0),a(this,"doubleClickZoom",!0),a(this,"touchZoom",!0),a(this,"touchRotate",!1),a(this,"keyboard",!0),a(this,"_interactionState",{isDragging:!1}),a(this,"_events",{}),a(this,"_setInteractionState",function(t){Object.assign(e._interactionState,t),e.onStateChange&&e.onStateChange(e._interactionState)}),a(this,"_onTransition",function(t,n){e.onViewportChange(t,e._interactionState,n)}),this.handleEvent=this.handleEvent.bind(this),this._transitionManager=new C({onViewportChange:this._onTransition,onStateChange:this._setInteractionState})}return en(t,[{key:"handleEvent",value:function(t){this.mapState=this.getMapState();var e=this._eventStartBlocked;switch(t.type){case"panstart":return!e&&this._onPanStart(t);case"panmove":return this._onPan(t);case"panend":return this._onPanEnd(t);case"pinchstart":return!e&&this._onPinchStart(t);case"pinchmove":return this._onPinch(t);case"pinchend":return this._onPinchEnd(t);case"tripanstart":return!e&&this._onTriplePanStart(t);case"tripanmove":return this._onTriplePan(t);case"tripanend":return this._onTriplePanEnd(t);case"doubletap":return this._onDoubleTap(t);case"wheel":return this._onWheel(t);case"keydown":return this._onKeyDown(t);default:return!1}}},{key:"getCenter",value:function(e){var t=e.offsetCenter;return[t.x,t.y]}},{key:"isFunctionKeyPressed",value:function(e){var t=e.srcEvent;return!!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)}},{key:"blockEvents",value:function(t){var n=this,e=setTimeout(function(){n._eventStartBlocked===e&&(n._eventStartBlocked=null)},t);this._eventStartBlocked=e}},{key:"updateViewport",value:function(t,n,r){var i=this.mapState instanceof eb?this.mapState.getViewportProps():this.mapState,e=ng(ng({},t.getViewportProps()),n),o=Object.keys(e).some(function(t){return i[t]!==e[t]});this._state=t.getState(),this._setInteractionState(r),o&&this.onViewportChange(e,this._interactionState,i)}},{key:"getMapState",value:function(t){return new eb(ng(ng(ng({},this.mapStateProps),this._state),t))}},{key:"isDragging",value:function(){return this._interactionState.isDragging}},{key:"setOptions",value:function(t){var w=t.onViewportChange,O=t.onStateChange,i=t.eventManager,o=void 0===i?this.eventManager:i,a=t.isInteractive,e=void 0===a||a,s=t.scrollZoom,c=void 0===s?this.scrollZoom:s,u=t.dragPan,l=void 0===u?this.dragPan:u,h=t.dragRotate,p=void 0===h?this.dragRotate:h,f=t.doubleClickZoom,d=void 0===f?this.doubleClickZoom:f,v=t.touchZoom,g=void 0===v?this.touchZoom:v,m=t.touchRotate,n=void 0===m?this.touchRotate:m,b=t.keyboard,y=void 0===b?this.keyboard:b;this.onViewportChange=w,this.onStateChange=O;var r=this.mapStateProps||{},E=r.height!==t.height||r.width!==t.width;this.mapStateProps=t,E&&(this.mapState=r,this.updateViewport(new eb(t))),this._transitionManager.processViewportChange(t),this.eventManager!==o&&(this.eventManager=o,this._events={},this.toggleEvents(this.events,!0)),this.toggleEvents(nw,e&&!!c),this.toggleEvents(nO,e&&!!(l||p)),this.toggleEvents(nE,e&&!!(g||n)),this.toggleEvents(n_,e&&!!n),this.toggleEvents(nP,e&&!!d),this.toggleEvents(nM,e&&!!y),this.scrollZoom=c,this.dragPan=l,this.dragRotate=p,this.doubleClickZoom=d,this.touchZoom=g,this.touchRotate=n,this.keyboard=y}},{key:"toggleEvents",value:function(t,e){var n=this;this.eventManager&&t.forEach(function(t){n._events[t]!==e&&(n._events[t]=e,e?n.eventManager.on(t,n.handleEvent):n.eventManager.off(t,n.handleEvent))})}},{key:"_onPanStart",value:function(t){var e=this.getCenter(t);this._panRotate=this.isFunctionKeyPressed(t)||t.rightButton;var n=this._panRotate?this.mapState.rotateStart({pos:e}):this.mapState.panStart({pos:e});return this.updateViewport(n,nm,{isDragging:!0}),!0}},{key:"_onPan",value:function(t){return!!this.isDragging()&&(this._panRotate?this._onPanRotate(t):this._onPanMove(t))}},{key:"_onPanEnd",value:function(t){return!!this.isDragging()&&(this._panRotate?this._onPanRotateEnd(t):this._onPanMoveEnd(t))}},{key:"_onPanMove",value:function(t){if(!this.dragPan)return!1;var e=this.getCenter(t),n=this.mapState.pan({pos:e});return this.updateViewport(n,nm,{isPanning:!0}),!0}},{key:"_onPanMoveEnd",value:function(e){if(this.dragPan){var n=this.dragPan.inertia,r=void 0===n?300:n;if(r&&e.velocity){var i=this.getCenter(e),o=[i[0]+e.velocityX*r/2,i[1]+e.velocityY*r/2],a=this.mapState.pan({pos:o}).panEnd();return this.updateViewport(a,ng(ng({},nb),{},{transitionDuration:r,transitionEasing:ny}),{isDragging:!1,isPanning:!0}),!0}}var t=this.mapState.panEnd();return this.updateViewport(t,null,{isDragging:!1,isPanning:!1}),!0}},{key:"_onPanRotate",value:function(t){if(!this.dragRotate)return!1;var e=this.getCenter(t),n=this.mapState.rotate({pos:e});return this.updateViewport(n,nm,{isRotating:!0}),!0}},{key:"_onPanRotateEnd",value:function(e){if(this.dragRotate){var n=this.dragRotate.inertia,r=void 0===n?300:n;if(r&&e.velocity){var i=this.getCenter(e),o=[i[0]+e.velocityX*r/2,i[1]+e.velocityY*r/2],a=this.mapState.rotate({pos:o}).rotateEnd();return this.updateViewport(a,ng(ng({},nb),{},{transitionDuration:r,transitionEasing:ny}),{isDragging:!1,isRotating:!0}),!0}}var t=this.mapState.panEnd();return this.updateViewport(t,null,{isDragging:!1,isRotating:!1}),!0}},{key:"_onWheel",value:function(e){if(!this.scrollZoom)return!1;var n=this.scrollZoom,r=n.speed,i=n.smooth;e.preventDefault();var o=this.getCenter(e),a=e.delta,t=2/(1+Math.exp(-Math.abs(a*(void 0===r?.01:r))));a<0&&0!==t&&(t=1/t);var s=this.mapState.zoom({pos:o,scale:t});return s.getViewportProps().zoom!==this.mapStateProps.zoom&&(this.updateViewport(s,ng(ng({},nb),{},{transitionInterpolator:new x({around:o}),transitionDuration:void 0!==i&&i?250:1}),{isPanning:!0,isZooming:!0}),!0)}},{key:"_onPinchStart",value:function(t){var e=this.getCenter(t),n=this.mapState.zoomStart({pos:e}).rotateStart({pos:e});return this._startPinchRotation=t.rotation,this._lastPinchEvent=t,this.updateViewport(n,nm,{isDragging:!0}),!0}},{key:"_onPinch",value:function(t){if(!this.isDragging()||!this.touchZoom&&!this.touchRotate)return!1;var e=this.mapState;if(this.touchZoom){var n=t.scale,r=this.getCenter(t);e=e.zoom({pos:r,scale:n})}if(this.touchRotate){var i=t.rotation;e=e.rotate({deltaAngleX:this._startPinchRotation-i})}return this.updateViewport(e,nm,{isDragging:!0,isPanning:!!this.touchZoom,isZooming:!!this.touchZoom,isRotating:!!this.touchRotate}),this._lastPinchEvent=t,!0}},{key:"_onPinchEnd",value:function(e){if(!this.isDragging())return!1;if(this.touchZoom){var n=this.touchZoom.inertia,r=void 0===n?300:n,i=this._lastPinchEvent;if(r&&i&&e.scale!==i.scale){var o=this.getCenter(e),a=this.mapState.rotateEnd(),s=Math.log2(e.scale),c=(s-Math.log2(i.scale))/(e.deltaTime-i.deltaTime),u=Math.pow(2,s+c*r/2);return a=a.zoom({pos:o,scale:u}).zoomEnd(),this.updateViewport(a,ng(ng({},nb),{},{transitionInterpolator:new x({around:o}),transitionDuration:r,transitionEasing:ny}),{isDragging:!1,isPanning:!!this.touchZoom,isZooming:!!this.touchZoom,isRotating:!1}),this.blockEvents(r),!0}}var t=this.mapState.zoomEnd().rotateEnd();return this._state.startPinchRotation=0,this.updateViewport(t,null,{isDragging:!1,isPanning:!1,isZooming:!1,isRotating:!1}),this._startPinchRotation=null,this._lastPinchEvent=null,!0}},{key:"_onTriplePanStart",value:function(t){var e=this.getCenter(t),n=this.mapState.rotateStart({pos:e});return this.updateViewport(n,nm,{isDragging:!0}),!0}},{key:"_onTriplePan",value:function(t){if(!this.isDragging()||!this.touchRotate)return!1;var e=this.getCenter(t);e[0]-=t.deltaX;var n=this.mapState.rotate({pos:e});return this.updateViewport(n,nm,{isRotating:!0}),!0}},{key:"_onTriplePanEnd",value:function(e){if(!this.isDragging())return!1;if(this.touchRotate){var n=this.touchRotate.inertia,r=void 0===n?300:n;if(r&&e.velocityY){var i=this.getCenter(e),o=[i[0],i[1]+=e.velocityY*r/2],a=this.mapState.rotate({pos:o});return this.updateViewport(a,ng(ng({},nb),{},{transitionDuration:r,transitionEasing:ny}),{isDragging:!1,isRotating:!0}),this.blockEvents(r),!1}}var t=this.mapState.rotateEnd();return this.updateViewport(t,null,{isDragging:!1,isRotating:!1}),!0}},{key:"_onDoubleTap",value:function(t){if(!this.doubleClickZoom)return!1;var e=this.getCenter(t),n=this.isFunctionKeyPressed(t),r=this.mapState.zoom({pos:e,scale:n?.5:2});return this.updateViewport(r,Object.assign({},nb,{transitionInterpolator:new x({around:e})}),{isZooming:!0}),!0}},{key:"_onKeyDown",value:function(a){if(!this.keyboard)return!1;var e,n=this.isFunctionKeyPressed(a),r=this.keyboard,s=r.zoomSpeed,i=void 0===s?2:s,c=r.moveSpeed,o=void 0===c?100:c,u=r.rotateSpeedX,l=void 0===u?15:u,h=r.rotateSpeedY,p=void 0===h?10:h,t=this.mapStateProps;switch(a.srcEvent.keyCode){case 189:e=n?this.getMapState({zoom:t.zoom-Math.log2(i)-1}):this.getMapState({zoom:t.zoom-Math.log2(i)});break;case 187:e=n?this.getMapState({zoom:t.zoom+Math.log2(i)+1}):this.getMapState({zoom:t.zoom+Math.log2(i)});break;case 37:e=n?this.getMapState({bearing:t.bearing-l}):this.mapState.pan({pos:[o,0],startPos:[0,0]});break;case 39:e=n?this.getMapState({bearing:t.bearing+l}):this.mapState.pan({pos:[-o,0],startPos:[0,0]});break;case 38:e=n?this.getMapState({pitch:t.pitch+p}):this.mapState.pan({pos:[0,o],startPos:[0,0]});break;case 40:e=n?this.getMapState({pitch:t.pitch-p}):this.mapState.pan({pos:[0,-o],startPos:[0,0]});break;default:return!1}return this.updateViewport(e,nb)}}]),t}();//# sourceMappingURL=map-controller.js.map
function nj(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}function nS(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nj(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):nj(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var tt=Object.assign({},u.propTypes,{maxZoom:t.number,minZoom:t.number,maxPitch:t.number,minPitch:t.number,onViewStateChange:t.func,onViewportChange:t.func,onInteractionStateChange:t.func,transitionDuration:t.oneOfType([t.number,t.string]),transitionInterpolator:t.object,transitionInterruption:t.number,transitionEasing:t.func,onTransitionStart:t.func,onTransitionInterrupt:t.func,onTransitionEnd:t.func,scrollZoom:t.oneOfType([t.bool,t.object]),dragPan:t.oneOfType([t.bool,t.object]),dragRotate:t.oneOfType([t.bool,t.object]),doubleClickZoom:t.bool,touchZoom:t.oneOfType([t.bool,t.object]),touchRotate:t.oneOfType([t.bool,t.object]),keyboard:t.oneOfType([t.bool,t.object]),onHover:t.func,onClick:t.func,onDblClick:t.func,onContextMenu:t.func,onMouseDown:t.func,onMouseMove:t.func,onMouseUp:t.func,onTouchStart:t.func,onTouchMove:t.func,onTouchEnd:t.func,onMouseEnter:t.func,onMouseLeave:t.func,onMouseOut:t.func,onWheel:t.func,touchAction:t.string,eventRecognizerOptions:t.object,clickRadius:t.number,interactiveLayerIds:t.array,getCursor:t.func,controller:t.instanceOf(Q)}),te=Object.assign({},u.defaultProps,S,C.defaultProps,{onViewStateChange:null,onViewportChange:null,onClick:null,onNativeClick:null,onHover:null,onContextMenu:function(t){return t.preventDefault()},scrollZoom:!0,dragPan:!0,dragRotate:!0,doubleClickZoom:!0,touchZoom:!0,touchRotate:!1,keyboard:!0,touchAction:"none",eventRecognizerOptions:{},clickRadius:0,getCursor:function(t){var e=t.isDragging,n=t.isHovering;return e?"grabbing":n?"pointer":"grab"}});function nT(t){if(t.lngLat||!t.offsetCenter)return t;var e=t.offsetCenter,n=e.x,r=e.y;if(!Number.isFinite(n)||!Number.isFinite(r))return t;var i=[n,r];if(t.point=i,this.map){var o=this.map.unproject(i);t.lngLat=[o.lng,o.lat]}return t}function nk(t){var e=this.map;if(!e||!t)return null;var n={},r=this.props.clickRadius;this.props.interactiveLayerIds&&(n.layers=this.props.interactiveLayerIds);try{return e.queryRenderedFeatures(r?[[t[0]-r,t[1]+r],[t[0]+r,t[1]-r]]:t,n)}catch(t){return null}}function nx(e,n){var t=this.props[e];t&&t(nT.call(this,n))}function nD(t){nx.call(this,"touch"===t.pointerType?"onTouchStart":"onMouseDown",t)}function nC(t){nx.call(this,"touch"===t.pointerType?"onTouchEnd":"onMouseUp",t)}function nR(t){if(nx.call(this,"touch"===t.pointerType?"onTouchMove":"onMouseMove",t),!this.state.isDragging){var e,n=this.props,r=n.onHover,i=n.interactiveLayerIds;t=nT.call(this,t),(i||r)&&(e=nk.call(this,t.point));var o=!!(i&&e&&e.length>0),a=o&&!this.state.isHovering,s=!o&&this.state.isHovering;(r||a)&&(t.features=e,r&&r(t)),a&&nx.call(this,"onMouseEnter",t),s&&nx.call(this,"onMouseLeave",t),(a||s)&&this.setState({isHovering:o})}}function nA(e){var n=this.props,r=n.onClick,o=n.onNativeClick,a=n.onDblClick,s=n.doubleClickZoom,t=[],i=a||s;switch(e.type){case"anyclick":t.push(o),i||t.push(r);break;case"click":i&&t.push(r)}(t=t.filter(Boolean)).length&&((e=nT.call(this,e)).features=nk.call(this,e.point),t.forEach(function(t){return t(e)}))}var f=(0,n.forwardRef)(function(e,s){var c,b,o=(0,n.useContext)(T),y=(0,n.useMemo)(function(){return e.controller||new Q},[]),w=(0,n.useMemo)(function(){return new nd(null,{touchAction:e.touchAction,recognizerOptions:e.eventRecognizerOptions})},[]),a=(0,n.useRef)(null),i=(0,n.useRef)(null),t=(0,n.useRef)({width:0,height:0,state:{isHovering:!1,isDragging:!1}}).current;t.props=e,t.map=i.current&&i.current.getMap(),t.setState=function(n){t.state=nS(nS({},t.state),n),a.current.style.cursor=e.getCursor(t.state)};var l=!0,h=function(e,n,r){if(l){c=[e,n,r];return}var i=t.props,o=i.onViewStateChange,a=i.onViewportChange;Object.defineProperty(e,"position",{get:function(){return[0,0,e_(t.map,e)]}}),o&&o({viewState:e,interactionState:n,oldViewState:r}),a&&a(e,n,r)};(0,n.useImperativeHandle)(s,function(){return{getMap:i.current&&i.current.getMap,queryRenderedFeatures:i.current&&i.current.queryRenderedFeatures}},[]);var r=(0,n.useMemo)(function(){return nS(nS({},o),{},{eventManager:w,container:o.container||a.current})},[o,a.current]);r.onViewportChange=h,r.viewport=o.viewport||eS(t),t.viewport=r.viewport;var O=function(e){var n=e.isDragging,r=void 0!==n&&n;if(r!==t.state.isDragging&&t.setState({isDragging:r}),l){b=e;return}var i=t.props.onInteractionStateChange;i&&i(e)},p=function(){t.width&&t.height&&y.setOptions(nS(nS(nS({},t.props),t.props.viewState),{},{isInteractive:!!(t.props.onViewStateChange||t.props.onViewportChange),onViewportChange:h,onStateChange:O,eventManager:w,width:t.width,height:t.height}))};(0,n.useEffect)(function(){return w.setElement(a.current),w.on({pointerdown:nD.bind(t),pointermove:nR.bind(t),pointerup:nC.bind(t),pointerleave:nx.bind(t,"onMouseOut"),click:nA.bind(t),anyclick:nA.bind(t),dblclick:nx.bind(t,"onDblClick"),wheel:nx.bind(t,"onWheel"),contextmenu:nx.bind(t,"onContextMenu")}),function(){w.destroy()}},[]),eE(function(){if(c){var t;h.apply(void 0,function(t){if(Array.isArray(t))return ty(t)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
(t=c)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
(t)||tw(t)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js
())}b&&O(b)}),p();var f=e.width,d=e.height,v=e.style,g=e.getCursor,m=(0,n.useMemo)(function(){return nS(nS({position:"relative"},v),{},{width:f,height:d,cursor:g(t.state)})},[v,f,d,g,t.state]);return c&&t._child||(t._child=n.createElement(eO,{value:r},n.createElement("div",{key:"event-canvas",ref:a,style:m},n.createElement(u,tb({},e,{width:"100%",height:"100%",style:null,onResize:function(e){var n=e.width,r=e.height;t.width=n,t.height=r,p(),t.props.onResize({width:n,height:r})},ref:i}))))),l=!1,t._child});f.supported=u.supported,f.propTypes=tt,f.defaultProps=te;/* harmony default export */var nI=f;// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/utils/deep-equal.js
t.string.isRequired,t.string,t.oneOf(["fill","line","symbol","circle","fill-extrusion","raster","background","heatmap","hillshade","sky"]).isRequired,t.string,t.string,t.string;//# sourceMappingURL=layer.js.map
var o={captureScroll:!1,captureDrag:!0,captureClick:!0,captureDoubleClick:!0,capturePointerMove:!1},r={captureScroll:t.bool,captureDrag:t.bool,captureClick:t.bool,captureDoubleClick:t.bool,capturePointerMove:t.bool};function nL(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=(0,n.useContext)(T),i=(0,n.useRef)(null),e=(0,n.useRef)({props:r,state:{},context:t,containerRef:i}).current;return e.props=r,e.context=t,(0,n.useEffect)(function(){return function(t){var e=t.containerRef.current,n=t.context.eventManager;if(e&&n){var r={wheel:function(n){var e=t.props;e.captureScroll&&n.stopPropagation(),e.onScroll&&e.onScroll(n,t)},panstart:function(n){var e=t.props;e.captureDrag&&n.stopPropagation(),e.onDragStart&&e.onDragStart(n,t)},anyclick:function(n){var e=t.props;e.captureClick&&n.stopPropagation(),e.onNativeClick&&e.onNativeClick(n,t)},click:function(n){var e=t.props;e.captureClick&&n.stopPropagation(),e.onClick&&e.onClick(n,t)},dblclick:function(n){var e=t.props;e.captureDoubleClick&&n.stopPropagation(),e.onDoubleClick&&e.onDoubleClick(n,t)},pointermove:function(n){var e=t.props;e.capturePointerMove&&n.stopPropagation(),e.onPointerMove&&e.onPointerMove(n,t)}};return n.watch(r,e),function(){n.off(r)}}}(e)},[t.eventManager]),e}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/base-control.js
function nN(e){var t=e.instance,n=nL(e),r=n.context,i=n.containerRef;return t._context=r,t._containerRef=i,t._render()}var R=function(e){eR(t,e);var r,i=(r=function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}(),function(){var e,n=eL(t);return e=r?Reflect.construct(n,arguments,eL(this).constructor):n.apply(this,arguments),eI(this,e)});function t(){var e;et(this,t);for(var o=arguments.length,r=Array(o),s=0;s<o;s++)r[s]=arguments[s];return a(eD(e=i.call.apply(i,[this].concat(r))),"_context",{}),a(eD(e),"_containerRef",(0,n.createRef)()),a(eD(e),"_onScroll",function(t){}),a(eD(e),"_onDragStart",function(t){}),a(eD(e),"_onDblClick",function(t){}),a(eD(e),"_onClick",function(t){}),a(eD(e),"_onPointerMove",function(t){}),e}return en(t,[{key:"_render",value:function(){throw Error("_render() not implemented")}},{key:"render",value:function(){return n.createElement(nN,tb({instance:this},this.props,{onScroll:this._onScroll,onDragStart:this._onDragStart,onDblClick:this._onDblClick,onClick:this._onClick,onPointerMove:this._onPointerMove}))}}]),t}(n.PureComponent);//# sourceMappingURL=base-control.js.map
function nz(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}function nF(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nz(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):nz(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}a(R,"propTypes",r),a(R,"defaultProps",o);var tn=Object.assign({},r,{draggable:t.bool,onDrag:t.func,onDragEnd:t.func,onDragStart:t.func,offsetLeft:t.number,offsetTop:t.number}),tr=Object.assign({},o,{draggable:!1,offsetLeft:0,offsetTop:0});function nV(e){var t=e.offsetCenter;return[t.x,t.y]}function nZ(t,e,n,r){var i=t[0]+e[0]-n.offsetLeft,o=t[1]+e[1]-n.offsetTop;return r.viewport.unproject([i,o])}function nB(n,t){var e=t.props,r=t.callbacks,i=t.state,o=t.context,a=t.containerRef;if(e.draggable){n.stopPropagation();var s=nV(n),c=function(e,n){var t=e.center,r=t.x,i=t.y;if(n){var o=n.getBoundingClientRect();return[o.left-r,o.top-i]}return null}(n,a.current);if(i.setDragPos(s),i.setDragOffset(c),r.onDragStart&&c){var u=Object.assign({},n);u.lngLat=nZ(s,c,e,o),r.onDragStart(u)}}}//# sourceMappingURL=draggable-control.js.map
var nU="undefined"!=typeof window&&window.devicePixelRatio||1,nq=function(t){return Math.round(t*nU)/nU},nW=function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"x";if(null===t)return e;var n="x"===r?t.offsetWidth:t.offsetHeight;return nq(e/100*n)/n*100};//# sourceMappingURL=crisp-pixel.js.map
function nH(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}var ti=Object.assign({},tn,{className:t.string,longitude:t.number.isRequired,latitude:t.number.isRequired,style:t.object});function y(e){var s,r,c,u,l,h,t,i=(r=(s=tE((0,n.useState)(null),2))[0],c=s[1],l=(u=tE((0,n.useState)(null),2))[0],h=u[1],(t=nL(nF(nF({},e),{},{onDragStart:nB}))).callbacks=e,t.state.dragPos=r,t.state.setDragPos=c,t.state.dragOffset=l,t.state.setDragOffset=h,(0,n.useEffect)(function(){return function(t){var e=t.context.eventManager;if(e&&t.state.dragPos){var n={panmove:function(e){return function(e,t){var a=t.props,r=t.callbacks,n=t.state,s=t.context;e.stopPropagation();var i=nV(e);n.setDragPos(i);var o=n.dragOffset;if(r.onDrag&&o){var c=Object.assign({},e);c.lngLat=nZ(i,o,a,s),r.onDrag(c)}}(e,t)},panend:function(e){return function(n,t){var a=t.props,r=t.callbacks,e=t.state,s=t.context;n.stopPropagation();var i=e.dragPos,o=e.dragOffset;if(e.setDragPos(null),e.setDragOffset(null),r.onDragEnd&&i&&o){var c=Object.assign({},n);c.lngLat=nZ(i,o,a,s),r.onDragEnd(c)}}(e,t)},pancancel:function(n){var e;return e=t.state,void(n.stopPropagation(),e.setDragPos(null),e.setDragOffset(null))}};return e.watch(n),function(){e.off(n)}}}(t)},[t.context.eventManager,!!r]),t),f=i.state,d=i.containerRef,v=e.children,g=e.className,m=e.draggable,M=e.style,b=f.dragPos,y=function(e){var t=e.props,i=e.state,o=e.context,a=t.longitude,s=t.latitude,u=t.offsetLeft,l=t.offsetTop,n=i.dragPos,r=i.dragOffset,h=o.viewport,p=o.map;if(n&&r)return[n[0]+r[0],n[1]+r[1]];var f=e_(p,{longitude:a,latitude:s}),c=tE(h.project([a,s,f]),2),d=c[0],v=c[1];return[d+=u,v+=l]}(i),p=tE(y,2),w=p[0],O=p[1],E="translate(".concat(nq(w),"px, ").concat(nq(O),"px)"),_=m?b?"grabbing":"grab":"auto",P=(0,n.useMemo)(function(){var t=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nH(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):nH(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute",left:0,top:0,transform:E,cursor:_},M);return n.createElement("div",{className:"mapboxgl-marker ".concat(g),ref:i.containerRef,style:t},v)},[v,g]),o=d.current;return o&&(o.style.transform=E,o.style.cursor=_),P}y.defaultProps=Object.assign({},tr,{className:""}),y.propTypes=ti,n.memo(y);//# sourceMappingURL=marker.js.map
var A={top:{x:.5,y:0},"top-left":{x:0,y:0},"top-right":{x:1,y:0},bottom:{x:.5,y:1},"bottom-left":{x:0,y:1},"bottom-right":{x:1,y:1},left:{x:0,y:.5},right:{x:1,y:.5}},nX=Object.keys(A),to=Object.assign({},r,{className:t.string,longitude:t.number.isRequired,latitude:t.number.isRequired,altitude:t.number,offsetLeft:t.number,offsetTop:t.number,tipSize:t.number,closeButton:t.bool,closeOnClick:t.bool,anchor:t.oneOf(Object.keys(A)),dynamicPosition:t.bool,sortByDepth:t.bool,onClose:t.func}),ta=Object.assign({},o,{className:"",offsetLeft:0,offsetTop:0,tipSize:10,anchor:"bottom",dynamicPosition:!0,sortByDepth:!1,closeButton:!0,closeOnClick:!0,onClose:function(){}});function w(t){var r,d,v,g,c,m,b,u,l,i,o,a,y,w,O,E,_,P,s,h=(0,n.useRef)(null),M=nL(t),p=M.context,j=M.containerRef,F=tE((0,n.useState)(!1),2)[1];(0,n.useEffect)(function(){F(!0)},[h.current]),(0,n.useEffect)(function(){if(p.eventManager&&t.closeOnClick){var e=function(){return M.props.onClose()};return p.eventManager.on("anyclick",e),function(){p.eventManager.off("anyclick",e)}}},[p.eventManager,t.closeOnClick]);var e=p.viewport,D=p.map,C=t.className,S=t.longitude,T=t.latitude,R=t.tipSize,I=t.closeButton,L=t.children,f=t.altitude;void 0===f&&(f=e_(D,{longitude:S,latitude:T}));var k=e.project([S,T,f]),x=(r=h.current,v=(d=tE(k,2))[0],g=d[1],c=t.anchor,m=t.dynamicPosition,b=t.tipSize,r&&m?function(t){var h=t.x,p=t.y,f=t.width,d=t.height,r=t.selfWidth,i=t.selfHeight,o=t.anchor,a=t.padding,e=void 0===a?0:a,s=A[o],n=s.x,c=s.y,u=p-c*i,v=u+i,g=Math.max(0,e-u)+Math.max(0,v-d+e);if(g>0){var w=c,O=g;for(c=0;c<=1;c+=.5)v=(u=p-c*i)+i,(g=Math.max(0,e-u)+Math.max(0,v-d+e))<O&&(O=g,w=c);c=w}var m=.5;.5===c&&(n=Math.floor(n),m=1);var l=h-n*r,b=l+r,y=Math.max(0,e-l)+Math.max(0,b-f+e);if(y>0){var E=n,_=y;for(n=0;n<=1;n+=m)b=(l=h-n*r)+r,(y=Math.max(0,e-l)+Math.max(0,b-f+e))<_&&(_=y,E=n);n=E}return nX.find(function(e){var t=A[e];return t.x===n&&t.y===c})||o}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/popup.js
({x:v,y:g,anchor:c,padding:b,width:e.width,height:e.height,selfWidth:r.clientWidth,selfHeight:r.clientHeight}):c),N=(u=j.current,i=(l=tE(k,3))[0],o=l[1],a=l[2],y=t.offsetLeft,w=t.offsetTop,O=t.sortByDepth,_=nW(u,-(100*(E=A[x]).x)),P=nW(u,-(100*E.y),"y"),s={position:"absolute",transform:"\n      translate(".concat(_,"%, ").concat(P,"%)\n      translate(").concat(nq(i+y),"px, ").concat(nq(o+w),"px)\n    "),display:void 0,zIndex:void 0},O&&(a>1||a<-1||i<0||i>e.width||o<0||o>e.height?s.display="none":s.zIndex=Math.floor((1-a)/2*1e5)),s),z=(0,n.useCallback)(function(e){M.props.onClose();var t=M.context.eventManager;t&&t.once("click",function(t){return t.stopPropagation()},e.target)},[]);return n.createElement("div",{className:"mapboxgl-popup mapboxgl-popup-anchor-".concat(x," ").concat(C),style:N,ref:j},n.createElement("div",{key:"tip",className:"mapboxgl-popup-tip",style:{borderWidth:R}}),n.createElement("div",{key:"content",ref:h,className:"mapboxgl-popup-content"},I&&n.createElement("button",{key:"close-button",className:"mapboxgl-popup-close-button",type:"button",onClick:z},"×"),L))}//# sourceMappingURL=popup.js.map
function nY(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}w.propTypes=to,w.defaultProps=ta,n.memo(w);var ts=Object.assign({},r,{toggleLabel:t.string,className:t.string,style:t.object,compact:t.bool,customAttribution:t.oneOfType([t.string,t.arrayOf(t.string)])}),tc=Object.assign({},o,{className:"",toggleLabel:"Toggle Attribution"});function O(t){var e=nL(t),r=e.context,c=e.containerRef,u=(0,n.useRef)(null),i=tE((0,n.useState)(!1),2),o=i[0],p=i[1];(0,n.useEffect)(function(){var s,i,n,o,a,e;return r.map&&(i={customAttribution:t.customAttribution},n=r.map,o=c.current,a=u.current,(e=new(j()).AttributionControl(i))._map=n,e._container=o,e._innerContainer=a,e._updateAttributions(),e._updateEditLink(),n.on("styledata",e._updateData),n.on("sourcedata",e._updateData),s=e),function(){var t;return s&&void((t=s)._map.off("styledata",t._updateData),t._map.off("sourcedata",t._updateData))}},[r.map]);var s=void 0===t.compact?r.viewport.width<=640:t.compact;(0,n.useEffect)(function(){!s&&o&&p(!1)},[s]);var l=(0,n.useCallback)(function(){return p(function(t){return!t})},[]),h=(0,n.useMemo)(function(){return function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nY(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):nY(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute"},t.style)},[t.style]);return n.createElement("div",{style:h,className:t.className},n.createElement("div",{ref:c,"aria-pressed":o,className:"mapboxgl-ctrl mapboxgl-ctrl-attrib ".concat(s?"mapboxgl-compact":""," ").concat(o?"mapboxgl-compact-show":"")},n.createElement("button",{type:"button",className:"mapboxgl-ctrl-attrib-button",title:t.toggleLabel,onClick:l}),n.createElement("div",{ref:u,className:"mapboxgl-ctrl-attrib-inner",role:"list"})))}//# sourceMappingURL=attribution-control.js.map
function nK(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}O.propTypes=ts,O.defaultProps=tc,n.memo(O);var tu=Object.assign({},r,{className:t.string,style:t.object,container:t.object,label:t.string}),tl=Object.assign({},o,{className:"",container:null,label:"Toggle fullscreen"});function E(t){var e=nL(t),d=e.context,c=e.containerRef,r=tE((0,n.useState)(!1),2),u=r[0],v=r[1],i=tE((0,n.useState)(!1),2),l=i[0],g=i[1],o=tE((0,n.useState)(null),2),m=o[0],b=o[1];(0,n.useEffect)(function(){var t=new(j()).FullscreenControl;b(t),g(t._checkFullscreenSupport());var e=function(){var e=!t._fullscreen;t._fullscreen=e,v(e)};return U.addEventListener(t._fullscreenchange,e),function(){U.removeEventListener(t._fullscreenchange,e)}},[]);var h=(0,n.useMemo)(function(){return function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nK(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):nK(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute"},t.style)},[t.style]);if(!l)return null;var p=t.className,f=t.label,s=u?"shrink":"fullscreen";return n.createElement("div",{style:h,className:p},n.createElement("div",{className:"mapboxgl-ctrl mapboxgl-ctrl-group",ref:c},n.createElement("button",{key:s,className:"mapboxgl-ctrl-icon mapboxgl-ctrl-".concat(s),type:"button",title:f,onClick:function(){m&&(m._container=t.container||d.container,m._onClickFullscreen())}},n.createElement("span",{className:"mapboxgl-ctrl-icon","aria-hidden":"true"}))))}//# sourceMappingURL=geolocate-utils.js.map
function nG(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}E.propTypes=tu,E.defaultProps=tl,n.memo(E);var n$=function(){},th=Object.assign({},r,{className:t.string,style:t.object,label:t.string,disabledLabel:t.string,auto:t.bool,positionOptions:t.object,fitBoundsOptions:t.object,trackUserLocation:t.bool,showUserLocation:t.bool,showAccuracyCircle:t.bool,showUserHeading:t.bool,onViewStateChange:t.func,onViewportChange:t.func,onGeolocate:t.func}),tp=Object.assign({},o,{className:"",label:"Find My Location",disabledLabel:"Location Not Available",auto:!1,positionOptions:{enableHighAccuracy:!1,timeout:6e3},fitBoundsOptions:{maxZoom:15},trackUserLocation:!1,showUserLocation:!0,showUserHeading:!1,showAccuracyCircle:!0,onGeolocate:function(){}});function _(t){var r=nL(t),i=r.context,h=r.containerRef,p=(0,n.useRef)(null),o=tE((0,n.useState)(null),2),s=o[0],m=o[1],c=tE((0,n.useState)(!1),2),e=c[0],b=c[1];(0,n.useEffect)(function(){var e;return i.map&&(void 0!==tO?Promise.resolve(tO):void 0!==window.navigator.permissions?window.navigator.permissions.query({name:"geolocation"}).then(function(t){return tO="denied"!==t.state}):Promise.resolve(tO=!!window.navigator.geolocation)).then(function(n){if(b(n),p.current){var o,a,s;o=p.current,(a=new(j()).GeolocateControl(t))._container=U.createElement("div"),a._map={on:function(){},_getUIString:function(){return""}},a._setupUI(!0),a._map=i.map,a._geolocateButton=o,s=i.eventManager,a.options.trackUserLocation&&s&&s.on("panstart",function(){"ACTIVE_LOCK"===a._watchState&&(a._watchState="BACKGROUND",o.classList.add("mapboxgl-ctrl-geolocate-background"),o.classList.remove("mapboxgl-ctrl-geolocate-active"))}),a.on("geolocate",t.onGeolocate),(e=a)._updateCamera=function(i){var t,e,s,c,n,u,o,l,h,p,a,f;return t=r.context,e=r.props,s=new(j()).LngLat(i.coords.longitude,i.coords.latitude),c=i.coords.accuracy,u=[[(n=s.toBounds(c))._ne.lng,n._ne.lat],[n._sw.lng,n._sw.lat]],l=(o=t.viewport.fitBounds(u,e.fitBoundsOptions)).longitude,h=o.latitude,p=o.zoom,a=Object.assign({},new eb(Object.assign({},t.viewport,{longitude:l,latitude:h,zoom:p})).getViewportProps(),nb),f=e.onViewportChange||t.onViewportChange||n$,void((e.onViewStateChange||t.onViewStateChange||n$)({viewState:a}),f(a))},m(e)}}),function(){e&&e._clearWatch()}},[i.map]);var f=(0,n.useCallback)(function(){s&&(s.options=r.props,s.trigger())},[s]);(0,n.useEffect)(function(){t.auto&&f()},[s,t.auto]),(0,n.useEffect)(function(){s&&s._onZoom()},[i.viewport.zoom]);var d=t.className,u=t.label,l=t.disabledLabel,v=t.trackUserLocation,g=(0,n.useMemo)(function(){return function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nG(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):nG(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute"},t.style)},[t.style]);return n.createElement("div",{style:g,className:d},n.createElement("div",{key:"geolocate-control",className:"mapboxgl-ctrl mapboxgl-ctrl-group",ref:h},n.createElement("button",{key:"geolocate",className:"mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate",ref:p,disabled:!e,"aria-pressed":!v,type:"button",title:e?u:l,"aria-label":e?u:l,onClick:f},n.createElement("span",{className:"mapboxgl-ctrl-icon","aria-hidden":"true"}))))}//# sourceMappingURL=version.js.map
function nJ(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}_.propTypes=th,_.defaultProps=tp,n.memo(_);var nQ=function(){},tf=Object.assign({},r,{className:t.string,style:t.object,onViewStateChange:t.func,onViewportChange:t.func,showCompass:t.bool,showZoom:t.bool,zoomInLabel:t.string,zoomOutLabel:t.string,compassLabel:t.string}),td=Object.assign({},o,{className:"",showCompass:!0,showZoom:!0,zoomInLabel:"Zoom In",zoomOutLabel:"Zoom Out",compassLabel:"Reset North"});function n0(t,e,r){var n=Object.assign({},new eb(Object.assign({},t.viewport,r)).getViewportProps(),nb),i=e.onViewportChange||t.onViewportChange||nQ;(e.onViewStateChange||t.onViewStateChange||nQ)({viewState:n}),i(n)}function n1(t,e,r,i){return n.createElement("button",{key:t,className:"mapboxgl-ctrl-icon mapboxgl-ctrl-".concat(t),type:"button",title:e,onClick:r},i||n.createElement("span",{className:"mapboxgl-ctrl-icon","aria-hidden":"true"}))}function P(t){var r,i,e,o=nL(t),s=o.context,u=o.containerRef,l=t.className,h=t.showCompass,c=t.showZoom,p=t.zoomInLabel,f=t.zoomOutLabel,d=t.compassLabel,v=(0,n.useMemo)(function(){return function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?nJ(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):nJ(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute"},t.style)},[t.style]);return n.createElement("div",{style:v,className:l},n.createElement("div",{className:"mapboxgl-ctrl mapboxgl-ctrl-group",ref:u},c&&n1("zoom-in",p,function(){n0(s,t,{zoom:s.viewport.zoom+1})}),c&&n1("zoom-out",f,function(){n0(s,t,{zoom:s.viewport.zoom-1})}),h&&n1("compass",d,function(){n0(s,t,{bearing:0,pitch:0})},(r=(0,n.useMemo)(function(){return s.map?//# sourceMappingURL=geolocate-control.js.map
function(t,e){for(var n=(t||"").split(".").map(Number),r=(e||"").split(".").map(Number),i=0;i<3;i++){var o=n[i]||0,a=r[i]||0;if(o<a)return -1;if(o>a)return 1}return 0}// CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/components/navigation-control.js
(s.map.version,"1.6.0")>=0?2:1:2},[s.map]),i=s.viewport.bearing,e={transform:"rotate(".concat(-i,"deg)")},2===r?n.createElement("span",{className:"mapboxgl-ctrl-icon","aria-hidden":"true",style:e}):n.createElement("span",{className:"mapboxgl-ctrl-compass-arrow",style:e})))))}//# sourceMappingURL=navigation-control.js.map
function n2(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}P.propTypes=tf,P.defaultProps=td,n.memo(P);var tv=Object.assign({},r,{className:t.string,style:t.object,maxWidth:t.number,unit:t.oneOf(["imperial","metric","nautical"])}),tg=Object.assign({},o,{className:"",maxWidth:100,unit:"metric"});function M(t){var r=nL(t),o=r.context,s=r.containerRef,i=tE((0,n.useState)(null),2),e=i[0],u=i[1];(0,n.useEffect)(function(){if(o.map){var t=new(j()).ScaleControl;t._map=o.map,t._container=s.current,u(t)}},[o.map]),e&&(e.options=t,e._onMove());var c=(0,n.useMemo)(function(){return function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?n2(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):n2(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute"},t.style)},[t.style]);return n.createElement("div",{style:c,className:t.className},n.createElement("div",{ref:s,className:"mapboxgl-ctrl mapboxgl-ctrl-scale"}))}M.propTypes=tv,M.defaultProps=tg,n.memo(M);//# sourceMappingURL=scale-control.js.map
var n5="undefined"!=typeof window&&window.devicePixelRatio||1;function I(r){var i=nL(r),o=i.context,s=i.containerRef,a=tE((0,n.useState)(null),2),e=a[0],u=a[1];(0,n.useEffect)(function(){u(s.current.getContext("2d"))},[]);var t=o.viewport,c=o.isDragging;return e&&(e.save(),e.scale(n5,n5),r.redraw({width:t.width,height:t.height,ctx:e,isDragging:c,project:t.project,unproject:t.unproject}),e.restore()),n.createElement("canvas",{ref:s,width:t.width*n5,height:t.height*n5,style:{width:"".concat(t.width,"px"),height:"".concat(t.height,"px"),position:"absolute",left:0,top:0}})}//# sourceMappingURL=canvas-overlay.js.map
function n4(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}function L(e){var r=nL(e),i=r.context,o=r.containerRef,t=i.viewport,s=i.isDragging,c=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?n4(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):n4(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute",left:0,top:0,width:t.width,height:t.height},e.style);return n.createElement("div",{ref:o,style:c},e.redraw({width:t.width,height:t.height,isDragging:s,project:t.project,unproject:t.unproject}))}//# sourceMappingURL=html-overlay.js.map
function n3(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),e.push.apply(e,r)}return e}function N(e){var r=nL(e),i=r.context,o=r.containerRef,t=i.viewport,s=i.isDragging,c=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?n3(Object(n),!0).forEach(function(e){a(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):n3(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({position:"absolute",left:0,top:0},e.style);return n.createElement("svg",{width:t.width,height:t.height,ref:o,style:c},e.redraw({width:t.width,height:t.height,isDragging:s,project:t.project,unproject:t.unproject}))}I.propTypes=Object.assign({},r,{redraw:t.func.isRequired}),I.defaultProps={captureScroll:!1,captureDrag:!1,captureClick:!1,captureDoubleClick:!1,capturePointerMove:!1},L.propTypes=Object.assign({},r,{redraw:t.func.isRequired,style:t.object}),L.defaultProps={captureScroll:!1,captureDrag:!1,captureClick:!1,captureDoubleClick:!1,capturePointerMove:!1},N.propTypes=Object.assign({},r,{redraw:t.func.isRequired,style:t.object}),N.defaultProps={captureScroll:!1,captureDrag:!1,captureClick:!1,captureDoubleClick:!1,capturePointerMove:!1},j()&&j().setRTLTextPlugin;//# sourceMappingURL=set-rtl-text-plugin.js.map // CONCATENATED MODULE: ./node_modules/react-map-gl/dist/esm/index.js
//# sourceMappingURL=index.js.map
/***/}}]);
