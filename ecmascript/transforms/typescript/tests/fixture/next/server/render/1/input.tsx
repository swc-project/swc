import { IncomingMessage, ServerResponse } from "http";
import { ParsedUrlQuery } from "querystring";
import { Writable } from "stream";
import React from "react";
import * as ReactDOMServer from "react-dom/server";
import { StyleRegistry, createStyleRegistry } from "styled-jsx";
import { warn } from "../build/output/log";
import { UnwrapPromise } from "../lib/coalesced-function";
import {
    GSP_NO_RETURNED_VALUE,
    GSSP_COMPONENT_MEMBER_ERROR,
    GSSP_NO_RETURNED_VALUE,
    STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR,
    SERVER_PROPS_GET_INIT_PROPS_CONFLICT,
    SERVER_PROPS_SSG_CONFLICT,
    SSG_GET_INITIAL_PROPS_CONFLICT,
    UNSTABLE_REVALIDATE_RENAME_ERROR,
} from "../lib/constants";
import { isSerializableProps } from "../lib/is-serializable-props";
import { GetServerSideProps, GetStaticProps, PreviewData } from "../types";
import { isInAmpMode } from "../shared/lib/amp";
import { AmpStateContext } from "../shared/lib/amp-context";
import {
    BODY_RENDER_TARGET,
    SERVER_PROPS_ID,
    STATIC_PROPS_ID,
    STATIC_STATUS_PAGES,
} from "../shared/lib/constants";
import { defaultHead } from "../shared/lib/head";
import { HeadManagerContext } from "../shared/lib/head-manager-context";
import Loadable from "../shared/lib/loadable";
import { LoadableContext } from "../shared/lib/loadable-context";
import postProcess from "../shared/lib/post-process";
import { RouterContext } from "../shared/lib/router-context";
import { NextRouter } from "../shared/lib/router/router";
import { isDynamicRoute } from "../shared/lib/router/utils/is-dynamic";
import {
    AppType,
    ComponentsEnhancer,
    DocumentInitialProps,
    DocumentProps,
    DocumentContext,
    HtmlContext,
    HtmlProps,
    getDisplayName,
    isResSent,
    loadGetInitialProps,
    NextComponentType,
    RenderPage,
    RenderPageResult,
} from "../shared/lib/utils";
import {
    tryGetPreviewData,
    NextApiRequestCookies,
    __ApiPreviewProps,
} from "./api-utils";
import { denormalizePagePath } from "./denormalize-page-path";
import { FontManifest, getFontDefinitionFromManifest } from "./font-utils";
import { LoadComponentsReturnType, ManifestItem } from "./load-components";
import { normalizePagePath } from "./normalize-page-path";
import optimizeAmp from "./optimize-amp";
import {
    allowedStatusCodes,
    getRedirectStatus,
    Redirect,
} from "../lib/load-custom-routes";
import { DomainLocale } from "./config";
import RenderResult, { NodeWritablePiper } from "./render-result";
import isError from "../lib/is-error";

function noRouter() {
    const message =
        'No router instance found. you should only use "next/router" inside the client side of your app. https://nextjs.org/docs/messages/no-router-instance';
    throw new Error(message);
}

class ServerRouter implements NextRouter {
    route: string;
    pathname: string;
    query: ParsedUrlQuery;
    asPath: string;
    basePath: string;
    events: any;
    isFallback: boolean;
    locale?: string;
    isReady: boolean;
    locales?: string[];
    defaultLocale?: string;
    domainLocales?: DomainLocale[];
    isPreview: boolean;
    isLocaleDomain: boolean;

    constructor(
        pathname: string,
        query: ParsedUrlQuery,
        as: string,
        { isFallback }: { isFallback: boolean },
        isReady: boolean,
        basePath: string,
        locale?: string,
        locales?: string[],
        defaultLocale?: string,
        domainLocales?: DomainLocale[],
        isPreview?: boolean,
        isLocaleDomain?: boolean
    ) {
        this.route = pathname.replace(/\/$/, "") || "/";
        this.pathname = pathname;
        this.query = query;
        this.asPath = as;
        this.isFallback = isFallback;
        this.basePath = basePath;
        this.locale = locale;
        this.locales = locales;
        this.defaultLocale = defaultLocale;
        this.isReady = isReady;
        this.domainLocales = domainLocales;
        this.isPreview = !!isPreview;
        this.isLocaleDomain = !!isLocaleDomain;
    }

    push(): any {
        noRouter();
    }
    replace(): any {
        noRouter();
    }
    reload() {
        noRouter();
    }
    back() {
        noRouter();
    }
    prefetch(): any {
        noRouter();
    }
    beforePopState() {
        noRouter();
    }
}

function enhanceComponents(
    options: ComponentsEnhancer,
    App: AppType,
    Component: NextComponentType
): {
    App: AppType;
    Component: NextComponentType;
} {
    // For backwards compatibility
    if (typeof options === "function") {
        return {
            App,
            Component: options(Component),
        };
    }

    return {
        App: options.enhanceApp ? options.enhanceApp(App) : App,
        Component: options.enhanceComponent
            ? options.enhanceComponent(Component)
            : Component,
    };
}

