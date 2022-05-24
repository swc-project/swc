import { Writable__1 } from "stream";
import * as ReactDOMServer__1 from "react-dom/server";
import { StyleRegistry__1, createStyleRegistry__1 } from "styled-jsx";
import { warn__1 } from "../build/output/log";
import { GSP_NO_RETURNED_VALUE__1, GSSP_COMPONENT_MEMBER_ERROR__1, GSSP_NO_RETURNED_VALUE__1, STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR__1, SERVER_PROPS_GET_INIT_PROPS_CONFLICT__1, SERVER_PROPS_SSG_CONFLICT__1, SSG_GET_INITIAL_PROPS_CONFLICT__1, UNSTABLE_REVALIDATE_RENAME_ERROR__1 } from "../lib/constants";
import { isSerializableProps__1 } from "../lib/is-serializable-props";
import { isInAmpMode__1 } from "../shared/lib/amp";
import { AmpStateContext__1 } from "../shared/lib/amp-context";
import { BODY_RENDER_TARGET__1, SERVER_PROPS_ID__1, STATIC_PROPS_ID__1, STATIC_STATUS_PAGES__1 } from "../shared/lib/constants";
import { defaultHead__1 } from "../shared/lib/head";
import { HeadManagerContext__1 } from "../shared/lib/head-manager-context";
import Loadable__1 from "../shared/lib/loadable";
import { LoadableContext__1 } from "../shared/lib/loadable-context";
import postProcess__1 from "../shared/lib/post-process";
import { RouterContext__1 } from "../shared/lib/router-context";
import { isDynamicRoute__1 } from "../shared/lib/router/utils/is-dynamic";
import { HtmlContext__1, getDisplayName__1, isResSent__1, loadGetInitialProps__1 } from "../shared/lib/utils";
import { tryGetPreviewData__1 } from "./api-utils";
import { denormalizePagePath__1 } from "./denormalize-page-path";
import { getFontDefinitionFromManifest__1 } from "./font-utils";
import { normalizePagePath__1 } from "./normalize-page-path";
import optimizeAmp__1 from "./optimize-amp";
import { allowedStatusCodes__1, getRedirectStatus__1 } from "../lib/load-custom-routes";
import RenderResult__1 from "./render-result";
import isError__1 from "../lib/is-error";
function noRouter__1() {
    const message__2 = 'No router instance found. you should only use "next/router" inside the client side of your app. https://nextjs.org/docs/messages/no-router-instance';
    throw new Error(message__2);
}
class ServerRouter__1 {
    constructor(pathname__4, query__4, as__4, { isFallback__4  }, isReady__4, basePath__4, locale__4, locales__4, defaultLocale__4, domainLocales__4, isPreview__4, isLocaleDomain__4){
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
        noRouter__1();
    }
    replace() {
        noRouter__1();
    }
    reload() {
        noRouter__1();
    }
    back() {
        noRouter__1();
    }
    prefetch() {
        noRouter__1();
    }
    beforePopState() {
        noRouter__1();
    }
}
function enhanceComponents__1(options__5, App__5, Component__5) {
    if (typeof options__5 === "function") {
        return {
            App__5,
            Component: options__5(Component__5)
        };
    }
    return {
        App: options__5.enhanceApp ? options__5.enhanceApp(App__5) : App__5,
        Component: options__5.enhanceComponent ? options__5.enhanceComponent(Component__5) : Component__5
    };
}
const invalidKeysMsg__1 = (methodName__6, invalidKeys__6)=>{
    return `Additional keys were returned from \`${methodName__6}\`. Properties intended for your component must be nested under the \`props\` key, e.g.:` + `\n\n\treturn { props: { title: 'My Title', content: '...' } }` + `\n\nKeys that need to be moved: ${invalidKeys__6.join(", ")}.` + `\nRead more: https://nextjs.org/docs/messages/invalid-getstaticprops-value`;
};
function checkRedirectValues__1(redirect__7, req__7, method__7) {
    const { destination__7 , permanent__7 , statusCode__7 , basePath__7  } = redirect__7;
    let errors__7 = [];
    const hasStatusCode__7 = typeof statusCode__7 !== "undefined";
    const hasPermanent__7 = typeof permanent__7 !== "undefined";
    if (hasPermanent__7 && hasStatusCode__7) {
        errors__7.push(`\`permanent\` and \`statusCode\` can not both be provided`);
    } else if (hasPermanent__7 && typeof permanent__7 !== "boolean") {
        errors__7.push(`\`permanent\` must be \`true\` or \`false\``);
    } else if (hasStatusCode__7 && !allowedStatusCodes__1.has(statusCode__7)) {
        errors__7.push(`\`statusCode\` must undefined or one of ${[
            ...allowedStatusCodes__1, 
        ].join(", ")}`);
    }
    const destinationType__7 = typeof destination__7;
    if (destinationType__7 !== "string") {
        errors__7.push(`\`destination\` should be string but received ${destinationType__7}`);
    }
    const basePathType__7 = typeof basePath__7;
    if (basePathType__7 !== "undefined" && basePathType__7 !== "boolean") {
        errors__7.push(`\`basePath\` should be undefined or a false, received ${basePathType__7}`);
    }
    if (errors__7.length > 0) {
        throw new Error(`Invalid redirect object returned from ${method__7} for ${req__7.url}\n` + errors__7.join(" and ") + "\n" + `See more info here: https://nextjs.org/docs/messages/invalid-redirect-gssp`);
    }
}
export async function renderToHTML__1(req__8, res__8, pathname__8, query__8, renderOpts__8) {
    renderOpts__8.devOnlyCacheBusterQueryString = renderOpts__8.dev ? renderOpts__8.devOnlyCacheBusterQueryString || `?ts=${Date.now()}` : "";
    query__8 = Object.assign({}, query__8);
    const { err__8 , dev__8 =false , ampPath__8 ="" , App__8 , Document__8 , pageConfig__8 ={} , Component__8 , buildManifest__8 , fontManifest__8 , reactLoadableManifest__8 , ErrorDebug__8 , getStaticProps__8 , getStaticPaths__8 , getServerSideProps__8 , isDataReq__8 , params__8 , previewProps__8 , basePath__8 , devOnlyCacheBusterQueryString__8 , supportsDynamicHTML__8 , concurrentFeatures__8 ,  } = renderOpts__8;
    const getFontDefinition__8 = (url__9)=>{
        if (fontManifest__8) {
            return getFontDefinitionFromManifest__1(url__9, fontManifest__8);
        }
        return "";
    };
    const callMiddleware__8 = async (method__10, args__10, props__10 = false)=>{
        let results__10 = props__10 ? {} : [];
        if (Document__8[`${method__10}Middleware`]) {
            let middlewareFunc__11 = await Document__8[`${method__10}Middleware`];
            middlewareFunc__11 = middlewareFunc__11.default || middlewareFunc__11;
            const curResults__11 = await middlewareFunc__11(...args__10);
            if (props__10) {
                for (const result__12 of curResults__11){
                    results__10 = {
                        ...results__10,
                        ...result__12
                    };
                }
            } else {
                results__10 = curResults__11;
            }
        }
        return results__10;
    };
    const headTags__8 = (...args__13)=>callMiddleware__8("headTags", args__13);
    const isFallback__8 = !!query__8.__nextFallback;
    delete query__8.__nextFallback;
    delete query__8.__nextLocale;
    delete query__8.__nextDefaultLocale;
    const isSSG__8 = !!getStaticProps__8;
    const isBuildTimeSSG__8 = isSSG__8 && renderOpts__8.nextExport;
    const defaultAppGetInitialProps__8 = App__8.getInitialProps === App__8.origGetInitialProps;
    const hasPageGetInitialProps__8 = !!Component__8.getInitialProps;
    const pageIsDynamic__8 = isDynamicRoute__1(pathname__8);
    const isAutoExport__8 = !hasPageGetInitialProps__8 && defaultAppGetInitialProps__8 && !isSSG__8 && !getServerSideProps__8;
    for (const methodName__14 of [
        "getStaticProps",
        "getServerSideProps",
        "getStaticPaths", 
    ]){
        if (Component__8[methodName__14]) {
            throw new Error(`page ${pathname__8} ${methodName__14} ${GSSP_COMPONENT_MEMBER_ERROR__1}`);
        }
    }
    if (hasPageGetInitialProps__8 && isSSG__8) {
        throw new Error(SSG_GET_INITIAL_PROPS_CONFLICT__1 + ` ${pathname__8}`);
    }
    if (hasPageGetInitialProps__8 && getServerSideProps__8) {
        throw new Error(SERVER_PROPS_GET_INIT_PROPS_CONFLICT__1 + ` ${pathname__8}`);
    }
    if (getServerSideProps__8 && isSSG__8) {
        throw new Error(SERVER_PROPS_SSG_CONFLICT__1 + ` ${pathname__8}`);
    }
    if (getStaticPaths__8 && !pageIsDynamic__8) {
        throw new Error(`getStaticPaths is only allowed for dynamic SSG pages and was found on '${pathname__8}'.` + `\nRead more: https://nextjs.org/docs/messages/non-dynamic-getstaticpaths-usage`);
    }
    if (!!getStaticPaths__8 && !isSSG__8) {
        throw new Error(`getStaticPaths was added without a getStaticProps in ${pathname__8}. Without getStaticProps, getStaticPaths does nothing`);
    }
    if (isSSG__8 && pageIsDynamic__8 && !getStaticPaths__8) {
        throw new Error(`getStaticPaths is required for dynamic SSG pages and is missing for '${pathname__8}'.` + `\nRead more: https://nextjs.org/docs/messages/invalid-getstaticpaths-value`);
    }
    let asPath__8 = renderOpts__8.resolvedAsPath || req__8.url;
    if (dev__8) {
        const { isValidElementType__15  } = require("react-is");
        if (!isValidElementType__15(Component__8)) {
            throw new Error(`The default export is not a React Component in page: "${pathname__8}"`);
        }
        if (!isValidElementType__15(App__8)) {
            throw new Error(`The default export is not a React Component in page: "/_app"`);
        }
        if (!isValidElementType__15(Document__8)) {
            throw new Error(`The default export is not a React Component in page: "/_document"`);
        }
        if (isAutoExport__8 || isFallback__8) {
            query__8 = {
                ...query__8.amp ? {
                    amp: query__8.amp
                } : {}
            };
            asPath__8 = `${pathname__8}${req__8.url.endsWith("/") && pathname__8 !== "/" && !pageIsDynamic__8 ? "/" : ""}`;
            req__8.url = pathname__8;
        }
        if (pathname__8 === "/404" && (hasPageGetInitialProps__8 || getServerSideProps__8)) {
            throw new Error(`\`pages/404\` ${STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR__1}`);
        }
        if (STATIC_STATUS_PAGES__1.includes(pathname__8) && (hasPageGetInitialProps__8 || getServerSideProps__8)) {
            throw new Error(`\`pages${pathname__8}\` ${STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR__1}`);
        }
    }
    await Loadable__1.preloadAll();
    let isPreview__8;
    let previewData__8;
    if ((isSSG__8 || getServerSideProps__8) && !isFallback__8) {
        previewData__8 = tryGetPreviewData__1(req__8, res__8, previewProps__8);
        isPreview__8 = previewData__8 !== false;
    }
    const routerIsReady__8 = !!(getServerSideProps__8 || hasPageGetInitialProps__8 || !defaultAppGetInitialProps__8 && !isSSG__8);
    const router__8 = new ServerRouter__1(pathname__8, query__8, asPath__8, {
        isFallback: isFallback__8
    }, routerIsReady__8, basePath__8, renderOpts__8.locale, renderOpts__8.locales, renderOpts__8.defaultLocale, renderOpts__8.domainLocales, isPreview__8, req__8.__nextIsLocaleDomain);
    const jsxStyleRegistry__8 = createStyleRegistry__1();
    const ctx__8 = {
        err__8,
        req: isAutoExport__8 ? undefined : req__8,
        res: isAutoExport__8 ? undefined : res__8,
        pathname__8,
        query__8,
        asPath__8,
        locale: renderOpts__8.locale,
        locales: renderOpts__8.locales,
        defaultLocale: renderOpts__8.defaultLocale,
        AppTree: (props__16)=>{
            return <AppContainer__8 >

                    <App__8 {...props__16} Component__0={Component__8} router__0={router__8}/>

                </AppContainer__8>;
        },
        defaultGetInitialProps: async (docCtx__17)=>{
            const enhanceApp__17 = (AppComp__18)=>{
                return (props__19)=><AppComp__18 {...props__19}/>;
            };
            const { html__17 , head__17  } = await docCtx__17.renderPage({
                enhanceApp__17
            });
            const styles__17 = jsxStyleRegistry__8.styles();
            return {
                html__17,
                head__17,
                styles__17
            };
        }
    };
    let props__8;
    const ampState__8 = {
        ampFirst: pageConfig__8.amp === true,
        hasQuery: Boolean(query__8.amp),
        hybrid: pageConfig__8.amp === "hybrid"
    };
    const inAmpMode__8 = isInAmpMode__1(ampState__8);
    const reactLoadableModules__8 = [];
    let head__8 = defaultHead__1(inAmpMode__8);
    let scriptLoader__8 = {};
    const nextExport__8 = !isSSG__8 && (renderOpts__8.nextExport || dev__8 && (isAutoExport__8 || isFallback__8));
    const AppContainer__8 = ({ children__20  })=><RouterContext__1.Provider value__0={router__8}>

            <AmpStateContext__1.Provider value__0={ampState__8}>

                <HeadManagerContext__1.Provider value__0={{
            updateHead: (state__21)=>{
                head__8 = state__21;
            },
            updateScripts: (scripts__22)=>{
                scriptLoader__8 = scripts__22;
            },
            scripts: {},
            mountedInstances: new Set()
        }}>

                    <LoadableContext__1.Provider value__0={(moduleName__23)=>reactLoadableModules__8.push(moduleName__23)}>

                        <StyleRegistry__1 registry__0={jsxStyleRegistry__8}>

                            {children__20}

                        </StyleRegistry__1>

                    </LoadableContext__1.Provider>

                </HeadManagerContext__1.Provider>

            </AmpStateContext__1.Provider>

        </RouterContext__1.Provider>;
    props__8 = await loadGetInitialProps__1(App__8, {
        AppTree: ctx__8.AppTree,
        Component__8,
        router__8,
        ctx__8
    });
    if ((isSSG__8 || getServerSideProps__8) && isPreview__8) {
        props__8.__N_PREVIEW = true;
    }
    if (isSSG__8) {
        props__8[STATIC_PROPS_ID__1] = true;
    }
    if (isSSG__8 && !isFallback__8) {
        let data__24;
        try {
            data__24 = await getStaticProps__8({
                ...pageIsDynamic__8 ? {
                    params: query__8
                } : undefined,
                ...isPreview__8 ? {
                    preview: true,
                    previewData: previewData__8
                } : undefined,
                locales: renderOpts__8.locales,
                locale: renderOpts__8.locale,
                defaultLocale: renderOpts__8.defaultLocale
            });
        } catch (staticPropsError__25) {
            if (staticPropsError__25 && staticPropsError__25.code === "ENOENT") {
                delete staticPropsError__25.code;
            }
            throw staticPropsError__25;
        }
        if (data__24 == null) {
            throw new Error(GSP_NO_RETURNED_VALUE__1);
        }
        const invalidKeys__24 = Object.keys(data__24).filter((key__26)=>key__26 !== "revalidate" && key__26 !== "props" && key__26 !== "redirect" && key__26 !== "notFound");
        if (invalidKeys__24.includes("unstable_revalidate")) {
            throw new Error(UNSTABLE_REVALIDATE_RENAME_ERROR__1);
        }
        if (invalidKeys__24.length) {
            throw new Error(invalidKeysMsg__1("getStaticProps", invalidKeys__24));
        }
        if (process.env.NODE_ENV !== "production") {
            if (typeof data__24.notFound !== "undefined" && typeof data__24.redirect !== "undefined") {
                throw new Error(`\`redirect\` and \`notFound\` can not both be returned from ${isSSG__8 ? "getStaticProps" : "getServerSideProps"} at the same time. Page: ${pathname__8}\nSee more info here: https://nextjs.org/docs/messages/gssp-mixed-not-found-redirect`);
            }
        }
        if ("notFound" in data__24 && data__24.notFound) {
            if (pathname__8 === "/404") {
                throw new Error(`The /404 page can not return notFound in "getStaticProps", please remove it to continue!`);
            }
            renderOpts__8.isNotFound = true;
        }
        if ("redirect" in data__24 && data__24.redirect && typeof data__24.redirect === "object") {
            checkRedirectValues__1(data__24.redirect, req__8, "getStaticProps");
            if (isBuildTimeSSG__8) {
                throw new Error(`\`redirect\` can not be returned from getStaticProps during prerendering (${req__8.url})\n` + `See more info here: https://nextjs.org/docs/messages/gsp-redirect-during-prerender`);
            }
            data__24.props = {
                __N_REDIRECT: data__24.redirect.destination,
                __N_REDIRECT_STATUS: getRedirectStatus__1(data__24.redirect)
            };
            if (typeof data__24.redirect.basePath !== "undefined") {
                data__24.props.__N_REDIRECT_BASE_PATH = data__24.redirect.basePath;
            }
            renderOpts__8.isRedirect = true;
        }
        if ((dev__8 || isBuildTimeSSG__8) && !renderOpts__8.isNotFound && !isSerializableProps__1(pathname__8, "getStaticProps", data__24.props)) {
            throw new Error("invariant: getStaticProps did not return valid props. Please report this.");
        }
        if ("revalidate" in data__24) {
            if (typeof data__24.revalidate === "number") {
                if (!Number.isInteger(data__24.revalidate)) {
                    throw new Error(`A page's revalidate option must be seconds expressed as a natural number for ${req__8.url}. Mixed numbers, such as '${data__24.revalidate}', cannot be used.` + `\nTry changing the value to '${Math.ceil(data__24.revalidate)}' or using \`Math.ceil()\` if you're computing the value.`);
                } else if (data__24.revalidate <= 0) {
                    throw new Error(`A page's revalidate option can not be less than or equal to zero for ${req__8.url}. A revalidate option of zero means to revalidate after _every_ request, and implies stale data cannot be tolerated.` + `\n\nTo never revalidate, you can set revalidate to \`false\` (only ran once at build-time).` + `\nTo revalidate as soon as possible, you can set the value to \`1\`.`);
                } else if (data__24.revalidate > 31536000) {
                    console.warn(`Warning: A page's revalidate option was set to more than a year for ${req__8.url}. This may have been done in error.` + `\nTo only run getStaticProps at build-time and not revalidate at runtime, you can set \`revalidate\` to \`false\`!`);
                }
            } else if (data__24.revalidate === true) {
                data__24.revalidate = 1;
            } else if (data__24.revalidate === false || typeof data__24.revalidate === "undefined") {
                data__24.revalidate = false;
            } else {
                throw new Error(`A page's revalidate option must be seconds expressed as a natural number. Mixed numbers and strings cannot be used. Received '${JSON.stringify(data__24.revalidate)}' for ${req__8.url}`);
            }
        } else {
            data__24.revalidate = false;
        }
        props__8.pageProps = Object.assign({}, props__8.pageProps, "props" in data__24 ? data__24.props : undefined);
        renderOpts__8.revalidate = "revalidate" in data__24 ? data__24.revalidate : undefined;
        renderOpts__8.pageData = props__8;
        if (renderOpts__8.isNotFound) {
            return null;
        }
    }
    if (getServerSideProps__8) {
        props__8[SERVER_PROPS_ID__1] = true;
    }
    if (getServerSideProps__8 && !isFallback__8) {
        let data__27;
        let canAccessRes__27 = true;
        let resOrProxy__27 = res__8;
        if (process.env.NODE_ENV !== "production") {
            resOrProxy__27 = new Proxy(res__8, {
                get: function(obj__28, prop__28, receiver__28) {
                    if (!canAccessRes__27) {
                        throw new Error(`You should not access 'res' after getServerSideProps resolves.` + `\nRead more: https://nextjs.org/docs/messages/gssp-no-mutating-res`);
                    }
                    return Reflect.get(obj__28, prop__28, receiver__28);
                }
            });
        }
        try {
            data__27 = await getServerSideProps__8({
                req: req__8,
                res: resOrProxy__27,
                query__8,
                resolvedUrl: renderOpts__8.resolvedUrl,
                ...pageIsDynamic__8 ? {
                    params: params__8
                } : undefined,
                ...previewData__8 !== false ? {
                    preview: true,
                    previewData: previewData__8
                } : undefined,
                locales: renderOpts__8.locales,
                locale: renderOpts__8.locale,
                defaultLocale: renderOpts__8.defaultLocale
            });
            canAccessRes__27 = false;
        } catch (serverSidePropsError__29) {
            if (isError__1(serverSidePropsError__29) && serverSidePropsError__29.code === "ENOENT") {
                delete serverSidePropsError__29.code;
            }
            throw serverSidePropsError__29;
        }
        if (data__27 == null) {
            throw new Error(GSSP_NO_RETURNED_VALUE__1);
        }
        const invalidKeys__27 = Object.keys(data__27).filter((key__30)=>key__30 !== "props" && key__30 !== "redirect" && key__30 !== "notFound");
        if (data__27.unstable_notFound) {
            throw new Error(`unstable_notFound has been renamed to notFound, please update the field to continue. Page: ${pathname__8}`);
        }
        if (data__27.unstable_redirect) {
            throw new Error(`unstable_redirect has been renamed to redirect, please update the field to continue. Page: ${pathname__8}`);
        }
        if (invalidKeys__27.length) {
            throw new Error(invalidKeysMsg__1("getServerSideProps", invalidKeys__27));
        }
        if ("notFound" in data__27 && data__27.notFound) {
            if (pathname__8 === "/404") {
                throw new Error(`The /404 page can not return notFound in "getStaticProps", please remove it to continue!`);
            }
            renderOpts__8.isNotFound = true;
            return null;
        }
        if ("redirect" in data__27 && typeof data__27.redirect === "object") {
            checkRedirectValues__1(data__27.redirect, req__8, "getServerSideProps");
            data__27.props = {
                __N_REDIRECT: data__27.redirect.destination,
                __N_REDIRECT_STATUS: getRedirectStatus__1(data__27.redirect)
            };
            if (typeof data__27.redirect.basePath !== "undefined") {
                data__27.props.__N_REDIRECT_BASE_PATH = data__27.redirect.basePath;
            }
            renderOpts__8.isRedirect = true;
        }
        if (data__27.props instanceof Promise) {
            data__27.props = await data__27.props;
        }
        if ((dev__8 || isBuildTimeSSG__8) && !isSerializableProps__1(pathname__8, "getServerSideProps", data__27.props)) {
            throw new Error("invariant: getServerSideProps did not return valid props. Please report this.");
        }
        props__8.pageProps = Object.assign({}, props__8.pageProps, data__27.props);
        renderOpts__8.pageData = props__8;
    }
    if (!isSSG__8 && !getServerSideProps__8 && process.env.NODE_ENV !== "production" && Object.keys(props__8?.pageProps || {}).includes("url")) {
        console.warn(`The prop \`url\` is a reserved prop in Next.js for legacy reasons and will be overridden on page ${pathname__8}\n` + `See more info here: https://nextjs.org/docs/messages/reserved-page-prop`);
    }
    if (isDataReq__8 && !isSSG__8 || renderOpts__8.isRedirect) {
        return RenderResult__1.fromStatic(JSON.stringify(props__8));
    }
    if (isFallback__8) {
        props__8.pageProps = {};
    }
    if (isResSent__1(res__8) && !isSSG__8) return null;
    let filteredBuildManifest__8 = buildManifest__8;
    if (isAutoExport__8 && pageIsDynamic__8) {
        const page__31 = denormalizePagePath__1(normalizePagePath__1(pathname__8));
        if (page__31 in filteredBuildManifest__8.pages) {
            filteredBuildManifest__8 = {
                ...filteredBuildManifest__8,
                pages: {
                    ...filteredBuildManifest__8.pages,
                    [page__31]: [
                        ...filteredBuildManifest__8.pages[page__31],
                        ...filteredBuildManifest__8.lowPriorityFiles.filter((f__32)=>f__32.includes("_buildManifest")), 
                    ]
                },
                lowPriorityFiles: filteredBuildManifest__8.lowPriorityFiles.filter((f__33)=>!f__33.includes("_buildManifest"))
            };
        }
    }
    const generateStaticHTML__8 = supportsDynamicHTML__8 !== true;
    const renderDocument__8 = async ()=>{
        if (Document__8.getInitialProps) {
            const renderPage__34 = (options__35 = {})=>{
                if (ctx__8.err && ErrorDebug__8) {
                    const html__36 = ReactDOMServer__1.renderToString(<ErrorDebug__8 error__0={ctx__8.err}/>);
                    return {
                        html__36,
                        head__8
                    };
                }
                if (dev__8 && (props__8.router || props__8.Component)) {
                    throw new Error(`'router' and 'Component' can not be returned in getInitialProps from _app.js https://nextjs.org/docs/messages/cant-override-next-props`);
                }
                const { App: EnhancedApp__35 , Component: EnhancedComponent__35  } = enhanceComponents__1(options__35, App__8, Component__8);
                const html__35 = ReactDOMServer__1.renderToString(<AppContainer__8 >

                        <EnhancedApp__35 Component__0={EnhancedComponent__35} router__0={router__8} {...props__8}/>

                    </AppContainer__8>);
                return {
                    html__35,
                    head__8
                };
            };
            const documentCtx__34 = {
                ...ctx__8,
                renderPage__34
            };
            const docProps__34 = await loadGetInitialProps__1(Document__8, documentCtx__34);
            if (isResSent__1(res__8) && !isSSG__8) return null;
            if (!docProps__34 || typeof docProps__34.html !== "string") {
                const message__37 = `"${getDisplayName__1(Document__8)}.getInitialProps()" should resolve to an object with a "html" prop set with a valid html string`;
                throw new Error(message__37);
            }
            return {
                bodyResult: piperFromArray__1([
                    docProps__34.html
                ]),
                documentElement: (htmlProps__38)=><Document__8 {...htmlProps__38} {...docProps__34}/>,
                head: docProps__34.head,
                headTags: await headTags__8(documentCtx__34),
                styles: docProps__34.styles
            };
        } else {
            const content__39 = ctx__8.err && ErrorDebug__8 ? <ErrorDebug__8 error__0={ctx__8.err}/> : <AppContainer__8 >

                        <App__8 {...props__8} Component__0={Component__8} router__0={router__8}/>

                    </AppContainer__8>;
            const bodyResult__39 = concurrentFeatures__8 ? await renderToStream__1(content__39, generateStaticHTML__8) : piperFromArray__1([
                ReactDOMServer__1.renderToString(content__39)
            ]);
            return {
                bodyResult__39,
                documentElement: ()=>Document__8(),
                head__8,
                headTags: [],
                styles: jsxStyleRegistry__8.styles()
            };
        }
    };
    const documentResult__8 = await renderDocument__8();
    if (!documentResult__8) {
        return null;
    }
    const dynamicImportsIds__8 = new Set();
    const dynamicImports__8 = new Set();
    for (const mod__40 of reactLoadableModules__8){
        const manifestItem__41 = reactLoadableManifest__8[mod__40];
        if (manifestItem__41) {
            dynamicImportsIds__8.add(manifestItem__41.id);
            manifestItem__41.files.forEach((item__42)=>{
                dynamicImports__8.add(item__42);
            });
        }
    }
    const hybridAmp__8 = ampState__8.hybrid;
    const docComponentsRendered__8 = {};
    const { assetPrefix__8 , buildId__8 , customServer__8 , defaultLocale__8 , disableOptimizedLoading__8 , domainLocales__8 , locale__8 , locales__8 , runtimeConfig__8 ,  } = renderOpts__8;
    const htmlProps__8 = {
        __NEXT_DATA__: {
            props__8,
            page: pathname__8,
            query__8,
            buildId__8,
            assetPrefix: assetPrefix__8 === "" ? undefined : assetPrefix__8,
            runtimeConfig__8,
            nextExport: nextExport__8 === true ? true : undefined,
            autoExport: isAutoExport__8 === true ? true : undefined,
            isFallback__8,
            dynamicIds: dynamicImportsIds__8.size === 0 ? undefined : Array.from(dynamicImportsIds__8),
            err: renderOpts__8.err ? serializeError__1(dev__8, renderOpts__8.err) : undefined,
            gsp: !!getStaticProps__8 ? true : undefined,
            gssp: !!getServerSideProps__8 ? true : undefined,
            customServer__8,
            gip: hasPageGetInitialProps__8 ? true : undefined,
            appGip: !defaultAppGetInitialProps__8 ? true : undefined,
            locale__8,
            locales__8,
            defaultLocale__8,
            domainLocales__8,
            isPreview: isPreview__8 === true ? true : undefined
        },
        buildManifest: filteredBuildManifest__8,
        docComponentsRendered__8,
        dangerousAsPath: router__8.asPath,
        canonicalBase: !renderOpts__8.ampPath && req__8.__nextStrippedLocale ? `${renderOpts__8.canonicalBase || ""}/${renderOpts__8.locale}` : renderOpts__8.canonicalBase,
        ampPath__8,
        inAmpMode__8,
        isDevelopment: !!dev__8,
        hybridAmp__8,
        dynamicImports: Array.from(dynamicImports__8),
        assetPrefix__8,
        unstable_runtimeJS: process.env.NODE_ENV === "production" ? pageConfig__8.unstable_runtimeJS : undefined,
        unstable_JsPreload: pageConfig__8.unstable_JsPreload,
        devOnlyCacheBusterQueryString__8,
        scriptLoader__8,
        locale__8,
        disableOptimizedLoading__8,
        head: documentResult__8.head,
        headTags: documentResult__8.headTags,
        styles: documentResult__8.styles,
        useMaybeDeferContent__1
    };
    const documentHTML__8 = ReactDOMServer__1.renderToStaticMarkup(<AmpStateContext__1.Provider value__0={ampState__8}>

            <HtmlContext__1.Provider value__0={htmlProps__8}>

                {documentResult__8.documentElement(htmlProps__8)}

            </HtmlContext__1.Provider>

        </AmpStateContext__1.Provider>);
    if (process.env.NODE_ENV !== "production") {
        const nonRenderedComponents__43 = [];
        const expectedDocComponents__43 = [
            "Main",
            "Head",
            "NextScript",
            "Html"
        ];
        for (const comp__44 of expectedDocComponents__43){
            if (!docComponentsRendered__8[comp__44]) {
                nonRenderedComponents__43.push(comp__44);
            }
        }
        const plural__43 = nonRenderedComponents__43.length !== 1 ? "s" : "";
        if (nonRenderedComponents__43.length) {
            const missingComponentList__45 = nonRenderedComponents__43.map((e__46)=>`<${e__46} />`).join(", ");
            warn__1(`Your custom Document (pages/_document) did not render all the required subcomponent${plural__43}.\n` + `Missing component${plural__43}: ${missingComponentList__45}\n` + "Read how to fix here: https://nextjs.org/docs/messages/missing-document-component");
        }
    }
    const renderTargetIdx__8 = documentHTML__8.indexOf(BODY_RENDER_TARGET__1);
    const prefix__8 = [];
    prefix__8.push("<!DOCTYPE html>");
    prefix__8.push(documentHTML__8.substring(0, renderTargetIdx__8));
    if (inAmpMode__8) {
        prefix__8.push("<!-- __NEXT_DATA__ -->");
    }
    let pipers__8 = [
        piperFromArray__1(prefix__8),
        documentResult__8.bodyResult,
        piperFromArray__1([
            documentHTML__8.substring(renderTargetIdx__8 + BODY_RENDER_TARGET__1.length), 
        ]), 
    ];
    const postProcessors__8 = (generateStaticHTML__8 ? [
        inAmpMode__8 ? async (html__47)=>{
            html__47 = await optimizeAmp__1(html__47, renderOpts__8.ampOptimizerConfig);
            if (!renderOpts__8.ampSkipValidation && renderOpts__8.ampValidator) {
                await renderOpts__8.ampValidator(html__47, pathname__8);
            }
            return html__47;
        } : null,
        process.env.__NEXT_OPTIMIZE_FONTS || process.env.__NEXT_OPTIMIZE_IMAGES ? async (html__48)=>{
            return await postProcess__1(html__48, {
                getFontDefinition__8
            }, {
                optimizeFonts: renderOpts__8.optimizeFonts,
                optimizeImages: renderOpts__8.optimizeImages
            });
        } : null,
        renderOpts__8.optimizeCss ? async (html__49)=>{
            const Critters__49 = require("critters");
            const cssOptimizer__49 = new Critters__49({
                ssrMode: true,
                reduceInlineStyles: false,
                path: renderOpts__8.distDir,
                publicPath: `${renderOpts__8.assetPrefix}/_next/`,
                preload: "media",
                fonts: false,
                ...renderOpts__8.optimizeCss
            });
            return await cssOptimizer__49.process(html__49);
        } : null,
        inAmpMode__8 || hybridAmp__8 ? async (html__50)=>{
            return html__50.replace(/&amp;amp=1/g, "&amp=1");
        } : null, 
    ] : []).filter(Boolean);
    if (generateStaticHTML__8 || postProcessors__8.length > 0) {
        let html__51 = await piperToString__1(chainPipers__1(pipers__8));
        for (const postProcessor__52 of postProcessors__8){
            if (postProcessor__52) {
                html__51 = await postProcessor__52(html__51);
            }
        }
        return new RenderResult__1(html__51);
    }
    return new RenderResult__1(chainPipers__1(pipers__8));
}
function errorToJSON__1(err__53) {
    const { name__53 , message__53 , stack__53  } = err__53;
    return {
        name__53,
        message__53,
        stack__53
    };
}
function serializeError__1(dev__54, err__54) {
    if (dev__54) {
        return errorToJSON__1(err__54);
    }
    return {
        name: "Internal Server Error.",
        message: "500 - Internal Server Error.",
        statusCode: 500
    };
}
function renderToStream__1(element__55, generateStaticHTML__55) {
    return new Promise((resolve__56, reject__56)=>{
        let underlyingStream__56 = null;
        const stream__56 = new Writable__1({
            highWaterMark: 0,
            write (chunk__57, encoding__57, callback__57) {
                if (!underlyingStream__56) {
                    throw new Error("invariant: write called without an underlying stream. This is a bug in Next.js");
                }
                if (!underlyingStream__56.writable.write(chunk__57, encoding__57)) {
                    underlyingStream__56.queuedCallbacks.push(()=>callback__57());
                } else {
                    callback__57();
                }
            }
        });
        stream__56.once("finish", ()=>{
            if (!underlyingStream__56) {
                throw new Error("invariant: finish called without an underlying stream. This is a bug in Next.js");
            }
            underlyingStream__56.resolve();
        });
        stream__56.once("error", (err__58)=>{
            if (!underlyingStream__56) {
                throw new Error("invariant: error called without an underlying stream. This is a bug in Next.js");
            }
            underlyingStream__56.resolve(err__58);
        });
        Object.defineProperty(stream__56, "flush", {
            value: ()=>{
                if (!underlyingStream__56) {
                    throw new Error("invariant: flush called without an underlying stream. This is a bug in Next.js");
                }
                if (typeof underlyingStream__56.writable.flush === "function") {
                    underlyingStream__56.writable.flush();
                }
            },
            enumerable: true
        });
        let resolved__56 = false;
        const doResolve__56 = ()=>{
            if (!resolved__56) {
                resolved__56 = true;
                resolve__56((res__59, next__59)=>{
                    const drainHandler__59 = ()=>{
                        const prevCallbacks__60 = underlyingStream__56.queuedCallbacks;
                        underlyingStream__56.queuedCallbacks = [];
                        prevCallbacks__60.forEach((callback__61)=>callback__61());
                    };
                    res__59.on("drain", drainHandler__59);
                    underlyingStream__56 = {
                        resolve: (err__62)=>{
                            underlyingStream__56 = null;
                            res__59.removeListener("drain", drainHandler__59);
                            next__59(err__62);
                        },
                        writable: res__59,
                        queuedCallbacks: []
                    };
                    startWriting__56();
                });
            }
        };
        const { abort__56 , startWriting__56  } = ReactDOMServer__1.pipeToNodeWritable(element__55, stream__56, {
            onError (error__63) {
                if (!resolved__56) {
                    resolved__56 = true;
                    reject__56(error__63);
                }
                abort__56();
            },
            onCompleteShell () {
                if (!generateStaticHTML__55) {
                    doResolve__56();
                }
            },
            onCompleteAll () {
                doResolve__56();
            }
        });
    });
}
function chainPipers__1(pipers__64) {
    return pipers__64.reduceRight((lhs__65, rhs__65)=>(res__66, next__66)=>{
            rhs__65(res__66, (err__67)=>err__67 ? next__66(err__67) : lhs__65(res__66, next__66));
        }, (res__68, next__68)=>{
        res__68.end();
        next__68();
    });
}
function piperFromArray__1(chunks__69) {
    return (res__70, next__70)=>{
        if (typeof res__70.cork === "function") {
            res__70.cork();
        }
        chunks__69.forEach((chunk__71)=>res__70.write(chunk__71));
        if (typeof res__70.uncork === "function") {
            res__70.uncork();
        }
        next__70();
    };
}
function piperToString__1(input__72) {
    return new Promise((resolve__73, reject__73)=>{
        const bufferedChunks__73 = [];
        const stream__73 = new Writable__1({
            writev (chunks__74, callback__74) {
                chunks__74.forEach((chunk__75)=>bufferedChunks__73.push(chunk__75.chunk));
                callback__74();
            }
        });
        input__72(stream__73, (err__76)=>{
            if (err__76) {
                reject__73(err__76);
            } else {
                resolve__73(Buffer.concat(bufferedChunks__73).toString());
            }
        });
    });
}
export function useMaybeDeferContent__1(_name__77, contentFn__77) {
    return [
        false,
        contentFn__77()
    ];
}
