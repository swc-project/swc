import { jsx as a, jsxs as b, Fragment as c } from "react/jsx-runtime";
import * as d from "react";
import e from "invariant";
import { injectScript as f } from "./utils/injectscript";
import { preventGoogleFonts as g } from "./utils/prevent-google-fonts";
import { isBrowser as h } from "./utils/isbrowser";
import { makeLoadScriptUrl as i } from "./utils/make-load-script-url";
let j = false;
export function DefaultLoadingElement() {
    return a("div", {
        children: `Loading...`
    });
}
export const defaultLoadScriptProps = {
    id: "script-loader",
    version: "weekly"
};
class k extends d.PureComponent {
    componentDidMount() {
        if (h) {
            if (window.google && window.google.maps && !j) {
                console.error("google api is already presented");
                return;
            }
            this.isCleaningUp().then(this.injectScript).catch(function a(b) {
                console.error("Error at injecting script after cleaning up: ", b);
            });
        }
    }
    componentDidUpdate(a) {
        if (this.props.libraries !== a.libraries) {
            console.warn("Performance warning! LoadScript has been reloaded unintentionally! You should not pass `libraries` prop as new array. Please keep an array of libraries as static class property for Components and PureComponents, or just a const variable outside of component, or somewhere in config files or ENV variables");
        }
        if (h && a.language !== this.props.language) {
            this.cleanup();
            this.setState(function a() {
                return {
                    loaded: false
                };
            }, this.cleanupCallback);
        }
    }
    componentWillUnmount() {
        if (h) {
            this.cleanup();
            const a = ()=>{
                if (!this.check.current) {
                    delete window.google;
                    j = false;
                }
            };
            window.setTimeout(a, 1);
            if (this.props.onUnmount) {
                this.props.onUnmount();
            }
        }
    }
    render() {
        return b(c, {
            children: [
                a("div", {
                    ref: this.check
                }),
                this.state.loaded ? this.props.children : this.props.loadingElement || a(DefaultLoadingElement, {}), 
            ]
        });
    }
    constructor(...a){
        super(...a);
        this.check = d.createRef();
        this.state = {
            loaded: false
        };
        this.cleanupCallback = ()=>{
            delete window.google.maps;
            this.injectScript();
        };
        this.isCleaningUp = async ()=>{
            function a(a) {
                if (!j) {
                    a();
                } else {
                    if (h) {
                        const b = window.setInterval(function c() {
                            if (!j) {
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
            j = true;
            const a = document.getElementById(this.props.id);
            if (a && a.parentNode) {
                a.parentNode.removeChild(a);
            }
            Array.prototype.slice.call(document.getElementsByTagName("script")).filter(function a(b) {
                return (typeof b.src === "string" && b.src.includes("maps.googleapis"));
            }).forEach(function a(b) {
                if (b.parentNode) {
                    b.parentNode.removeChild(b);
                }
            });
            Array.prototype.slice.call(document.getElementsByTagName("link")).filter(function a(b) {
                return (b.href === "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Google+Sans");
            }).forEach(function a(b) {
                if (b.parentNode) {
                    b.parentNode.removeChild(b);
                }
            });
            Array.prototype.slice.call(document.getElementsByTagName("style")).filter(function a(b) {
                return (b.innerText !== undefined && b.innerText.length > 0 && b.innerText.includes(".gm-"));
            }).forEach(function a(b) {
                if (b.parentNode) {
                    b.parentNode.removeChild(b);
                }
            });
        };
        this.injectScript = ()=>{
            if (this.props.preventGoogleFontsLoading) {
                g();
            }
            e(!!this.props.id, 'LoadScript requires "id" prop to be a string: %s', this.props.id);
            const a = {
                id: this.props.id,
                nonce: this.props.nonce,
                url: i(this.props)
            };
            f(a).then(()=>{
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
k.defaultProps = defaultLoadScriptProps;
export default k;