export type RenderOptsPartial = {
    buildId: string;
    canonicalBase: string;
    runtimeConfig?: { [key: string]: any };
    assetPrefix?: string;
    err?: Error | null;
    nextExport?: boolean;
    dev?: boolean;
    ampPath?: string;
    ErrorDebug?: React.ComponentType<{ error: Error }>;
    ampValidator?: (html: string, pathname: string) => Promise<void>;
    ampSkipValidation?: boolean;
    ampOptimizerConfig?: { [key: string]: any };
    isDataReq?: boolean;
    params?: ParsedUrlQuery;
    previewProps: __ApiPreviewProps;
    basePath: string;
    unstable_runtimeJS?: false;
    unstable_JsPreload?: false;
    optimizeFonts: boolean;
    fontManifest?: FontManifest;
    optimizeImages: boolean;
    optimizeCss: any;
    devOnlyCacheBusterQueryString?: string;
    resolvedUrl?: string;
    resolvedAsPath?: string;
    distDir?: string;
    locale?: string;
    locales?: string[];
    defaultLocale?: string;
    domainLocales?: DomainLocale[];
    disableOptimizedLoading?: boolean;
    supportsDynamicHTML?: boolean;
    concurrentFeatures?: boolean;
    customServer?: boolean;
};

export type RenderOpts = LoadComponentsReturnType & RenderOptsPartial;

const invalidKeysMsg = (methodName: string, invalidKeys: string[]) => {
    return (
        `Additional keys were returned from \`${methodName}\`. Properties intended for your component must be nested under the \`props\` key, e.g.:` +
        `\n\n\treturn { props: { title: 'My Title', content: '...' } }` +
        `\n\nKeys that need to be moved: ${invalidKeys.join(", ")}.` +
        `\nRead more: https://nextjs.org/docs/messages/invalid-getstaticprops-value`
    );
};

function checkRedirectValues(
    redirect: Redirect,
    req: IncomingMessage,
    method: "getStaticProps" | "getServerSideProps"
) {
    const { destination, permanent, statusCode, basePath } = redirect;
    let errors: string[] = [];

    const hasStatusCode = typeof statusCode !== "undefined";
    const hasPermanent = typeof permanent !== "undefined";

    if (hasPermanent && hasStatusCode) {
        errors.push(
            `\`permanent\` and \`statusCode\` can not both be provided`
        );
    } else if (hasPermanent && typeof permanent !== "boolean") {
        errors.push(`\`permanent\` must be \`true\` or \`false\``);
    } else if (hasStatusCode && !allowedStatusCodes.has(statusCode!)) {
        errors.push(
            `\`statusCode\` must undefined or one of ${[
                ...allowedStatusCodes,
            ].join(", ")}`
        );
    }
    const destinationType = typeof destination;

    if (destinationType !== "string") {
        errors.push(
            `\`destination\` should be string but received ${destinationType}`
        );
    }

    const basePathType = typeof basePath;

    if (basePathType !== "undefined" && basePathType !== "boolean") {
        errors.push(
            `\`basePath\` should be undefined or a false, received ${basePathType}`
        );
    }

    if (errors.length > 0) {
        throw new Error(
            `Invalid redirect object returned from ${method} for ${req.url}\n` +
                errors.join(" and ") +
                "\n" +
                `See more info here: https://nextjs.org/docs/messages/invalid-redirect-gssp`
        );
    }
}

