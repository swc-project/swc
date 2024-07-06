import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import invariant from "invariant";
import { injectScript } from "./utils/injectscript";
import { preventGoogleFonts } from "./utils/prevent-google-fonts";
import { isBrowser } from "./utils/isbrowser";
import { makeLoadScriptUrl } from "./utils/make-load-script-url";
let cleaningUp = !1;
export function DefaultLoadingElement() {
    return /*#__PURE__*/ _jsx("div", {
        children: "Loading..."
    });
}
export const defaultLoadScriptProps = {
    id: "script-loader",
    version: "weekly"
};
class LoadScript extends React.PureComponent {
    componentDidMount() {
        if (isBrowser) {
            if (window.google && window.google.maps && !cleaningUp) {
                console.error("google api is already presented");
                return;
            }
            this.isCleaningUp().then(this.injectScript).catch(function(err) {
                console.error("Error at injecting script after cleaning up: ", err);
            });
        }
    }
    componentDidUpdate(prevProps) {
        this.props.libraries !== prevProps.libraries && console.warn("Performance warning! LoadScript has been reloaded unintentionally! You should not pass `libraries` prop as new array. Please keep an array of libraries as static class property for Components and PureComponents, or just a const variable outside of component, or somewhere in config files or ENV variables"), isBrowser && prevProps.language !== this.props.language && (this.cleanup(), // TODO: refactor to use gDSFP maybe... wait for hooks refactoring.
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState(function() {
            return {
                loaded: !1
            };
        }, this.cleanupCallback));
    }
    componentWillUnmount() {
        isBrowser && (this.cleanup(), window.setTimeout(()=>{
            this.check.current || (// @ts-ignore
            delete window.google, cleaningUp = !1);
        }, 1), this.props.onUnmount && this.props.onUnmount());
    }
    render() {
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx("div", {
                    ref: this.check
                }),
                this.state.loaded ? this.props.children : this.props.loadingElement || /*#__PURE__*/ _jsx(DefaultLoadingElement, {})
            ]
        });
    }
    constructor(...args){
        super(...args), this.check = /*#__PURE__*/ React.createRef(), this.state = {
            loaded: !1
        }, this.cleanupCallback = ()=>{
            // @ts-ignore
            delete window.google.maps, this.injectScript();
        }, this.isCleaningUp = async ()=>new Promise(function(resolve) {
                if (cleaningUp) {
                    if (isBrowser) {
                        const timer = window.setInterval(function() {
                            cleaningUp || (window.clearInterval(timer), resolve());
                        }, 1);
                    }
                } else resolve();
            }), this.cleanup = ()=>{
            cleaningUp = !0;
            const script1 = document.getElementById(this.props.id);
            script1 && script1.parentNode && script1.parentNode.removeChild(script1), Array.prototype.slice.call(document.getElementsByTagName("script")).filter(function(script) {
                return "string" == typeof script.src && script.src.includes("maps.googleapis");
            }).forEach(function(script) {
                script.parentNode && script.parentNode.removeChild(script);
            }), Array.prototype.slice.call(document.getElementsByTagName("link")).filter(function(link) {
                return "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Google+Sans" === link.href;
            }).forEach(function(link) {
                link.parentNode && link.parentNode.removeChild(link);
            }), Array.prototype.slice.call(document.getElementsByTagName("style")).filter(function(style) {
                return void 0 !== style.innerText && style.innerText.length > 0 && style.innerText.includes(".gm-");
            }).forEach(function(style) {
                style.parentNode && style.parentNode.removeChild(style);
            });
        }, this.injectScript = ()=>{
            this.props.preventGoogleFontsLoading && preventGoogleFonts(), invariant(!!this.props.id, 'LoadScript requires "id" prop to be a string: %s', this.props.id), injectScript({
                id: this.props.id,
                nonce: this.props.nonce,
                url: makeLoadScriptUrl(this.props)
            }).then(()=>{
                this.props.onLoad && this.props.onLoad(), this.setState(function() {
                    return {
                        loaded: !0
                    };
                });
            }).catch((err)=>{
                this.props.onError && this.props.onError(err), console.error(`
          There has been an Error with loading Google Maps API script, please check that you provided correct google API key (${this.props.googleMapsApiKey || "-"}) or Client ID (${this.props.googleMapsClientId || "-"}) to <LoadScript />
          Otherwise it is a Network issue.
        `);
            });
        };
    }
}
LoadScript.defaultProps = defaultLoadScriptProps;
export default LoadScript;
