import { jsx as c, jsxs as d, Fragment as e } from "react/jsx-runtime";
import * as b from "react";
import f from "invariant";
import { injectScript as g } from "./utils/injectscript";
import { preventGoogleFonts as h } from "./utils/prevent-google-fonts";
import { isBrowser as i } from "./utils/isbrowser";
import { makeLoadScriptUrl as j } from "./utils/make-load-script-url";
let k = false;
export function DefaultLoadingElement() {
    return c("div", {
        children: `Loading...`
    });
}
export const defaultLoadScriptProps = {
    id: "script-loader",
    version: "weekly"
};
class a extends b.PureComponent {
    componentDidMount() {
        if (i) {
            if (window.google && window.google.maps && !k) {
                console.error("google api is already presented");
                return;
            }
            this.isCleaningUp().then(this.injectScript).catch(function b(a) {
                console.error("Error at injecting script after cleaning up: ", a);
            });
        }
    }
    componentDidUpdate(a) {
        if (this.props.libraries !== a.libraries) {
            console.warn("Performance warning! LoadScript has been reloaded unintentionally! You should not pass `libraries` prop as new array. Please keep an array of libraries as static class property for Components and PureComponents, or just a const variable outside of component, or somewhere in config files or ENV variables");
        }
        if (i && a.language !== this.props.language) {
            this.cleanup();
            this.setState(function a() {
                return {
                    loaded: false
                };
            }, this.cleanupCallback);
        }
    }
    componentWillUnmount() {
        if (i) {
            this.cleanup();
            const a = ()=>{
                if (!this.check.current) {
                    delete window.google;
                    k = false;
                }
            };
            window.setTimeout(a, 1);
            if (this.props.onUnmount) {
                this.props.onUnmount();
            }
        }
    }
    render() {
        return d(e, {
            children: [
                c("div", {
                    ref: this.check
                }),
                this.state.loaded ? this.props.children : this.props.loadingElement || c(DefaultLoadingElement, {}), 
            ]
        });
    }
    constructor(...a){
        super(...a);
        this.check = b.createRef();
        this.state = {
            loaded: false
        };
        this.cleanupCallback = ()=>{
            delete window.google.maps;
            this.injectScript();
        };
        this.isCleaningUp = async ()=>{
            function a(a) {
                if (!k) {
                    a();
                } else {
                    if (i) {
                        const b = window.setInterval(function c() {
                            if (!k) {
                                window.clearInterval(b);
                                a();
                            }
                        }, 1);
                    }
                }
                return;
            }
            return new Promise(a);
        };
        this.cleanup = ()=>{
            k = true;
            const a = document.getElementById(this.props.id);
            if (a && a.parentNode) {
                a.parentNode.removeChild(a);
            }
            Array.prototype.slice.call(document.getElementsByTagName("script")).filter(function b(a) {
                return (typeof a.src === "string" && a.src.includes("maps.googleapis"));
            }).forEach(function b(a) {
                if (a.parentNode) {
                    a.parentNode.removeChild(a);
                }
            });
            Array.prototype.slice.call(document.getElementsByTagName("link")).filter(function b(a) {
                return (a.href === "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Google+Sans");
            }).forEach(function b(a) {
                if (a.parentNode) {
                    a.parentNode.removeChild(a);
                }
            });
            Array.prototype.slice.call(document.getElementsByTagName("style")).filter(function b(a) {
                return (a.innerText !== undefined && a.innerText.length > 0 && a.innerText.includes(".gm-"));
            }).forEach(function b(a) {
                if (a.parentNode) {
                    a.parentNode.removeChild(a);
                }
            });
        };
        this.injectScript = ()=>{
            if (this.props.preventGoogleFontsLoading) {
                h();
            }
            f(!!this.props.id, 'LoadScript requires "id" prop to be a string: %s', this.props.id);
            const a = {
                id: this.props.id,
                nonce: this.props.nonce,
                url: j(this.props)
            };
            g(a).then(()=>{
                if (this.props.onLoad) {
                    this.props.onLoad();
                }
                this.setState(function a() {
                    return {
                        loaded: true
                    };
                });
                return;
            }).catch((a)=>{
                if (this.props.onError) {
                    this.props.onError(a);
                }
                console.error(`
          There has been an Error with loading Google Maps API script, please check that you provided correct google API key (${this.props.googleMapsApiKey || "-"}) or Client ID (${this.props.googleMapsClientId || "-"}) to <LoadScript />
          Otherwise it is a Network issue.
        `);
            });
        };
    }
}
a.defaultProps = defaultLoadScriptProps;
export default a;