export async function renderToHTML(
    req: IncomingMessage,
    res: ServerResponse,
    pathname: string,
    query: ParsedUrlQuery,
    renderOpts: RenderOpts
): Promise<RenderResult | null> {
    // In dev we invalidate the cache by appending a timestamp to the resource URL.
    // This is a workaround to fix https://github.com/vercel/next.js/issues/5860
    // TODO: remove this workaround when https://bugs.webkit.org/show_bug.cgi?id=187726 is fixed.
    renderOpts.devOnlyCacheBusterQueryString = renderOpts.dev
        ? renderOpts.devOnlyCacheBusterQueryString || `?ts=${Date.now()}`
        : "";

    // don't modify original query object
    query = Object.assign({}, query);

    const {
        err,
        dev = false,
        ampPath = "",
        App,
        Document,
        pageConfig = {},
        Component,
        buildManifest,
        fontManifest,
        reactLoadableManifest,
        ErrorDebug,
        getStaticProps,
        getStaticPaths,
        getServerSideProps,
        isDataReq,
        params,
        previewProps,
        basePath,
        devOnlyCacheBusterQueryString,
        supportsDynamicHTML,
        concurrentFeatures,
    } = renderOpts;

    const getFontDefinition = (url: string): string => {
        if (fontManifest) {
            return getFontDefinitionFromManifest(url, fontManifest);
        }
        return "";
    };

    const callMiddleware = async (
        method: string,
        args: any[],
        props = false
    ) => {
        let results: any = props ? {} : [];

        if ((Document as any)[`${method}Middleware`]) {
            let middlewareFunc = await (Document as any)[`${method}Middleware`];
            middlewareFunc = middlewareFunc.default || middlewareFunc;

            const curResults = await middlewareFunc(...args);
            if (props) {
                for (const result of curResults) {
                    results = {
                        ...results,
                        ...result,
                    };
                }
            } else {
                results = curResults;
            }
        }
        return results;
    };

    const headTags = (...args: any) => callMiddleware("headTags", args);

    const isFallback = !!query.__nextFallback;
    delete query.__nextFallback;
    delete query.__nextLocale;
    delete query.__nextDefaultLocale;

    const isSSG = !!getStaticProps;
    const isBuildTimeSSG = isSSG && renderOpts.nextExport;
    const defaultAppGetInitialProps =
        App.getInitialProps === (App as any).origGetInitialProps;

    const hasPageGetInitialProps = !!(Component as any).getInitialProps;

    const pageIsDynamic = isDynamicRoute(pathname);

    const isAutoExport =
        !hasPageGetInitialProps &&
        defaultAppGetInitialProps &&
        !isSSG &&
        !getServerSideProps;

    for (const methodName of [
        "getStaticProps",
        "getServerSideProps",
        "getStaticPaths",
    ]) {
        if ((Component as any)[methodName]) {
            throw new Error(
                `page ${pathname} ${methodName} ${GSSP_COMPONENT_MEMBER_ERROR}`
            );
        }
    }

    if (hasPageGetInitialProps && isSSG) {
        throw new Error(SSG_GET_INITIAL_PROPS_CONFLICT + ` ${pathname}`);
    }

    if (hasPageGetInitialProps && getServerSideProps) {
        throw new Error(SERVER_PROPS_GET_INIT_PROPS_CONFLICT + ` ${pathname}`);
    }

    if (getServerSideProps && isSSG) {
        throw new Error(SERVER_PROPS_SSG_CONFLICT + ` ${pathname}`);
    }

    if (getStaticPaths && !pageIsDynamic) {
        throw new Error(
            `getStaticPaths is only allowed for dynamic SSG pages and was found on '${pathname}'.` +
                `\nRead more: https://nextjs.org/docs/messages/non-dynamic-getstaticpaths-usage`
        );
    }

    if (!!getStaticPaths && !isSSG) {
        throw new Error(
            `getStaticPaths was added without a getStaticProps in ${pathname}. Without getStaticProps, getStaticPaths does nothing`
        );
    }

    if (isSSG && pageIsDynamic && !getStaticPaths) {
        throw new Error(
            `getStaticPaths is required for dynamic SSG pages and is missing for '${pathname}'.` +
                `\nRead more: https://nextjs.org/docs/messages/invalid-getstaticpaths-value`
        );
    }

    let asPath: string = renderOpts.resolvedAsPath || (req.url as string);

    if (dev) {
        const { isValidElementType } = require("react-is");
        if (!isValidElementType(Component)) {
            throw new Error(
                `The default export is not a React Component in page: "${pathname}"`
            );
        }

        if (!isValidElementType(App)) {
            throw new Error(
                `The default export is not a React Component in page: "/_app"`
            );
        }

        if (!isValidElementType(Document)) {
            throw new Error(
                `The default export is not a React Component in page: "/_document"`
            );
        }

        if (isAutoExport || isFallback) {
            // remove query values except ones that will be set during export
            query = {
                ...(query.amp
                    ? {
                          amp: query.amp,
                      }
                    : {}),
            };
            asPath = `${pathname}${
                // ensure trailing slash is present for non-dynamic auto-export pages
                req.url!.endsWith("/") && pathname !== "/" && !pageIsDynamic
                    ? "/"
                    : ""
            }`;
            req.url = pathname;
        }

        if (
            pathname === "/404" &&
            (hasPageGetInitialProps || getServerSideProps)
        ) {
            throw new Error(
                `\`pages/404\` ${STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR}`
            );
        }
        if (
            STATIC_STATUS_PAGES.includes(pathname) &&
            (hasPageGetInitialProps || getServerSideProps)
        ) {
            throw new Error(
                `\`pages${pathname}\` ${STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR}`
            );
        }
    }

    await Loadable.preloadAll(); // Make sure all dynamic imports are loaded

    let isPreview;
    let previewData: PreviewData;

    if ((isSSG || getServerSideProps) && !isFallback) {
        // Reads of this are cached on the `req` object, so this should resolve
        // instantly. There's no need to pass this data down from a previous
        // invoke, where we'd have to consider server & serverless.
        previewData = tryGetPreviewData(req, res, previewProps);
        isPreview = previewData !== false;
    }

    // url will always be set
    const routerIsReady = !!(
        getServerSideProps ||
        hasPageGetInitialProps ||
        (!defaultAppGetInitialProps && !isSSG)
    );
    const router = new ServerRouter(
        pathname,
        query,
        asPath,
        {
            isFallback: isFallback,
        },
        routerIsReady,
        basePath,
        renderOpts.locale,
        renderOpts.locales,
        renderOpts.defaultLocale,
        renderOpts.domainLocales,
        isPreview,
        (req as any).__nextIsLocaleDomain
    );
    const jsxStyleRegistry = createStyleRegistry();
    const ctx = {
        err,
        req: isAutoExport ? undefined : req,
        res: isAutoExport ? undefined : res,
        pathname,
        query,
        asPath,
        locale: renderOpts.locale,
        locales: renderOpts.locales,
        defaultLocale: renderOpts.defaultLocale,
        AppTree: (props: any) => {
            return (
                <AppContainer>
                    <App {...props} Component={Component} router={router} />
                </AppContainer>
            );
        },
        defaultGetInitialProps: async (
            docCtx: DocumentContext
        ): Promise<DocumentInitialProps> => {
            const enhanceApp = (AppComp: any) => {
                return (props: any) => <AppComp {...props} />;
            };

            const { html, head } = await docCtx.renderPage({ enhanceApp });
            const styles = jsxStyleRegistry.styles();
            return { html, head, styles };
        },
    };
    let props: any;

    const ampState = {
        ampFirst: pageConfig.amp === true,
        hasQuery: Boolean(query.amp),
        hybrid: pageConfig.amp === "hybrid",
    };

    const inAmpMode = isInAmpMode(ampState);

    const reactLoadableModules: string[] = [];

    let head: JSX.Element[] = defaultHead(inAmpMode);

    let scriptLoader: any = {};
    const nextExport =
        !isSSG &&
        (renderOpts.nextExport || (dev && (isAutoExport || isFallback)));

    const AppContainer = ({ children }: { children: JSX.Element }) => (
        <RouterContext.Provider value={router}>
            <AmpStateContext.Provider value={ampState}>
                <HeadManagerContext.Provider
                    value={{
                        updateHead: (state) => {
                            head = state;
                        },
                        updateScripts: (scripts) => {
                            scriptLoader = scripts;
                        },
                        scripts: {},
                        mountedInstances: new Set(),
                    }}
                >
                    <LoadableContext.Provider
                        value={(moduleName) =>
                            reactLoadableModules.push(moduleName)
                        }
                    >
                        <StyleRegistry registry={jsxStyleRegistry}>
                            {children}
                        </StyleRegistry>
                    </LoadableContext.Provider>
                </HeadManagerContext.Provider>
            </AmpStateContext.Provider>
        </RouterContext.Provider>
    );

    props = await loadGetInitialProps(App, {
        AppTree: ctx.AppTree,
        Component,
        router,
        ctx,
    });

    if ((isSSG || getServerSideProps) && isPreview) {
        props.__N_PREVIEW = true;
    }

    if (isSSG) {
        props[STATIC_PROPS_ID] = true;
    }

    if (isSSG && !isFallback) {
        let data: UnwrapPromise<ReturnType<GetStaticProps>>;

        try {
            data = await getStaticProps!({
                ...(pageIsDynamic
                    ? { params: query as ParsedUrlQuery }
                    : undefined),
                ...(isPreview
                    ? { preview: true, previewData: previewData }
                    : undefined),
                locales: renderOpts.locales,
                locale: renderOpts.locale,
                defaultLocale: renderOpts.defaultLocale,
            });
        } catch (staticPropsError: any) {
            // remove not found error code to prevent triggering legacy
            // 404 rendering
            if (staticPropsError && staticPropsError.code === "ENOENT") {
                delete staticPropsError.code;
            }
            throw staticPropsError;
        }

        if (data == null) {
            throw new Error(GSP_NO_RETURNED_VALUE);
        }

        const invalidKeys = Object.keys(data).filter(
            (key) =>
                key !== "revalidate" &&
                key !== "props" &&
                key !== "redirect" &&
                key !== "notFound"
        );

        if (invalidKeys.includes("unstable_revalidate")) {
            throw new Error(UNSTABLE_REVALIDATE_RENAME_ERROR);
        }

        if (invalidKeys.length) {
            throw new Error(invalidKeysMsg("getStaticProps", invalidKeys));
        }

        if (process.env.NODE_ENV !== "production") {
            if (
                typeof (data as any).notFound !== "undefined" &&
                typeof (data as any).redirect !== "undefined"
            ) {
                throw new Error(
                    `\`redirect\` and \`notFound\` can not both be returned from ${
                        isSSG ? "getStaticProps" : "getServerSideProps"
                    } at the same time. Page: ${pathname}\nSee more info here: https://nextjs.org/docs/messages/gssp-mixed-not-found-redirect`
                );
            }
        }

        if ("notFound" in data && data.notFound) {
            if (pathname === "/404") {
                throw new Error(
                    `The /404 page can not return notFound in "getStaticProps", please remove it to continue!`
                );
            }

            (renderOpts as any).isNotFound = true;
        }

        if (
            "redirect" in data &&
            data.redirect &&
            typeof data.redirect === "object"
        ) {
            checkRedirectValues(
                data.redirect as Redirect,
                req,
                "getStaticProps"
            );

            if (isBuildTimeSSG) {
                throw new Error(
                    `\`redirect\` can not be returned from getStaticProps during prerendering (${req.url})\n` +
                        `See more info here: https://nextjs.org/docs/messages/gsp-redirect-during-prerender`
                );
            }

            (data as any).props = {
                __N_REDIRECT: data.redirect.destination,
                __N_REDIRECT_STATUS: getRedirectStatus(data.redirect),
            };
            if (typeof data.redirect.basePath !== "undefined") {
                (data as any).props.__N_REDIRECT_BASE_PATH =
                    data.redirect.basePath;
            }
            (renderOpts as any).isRedirect = true;
        }

        if (
            (dev || isBuildTimeSSG) &&
            !(renderOpts as any).isNotFound &&
            !isSerializableProps(
                pathname,
                "getStaticProps",
                (data as any).props
            )
        ) {
            // this fn should throw an error instead of ever returning `false`
            throw new Error(
                "invariant: getStaticProps did not return valid props. Please report this."
            );
        }

        if ("revalidate" in data) {
            if (typeof data.revalidate === "number") {
                if (!Number.isInteger(data.revalidate)) {
                    throw new Error(
                        `A page's revalidate option must be seconds expressed as a natural number for ${req.url}. Mixed numbers, such as '${data.revalidate}', cannot be used.` +
                            `\nTry changing the value to '${Math.ceil(
                                data.revalidate
                            )}' or using \`Math.ceil()\` if you're computing the value.`
                    );
                } else if (data.revalidate <= 0) {
                    throw new Error(
                        `A page's revalidate option can not be less than or equal to zero for ${req.url}. A revalidate option of zero means to revalidate after _every_ request, and implies stale data cannot be tolerated.` +
                            `\n\nTo never revalidate, you can set revalidate to \`false\` (only ran once at build-time).` +
                            `\nTo revalidate as soon as possible, you can set the value to \`1\`.`
                    );
                } else if (data.revalidate > 31536000) {
                    // if it's greater than a year for some reason error
                    console.warn(
                        `Warning: A page's revalidate option was set to more than a year for ${req.url}. This may have been done in error.` +
                            `\nTo only run getStaticProps at build-time and not revalidate at runtime, you can set \`revalidate\` to \`false\`!`
                    );
                }
            } else if (data.revalidate === true) {
                // When enabled, revalidate after 1 second. This value is optimal for
                // the most up-to-date page possible, but without a 1-to-1
                // request-refresh ratio.
                data.revalidate = 1;
            } else if (
                data.revalidate === false ||
                typeof data.revalidate === "undefined"
            ) {
                // By default, we never revalidate.
                data.revalidate = false;
            } else {
                throw new Error(
                    `A page's revalidate option must be seconds expressed as a natural number. Mixed numbers and strings cannot be used. Received '${JSON.stringify(
                        data.revalidate
                    )}' for ${req.url}`
                );
            }
        } else {
            // By default, we never revalidate.
            (data as any).revalidate = false;
        }

        props.pageProps = Object.assign(
            {},
            props.pageProps,
            "props" in data ? data.props : undefined
        );

        // pass up revalidate and props for export
        // TODO: change this to a different passing mechanism
        (renderOpts as any).revalidate =
            "revalidate" in data ? data.revalidate : undefined;
        (renderOpts as any).pageData = props;

        // this must come after revalidate is added to renderOpts
        if ((renderOpts as any).isNotFound) {
            return null;
        }
    }

    if (getServerSideProps) {
        props[SERVER_PROPS_ID] = true;
    }

    if (getServerSideProps && !isFallback) {
        let data: UnwrapPromise<ReturnType<GetServerSideProps>>;

        let canAccessRes = true;
        let resOrProxy = res;
        if (process.env.NODE_ENV !== "production") {
            resOrProxy = new Proxy<ServerResponse>(res, {
                get: function (obj, prop, receiver) {
                    if (!canAccessRes) {
                        throw new Error(
                            `You should not access 'res' after getServerSideProps resolves.` +
                                `\nRead more: https://nextjs.org/docs/messages/gssp-no-mutating-res`
                        );
                    }
                    return Reflect.get(obj, prop, receiver);
                },
            });
        }

        try {
            data = await getServerSideProps({
                req: req as IncomingMessage & {
                    cookies: NextApiRequestCookies;
                },
                res: resOrProxy,
                query,
                resolvedUrl: renderOpts.resolvedUrl as string,
                ...(pageIsDynamic
                    ? { params: params as ParsedUrlQuery }
                    : undefined),
                ...(previewData !== false
                    ? { preview: true, previewData: previewData }
                    : undefined),
                locales: renderOpts.locales,
                locale: renderOpts.locale,
                defaultLocale: renderOpts.defaultLocale,
            });
            canAccessRes = false;
        } catch (serverSidePropsError: any) {
            // remove not found error code to prevent triggering legacy
            // 404 rendering
            if (
                isError(serverSidePropsError) &&
                serverSidePropsError.code === "ENOENT"
            ) {
                delete serverSidePropsError.code;
            }
            throw serverSidePropsError;
        }

        if (data == null) {
            throw new Error(GSSP_NO_RETURNED_VALUE);
        }

        const invalidKeys = Object.keys(data).filter(
            (key) => key !== "props" && key !== "redirect" && key !== "notFound"
        );

        if ((data as any).unstable_notFound) {
            throw new Error(
                `unstable_notFound has been renamed to notFound, please update the field to continue. Page: ${pathname}`
            );
        }
        if ((data as any).unstable_redirect) {
            throw new Error(
                `unstable_redirect has been renamed to redirect, please update the field to continue. Page: ${pathname}`
            );
        }

        if (invalidKeys.length) {
            throw new Error(invalidKeysMsg("getServerSideProps", invalidKeys));
        }

        if ("notFound" in data && data.notFound) {
            if (pathname === "/404") {
                throw new Error(
                    `The /404 page can not return notFound in "getStaticProps", please remove it to continue!`
                );
            }

            (renderOpts as any).isNotFound = true;
            return null;
        }

        if ("redirect" in data && typeof data.redirect === "object") {
            checkRedirectValues(
                data.redirect as Redirect,
                req,
                "getServerSideProps"
            );
            (data as any).props = {
                __N_REDIRECT: data.redirect.destination,
                __N_REDIRECT_STATUS: getRedirectStatus(data.redirect),
            };
            if (typeof data.redirect.basePath !== "undefined") {
                (data as any).props.__N_REDIRECT_BASE_PATH =
                    data.redirect.basePath;
            }
            (renderOpts as any).isRedirect = true;
        }

        if ((data as any).props instanceof Promise) {
            (data as any).props = await (data as any).props;
        }

        if (
            (dev || isBuildTimeSSG) &&
            !isSerializableProps(
                pathname,
                "getServerSideProps",
                (data as any).props
            )
        ) {
            // this fn should throw an error instead of ever returning `false`
            throw new Error(
                "invariant: getServerSideProps did not return valid props. Please report this."
            );
        }

        props.pageProps = Object.assign(
            {},
            props.pageProps,
            (data as any).props
        );
        (renderOpts as any).pageData = props;
    }

    if (
        !isSSG && // we only show this warning for legacy pages
        !getServerSideProps &&
        process.env.NODE_ENV !== "production" &&
        Object.keys(props?.pageProps || {}).includes("url")
    ) {
        console.warn(
            `The prop \`url\` is a reserved prop in Next.js for legacy reasons and will be overridden on page ${pathname}\n` +
                `See more info here: https://nextjs.org/docs/messages/reserved-page-prop`
        );
    }

    // Avoid rendering page un-necessarily for getServerSideProps data request
    // and getServerSideProps/getStaticProps redirects
    if ((isDataReq && !isSSG) || (renderOpts as any).isRedirect) {
        return RenderResult.fromStatic(JSON.stringify(props));
    }

    // We don't call getStaticProps or getServerSideProps while generating
    // the fallback so make sure to set pageProps to an empty object
    if (isFallback) {
        props.pageProps = {};
    }

    // the response might be finished on the getInitialProps call
    if (isResSent(res) && !isSSG) return null;

    // we preload the buildManifest for auto-export dynamic pages
    // to speed up hydrating query values
    let filteredBuildManifest = buildManifest;
    if (isAutoExport && pageIsDynamic) {
        const page = denormalizePagePath(normalizePagePath(pathname));
        // This code would be much cleaner using `immer` and directly pushing into
        // the result from `getPageFiles`, we could maybe consider that in the
        // future.
        if (page in filteredBuildManifest.pages) {
            filteredBuildManifest = {
                ...filteredBuildManifest,
                pages: {
                    ...filteredBuildManifest.pages,
                    [page]: [
                        ...filteredBuildManifest.pages[page],
                        ...filteredBuildManifest.lowPriorityFiles.filter((f) =>
                            f.includes("_buildManifest")
                        ),
                    ],
                },
                lowPriorityFiles: filteredBuildManifest.lowPriorityFiles.filter(
                    (f) => !f.includes("_buildManifest")
                ),
            };
        }
    }

    /**
     * Rules of Static & Dynamic HTML:
     *
     *    1.) We must generate static HTML unless the caller explicitly opts
     *        in to dynamic HTML support.
     *
     *    2.) If dynamic HTML support is requested, we must honor that request
     *        or throw an error. It is the sole responsibility of the caller to
     *        ensure they aren't e.g. requesting dynamic HTML for an AMP page.
     *
     * These rules help ensure that other existing features like request caching,
     * coalescing, and ISR continue working as intended.
     */
    const generateStaticHTML = supportsDynamicHTML !== true;
    const renderDocument = async () => {
        if (Document.getInitialProps) {
            const renderPage: RenderPage = (
                options: ComponentsEnhancer = {}
            ): RenderPageResult | Promise<RenderPageResult> => {
                if (ctx.err && ErrorDebug) {
                    const html = ReactDOMServer.renderToString(
                        <ErrorDebug error={ctx.err} />
                    );
                    return { html, head };
                }

                if (dev && (props.router || props.Component)) {
                    throw new Error(
                        `'router' and 'Component' can not be returned in getInitialProps from _app.js https://nextjs.org/docs/messages/cant-override-next-props`
                    );
                }

                const { App: EnhancedApp, Component: EnhancedComponent } =
                    enhanceComponents(options, App, Component);

                const html = ReactDOMServer.renderToString(
                    <AppContainer>
                        <EnhancedApp
                            Component={EnhancedComponent}
                            router={router}
                            {...props}
                        />
                    </AppContainer>
                );
                return { html, head };
            };
            const documentCtx = { ...ctx, renderPage };
            const docProps: DocumentInitialProps = await loadGetInitialProps(
                Document,
                documentCtx
            );
            // the response might be finished on the getInitialProps call
            if (isResSent(res) && !isSSG) return null;

            if (!docProps || typeof docProps.html !== "string") {
                const message = `"${getDisplayName(
                    Document
                )}.getInitialProps()" should resolve to an object with a "html" prop set with a valid html string`;
                throw new Error(message);
            }

            return {
                bodyResult: piperFromArray([docProps.html]),
                documentElement: (htmlProps: HtmlProps) => (
                    <Document {...htmlProps} {...docProps} />
                ),
                head: docProps.head,
                headTags: await headTags(documentCtx),
                styles: docProps.styles,
            };
        } else {
            const content =
                ctx.err && ErrorDebug ? (
                    <ErrorDebug error={ctx.err} />
                ) : (
                    <AppContainer>
                        <App {...props} Component={Component} router={router} />
                    </AppContainer>
                );
            const bodyResult = concurrentFeatures
                ? await renderToStream(content, generateStaticHTML)
                : piperFromArray([ReactDOMServer.renderToString(content)]);

            return {
                bodyResult,
                documentElement: () => (Document as any)(),
                head,
                headTags: [],
                styles: jsxStyleRegistry.styles(),
            };
        }
    };

    const documentResult = await renderDocument();
    if (!documentResult) {
        return null;
    }

    const dynamicImportsIds = new Set<string | number>();
    const dynamicImports = new Set<string>();

    for (const mod of reactLoadableModules) {
        const manifestItem: ManifestItem = reactLoadableManifest[mod];

        if (manifestItem) {
            dynamicImportsIds.add(manifestItem.id);
            manifestItem.files.forEach((item) => {
                dynamicImports.add(item);
            });
        }
    }

    const hybridAmp = ampState.hybrid;

    const docComponentsRendered: DocumentProps["docComponentsRendered"] = {};
    const {
        assetPrefix,
        buildId,
        customServer,
        defaultLocale,
        disableOptimizedLoading,
        domainLocales,
        locale,
        locales,
        runtimeConfig,
    } = renderOpts;
    const htmlProps: any = {
        __NEXT_DATA__: {
            props, // The result of getInitialProps
            page: pathname, // The rendered page
            query, // querystring parsed / passed by the user
            buildId, // buildId is used to facilitate caching of page bundles, we send it to the client so that pageloader knows where to load bundles
            assetPrefix: assetPrefix === "" ? undefined : assetPrefix, // send assetPrefix to the client side when configured, otherwise don't sent in the resulting HTML
            runtimeConfig, // runtimeConfig if provided, otherwise don't sent in the resulting HTML
            nextExport: nextExport === true ? true : undefined, // If this is a page exported by `next export`
            autoExport: isAutoExport === true ? true : undefined, // If this is an auto exported page
            isFallback,
            dynamicIds:
                dynamicImportsIds.size === 0
                    ? undefined
                    : Array.from(dynamicImportsIds),
            err: renderOpts.err
                ? serializeError(dev, renderOpts.err)
                : undefined, // Error if one happened, otherwise don't sent in the resulting HTML
            gsp: !!getStaticProps ? true : undefined, // whether the page is getStaticProps
            gssp: !!getServerSideProps ? true : undefined, // whether the page is getServerSideProps
            customServer, // whether the user is using a custom server
            gip: hasPageGetInitialProps ? true : undefined, // whether the page has getInitialProps
            appGip: !defaultAppGetInitialProps ? true : undefined, // whether the _app has getInitialProps
            locale,
            locales,
            defaultLocale,
            domainLocales,
            isPreview: isPreview === true ? true : undefined,
        },
        buildManifest: filteredBuildManifest,
        docComponentsRendered,
        dangerousAsPath: router.asPath,
        canonicalBase:
            !renderOpts.ampPath && (req as any).__nextStrippedLocale
                ? `${renderOpts.canonicalBase || ""}/${renderOpts.locale}`
                : renderOpts.canonicalBase,
        ampPath,
        inAmpMode,
        isDevelopment: !!dev,
        hybridAmp,
        dynamicImports: Array.from(dynamicImports),
        assetPrefix,
        // Only enabled in production as development mode has features relying on HMR (style injection for example)
        unstable_runtimeJS:
            process.env.NODE_ENV === "production"
                ? pageConfig.unstable_runtimeJS
                : undefined,
        unstable_JsPreload: pageConfig.unstable_JsPreload,
        devOnlyCacheBusterQueryString,
        scriptLoader,
        locale,
        disableOptimizedLoading,
        head: documentResult.head,
        headTags: documentResult.headTags,
        styles: documentResult.styles,
        useMaybeDeferContent,
    };
    const documentHTML = ReactDOMServer.renderToStaticMarkup(
        <AmpStateContext.Provider value={ampState}>
            <HtmlContext.Provider value={htmlProps}>
                {documentResult.documentElement(htmlProps)}
            </HtmlContext.Provider>
        </AmpStateContext.Provider>
    );

    if (process.env.NODE_ENV !== "production") {
        const nonRenderedComponents = [];
        const expectedDocComponents = ["Main", "Head", "NextScript", "Html"];

        for (const comp of expectedDocComponents) {
            if (!(docComponentsRendered as any)[comp]) {
                nonRenderedComponents.push(comp);
            }
        }
        const plural = nonRenderedComponents.length !== 1 ? "s" : "";

        if (nonRenderedComponents.length) {
            const missingComponentList = nonRenderedComponents
                .map((e) => `<${e} />`)
                .join(", ");
            warn(
                `Your custom Document (pages/_document) did not render all the required subcomponent${plural}.\n` +
                    `Missing component${plural}: ${missingComponentList}\n` +
                    "Read how to fix here: https://nextjs.org/docs/messages/missing-document-component"
            );
        }
    }

    const renderTargetIdx = documentHTML.indexOf(BODY_RENDER_TARGET);
    const prefix: Array<string> = [];
    prefix.push("<!DOCTYPE html>");
    prefix.push(documentHTML.substring(0, renderTargetIdx));
    if (inAmpMode) {
        prefix.push("<!-- __NEXT_DATA__ -->");
    }

    let pipers: Array<NodeWritablePiper> = [
        piperFromArray(prefix),
        documentResult.bodyResult,
        piperFromArray([
            documentHTML.substring(renderTargetIdx + BODY_RENDER_TARGET.length),
        ]),
    ];

    const postProcessors: Array<((html: string) => Promise<string>) | null> = (
        generateStaticHTML
            ? [
                  inAmpMode
                      ? async (html: string) => {
                            html = await optimizeAmp(
                                html,
                                renderOpts.ampOptimizerConfig
                            );
                            if (
                                !renderOpts.ampSkipValidation &&
                                renderOpts.ampValidator
                            ) {
                                await renderOpts.ampValidator(html, pathname);
                            }
                            return html;
                        }
                      : null,
                  process.env.__NEXT_OPTIMIZE_FONTS ||
                  process.env.__NEXT_OPTIMIZE_IMAGES
                      ? async (html: string) => {
                            return await postProcess(
                                html,
                                { getFontDefinition },
                                {
                                    optimizeFonts: renderOpts.optimizeFonts,
                                    optimizeImages: renderOpts.optimizeImages,
                                }
                            );
                        }
                      : null,
                  renderOpts.optimizeCss
                      ? async (html: string) => {
                            // eslint-disable-next-line import/no-extraneous-dependencies
                            const Critters = require("critters");
                            const cssOptimizer = new Critters({
                                ssrMode: true,
                                reduceInlineStyles: false,
                                path: renderOpts.distDir,
                                publicPath: `${renderOpts.assetPrefix}/_next/`,
                                preload: "media",
                                fonts: false,
                                ...renderOpts.optimizeCss,
                            });
                            return await cssOptimizer.process(html);
                        }
                      : null,
                  inAmpMode || hybridAmp
                      ? async (html: string) => {
                            return html.replace(/&amp;amp=1/g, "&amp=1");
                        }
                      : null,
              ]
            : []
    ).filter(Boolean);

    if (generateStaticHTML || postProcessors.length > 0) {
        let html = await piperToString(chainPipers(pipers));
        for (const postProcessor of postProcessors) {
            if (postProcessor) {
                html = await postProcessor(html);
            }
        }
        return new RenderResult(html);
    }

    return new RenderResult(chainPipers(pipers));
}

