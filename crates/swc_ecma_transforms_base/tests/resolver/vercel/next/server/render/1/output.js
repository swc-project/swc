import { Writable__2 } from "stream";
import * as ReactDOMServer__2 from "react-dom/server";
import { StyleRegistry__2, createStyleRegistry__2 } from "styled-jsx";
import { warn__2 } from "../build/output/log";
import { GSP_NO_RETURNED_VALUE__2, GSSP_COMPONENT_MEMBER_ERROR__2, GSSP_NO_RETURNED_VALUE__2, STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR__2, SERVER_PROPS_GET_INIT_PROPS_CONFLICT__2, SERVER_PROPS_SSG_CONFLICT__2, SSG_GET_INITIAL_PROPS_CONFLICT__2, UNSTABLE_REVALIDATE_RENAME_ERROR__2 } from "../lib/constants";
import { isSerializableProps__2 } from "../lib/is-serializable-props";
import { isInAmpMode__2 } from "../shared/lib/amp";
import { AmpStateContext__2 } from "../shared/lib/amp-context";
import { BODY_RENDER_TARGET__2, SERVER_PROPS_ID__2, STATIC_PROPS_ID__2, STATIC_STATUS_PAGES__2 } from "../shared/lib/constants";
import { defaultHead__2 } from "../shared/lib/head";
import { HeadManagerContext__2 } from "../shared/lib/head-manager-context";
import Loadable__2 from "../shared/lib/loadable";
import { LoadableContext__2 } from "../shared/lib/loadable-context";
import postProcess__2 from "../shared/lib/post-process";
import { RouterContext__2 } from "../shared/lib/router-context";
import { isDynamicRoute__2 } from "../shared/lib/router/utils/is-dynamic";
import { HtmlContext__2, getDisplayName__2, isResSent__2, loadGetInitialProps__2 } from "../shared/lib/utils";
import { tryGetPreviewData__2 } from "./api-utils";
import { denormalizePagePath__2 } from "./denormalize-page-path";
import { getFontDefinitionFromManifest__2 } from "./font-utils";
import { normalizePagePath__2 } from "./normalize-page-path";
import optimizeAmp__2 from "./optimize-amp";
import { allowedStatusCodes__2, getRedirectStatus__2 } from "../lib/load-custom-routes";
import RenderResult__2 from "./render-result";
import isError__2 from "../lib/is-error";
function noRouter__2() {
    const message__3 = 'No router instance found. you should only use "next/router" inside the client side of your app. https://nextjs.org/docs/messages/no-router-instance';
    throw new Error(message__3);
}
class ServerRouter__2 {
    constructor(pathname__4, query__4, as__4, { isFallback__4 }, isReady__4, basePath__4, locale__4, locales__4, defaultLocale__4, domainLocales__4, isPreview__4, isLocaleDomain__4){
        this.route = pathname__4.replace(/\/$/, "") || "/";
        this.pathname = pathname__4;
        this.query = query__4;
        this.asPath = as__4;
        this.isFallback = isFallback__4;
        this.basePath = basePath__4;
        this.locale = locale__4;
        this.locales = locales__4;
        this.defaultLocale = defaultLocale__4;
        this.isReady = isReady__4;
        this.domainLocales = domainLocales__4;
        this.isPreview = !!isPreview__4;
        this.isLocaleDomain = !!isLocaleDomain__4;
    }
    push() {
        noRouter__2();
    }
    replace() {
        noRouter__2();
    }
    reload() {
        noRouter__2();
    }
    back() {
        noRouter__2();
    }
    prefetch() {
        noRouter__2();
    }
    beforePopState() {
        noRouter__2();
    }
}
function enhanceComponents__2(options__11, App__11, Component__11) {
    if (typeof options__11 === "function") {
        return {
            App__11,
            Component: options__11(Component__11)
        };
    }
    return {
        App: options__11.enhanceApp ? options__11.enhanceApp(App__11) : App__11,
        Component: options__11.enhanceComponent ? options__11.enhanceComponent(Component__11) : Component__11
    };
}
const invalidKeysMsg__2 = (methodName__13, invalidKeys__13)=>{
    return `Additional keys were returned from \`${methodName__13}\`. Properties intended for your component must be nested under the \`props\` key, e.g.:` + `\n\n\treturn { props: { title: 'My Title', content: '...' } }` + `\n\nKeys that need to be moved: ${invalidKeys__13.join(", ")}.` + `\nRead more: https://nextjs.org/docs/messages/invalid-getstaticprops-value`;
};
function checkRedirectValues__2(redirect__14, req__14, method__14) {
    const { destination__14, permanent__14, statusCode__14, basePath__14 } = redirect__14;
    let errors__14 = [];
    const hasStatusCode__14 = typeof statusCode__14 !== "undefined";
    const hasPermanent__14 = typeof permanent__14 !== "undefined";
    if (hasPermanent__14 && hasStatusCode__14) {
        errors__14.push(`\`permanent\` and \`statusCode\` can not both be provided`);
    } else if (hasPermanent__14 && typeof permanent__14 !== "boolean") {
        errors__14.push(`\`permanent\` must be \`true\` or \`false\``);
    } else if (hasStatusCode__14 && !allowedStatusCodes__2.has(statusCode__14)) {
        errors__14.push(`\`statusCode\` must undefined or one of ${[
            ...allowedStatusCodes__2
        ].join(", ")}`);
    }
    const destinationType__14 = typeof destination__14;
    if (destinationType__14 !== "string") {
        errors__14.push(`\`destination\` should be string but received ${destinationType__14}`);
    }
    const basePathType__14 = typeof basePath__14;
    if (basePathType__14 !== "undefined" && basePathType__14 !== "boolean") {
        errors__14.push(`\`basePath\` should be undefined or a false, received ${basePathType__14}`);
    }
    if (errors__14.length > 0) {
        throw new Error(`Invalid redirect object returned from ${method__14} for ${req__14.url}\n` + errors__14.join(" and ") + "\n" + `See more info here: https://nextjs.org/docs/messages/invalid-redirect-gssp`);
    }
}
export async function renderToHTML__2(req__21, res__21, pathname__21, query__21, renderOpts__21) {
    renderOpts__21.devOnlyCacheBusterQueryString = renderOpts__21.dev ? renderOpts__21.devOnlyCacheBusterQueryString || `?ts=${Date.now()}` : "";
    query__21 = Object.assign({}, query__21);
    const { err__21, dev__21 = false, ampPath__21 = "", App__21, Document__21, pageConfig__21 = {}, Component__21, buildManifest__21, fontManifest__21, reactLoadableManifest__21, ErrorDebug__21, getStaticProps__21, getStaticPaths__21, getServerSideProps__21, isDataReq__21, params__21, previewProps__21, basePath__21, devOnlyCacheBusterQueryString__21, supportsDynamicHTML__21, concurrentFeatures__21 } = renderOpts__21;
    const getFontDefinition__21 = (url__22)=>{
        if (fontManifest__21) {
            return getFontDefinitionFromManifest__2(url__22, fontManifest__21);
        }
        return "";
    };
    const callMiddleware__21 = async (method__24, args__24, props__24 = false)=>{
        let results__24 = props__24 ? {} : [];
        if (Document__21[`${method__24}Middleware`]) {
            let middlewareFunc__25 = await Document__21[`${method__24}Middleware`];
            middlewareFunc__25 = middlewareFunc__25.default || middlewareFunc__25;
            const curResults__25 = await middlewareFunc__25(...args__24);
            if (props__24) {
                for (const result__27 of curResults__25){
                    results__24 = {
                        ...results__24,
                        ...result__27
                    };
                }
            } else {
                results__24 = curResults__25;
            }
        }
        return results__24;
    };
    const headTags__21 = (...args__30)=>callMiddleware__21("headTags", args__30);
    const isFallback__21 = !!query__21.__nextFallback;
    delete query__21.__nextFallback;
    delete query__21.__nextLocale;
    delete query__21.__nextDefaultLocale;
    const isSSG__21 = !!getStaticProps__21;
    const isBuildTimeSSG__21 = isSSG__21 && renderOpts__21.nextExport;
    const defaultAppGetInitialProps__21 = App__21.getInitialProps === App__21.origGetInitialProps;
    const hasPageGetInitialProps__21 = !!Component__21.getInitialProps;
    const pageIsDynamic__21 = isDynamicRoute__2(pathname__21);
    const isAutoExport__21 = !hasPageGetInitialProps__21 && defaultAppGetInitialProps__21 && !isSSG__21 && !getServerSideProps__21;
    for (const methodName__31 of [
        "getStaticProps",
        "getServerSideProps",
        "getStaticPaths"
    ]){
        if (Component__21[methodName__31]) {
            throw new Error(`page ${pathname__21} ${methodName__31} ${GSSP_COMPONENT_MEMBER_ERROR__2}`);
        }
    }
    if (hasPageGetInitialProps__21 && isSSG__21) {
        throw new Error(SSG_GET_INITIAL_PROPS_CONFLICT__2 + ` ${pathname__21}`);
    }
    if (hasPageGetInitialProps__21 && getServerSideProps__21) {
        throw new Error(SERVER_PROPS_GET_INIT_PROPS_CONFLICT__2 + ` ${pathname__21}`);
    }
    if (getServerSideProps__21 && isSSG__21) {
        throw new Error(SERVER_PROPS_SSG_CONFLICT__2 + ` ${pathname__21}`);
    }
    if (getStaticPaths__21 && !pageIsDynamic__21) {
        throw new Error(`getStaticPaths is only allowed for dynamic SSG pages and was found on '${pathname__21}'.` + `\nRead more: https://nextjs.org/docs/messages/non-dynamic-getstaticpaths-usage`);
    }
    if (!!getStaticPaths__21 && !isSSG__21) {
        throw new Error(`getStaticPaths was added without a getStaticProps in ${pathname__21}. Without getStaticProps, getStaticPaths does nothing`);
    }
    if (isSSG__21 && pageIsDynamic__21 && !getStaticPaths__21) {
        throw new Error(`getStaticPaths is required for dynamic SSG pages and is missing for '${pathname__21}'.` + `\nRead more: https://nextjs.org/docs/messages/invalid-getstaticpaths-value`);
    }
    let asPath__21 = renderOpts__21.resolvedAsPath || req__21.url;
    if (dev__21) {
        const { isValidElementType__40 } = require("react-is");
        if (!isValidElementType__40(Component__21)) {
            throw new Error(`The default export is not a React Component in page: "${pathname__21}"`);
        }
        if (!isValidElementType__40(App__21)) {
            throw new Error(`The default export is not a React Component in page: "/_app"`);
        }
        if (!isValidElementType__40(Document__21)) {
            throw new Error(`The default export is not a React Component in page: "/_document"`);
        }
        if (isAutoExport__21 || isFallback__21) {
            query__21 = {
                ...query__21.amp ? {
                    amp: query__21.amp
                } : {}
            };
            asPath__21 = `${pathname__21}${req__21.url.endsWith("/") && pathname__21 !== "/" && !pageIsDynamic__21 ? "/" : ""}`;
            req__21.url = pathname__21;
        }
        if (pathname__21 === "/404" && (hasPageGetInitialProps__21 || getServerSideProps__21)) {
            throw new Error(`\`pages/404\` ${STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR__2}`);
        }
        if (STATIC_STATUS_PAGES__2.includes(pathname__21) && (hasPageGetInitialProps__21 || getServerSideProps__21)) {
            throw new Error(`\`pages${pathname__21}\` ${STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR__2}`);
        }
    }
    await Loadable__2.preloadAll();
    let isPreview__21;
    let previewData__21;
    if ((isSSG__21 || getServerSideProps__21) && !isFallback__21) {
        previewData__21 = tryGetPreviewData__2(req__21, res__21, previewProps__21);
        isPreview__21 = previewData__21 !== false;
    }
    const routerIsReady__21 = !!(getServerSideProps__21 || hasPageGetInitialProps__21 || !defaultAppGetInitialProps__21 && !isSSG__21);
    const router__21 = new ServerRouter__2(pathname__21, query__21, asPath__21, {
        isFallback: isFallback__21
    }, routerIsReady__21, basePath__21, renderOpts__21.locale, renderOpts__21.locales, renderOpts__21.defaultLocale, renderOpts__21.domainLocales, isPreview__21, req__21.__nextIsLocaleDomain);
    const jsxStyleRegistry__21 = createStyleRegistry__2();
    const ctx__21 = {
        err__21,
        req: isAutoExport__21 ? undefined : req__21,
        res: isAutoExport__21 ? undefined : res__21,
        pathname__21,
        query__21,
        asPath__21,
        locale: renderOpts__21.locale,
        locales: renderOpts__21.locales,
        defaultLocale: renderOpts__21.defaultLocale,
        AppTree: (props__48)=>{
            return <AppContainer__21>
                    <App__21 {...props__48} Component={Component__21} router={router__21}/>
                </AppContainer__21>;
        },
        defaultGetInitialProps: async (docCtx__49)=>{
            const enhanceApp__49 = (AppComp__50)=>{
                return (props__51)=><AppComp__50 {...props__51}/>;
            };
            const { html__49, head__49 } = await docCtx__49.renderPage({
                enhanceApp__49
            });
            const styles__49 = jsxStyleRegistry__21.styles();
            return {
                html__49,
                head__49,
                styles__49
            };
        }
    };
    let props__21;
    const ampState__21 = {
        ampFirst: pageConfig__21.amp === true,
        hasQuery: Boolean(query__21.amp),
        hybrid: pageConfig__21.amp === "hybrid"
    };
    const inAmpMode__21 = isInAmpMode__2(ampState__21);
    const reactLoadableModules__21 = [];
    let head__21 = defaultHead__2(inAmpMode__21);
    let scriptLoader__21 = {};
    const nextExport__21 = !isSSG__21 && (renderOpts__21.nextExport || dev__21 && (isAutoExport__21 || isFallback__21));
    const AppContainer__21 = ({ children__52 })=><RouterContext__2.Provider value={router__21}>
            <AmpStateContext__2.Provider value={ampState__21}>
                <HeadManagerContext__2.Provider value={{
            updateHead: (state__53)=>{
                head__21 = state__53;
            },
            updateScripts: (scripts__54)=>{
                scriptLoader__21 = scripts__54;
            },
            scripts: {},
            mountedInstances: new Set()
        }}>
                    <LoadableContext__2.Provider value={(moduleName__55)=>reactLoadableModules__21.push(moduleName__55)}>
                        <StyleRegistry__2 registry={jsxStyleRegistry__21}>
                            {children__52}
                        </StyleRegistry__2>
                    </LoadableContext__2.Provider>
                </HeadManagerContext__2.Provider>
            </AmpStateContext__2.Provider>
        </RouterContext__2.Provider>;
    props__21 = await loadGetInitialProps__2(App__21, {
        AppTree: ctx__21.AppTree,
        Component__21,
        router__21,
        ctx__21
    });
    if ((isSSG__21 || getServerSideProps__21) && isPreview__21) {
        props__21.__N_PREVIEW = true;
    }
    if (isSSG__21) {
        props__21[STATIC_PROPS_ID__2] = true;
    }
    if (isSSG__21 && !isFallback__21) {
        let data__58;
        try {
            data__58 = await getStaticProps__21({
                ...pageIsDynamic__21 ? {
                    params: query__21
                } : undefined,
                ...isPreview__21 ? {
                    preview: true,
                    previewData: previewData__21
                } : undefined,
                locales: renderOpts__21.locales,
                locale: renderOpts__21.locale,
                defaultLocale: renderOpts__21.defaultLocale
            });
        } catch (staticPropsError__60) {
            if (staticPropsError__60 && staticPropsError__60.code === "ENOENT") {
                delete staticPropsError__60.code;
            }
            throw staticPropsError__60;
        }
        if (data__58 == null) {
            throw new Error(GSP_NO_RETURNED_VALUE__2);
        }
        const invalidKeys__58 = Object.keys(data__58).filter((key__63)=>key__63 !== "revalidate" && key__63 !== "props" && key__63 !== "redirect" && key__63 !== "notFound");
        if (invalidKeys__58.includes("unstable_revalidate")) {
            throw new Error(UNSTABLE_REVALIDATE_RENAME_ERROR__2);
        }
        if (invalidKeys__58.length) {
            throw new Error(invalidKeysMsg__2("getStaticProps", invalidKeys__58));
        }
        if (process.env.NODE_ENV !== "production") {
            if (typeof data__58.notFound !== "undefined" && typeof data__58.redirect !== "undefined") {
                throw new Error(`\`redirect\` and \`notFound\` can not both be returned from ${isSSG__21 ? "getStaticProps" : "getServerSideProps"} at the same time. Page: ${pathname__21}\nSee more info here: https://nextjs.org/docs/messages/gssp-mixed-not-found-redirect`);
            }
        }
        if ("notFound" in data__58 && data__58.notFound) {
            if (pathname__21 === "/404") {
                throw new Error(`The /404 page can not return notFound in "getStaticProps", please remove it to continue!`);
            }
            renderOpts__21.isNotFound = true;
        }
        if ("redirect" in data__58 && data__58.redirect && typeof data__58.redirect === "object") {
            checkRedirectValues__2(data__58.redirect, req__21, "getStaticProps");
            if (isBuildTimeSSG__21) {
                throw new Error(`\`redirect\` can not be returned from getStaticProps during prerendering (${req__21.url})\n` + `See more info here: https://nextjs.org/docs/messages/gsp-redirect-during-prerender`);
            }
            data__58.props = {
                __N_REDIRECT: data__58.redirect.destination,
                __N_REDIRECT_STATUS: getRedirectStatus__2(data__58.redirect)
            };
            if (typeof data__58.redirect.basePath !== "undefined") {
                data__58.props.__N_REDIRECT_BASE_PATH = data__58.redirect.basePath;
            }
            renderOpts__21.isRedirect = true;
        }
        if ((dev__21 || isBuildTimeSSG__21) && !renderOpts__21.isNotFound && !isSerializableProps__2(pathname__21, "getStaticProps", data__58.props)) {
            throw new Error("invariant: getStaticProps did not return valid props. Please report this.");
        }
        if ("revalidate" in data__58) {
            if (typeof data__58.revalidate === "number") {
                if (!Number.isInteger(data__58.revalidate)) {
                    throw new Error(`A page's revalidate option must be seconds expressed as a natural number for ${req__21.url}. Mixed numbers, such as '${data__58.revalidate}', cannot be used.` + `\nTry changing the value to '${Math.ceil(data__58.revalidate)}' or using \`Math.ceil()\` if you're computing the value.`);
                } else if (data__58.revalidate <= 0) {
                    throw new Error(`A page's revalidate option can not be less than or equal to zero for ${req__21.url}. A revalidate option of zero means to revalidate after _every_ request, and implies stale data cannot be tolerated.` + `\n\nTo never revalidate, you can set revalidate to \`false\` (only ran once at build-time).` + `\nTo revalidate as soon as possible, you can set the value to \`1\`.`);
                } else if (data__58.revalidate > 31536000) {
                    console.warn(`Warning: A page's revalidate option was set to more than a year for ${req__21.url}. This may have been done in error.` + `\nTo only run getStaticProps at build-time and not revalidate at runtime, you can set \`revalidate\` to \`false\`!`);
                }
            } else if (data__58.revalidate === true) {
                data__58.revalidate = 1;
            } else if (data__58.revalidate === false || typeof data__58.revalidate === "undefined") {
                data__58.revalidate = false;
            } else {
                throw new Error(`A page's revalidate option must be seconds expressed as a natural number. Mixed numbers and strings cannot be used. Received '${JSON.stringify(data__58.revalidate)}' for ${req__21.url}`);
            }
        } else {
            data__58.revalidate = false;
        }
        props__21.pageProps = Object.assign({}, props__21.pageProps, "props" in data__58 ? data__58.props : undefined);
        renderOpts__21.revalidate = "revalidate" in data__58 ? data__58.revalidate : undefined;
        renderOpts__21.pageData = props__21;
        if (renderOpts__21.isNotFound) {
            return null;
        }
    }
    if (getServerSideProps__21) {
        props__21[SERVER_PROPS_ID__2] = true;
    }
    if (getServerSideProps__21 && !isFallback__21) {
        let data__85;
        let canAccessRes__85 = true;
        let resOrProxy__85 = res__21;
        if (process.env.NODE_ENV !== "production") {
            resOrProxy__85 = new Proxy(res__21, {
                get: function(obj__87, prop__87, receiver__87) {
                    if (!canAccessRes__85) {
                        throw new Error(`You should not access 'res' after getServerSideProps resolves.` + `\nRead more: https://nextjs.org/docs/messages/gssp-no-mutating-res`);
                    }
                    return Reflect.get(obj__87, prop__87, receiver__87);
                }
            });
        }
        try {
            data__85 = await getServerSideProps__21({
                req: req__21,
                res: resOrProxy__85,
                query__21,
                resolvedUrl: renderOpts__21.resolvedUrl,
                ...pageIsDynamic__21 ? {
                    params: params__21
                } : undefined,
                ...previewData__21 !== false ? {
                    preview: true,
                    previewData: previewData__21
                } : undefined,
                locales: renderOpts__21.locales,
                locale: renderOpts__21.locale,
                defaultLocale: renderOpts__21.defaultLocale
            });
            canAccessRes__85 = false;
        } catch (serverSidePropsError__90) {
            if (isError__2(serverSidePropsError__90) && serverSidePropsError__90.code === "ENOENT") {
                delete serverSidePropsError__90.code;
            }
            throw serverSidePropsError__90;
        }
        if (data__85 == null) {
            throw new Error(GSSP_NO_RETURNED_VALUE__2);
        }
        const invalidKeys__85 = Object.keys(data__85).filter((key__93)=>key__93 !== "props" && key__93 !== "redirect" && key__93 !== "notFound");
        if (data__85.unstable_notFound) {
            throw new Error(`unstable_notFound has been renamed to notFound, please update the field to continue. Page: ${pathname__21}`);
        }
        if (data__85.unstable_redirect) {
            throw new Error(`unstable_redirect has been renamed to redirect, please update the field to continue. Page: ${pathname__21}`);
        }
        if (invalidKeys__85.length) {
            throw new Error(invalidKeysMsg__2("getServerSideProps", invalidKeys__85));
        }
        if ("notFound" in data__85 && data__85.notFound) {
            if (pathname__21 === "/404") {
                throw new Error(`The /404 page can not return notFound in "getStaticProps", please remove it to continue!`);
            }
            renderOpts__21.isNotFound = true;
            return null;
        }
        if ("redirect" in data__85 && typeof data__85.redirect === "object") {
            checkRedirectValues__2(data__85.redirect, req__21, "getServerSideProps");
            data__85.props = {
                __N_REDIRECT: data__85.redirect.destination,
                __N_REDIRECT_STATUS: getRedirectStatus__2(data__85.redirect)
            };
            if (typeof data__85.redirect.basePath !== "undefined") {
                data__85.props.__N_REDIRECT_BASE_PATH = data__85.redirect.basePath;
            }
            renderOpts__21.isRedirect = true;
        }
        if (data__85.props instanceof Promise) {
            data__85.props = await data__85.props;
        }
        if ((dev__21 || isBuildTimeSSG__21) && !isSerializableProps__2(pathname__21, "getServerSideProps", data__85.props)) {
            throw new Error("invariant: getServerSideProps did not return valid props. Please report this.");
        }
        props__21.pageProps = Object.assign({}, props__21.pageProps, data__85.props);
        renderOpts__21.pageData = props__21;
    }
    if (!isSSG__21 && !getServerSideProps__21 && process.env.NODE_ENV !== "production" && Object.keys(props__21?.pageProps || {}).includes("url")) {
        console.warn(`The prop \`url\` is a reserved prop in Next.js for legacy reasons and will be overridden on page ${pathname__21}\n` + `See more info here: https://nextjs.org/docs/messages/reserved-page-prop`);
    }
    if (isDataReq__21 && !isSSG__21 || renderOpts__21.isRedirect) {
        return RenderResult__2.fromStatic(JSON.stringify(props__21));
    }
    if (isFallback__21) {
        props__21.pageProps = {};
    }
    if (isResSent__2(res__21) && !isSSG__21) return null;
    let filteredBuildManifest__21 = buildManifest__21;
    if (isAutoExport__21 && pageIsDynamic__21) {
        const page__106 = denormalizePagePath__2(normalizePagePath__2(pathname__21));
        if (page__106 in filteredBuildManifest__21.pages) {
            filteredBuildManifest__21 = {
                ...filteredBuildManifest__21,
                pages: {
                    ...filteredBuildManifest__21.pages,
                    [page__106]: [
                        ...filteredBuildManifest__21.pages[page__106],
                        ...filteredBuildManifest__21.lowPriorityFiles.filter((f__108)=>f__108.includes("_buildManifest"))
                    ]
                },
                lowPriorityFiles: filteredBuildManifest__21.lowPriorityFiles.filter((f__109)=>!f__109.includes("_buildManifest"))
            };
        }
    }
    const generateStaticHTML__21 = supportsDynamicHTML__21 !== true;
    const renderDocument__21 = async ()=>{
        if (Document__21.getInitialProps) {
            const renderPage__111 = (options__112 = {})=>{
                if (ctx__21.err && ErrorDebug__21) {
                    const html__113 = ReactDOMServer__2.renderToString(<ErrorDebug__21 error={ctx__21.err}/>);
                    return {
                        html__113,
                        head__21
                    };
                }
                if (dev__21 && (props__21.router || props__21.Component)) {
                    throw new Error(`'router' and 'Component' can not be returned in getInitialProps from _app.js https://nextjs.org/docs/messages/cant-override-next-props`);
                }
                const { App: EnhancedApp__112, Component: EnhancedComponent__112 } = enhanceComponents__2(options__112, App__21, Component__21);
                const html__112 = ReactDOMServer__2.renderToString(<AppContainer__21>
                        <EnhancedApp__112 Component={EnhancedComponent__112} router={router__21} {...props__21}/>
                    </AppContainer__21>);
                return {
                    html__112,
                    head__21
                };
            };
            const documentCtx__111 = {
                ...ctx__21,
                renderPage__111
            };
            const docProps__111 = await loadGetInitialProps__2(Document__21, documentCtx__111);
            if (isResSent__2(res__21) && !isSSG__21) return null;
            if (!docProps__111 || typeof docProps__111.html !== "string") {
                const message__115 = `"${getDisplayName__2(Document__21)}.getInitialProps()" should resolve to an object with a "html" prop set with a valid html string`;
                throw new Error(message__115);
            }
            return {
                bodyResult: piperFromArray__2([
                    docProps__111.html
                ]),
                documentElement: (htmlProps__116)=><Document__21 {...htmlProps__116} {...docProps__111}/>,
                head: docProps__111.head,
                headTags: await headTags__21(documentCtx__111),
                styles: docProps__111.styles
            };
        } else {
            const content__117 = ctx__21.err && ErrorDebug__21 ? <ErrorDebug__21 error={ctx__21.err}/> : <AppContainer__21>
                        <App__21 {...props__21} Component={Component__21} router={router__21}/>
                    </AppContainer__21>;
            const bodyResult__117 = concurrentFeatures__21 ? await renderToStream__2(content__117, generateStaticHTML__21) : piperFromArray__2([
                ReactDOMServer__2.renderToString(content__117)
            ]);
            return {
                bodyResult__117,
                documentElement: ()=>Document__21(),
                head__21,
                headTags: [],
                styles: jsxStyleRegistry__21.styles()
            };
        }
    };
    const documentResult__21 = await renderDocument__21();
    if (!documentResult__21) {
        return null;
    }
    const dynamicImportsIds__21 = new Set();
    const dynamicImports__21 = new Set();
    for (const mod__119 of reactLoadableModules__21){
        const manifestItem__120 = reactLoadableManifest__21[mod__119];
        if (manifestItem__120) {
            dynamicImportsIds__21.add(manifestItem__120.id);
            manifestItem__120.files.forEach((item__122)=>{
                dynamicImports__21.add(item__122);
            });
        }
    }
    const hybridAmp__21 = ampState__21.hybrid;
    const docComponentsRendered__21 = {};
    const { assetPrefix__21, buildId__21, customServer__21, defaultLocale__21, disableOptimizedLoading__21, domainLocales__21, locale__21, locales__21, runtimeConfig__21 } = renderOpts__21;
    const htmlProps__21 = {
        __NEXT_DATA__: {
            props__21,
            page: pathname__21,
            query__21,
            buildId__21,
            assetPrefix: assetPrefix__21 === "" ? undefined : assetPrefix__21,
            runtimeConfig__21,
            nextExport: nextExport__21 === true ? true : undefined,
            autoExport: isAutoExport__21 === true ? true : undefined,
            isFallback__21,
            dynamicIds: dynamicImportsIds__21.size === 0 ? undefined : Array.from(dynamicImportsIds__21),
            err: renderOpts__21.err ? serializeError__2(dev__21, renderOpts__21.err) : undefined,
            gsp: !!getStaticProps__21 ? true : undefined,
            gssp: !!getServerSideProps__21 ? true : undefined,
            customServer__21,
            gip: hasPageGetInitialProps__21 ? true : undefined,
            appGip: !defaultAppGetInitialProps__21 ? true : undefined,
            locale__21,
            locales__21,
            defaultLocale__21,
            domainLocales__21,
            isPreview: isPreview__21 === true ? true : undefined
        },
        buildManifest: filteredBuildManifest__21,
        docComponentsRendered__21,
        dangerousAsPath: router__21.asPath,
        canonicalBase: !renderOpts__21.ampPath && req__21.__nextStrippedLocale ? `${renderOpts__21.canonicalBase || ""}/${renderOpts__21.locale}` : renderOpts__21.canonicalBase,
        ampPath__21,
        inAmpMode__21,
        isDevelopment: !!dev__21,
        hybridAmp__21,
        dynamicImports: Array.from(dynamicImports__21),
        assetPrefix__21,
        unstable_runtimeJS: process.env.NODE_ENV === "production" ? pageConfig__21.unstable_runtimeJS : undefined,
        unstable_JsPreload: pageConfig__21.unstable_JsPreload,
        devOnlyCacheBusterQueryString__21,
        scriptLoader__21,
        locale__21,
        disableOptimizedLoading__21,
        head: documentResult__21.head,
        headTags: documentResult__21.headTags,
        styles: documentResult__21.styles,
        useMaybeDeferContent__2
    };
    const documentHTML__21 = ReactDOMServer__2.renderToStaticMarkup(<AmpStateContext__2.Provider value={ampState__21}>
            <HtmlContext__2.Provider value={htmlProps__21}>
                {documentResult__21.documentElement(htmlProps__21)}
            </HtmlContext__2.Provider>
        </AmpStateContext__2.Provider>);
    if (process.env.NODE_ENV !== "production") {
        const nonRenderedComponents__123 = [];
        const expectedDocComponents__123 = [
            "Main",
            "Head",
            "NextScript",
            "Html"
        ];
        for (const comp__124 of expectedDocComponents__123){
            if (!docComponentsRendered__21[comp__124]) {
                nonRenderedComponents__123.push(comp__124);
            }
        }
        const plural__123 = nonRenderedComponents__123.length !== 1 ? "s" : "";
        if (nonRenderedComponents__123.length) {
            const missingComponentList__127 = nonRenderedComponents__123.map((e__128)=>`<${e__128} />`).join(", ");
            warn__2(`Your custom Document (pages/_document) did not render all the required subcomponent${plural__123}.\n` + `Missing component${plural__123}: ${missingComponentList__127}\n` + "Read how to fix here: https://nextjs.org/docs/messages/missing-document-component");
        }
    }
    const renderTargetIdx__21 = documentHTML__21.indexOf(BODY_RENDER_TARGET__2);
    const prefix__21 = [];
    prefix__21.push("<!DOCTYPE html>");
    prefix__21.push(documentHTML__21.substring(0, renderTargetIdx__21));
    if (inAmpMode__21) {
        prefix__21.push("<!-- __NEXT_DATA__ -->");
    }
    let pipers__21 = [
        piperFromArray__2(prefix__21),
        documentResult__21.bodyResult,
        piperFromArray__2([
            documentHTML__21.substring(renderTargetIdx__21 + BODY_RENDER_TARGET__2.length)
        ])
    ];
    const postProcessors__21 = (generateStaticHTML__21 ? [
        inAmpMode__21 ? async (html__130)=>{
            html__130 = await optimizeAmp__2(html__130, renderOpts__21.ampOptimizerConfig);
            if (!renderOpts__21.ampSkipValidation && renderOpts__21.ampValidator) {
                await renderOpts__21.ampValidator(html__130, pathname__21);
            }
            return html__130;
        } : null,
        process.env.__NEXT_OPTIMIZE_FONTS || process.env.__NEXT_OPTIMIZE_IMAGES ? async (html__132)=>{
            return await postProcess__2(html__132, {
                getFontDefinition__21
            }, {
                optimizeFonts: renderOpts__21.optimizeFonts,
                optimizeImages: renderOpts__21.optimizeImages
            });
        } : null,
        renderOpts__21.optimizeCss ? async (html__133)=>{
            const Critters__133 = require("critters");
            const cssOptimizer__133 = new Critters__133({
                ssrMode: true,
                reduceInlineStyles: false,
                path: renderOpts__21.distDir,
                publicPath: `${renderOpts__21.assetPrefix}/_next/`,
                preload: "media",
                fonts: false,
                ...renderOpts__21.optimizeCss
            });
            return await cssOptimizer__133.process(html__133);
        } : null,
        inAmpMode__21 || hybridAmp__21 ? async (html__134)=>{
            return html__134.replace(/&amp;amp=1/g, "&amp=1");
        } : null
    ] : []).filter(Boolean);
    if (generateStaticHTML__21 || postProcessors__21.length > 0) {
        let html__135 = await piperToString__2(chainPipers__2(pipers__21));
        for (const postProcessor__136 of postProcessors__21){
            if (postProcessor__136) {
                html__135 = await postProcessor__136(html__135);
            }
        }
        return new RenderResult__2(html__135);
    }
    return new RenderResult__2(chainPipers__2(pipers__21));
}
function errorToJSON__2(err__139) {
    const { name__139, message__139, stack__139 } = err__139;
    return {
        name__139,
        message__139,
        stack__139
    };
}
function serializeError__2(dev__140, err__140) {
    if (dev__140) {
        return errorToJSON__2(err__140);
    }
    return {
        name: "Internal Server Error.",
        message: "500 - Internal Server Error.",
        statusCode: 500
    };
}
function renderToStream__2(element__142, generateStaticHTML__142) {
    return new Promise((resolve__143, reject__143)=>{
        let underlyingStream__143 = null;
        const stream__143 = new Writable__2({
            highWaterMark: 0,
            write (chunk__144, encoding__144, callback__144) {
                if (!underlyingStream__143) {
                    throw new Error("invariant: write called without an underlying stream. This is a bug in Next.js");
                }
                if (!underlyingStream__143.writable.write(chunk__144, encoding__144)) {
                    underlyingStream__143.queuedCallbacks.push(()=>callback__144());
                } else {
                    callback__144();
                }
            }
        });
        stream__143.once("finish", ()=>{
            if (!underlyingStream__143) {
                throw new Error("invariant: finish called without an underlying stream. This is a bug in Next.js");
            }
            underlyingStream__143.resolve();
        });
        stream__143.once("error", (err__150)=>{
            if (!underlyingStream__143) {
                throw new Error("invariant: error called without an underlying stream. This is a bug in Next.js");
            }
            underlyingStream__143.resolve(err__150);
        });
        Object.defineProperty(stream__143, "flush", {
            value: ()=>{
                if (!underlyingStream__143) {
                    throw new Error("invariant: flush called without an underlying stream. This is a bug in Next.js");
                }
                if (typeof underlyingStream__143.writable.flush === "function") {
                    underlyingStream__143.writable.flush();
                }
            },
            enumerable: true
        });
        let resolved__143 = false;
        const doResolve__143 = ()=>{
            if (!resolved__143) {
                resolved__143 = true;
                resolve__143((res__157, next__157)=>{
                    const drainHandler__157 = ()=>{
                        const prevCallbacks__158 = underlyingStream__143.queuedCallbacks;
                        underlyingStream__143.queuedCallbacks = [];
                        prevCallbacks__158.forEach((callback__159)=>callback__159());
                    };
                    res__157.on("drain", drainHandler__157);
                    underlyingStream__143 = {
                        resolve: (err__160)=>{
                            underlyingStream__143 = null;
                            res__157.removeListener("drain", drainHandler__157);
                            next__157(err__160);
                        },
                        writable: res__157,
                        queuedCallbacks: []
                    };
                    startWriting__143();
                });
            }
        };
        const { abort__143, startWriting__143 } = ReactDOMServer__2.pipeToNodeWritable(element__142, stream__143, {
            onError (error__161) {
                if (!resolved__143) {
                    resolved__143 = true;
                    reject__143(error__161);
                }
                abort__143();
            },
            onCompleteShell () {
                if (!generateStaticHTML__142) {
                    doResolve__143();
                }
            },
            onCompleteAll () {
                doResolve__143();
            }
        });
    });
}
function chainPipers__2(pipers__166) {
    return pipers__166.reduceRight((lhs__167, rhs__167)=>(res__168, next__168)=>{
            rhs__167(res__168, (err__169)=>err__169 ? next__168(err__169) : lhs__167(res__168, next__168));
        }, (res__170, next__170)=>{
        res__170.end();
        next__170();
    });
}
function piperFromArray__2(chunks__171) {
    return (res__172, next__172)=>{
        if (typeof res__172.cork === "function") {
            res__172.cork();
        }
        chunks__171.forEach((chunk__174)=>res__172.write(chunk__174));
        if (typeof res__172.uncork === "function") {
            res__172.uncork();
        }
        next__172();
    };
}
function piperToString__2(input__176) {
    return new Promise((resolve__177, reject__177)=>{
        const bufferedChunks__177 = [];
        const stream__177 = new Writable__2({
            writev (chunks__178, callback__178) {
                chunks__178.forEach((chunk__179)=>bufferedChunks__177.push(chunk__179.chunk));
                callback__178();
            }
        });
        input__176(stream__177, (err__180)=>{
            if (err__180) {
                reject__177(err__180);
            } else {
                resolve__177(Buffer.concat(bufferedChunks__177).toString());
            }
        });
    });
}
export function useMaybeDeferContent__2(_name__183, contentFn__183) {
    return [
        false,
        contentFn__183()
    ];
}
