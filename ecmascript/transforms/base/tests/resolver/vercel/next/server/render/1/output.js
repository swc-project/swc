import { Writable } from "stream";
import * as ReactDOMServer from "react-dom/server";
import { StyleRegistry, createStyleRegistry } from "styled-jsx";
import { warn } from "../build/output/log";
import { GSP_NO_RETURNED_VALUE, GSSP_COMPONENT_MEMBER_ERROR, GSSP_NO_RETURNED_VALUE, STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR, SERVER_PROPS_GET_INIT_PROPS_CONFLICT, SERVER_PROPS_SSG_CONFLICT, SSG_GET_INITIAL_PROPS_CONFLICT, UNSTABLE_REVALIDATE_RENAME_ERROR } from "../lib/constants";
import { isSerializableProps } from "../lib/is-serializable-props";
import { isInAmpMode } from "../shared/lib/amp";
import { AmpStateContext } from "../shared/lib/amp-context";
import { BODY_RENDER_TARGET, SERVER_PROPS_ID, STATIC_PROPS_ID, STATIC_STATUS_PAGES } from "../shared/lib/constants";
import { defaultHead } from "../shared/lib/head";
import { HeadManagerContext } from "../shared/lib/head-manager-context";
import Loadable from "../shared/lib/loadable";
import { LoadableContext } from "../shared/lib/loadable-context";
import postProcess from "../shared/lib/post-process";
import { RouterContext } from "../shared/lib/router-context";
import { isDynamicRoute } from "../shared/lib/router/utils/is-dynamic";
import { HtmlContext, getDisplayName, isResSent, loadGetInitialProps } from "../shared/lib/utils";
import { tryGetPreviewData } from "./api-utils";
import { denormalizePagePath } from "./denormalize-page-path";
import { getFontDefinitionFromManifest } from "./font-utils";
import { normalizePagePath } from "./normalize-page-path";
import optimizeAmp from "./optimize-amp";
import { allowedStatusCodes, getRedirectStatus } from "../lib/load-custom-routes";
import RenderResult from "./render-result";
import isError from "../lib/is-error";
function noRouter() {
    const message__2 = "No router instance found. you should only use \"next/router\" inside the client side of your app. https://nextjs.org/docs/messages/no-router-instance";
    throw new Error(message__2);
}
class ServerRouter {
    constructor(pathname__3, query__3, as__3, { isFallback__3  }, isReady__3, basePath__3, locale__3, locales__3, defaultLocale__3, domainLocales__3, isPreview__3, isLocaleDomain__3){
        this.route = pathname__3.replace(/\/$/, "") || "/";
        this.pathname = pathname__3;
        this.query = query__3;
        this.asPath = as__3;
        this.isFallback = isFallback__3;
        this.basePath = basePath__3;
        this.locale = locale__3;
        this.locales = locales__3;
        this.defaultLocale = defaultLocale__3;
        this.isReady = isReady__3;
        this.domainLocales = domainLocales__3;
        this.isPreview = !!isPreview__3;
        this.isLocaleDomain = !!isLocaleDomain__3;
    }
    push() {
        noRouter();
    }
    replace() {
        noRouter();
    }
    reload() {
        noRouter();
    }
    back() {
        noRouter();
    }
    prefetch() {
        noRouter();
    }
    beforePopState() {
        noRouter();
    }
}
function enhanceComponents(options__4, App__4, Component__4) {
    if (typeof options__4 === "function") {
        return {
            App__4,
            Component: options__4(Component__4)
        };
    }
    return {
        App: options__4.enhanceApp ? options__4.enhanceApp(App__4) : App__4,
        Component: options__4.enhanceComponent ? options__4.enhanceComponent(Component__4) : Component__4
    };
}
const invalidKeysMsg = (methodName__5, invalidKeys__5)=>{
    return `Additional keys were returned from \`${methodName__5}\`. Properties intended for your component must be nested under the \`props\` key, e.g.:` + `\n\n\treturn { props: { title: 'My Title', content: '...' } }` + `\n\nKeys that need to be moved: ${invalidKeys__5.join(", ")}.` + `\nRead more: https://nextjs.org/docs/messages/invalid-getstaticprops-value`;
};
function checkRedirectValues(redirect__6, req__6, method__6) {
    const { destination__6 , permanent__6 , statusCode__6 , basePath__6  } = redirect__6;
    let errors__6 = [];
    const hasStatusCode__6 = typeof statusCode__6 !== "undefined";
    const hasPermanent__6 = typeof permanent__6 !== "undefined";
    if (hasPermanent__6 && hasStatusCode__6) {
        errors__6.push(`\`permanent\` and \`statusCode\` can not both be provided`);
    } else if (hasPermanent__6 && typeof permanent__6 !== "boolean") {
        errors__6.push(`\`permanent\` must be \`true\` or \`false\``);
    } else if (hasStatusCode__6 && !allowedStatusCodes.has(statusCode__6)) {
        errors__6.push(`\`statusCode\` must undefined or one of ${[
            ...allowedStatusCodes
        ].join(", ")}`);
    }
    const destinationType__6 = typeof destination__6;
    if (destinationType__6 !== "string") {
        errors__6.push(`\`destination\` should be string but received ${destinationType__6}`);
    }
    const basePathType__6 = typeof basePath__6;
    if (basePathType__6 !== "undefined" && basePathType__6 !== "boolean") {
        errors__6.push(`\`basePath\` should be undefined or a false, received ${basePathType__6}`);
    }
    if (errors__6.length > 0) {
        throw new Error(`Invalid redirect object returned from ${method__6} for ${req__6.url}\n` + errors__6.join(" and ") + "\n" + `See more info here: https://nextjs.org/docs/messages/invalid-redirect-gssp`);
    }
}
export async function renderToHTML(req__7, res__7, pathname__7, query__7, renderOpts__7) {
    renderOpts__7.devOnlyCacheBusterQueryString = renderOpts__7.dev ? renderOpts__7.devOnlyCacheBusterQueryString || `?ts=${Date.now()}` : "";
    query__7 = Object.assign({
    }, query__7);
    const { err__7 , dev__7 =false , ampPath__7 ="" , App__7 , Document__7 , pageConfig__7 ={
    } , Component__7 , buildManifest__7 , fontManifest__7 , reactLoadableManifest__7 , ErrorDebug__7 , getStaticProps__7 , getStaticPaths__7 , getServerSideProps__7 , isDataReq__7 , params__7 , previewProps__7 , basePath__7 , devOnlyCacheBusterQueryString__7 , supportsDynamicHTML__7 , concurrentFeatures__7  } = renderOpts__7;
    const getFontDefinition__7 = (url__8)=>{
        if (fontManifest__7) {
            return getFontDefinitionFromManifest(url__8, fontManifest__7);
        }
        return "";
    };
    const callMiddleware__7 = async (method__9, args__9, props__9 = false)=>{
        let results__9 = props__9 ? {
        } : [];
        if (Document__7[`${method__9}Middleware`]) {
            let middlewareFunc__10 = await Document__7[`${method__9}Middleware`];
            middlewareFunc__10 = middlewareFunc__10.default || middlewareFunc__10;
            const curResults__10 = await middlewareFunc__10(...args__9);
            if (props__9) {
                for (const result__11 of curResults__10){
                    results__9 = {
                        ...results__9,
                        ...result__11
                    };
                }
            } else {
                results__9 = curResults__10;
            }
        }
        return results__9;
    };
    const headTags__7 = (...args__12)=>callMiddleware__7("headTags", args__12)
    ;
    const isFallback__7 = !!query__7.__nextFallback;
    delete query__7.__nextFallback;
    delete query__7.__nextLocale;
    delete query__7.__nextDefaultLocale;
    const isSSG__7 = !!getStaticProps__7;
    const isBuildTimeSSG__7 = isSSG__7 && renderOpts__7.nextExport;
    const defaultAppGetInitialProps__7 = App__7.getInitialProps === App__7.origGetInitialProps;
    const hasPageGetInitialProps__7 = !!Component__7.getInitialProps;
    const pageIsDynamic__7 = isDynamicRoute(pathname__7);
    const isAutoExport__7 = !hasPageGetInitialProps__7 && defaultAppGetInitialProps__7 && !isSSG__7 && !getServerSideProps__7;
    for (const methodName__13 of [
        "getStaticProps",
        "getServerSideProps",
        "getStaticPaths"
    ]){
        if (Component__7[methodName__13]) {
            throw new Error(`page ${pathname__7} ${methodName__13} ${GSSP_COMPONENT_MEMBER_ERROR}`);
        }
    }
    if (hasPageGetInitialProps__7 && isSSG__7) {
        throw new Error(SSG_GET_INITIAL_PROPS_CONFLICT + ` ${pathname__7}`);
    }
    if (hasPageGetInitialProps__7 && getServerSideProps__7) {
        throw new Error(SERVER_PROPS_GET_INIT_PROPS_CONFLICT + ` ${pathname__7}`);
    }
    if (getServerSideProps__7 && isSSG__7) {
        throw new Error(SERVER_PROPS_SSG_CONFLICT + ` ${pathname__7}`);
    }
    if (getStaticPaths__7 && !pageIsDynamic__7) {
        throw new Error(`getStaticPaths is only allowed for dynamic SSG pages and was found on '${pathname__7}'.` + `\nRead more: https://nextjs.org/docs/messages/non-dynamic-getstaticpaths-usage`);
    }
    if (!!getStaticPaths__7 && !isSSG__7) {
        throw new Error(`getStaticPaths was added without a getStaticProps in ${pathname__7}. Without getStaticProps, getStaticPaths does nothing`);
    }
    if (isSSG__7 && pageIsDynamic__7 && !getStaticPaths__7) {
        throw new Error(`getStaticPaths is required for dynamic SSG pages and is missing for '${pathname__7}'.` + `\nRead more: https://nextjs.org/docs/messages/invalid-getstaticpaths-value`);
    }
    let asPath__7 = renderOpts__7.resolvedAsPath || req__7.url;
    if (dev__7) {
        const { isValidElementType__14  } = require("react-is");
        if (!isValidElementType__14(Component__7)) {
            throw new Error(`The default export is not a React Component in page: "${pathname__7}"`);
        }
        if (!isValidElementType__14(App__7)) {
            throw new Error(`The default export is not a React Component in page: "/_app"`);
        }
        if (!isValidElementType__14(Document__7)) {
            throw new Error(`The default export is not a React Component in page: "/_document"`);
        }
        if (isAutoExport__7 || isFallback__7) {
            query__7 = {
                ...query__7.amp ? {
                    amp: query__7.amp
                } : {
                }
            };
            asPath__7 = `${pathname__7}${req__7.url.endsWith("/") && pathname__7 !== "/" && !pageIsDynamic__7 ? "/" : ""}`;
            req__7.url = pathname__7;
        }
        if (pathname__7 === "/404" && (hasPageGetInitialProps__7 || getServerSideProps__7)) {
            throw new Error(`\`pages/404\` ${STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR}`);
        }
        if (STATIC_STATUS_PAGES.includes(pathname__7) && (hasPageGetInitialProps__7 || getServerSideProps__7)) {
            throw new Error(`\`pages${pathname__7}\` ${STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR}`);
        }
    }
    await Loadable.preloadAll();
    let isPreview__7;
    let previewData__7;
    if ((isSSG__7 || getServerSideProps__7) && !isFallback__7) {
        previewData__7 = tryGetPreviewData(req__7, res__7, previewProps__7);
        isPreview__7 = previewData__7 !== false;
    }
    const routerIsReady__7 = !!(getServerSideProps__7 || hasPageGetInitialProps__7 || !defaultAppGetInitialProps__7 && !isSSG__7);
    const router__7 = new ServerRouter(pathname__7, query__7, asPath__7, {
        isFallback: isFallback__7
    }, routerIsReady__7, basePath__7, renderOpts__7.locale, renderOpts__7.locales, renderOpts__7.defaultLocale, renderOpts__7.domainLocales, isPreview__7, req__7.__nextIsLocaleDomain);
    const jsxStyleRegistry__7 = createStyleRegistry();
    const ctx__7 = {
        err__7,
        req: isAutoExport__7 ? undefined : req__7,
        res: isAutoExport__7 ? undefined : res__7,
        pathname__7,
        query__7,
        asPath__7,
        locale: renderOpts__7.locale,
        locales: renderOpts__7.locales,
        defaultLocale: renderOpts__7.defaultLocale,
        AppTree: (props__15)=>{
            return <AppContainer__7 >



                <App__7 {...props__15} Component__7={Component__7} router__7={router__7}/>



            </AppContainer__7>;
        },
        defaultGetInitialProps: async (docCtx__16)=>{
            const enhanceApp__16 = (AppComp__17)=>{
                return (props__18)=><AppComp__17 {...props__18}/>
                ;
            };
            const { html__16 , head__16  } = await docCtx__16.renderPage({
                enhanceApp__16
            });
            const styles__16 = jsxStyleRegistry__7.styles();
            return {
                html__16,
                head__16,
                styles__16
            };
        }
    };
    let props__7;
    const ampState__7 = {
        ampFirst: pageConfig__7.amp === true,
        hasQuery: Boolean(query__7.amp),
        hybrid: pageConfig__7.amp === "hybrid"
    };
    const inAmpMode__7 = isInAmpMode(ampState__7);
    const reactLoadableModules__7 = [];
    let head__7 = defaultHead(inAmpMode__7);
    let scriptLoader__7 = {
    };
    const nextExport__7 = !isSSG__7 && (renderOpts__7.nextExport || dev__7 && (isAutoExport__7 || isFallback__7));
    const AppContainer__7 = ({ children__19  })=><RouterContext.Provider value={router__7}>



        <AmpStateContext.Provider value={ampState__7}>



            <HeadManagerContext.Provider value={{
            updateHead: (state__20)=>{
                head__7 = state__20;
            },
            updateScripts: (scripts__21)=>{
                scriptLoader__7 = scripts__21;
            },
            scripts: {
            },
            mountedInstances: new Set()
        }}>



                <LoadableContext.Provider value={(moduleName__22)=>reactLoadableModules__7.push(moduleName__22)
        }>



                    <StyleRegistry registry={jsxStyleRegistry__7}>



                        {children__19}



                    </StyleRegistry>



                </LoadableContext.Provider>



            </HeadManagerContext.Provider>



        </AmpStateContext.Provider>



    </RouterContext.Provider>
    ;
    props__7 = await loadGetInitialProps(App__7, {
        AppTree: ctx__7.AppTree,
        Component__7,
        router__7,
        ctx__7
    });
    if ((isSSG__7 || getServerSideProps__7) && isPreview__7) {
        props__7.__N_PREVIEW = true;
    }
    if (isSSG__7) {
        props__7[STATIC_PROPS_ID] = true;
    }
    if (isSSG__7 && !isFallback__7) {
        let data__23;
        try {
            data__23 = await getStaticProps__7({
                ...pageIsDynamic__7 ? {
                    params: query__7
                } : undefined,
                ...isPreview__7 ? {
                    preview: true,
                    previewData: previewData__7
                } : undefined,
                locales: renderOpts__7.locales,
                locale: renderOpts__7.locale,
                defaultLocale: renderOpts__7.defaultLocale
            });
        } catch (staticPropsError__24) {
            if (staticPropsError__24 && staticPropsError__24.code === "ENOENT") {
                delete staticPropsError__24.code;
            }
            throw staticPropsError__24;
        }
        if (data__23 == null) {
            throw new Error(GSP_NO_RETURNED_VALUE);
        }
        const invalidKeys__23 = Object.keys(data__23).filter((key__25)=>key__25 !== "revalidate" && key__25 !== "props" && key__25 !== "redirect" && key__25 !== "notFound"
        );
        if (invalidKeys__23.includes("unstable_revalidate")) {
            throw new Error(UNSTABLE_REVALIDATE_RENAME_ERROR);
        }
        if (invalidKeys__23.length) {
            throw new Error(invalidKeysMsg("getStaticProps", invalidKeys__23));
        }
        if (process.env.NODE_ENV !== "production") {
            if (typeof data__23.notFound !== "undefined" && typeof data__23.redirect !== "undefined") {
                throw new Error(`\`redirect\` and \`notFound\` can not both be returned from ${isSSG__7 ? "getStaticProps" : "getServerSideProps"} at the same time. Page: ${pathname__7}\nSee more info here: https://nextjs.org/docs/messages/gssp-mixed-not-found-redirect`);
            }
        }
        if ("notFound" in data__23 && data__23.notFound) {
            if (pathname__7 === "/404") {
                throw new Error(`The /404 page can not return notFound in "getStaticProps", please remove it to continue!`);
            }
            renderOpts__7.isNotFound = true;
        }
        if ("redirect" in data__23 && data__23.redirect && typeof data__23.redirect === "object") {
            checkRedirectValues(data__23.redirect, req__7, "getStaticProps");
            if (isBuildTimeSSG__7) {
                throw new Error(`\`redirect\` can not be returned from getStaticProps during prerendering (${req__7.url})\n` + `See more info here: https://nextjs.org/docs/messages/gsp-redirect-during-prerender`);
            }
            data__23.props = {
                __N_REDIRECT: data__23.redirect.destination,
                __N_REDIRECT_STATUS: getRedirectStatus(data__23.redirect)
            };
            if (typeof data__23.redirect.basePath !== "undefined") {
                data__23.props.__N_REDIRECT_BASE_PATH = data__23.redirect.basePath;
            }
            renderOpts__7.isRedirect = true;
        }
        if ((dev__7 || isBuildTimeSSG__7) && !renderOpts__7.isNotFound && !isSerializableProps(pathname__7, "getStaticProps", data__23.props)) {
            throw new Error("invariant: getStaticProps did not return valid props. Please report this.");
        }
        if ("revalidate" in data__23) {
            if (typeof data__23.revalidate === "number") {
                if (!Number.isInteger(data__23.revalidate)) {
                    throw new Error(`A page's revalidate option must be seconds expressed as a natural number for ${req__7.url}. Mixed numbers, such as '${data__23.revalidate}', cannot be used.` + `\nTry changing the value to '${Math.ceil(data__23.revalidate)}' or using \`Math.ceil()\` if you're computing the value.`);
                } else if (data__23.revalidate <= 0) {
                    throw new Error(`A page's revalidate option can not be less than or equal to zero for ${req__7.url}. A revalidate option of zero means to revalidate after _every_ request, and implies stale data cannot be tolerated.` + `\n\nTo never revalidate, you can set revalidate to \`false\` (only ran once at build-time).` + `\nTo revalidate as soon as possible, you can set the value to \`1\`.`);
                } else if (data__23.revalidate > 31536000) {
                    console.warn(`Warning: A page's revalidate option was set to more than a year for ${req__7.url}. This may have been done in error.` + `\nTo only run getStaticProps at build-time and not revalidate at runtime, you can set \`revalidate\` to \`false\`!`);
                }
            } else if (data__23.revalidate === true) {
                data__23.revalidate = 1;
            } else if (data__23.revalidate === false || typeof data__23.revalidate === "undefined") {
                data__23.revalidate = false;
            } else {
                throw new Error(`A page's revalidate option must be seconds expressed as a natural number. Mixed numbers and strings cannot be used. Received '${JSON.stringify(data__23.revalidate)}' for ${req__7.url}`);
            }
        } else {
            data__23.revalidate = false;
        }
        props__7.pageProps = Object.assign({
        }, props__7.pageProps, "props" in data__23 ? data__23.props : undefined);
        renderOpts__7.revalidate = "revalidate" in data__23 ? data__23.revalidate : undefined;
        renderOpts__7.pageData = props__7;
        if (renderOpts__7.isNotFound) {
            return null;
        }
    }
    if (getServerSideProps__7) {
        props__7[SERVER_PROPS_ID] = true;
    }
    if (getServerSideProps__7 && !isFallback__7) {
        let data__26;
        let canAccessRes__26 = true;
        let resOrProxy__26 = res__7;
        if (process.env.NODE_ENV !== "production") {
            resOrProxy__26 = new Proxy(res__7, {
                get: function(obj__27, prop__27, receiver__27) {
                    if (!canAccessRes__26) {
                        throw new Error(`You should not access 'res' after getServerSideProps resolves.` + `\nRead more: https://nextjs.org/docs/messages/gssp-no-mutating-res`);
                    }
                    return Reflect.get(obj__27, prop__27, receiver__27);
                }
            });
        }
        try {
            data__26 = await getServerSideProps__7({
                req: req__7,
                res: resOrProxy__26,
                query__7,
                resolvedUrl: renderOpts__7.resolvedUrl,
                ...pageIsDynamic__7 ? {
                    params: params__7
                } : undefined,
                ...previewData__7 !== false ? {
                    preview: true,
                    previewData: previewData__7
                } : undefined,
                locales: renderOpts__7.locales,
                locale: renderOpts__7.locale,
                defaultLocale: renderOpts__7.defaultLocale
            });
            canAccessRes__26 = false;
        } catch (serverSidePropsError__28) {
            if (isError(serverSidePropsError__28) && serverSidePropsError__28.code === "ENOENT") {
                delete serverSidePropsError__28.code;
            }
            throw serverSidePropsError__28;
        }
        if (data__26 == null) {
            throw new Error(GSSP_NO_RETURNED_VALUE);
        }
        const invalidKeys__26 = Object.keys(data__26).filter((key__29)=>key__29 !== "props" && key__29 !== "redirect" && key__29 !== "notFound"
        );
        if (data__26.unstable_notFound) {
            throw new Error(`unstable_notFound has been renamed to notFound, please update the field to continue. Page: ${pathname__7}`);
        }
        if (data__26.unstable_redirect) {
            throw new Error(`unstable_redirect has been renamed to redirect, please update the field to continue. Page: ${pathname__7}`);
        }
        if (invalidKeys__26.length) {
            throw new Error(invalidKeysMsg("getServerSideProps", invalidKeys__26));
        }
        if ("notFound" in data__26 && data__26.notFound) {
            if (pathname__7 === "/404") {
                throw new Error(`The /404 page can not return notFound in "getStaticProps", please remove it to continue!`);
            }
            renderOpts__7.isNotFound = true;
            return null;
        }
        if ("redirect" in data__26 && typeof data__26.redirect === "object") {
            checkRedirectValues(data__26.redirect, req__7, "getServerSideProps");
            data__26.props = {
                __N_REDIRECT: data__26.redirect.destination,
                __N_REDIRECT_STATUS: getRedirectStatus(data__26.redirect)
            };
            if (typeof data__26.redirect.basePath !== "undefined") {
                data__26.props.__N_REDIRECT_BASE_PATH = data__26.redirect.basePath;
            }
            renderOpts__7.isRedirect = true;
        }
        if (data__26.props instanceof Promise) {
            data__26.props = await data__26.props;
        }
        if ((dev__7 || isBuildTimeSSG__7) && !isSerializableProps(pathname__7, "getServerSideProps", data__26.props)) {
            throw new Error("invariant: getServerSideProps did not return valid props. Please report this.");
        }
        props__7.pageProps = Object.assign({
        }, props__7.pageProps, data__26.props);
        renderOpts__7.pageData = props__7;
    }
    if (!isSSG__7 && !getServerSideProps__7 && process.env.NODE_ENV !== "production" && Object.keys(props__7?.pageProps || {
    }).includes("url")) {
        console.warn(`The prop \`url\` is a reserved prop in Next.js for legacy reasons and will be overridden on page ${pathname__7}\n` + `See more info here: https://nextjs.org/docs/messages/reserved-page-prop`);
    }
    if (isDataReq__7 && !isSSG__7 || renderOpts__7.isRedirect) {
        return RenderResult.fromStatic(JSON.stringify(props__7));
    }
    if (isFallback__7) {
        props__7.pageProps = {
        };
    }
    if (isResSent(res__7) && !isSSG__7) return null;
    let filteredBuildManifest__7 = buildManifest__7;
    if (isAutoExport__7 && pageIsDynamic__7) {
        const page__30 = denormalizePagePath(normalizePagePath(pathname__7));
        if (page__30 in filteredBuildManifest__7.pages) {
            filteredBuildManifest__7 = {
                ...filteredBuildManifest__7,
                pages: {
                    ...filteredBuildManifest__7.pages,
                    [page__30]: [
                        ...filteredBuildManifest__7.pages[page__30],
                        ...filteredBuildManifest__7.lowPriorityFiles.filter((f__31)=>f__31.includes("_buildManifest")
                        )
                    ]
                },
                lowPriorityFiles: filteredBuildManifest__7.lowPriorityFiles.filter((f__32)=>!f__32.includes("_buildManifest")
                )
            };
        }
    }
    const generateStaticHTML__7 = supportsDynamicHTML__7 !== true;
    const renderDocument__7 = async ()=>{
        if (Document__7.getInitialProps) {
            const renderPage__33 = (options__34 = {
            })=>{
                if (ctx__7.err && ErrorDebug__7) {
                    const html__35 = ReactDOMServer.renderToString(<ErrorDebug__7 error={ctx__7.err}/>);
                    return {
                        html__35,
                        head__7
                    };
                }
                if (dev__7 && (props__7.router || props__7.Component)) {
                    throw new Error(`'router' and 'Component' can not be returned in getInitialProps from _app.js https://nextjs.org/docs/messages/cant-override-next-props`);
                }
                const { App: EnhancedApp__34 , Component: EnhancedComponent__34  } = enhanceComponents(options__34, App__7, Component__7);
                const html__34 = ReactDOMServer.renderToString(<AppContainer__7 >



                    <EnhancedApp__34 Component__7={EnhancedComponent__34} router__7={router__7} {...props__7}/>



                </AppContainer__7>);
                return {
                    html__34,
                    head__7
                };
            };
            const documentCtx__33 = {
                ...ctx__7,
                renderPage__33
            };
            const docProps__33 = await loadGetInitialProps(Document__7, documentCtx__33);
            if (isResSent(res__7) && !isSSG__7) return null;
            if (!docProps__33 || typeof docProps__33.html !== "string") {
                const message__36 = `"${getDisplayName(Document__7)}.getInitialProps()" should resolve to an object with a "html" prop set with a valid html string`;
                throw new Error(message__36);
            }
            return {
                bodyResult: piperFromArray([
                    docProps__33.html
                ]),
                documentElement: (htmlProps__37)=><Document__7 {...htmlProps__37} {...docProps__33}/>
                ,
                head: docProps__33.head,
                headTags: await headTags__7(documentCtx__33),
                styles: docProps__33.styles
            };
        } else {
            const content__38 = ctx__7.err && ErrorDebug__7 ? <ErrorDebug__7 error={ctx__7.err}/> : <AppContainer__7 >



                <App__7 {...props__7} Component__7={Component__7} router__7={router__7}/>



            </AppContainer__7>;
            const bodyResult__38 = concurrentFeatures__7 ? await renderToStream(content__38, generateStaticHTML__7) : piperFromArray([
                ReactDOMServer.renderToString(content__38)
            ]);
            return {
                bodyResult__38,
                documentElement: ()=>Document__7()
                ,
                head__7,
                headTags: [],
                styles: jsxStyleRegistry__7.styles()
            };
        }
    };
    const documentResult__7 = await renderDocument__7();
    if (!documentResult__7) {
        return null;
    }
    const dynamicImportsIds__7 = new Set();
    const dynamicImports__7 = new Set();
    for (const mod__39 of reactLoadableModules__7){
        const manifestItem__40 = reactLoadableManifest__7[mod__39];
        if (manifestItem__40) {
            dynamicImportsIds__7.add(manifestItem__40.id);
            manifestItem__40.files.forEach((item__41)=>{
                dynamicImports__7.add(item__41);
            });
        }
    }
    const hybridAmp__7 = ampState__7.hybrid;
    const docComponentsRendered__7 = {
    };
    const { assetPrefix__7 , buildId__7 , customServer__7 , defaultLocale__7 , disableOptimizedLoading__7 , domainLocales__7 , locale__7 , locales__7 , runtimeConfig__7  } = renderOpts__7;
    const htmlProps__7 = {
        __NEXT_DATA__: {
            props__7,
            page: pathname__7,
            query__7,
            buildId__7,
            assetPrefix: assetPrefix__7 === "" ? undefined : assetPrefix__7,
            runtimeConfig__7,
            nextExport: nextExport__7 === true ? true : undefined,
            autoExport: isAutoExport__7 === true ? true : undefined,
            isFallback__7,
            dynamicIds: dynamicImportsIds__7.size === 0 ? undefined : Array.from(dynamicImportsIds__7),
            err: renderOpts__7.err ? serializeError(dev__7, renderOpts__7.err) : undefined,
            gsp: !!getStaticProps__7 ? true : undefined,
            gssp: !!getServerSideProps__7 ? true : undefined,
            customServer__7,
            gip: hasPageGetInitialProps__7 ? true : undefined,
            appGip: !defaultAppGetInitialProps__7 ? true : undefined,
            locale__7,
            locales__7,
            defaultLocale__7,
            domainLocales__7,
            isPreview: isPreview__7 === true ? true : undefined
        },
        buildManifest: filteredBuildManifest__7,
        docComponentsRendered__7,
        dangerousAsPath: router__7.asPath,
        canonicalBase: !renderOpts__7.ampPath && req__7.__nextStrippedLocale ? `${renderOpts__7.canonicalBase || ""}/${renderOpts__7.locale}` : renderOpts__7.canonicalBase,
        ampPath__7,
        inAmpMode__7,
        isDevelopment: !!dev__7,
        hybridAmp__7,
        dynamicImports: Array.from(dynamicImports__7),
        assetPrefix__7,
        unstable_runtimeJS: process.env.NODE_ENV === "production" ? pageConfig__7.unstable_runtimeJS : undefined,
        unstable_JsPreload: pageConfig__7.unstable_JsPreload,
        devOnlyCacheBusterQueryString__7,
        scriptLoader__7,
        locale__7,
        disableOptimizedLoading__7,
        head: documentResult__7.head,
        headTags: documentResult__7.headTags,
        styles: documentResult__7.styles,
        useMaybeDeferContent
    };
    const documentHTML__7 = ReactDOMServer.renderToStaticMarkup(<AmpStateContext.Provider value={ampState__7}>



        <HtmlContext.Provider value={htmlProps__7}>



            {documentResult__7.documentElement(htmlProps__7)}



        </HtmlContext.Provider>



    </AmpStateContext.Provider>);
    if (process.env.NODE_ENV !== "production") {
        const nonRenderedComponents__42 = [];
        const expectedDocComponents__42 = [
            "Main",
            "Head",
            "NextScript",
            "Html"
        ];
        for (const comp__43 of expectedDocComponents__42){
            if (!docComponentsRendered__7[comp__43]) {
                nonRenderedComponents__42.push(comp__43);
            }
        }
        const plural__42 = nonRenderedComponents__42.length !== 1 ? "s" : "";
        if (nonRenderedComponents__42.length) {
            const missingComponentList__44 = nonRenderedComponents__42.map((e__45)=>`<${e__45} />`
            ).join(", ");
            warn(`Your custom Document (pages/_document) did not render all the required subcomponent${plural__42}.\n` + `Missing component${plural__42}: ${missingComponentList__44}\n` + "Read how to fix here: https://nextjs.org/docs/messages/missing-document-component");
        }
    }
    const renderTargetIdx__7 = documentHTML__7.indexOf(BODY_RENDER_TARGET);
    const prefix__7 = [];
    prefix__7.push("<!DOCTYPE html>");
    prefix__7.push(documentHTML__7.substring(0, renderTargetIdx__7));
    if (inAmpMode__7) {
        prefix__7.push("<!-- __NEXT_DATA__ -->");
    }
    let pipers__7 = [
        piperFromArray(prefix__7),
        documentResult__7.bodyResult,
        piperFromArray([
            documentHTML__7.substring(renderTargetIdx__7 + BODY_RENDER_TARGET.length)
        ])
    ];
    const postProcessors__7 = (generateStaticHTML__7 ? [
        inAmpMode__7 ? async (html__46)=>{
            html__46 = await optimizeAmp(html__46, renderOpts__7.ampOptimizerConfig);
            if (!renderOpts__7.ampSkipValidation && renderOpts__7.ampValidator) {
                await renderOpts__7.ampValidator(html__46, pathname__7);
            }
            return html__46;
        } : null,
        process.env.__NEXT_OPTIMIZE_FONTS || process.env.__NEXT_OPTIMIZE_IMAGES ? async (html__47)=>{
            return await postProcess(html__47, {
                getFontDefinition__7
            }, {
                optimizeFonts: renderOpts__7.optimizeFonts,
                optimizeImages: renderOpts__7.optimizeImages
            });
        } : null,
        renderOpts__7.optimizeCss ? async (html__48)=>{
            const Critters__48 = require("critters");
            const cssOptimizer__48 = new Critters__48({
                ssrMode: true,
                reduceInlineStyles: false,
                path: renderOpts__7.distDir,
                publicPath: `${renderOpts__7.assetPrefix}/_next/`,
                preload: "media",
                fonts: false,
                ...renderOpts__7.optimizeCss
            });
            return await cssOptimizer__48.process(html__48);
        } : null,
        inAmpMode__7 || hybridAmp__7 ? async (html__49)=>{
            return html__49.replace(/&amp;amp=1/g, "&amp=1");
        } : null
    ] : []).filter(Boolean);
    if (generateStaticHTML__7 || postProcessors__7.length > 0) {
        let html__50 = await piperToString(chainPipers(pipers__7));
        for (const postProcessor__51 of postProcessors__7){
            if (postProcessor__51) {
                html__50 = await postProcessor__51(html__50);
            }
        }
        return new RenderResult(html__50);
    }
    return new RenderResult(chainPipers(pipers__7));
}
function errorToJSON(err__52) {
    const { name__52 , message__52 , stack__52  } = err__52;
    return {
        name__52,
        message__52,
        stack__52
    };
}
function serializeError(dev__53, err__53) {
    if (dev__53) {
        return errorToJSON(err__53);
    }
    return {
        name: "Internal Server Error.",
        message: "500 - Internal Server Error.",
        statusCode: 500
    };
}
function renderToStream(element__54, generateStaticHTML__54) {
    return new Promise((resolve__55, reject__55)=>{
        let underlyingStream__55 = null;
        const stream__55 = new Writable({
            highWaterMark: 0,
            write (chunk__56, encoding__56, callback__56) {
                if (!underlyingStream__55) {
                    throw new Error("invariant: write called without an underlying stream. This is a bug in Next.js");
                }
                if (!underlyingStream__55.writable.write(chunk__56, encoding__56)) {
                    underlyingStream__55.queuedCallbacks.push(()=>callback__56()
                    );
                } else {
                    callback__56();
                }
            }
        });
        stream__55.once("finish", ()=>{
            if (!underlyingStream__55) {
                throw new Error("invariant: finish called without an underlying stream. This is a bug in Next.js");
            }
            underlyingStream__55.resolve();
        });
        stream__55.once("error", (err__57)=>{
            if (!underlyingStream__55) {
                throw new Error("invariant: error called without an underlying stream. This is a bug in Next.js");
            }
            underlyingStream__55.resolve(err__57);
        });
        Object.defineProperty(stream__55, "flush", {
            value: ()=>{
                if (!underlyingStream__55) {
                    throw new Error("invariant: flush called without an underlying stream. This is a bug in Next.js");
                }
                if (typeof underlyingStream__55.writable.flush === "function") {
                    underlyingStream__55.writable.flush();
                }
            },
            enumerable: true
        });
        let resolved__55 = false;
        const doResolve__55 = ()=>{
            if (!resolved__55) {
                resolved__55 = true;
                resolve__55((res__58, next__58)=>{
                    const drainHandler__58 = ()=>{
                        const prevCallbacks__59 = underlyingStream__55.queuedCallbacks;
                        underlyingStream__55.queuedCallbacks = [];
                        prevCallbacks__59.forEach((callback__60)=>callback__60()
                        );
                    };
                    res__58.on("drain", drainHandler__58);
                    underlyingStream__55 = {
                        resolve: (err__61)=>{
                            underlyingStream__55 = null;
                            res__58.removeListener("drain", drainHandler__58);
                            next__58(err__61);
                        },
                        writable: res__58,
                        queuedCallbacks: []
                    };
                    startWriting__55();
                });
            }
        };
        const { abort__55 , startWriting__55  } = ReactDOMServer.pipeToNodeWritable(element__54, stream__55, {
            onError (error__62) {
                if (!resolved__55) {
                    resolved__55 = true;
                    reject__55(error__62);
                }
                abort__55();
            },
            onCompleteShell () {
                if (!generateStaticHTML__54) {
                    doResolve__55();
                }
            },
            onCompleteAll () {
                doResolve__55();
            }
        });
    });
}
function chainPipers(pipers__63) {
    return pipers__63.reduceRight((lhs__64, rhs__64)=>(res__65, next__65)=>{
            rhs__64(res__65, (err__66)=>err__66 ? next__65(err__66) : lhs__64(res__65, next__65)
            );
        }
    , (res__67, next__67)=>{
        res__67.end();
        next__67();
    });
}
function piperFromArray(chunks__68) {
    return (res__69, next__69)=>{
        if (typeof res__69.cork === "function") {
            res__69.cork();
        }
        chunks__68.forEach((chunk__70)=>res__69.write(chunk__70)
        );
        if (typeof res__69.uncork === "function") {
            res__69.uncork();
        }
        next__69();
    };
}
function piperToString(input__71) {
    return new Promise((resolve__72, reject__72)=>{
        const bufferedChunks__72 = [];
        const stream__72 = new Writable({
            writev (chunks__73, callback__73) {
                chunks__73.forEach((chunk__74)=>bufferedChunks__72.push(chunk__74.chunk)
                );
                callback__73();
            }
        });
        input__71(stream__72, (err__75)=>{
            if (err__75) {
                reject__72(err__75);
            } else {
                resolve__72(Buffer.concat(bufferedChunks__72).toString());
            }
        });
    });
}
export function useMaybeDeferContent(_name__76, contentFn__76) {
    return [
        false,
        contentFn__76()
    ];
}