function errorToJSON(err: Error): Error {
    const { name, message, stack } = err;
    return { name, message, stack };
}

function serializeError(
    dev: boolean | undefined,
    err: Error
): Error & { statusCode?: number } {
    if (dev) {
        return errorToJSON(err);
    }

    return {
        name: "Internal Server Error.",
        message: "500 - Internal Server Error.",
        statusCode: 500,
    };
}

function renderToStream(
    element: React.ReactElement,
    generateStaticHTML: boolean
): Promise<NodeWritablePiper> {
    return new Promise((resolve, reject) => {
        let underlyingStream: {
            resolve: (error?: Error) => void;
            writable: Writable;
            queuedCallbacks: Array<() => void>;
        } | null = null;
        const stream = new Writable({
            // Use the buffer from the underlying stream
            highWaterMark: 0,
            write(chunk, encoding, callback) {
                if (!underlyingStream) {
                    throw new Error(
                        "invariant: write called without an underlying stream. This is a bug in Next.js"
                    );
                }
                if (!underlyingStream.writable.write(chunk, encoding)) {
                    underlyingStream.queuedCallbacks.push(() => callback());
                } else {
                    callback();
                }
            },
        });
        stream.once("finish", () => {
            if (!underlyingStream) {
                throw new Error(
                    "invariant: finish called without an underlying stream. This is a bug in Next.js"
                );
            }
            underlyingStream.resolve();
        });
        stream.once("error", (err) => {
            if (!underlyingStream) {
                throw new Error(
                    "invariant: error called without an underlying stream. This is a bug in Next.js"
                );
            }
            underlyingStream.resolve(err);
        });
        // React uses `flush` to prevent stream middleware like gzip from buffering to the
        // point of harming streaming performance, so we make sure to expose it and forward it.
        // See: https://github.com/reactwg/react-18/discussions/91
        Object.defineProperty(stream, "flush", {
            value: () => {
                if (!underlyingStream) {
                    throw new Error(
                        "invariant: flush called without an underlying stream. This is a bug in Next.js"
                    );
                }
                if (
                    typeof (underlyingStream.writable as any).flush ===
                    "function"
                ) {
                    (underlyingStream.writable as any).flush();
                }
            },
            enumerable: true,
        });

        let resolved = false;
        const doResolve = () => {
            if (!resolved) {
                resolved = true;
                resolve((res, next) => {
                    const drainHandler = () => {
                        const prevCallbacks = underlyingStream!.queuedCallbacks;
                        underlyingStream!.queuedCallbacks = [];
                        prevCallbacks.forEach((callback) => callback());
                    };
                    res.on("drain", drainHandler);
                    underlyingStream = {
                        resolve: (err) => {
                            underlyingStream = null;
                            res.removeListener("drain", drainHandler);
                            next(err);
                        },
                        writable: res,
                        queuedCallbacks: [],
                    };
                    startWriting();
                });
            }
        };

        const { abort, startWriting } = (
            ReactDOMServer as any
        ).pipeToNodeWritable(element, stream, {
            onError(error: Error) {
                if (!resolved) {
                    resolved = true;
                    reject(error);
                }
                abort();
            },
            onCompleteShell() {
                if (!generateStaticHTML) {
                    doResolve();
                }
            },
            onCompleteAll() {
                doResolve();
            },
        });
    });
}

function chainPipers(pipers: NodeWritablePiper[]): NodeWritablePiper {
    return pipers.reduceRight(
        (lhs, rhs) => (res, next) => {
            rhs(res, (err) => (err ? next(err) : lhs(res, next)));
        },
        (res, next) => {
            res.end();
            next();
        }
    );
}

function piperFromArray(chunks: string[]): NodeWritablePiper {
    return (res, next) => {
        if (typeof (res as any).cork === "function") {
            res.cork();
        }
        chunks.forEach((chunk) => res.write(chunk));
        if (typeof (res as any).uncork === "function") {
            res.uncork();
        }
        next();
    };
}

function piperToString(input: NodeWritablePiper): Promise<string> {
    return new Promise((resolve, reject) => {
        const bufferedChunks: Buffer[] = [];
        const stream = new Writable({
            writev(chunks, callback) {
                chunks.forEach((chunk) => bufferedChunks.push(chunk.chunk));
                callback();
            },
        });
        input(stream, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(Buffer.concat(bufferedChunks).toString());
            }
        });
    });
}

export function useMaybeDeferContent(
    _name: string,
    contentFn: () => JSX.Element
): [boolean, JSX.Element] {
    return [false, contentFn()];
}
