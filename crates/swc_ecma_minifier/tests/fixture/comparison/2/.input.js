self.push({
    58354: function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.d(__webpack_exports__, {
            do: function () {
                return ResizeObserver
            }
        });
        var ResizeObserverBoxOptions, trigger, ResizeObserverBoxOptions, resizeObservers = [],
            msg = "ResizeObserver loop completed with undelivered notifications.",
            deliverResizeLoopError = function () {
                var event;
                "function" == typeof ErrorEvent ? event = new ErrorEvent("error", {
                    message: msg
                }) : ((event = document.createEvent("Event")).initEvent("error", !1, !1), event.message = msg), window.dispatchEvent(event)
            };
        (ResizeObserverBoxOptions = ResizeObserverBoxOptions || (ResizeObserverBoxOptions = {})).BORDER_BOX = "border-box", ResizeObserverBoxOptions.CONTENT_BOX = "content-box", ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box";
        var freeze = function (obj) {
            return Object.freeze(obj)
        };
        return function () {
            function DOMRectReadOnly(x, y, width, height) {
                return this.x = x, this.y = y, this.width = width, this.height = height, this.top = this.y, this.left = this.x, this.bottom = this.top + this.height, this.right = this.left + this.width, freeze(this)
            }
            return DOMRectReadOnly.prototype.toJSON = function () {
                var width, x = this.x,
                    y = this.y,
                    top = this.top,
                    right = this.right,
                    bottom = this.bottom,
                    left = this.left;
                return {
                    x: x,
                    y: y,
                    top: top,
                    right: right,
                    bottom: bottom,
                    left: left,
                    width: this.width,
                    height: this.height
                }
            }, DOMRectReadOnly.fromRect = function (rectangle) {
                return new DOMRectReadOnly(rectangle.x, rectangle.y, rectangle.width, rectangle.height)
            }, DOMRectReadOnly
        }()
    },
})