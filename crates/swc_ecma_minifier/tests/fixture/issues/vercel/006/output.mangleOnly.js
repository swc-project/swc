import { jsx as e, jsxs as t, Fragment as o } from "react/jsx-runtime";
import * as r from "react";
import i from "invariant";
import { injectScript as n } from "./utils/injectscript";
import { preventGoogleFonts as s } from "./utils/prevent-google-fonts";
import { isBrowser as a } from "./utils/isbrowser";
import { makeLoadScriptUrl as p } from "./utils/make-load-script-url";
let l = false;
export function DefaultLoadingElement() {
    return e("div", {
        children: `Loading...`
    });
}
export const defaultLoadScriptProps = {
    id: "script-loader",
    version: "weekly"
};
class c extends r.PureComponent {
    componentDidMount() {
        if (a) {
            if (window.google && window.google.maps && !l) {
                console.error("google api is already presented");
                return;
            }
            this.isCleaningUp().then(this.injectScript).catch(function e(t) {
                console.error("Error at injecting script after cleaning up: ", t);
            });
        }
    }
    componentDidUpdate(e) {
        if (this.props.libraries !== e.libraries) {
            console.warn("Performance warning! LoadScript has been reloaded unintentionally! You should not pass `libraries` prop as new array. Please keep an array of libraries as static class property for Components and PureComponents, or just a const variable outside of component, or somewhere in config files or ENV variables");
        }
        if (a && e.language !== this.props.language) {
            this.cleanup();
            this.setState(function e() {
                return {
                    loaded: false
                };
            }, this.cleanupCallback);
        }
    }
    componentWillUnmount() {
        if (a) {
            this.cleanup();
            const e = ()=>{
                if (!this.check.current) {
                    delete window.google;
                    l = false;
                }
            };
            window.setTimeout(e, 1);
            if (this.props.onUnmount) {
                this.props.onUnmount();
            }
        }
    }
    render() {
        return t(o, {
            children: [
                e("div", {
                    ref: this.check
                }),
                this.state.loaded ? this.props.children : this.props.loadingElement || e(DefaultLoadingElement, {}), 
            ]
        });
    }
    constructor(...e){
        super(...e);
        this.check = r.createRef();
        this.state = {
            loaded: false
        };
        this.cleanupCallback = ()=>{
            delete window.google.maps;
            this.injectScript();
        };
        this.isCleaningUp = async ()=>{
            function e(e) {
                if (!l) {
                    e();
                } else {
                    if (a) {
                        const t = window.setInterval(function o() {
                            if (!l) {
                                window.clearInterval(t);
                                e();
                            }
                        }, 1);
                    }
                }
                return;
            }
            return new Promise(e);
        };
        this.cleanup = ()=>{
            l = true;
            const e = document.getElementById(this.props.id);
            if (e && e.parentNode) {
                e.parentNode.removeChild(e);
            }
            Array.prototype.slice.call(document.getElementsByTagName("script")).filter(function e(t) {
                return (typeof t.src === "string" && t.src.includes("maps.googleapis"));
            }).forEach(function e(t) {
                if (t.parentNode) {
                    t.parentNode.removeChild(t);
                }
            });
            Array.prototype.slice.call(document.getElementsByTagName("link")).filter(function e(t) {
                return (t.href === "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Google+Sans");
            }).forEach(function e(t) {
                if (t.parentNode) {
                    t.parentNode.removeChild(t);
                }
            });
            Array.prototype.slice.call(document.getElementsByTagName("style")).filter(function e(t) {
                return (t.innerText !== undefined && t.innerText.length > 0 && t.innerText.includes(".gm-"));
            }).forEach(function e(t) {
                if (t.parentNode) {
                    t.parentNode.removeChild(t);
                }
            });
        };
        this.injectScript = ()=>{
            if (this.props.preventGoogleFontsLoading) {
                s();
            }
            i(!!this.props.id, 'LoadScript requires "id" prop to be a string: %s', this.props.id);
            const e = {
                id: this.props.id,
                nonce: this.props.nonce,
                url: p(this.props)
            };
            n(e).then(()=>{
                if (this.props.onLoad) {
                    this.props.onLoad();
                }
                this.setState(function e() {
                    return {
                        loaded: true
                    };
                });
                return;
            }).catch((e)=>{
                if (this.props.onError) {
                    this.props.onError(e);
                }
                console.error(`
          There has been an Error with loading Google Maps API script, please check that you provided correct google API key (${this.props.googleMapsApiKey || "-"}) or Client ID (${this.props.googleMapsClientId || "-"}) to <LoadScript />
          Otherwise it is a Network issue.
        `);
            });
        };
    }
}
c.defaultProps = defaultLoadScriptProps;
export default c;
