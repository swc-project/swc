import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import invariant from "invariant";
import { injectScript } from "./utils/injectscript";
import { preventGoogleFonts } from "./utils/prevent-google-fonts";
import { isBrowser } from "./utils/isbrowser";
import { makeLoadScriptUrl } from "./utils/make-load-script-url";
var cleaningUp = false;
export function DefaultLoadingElement() {
    return (/*#__PURE__*/ _jsx("div", {
        children: "Loading..."
    }));
}
export var defaultLoadScriptProps = {
    id: "script-loader",
    version: "weekly"
};
var LoadScript = /*#__PURE__*/ function (_PureComponent) {
    "use strict";
    swcHelpers.inherits(LoadScript, _PureComponent);
    function LoadScript() {
        swcHelpers.classCallCheck(this, LoadScript);
        var _this;
        _this = swcHelpers.possibleConstructorReturn(this, swcHelpers.getPrototypeOf(LoadScript).apply(this, arguments));
        _this.check = /*#__PURE__*/ React.createRef();
        _this.state = {
            loaded: false
        };
        _this.cleanupCallback = function () {
            // @ts-ignore
            delete window.google.maps;
            _this.injectScript();
        };
        _this.isCleaningUp = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while (1) switch (_ctx.prev = _ctx.next) {
                    case 0:
                        function promiseCallback(resolve) {
                            if (!cleaningUp) {
                                resolve();
                            } else {
                                if (isBrowser) {
                                    var timer = window.setInterval(function interval() {
                                        if (!cleaningUp) {
                                            window.clearInterval(timer);
                                            resolve();
                                        }
                                    }, 1);
                                }
                            }
                            return;
                        }
                        return _ctx.abrupt("return", new Promise(promiseCallback));
                    case 2:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        _this.cleanup = function () {
            cleaningUp = true;
            var script1 = document.getElementById(_this.props.id);
            if (script1 && script1.parentNode) {
                script1.parentNode.removeChild(script1);
            }
            Array.prototype.slice.call(document.getElementsByTagName("script")).filter(function filter(script) {
                return typeof script.src === "string" && script.src.includes("maps.googleapis");
            }).forEach(function forEach(script) {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            });
            Array.prototype.slice.call(document.getElementsByTagName("link")).filter(function filter(link) {
                return link.href === "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Google+Sans";
            }).forEach(function forEach(link) {
                if (link.parentNode) {
                    link.parentNode.removeChild(link);
                }
            });
            Array.prototype.slice.call(document.getElementsByTagName("style")).filter(function filter(style) {
                return style.innerText !== undefined && style.innerText.length > 0 && style.innerText.includes(".gm-");
            }).forEach(function forEach(style) {
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            });
        };
        _this.injectScript = function () {
            if (_this.props.preventGoogleFontsLoading) {
                preventGoogleFonts();
            }
            invariant(!!_this.props.id, 'LoadScript requires "id" prop to be a string: %s', _this.props.id);
            var injectScriptOptions = {
                id: _this.props.id,
                nonce: _this.props.nonce,
                url: makeLoadScriptUrl(_this.props)
            };
            injectScript(injectScriptOptions).then(function () {
                if (_this.props.onLoad) {
                    _this.props.onLoad();
                }
                _this.setState(function setLoaded() {
                    return {
                        loaded: true
                    };
                });
                return;
            }).catch(function (err) {
                if (_this.props.onError) {
                    _this.props.onError(err);
                }
                console.error("\n          There has been an Error with loading Google Maps API script, please check that you provided correct google API key (".concat(_this.props.googleMapsApiKey || "-", ") or Client ID (").concat(_this.props.googleMapsClientId || "-", ") to <LoadScript />\n          Otherwise it is a Network issue.\n        "));
            });
        };
        return _this;
    }
    swcHelpers.createClass(LoadScript, [
        {
            key: "componentDidMount",
            value: function componentDidMount() {
                if (isBrowser) {
                    if (window.google && window.google.maps && !cleaningUp) {
                        console.error("google api is already presented");
                        return;
                    }
                    this.isCleaningUp().then(this.injectScript).catch(function error(err) {
                        console.error("Error at injecting script after cleaning up: ", err);
                    });
                }
            }
        },
        {
            key: "componentDidUpdate",
            value: function componentDidUpdate(prevProps) {
                if (this.props.libraries !== prevProps.libraries) {
                    console.warn("Performance warning! LoadScript has been reloaded unintentionally! You should not pass `libraries` prop as new array. Please keep an array of libraries as static class property for Components and PureComponents, or just a const variable outside of component, or somewhere in config files or ENV variables");
                }
                if (isBrowser && prevProps.language !== this.props.language) {
                    this.cleanup();
                    // TODO: refactor to use gDSFP maybe... wait for hooks refactoring.
                    // eslint-disable-next-line react/no-did-update-set-state
                    this.setState(function setLoaded() {
                        return {
                            loaded: false
                        };
                    }, this.cleanupCallback);
                }
            }
        },
        {
            key: "componentWillUnmount",
            value: function componentWillUnmount() {
                if (isBrowser) {
                    var _this = this;
                    this.cleanup();
                    var timeoutCallback = function () {
                        if (!_this.check.current) {
                            // @ts-ignore
                            delete window.google;
                            cleaningUp = false;
                        }
                    };
                    window.setTimeout(timeoutCallback, 1);
                    if (this.props.onUnmount) {
                        this.props.onUnmount();
                    }
                }
            }
        },
        {
            key: "render",
            value: function render() {
                return (/*#__PURE__*/ _jsxs(_Fragment, {
                    children: [
                        /*#__PURE__*/ _jsx("div", {
                        ref: this.check
                    }),
                        this.state.loaded ? this.props.children : this.props.loadingElement || /*#__PURE__*/ _jsx(DefaultLoadingElement, {
                        })
                    ]
                }));
            }
        }
    ]);
    return LoadScript;
}(React.PureComponent);
LoadScript.defaultProps = defaultLoadScriptProps;
export default LoadScript;
