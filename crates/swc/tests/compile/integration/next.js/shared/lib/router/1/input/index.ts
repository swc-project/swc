export default class Router implements BaseRouter {
    private async change(
        method: HistoryMethod,
        url: string,
        as: string,
        options: TransitionOptions,
        forcedScroll?: { x: number; y: number }
    ): Promise<boolean> {
        if (!isLocalURL(url)) {
            window.location.href = url;
            return false;
        }
        const shouldResolveHref =
            (options as any)._h ||
            (options as any)._shouldResolveHref ||
            pathNoQueryHash(url) === pathNoQueryHash(as);

        // for static pages with query params in the URL we delay
        // marking the router ready until after the query is updated
        if ((options as any)._h) {
            this.isReady = true;
        }

        const prevLocale = this.locale;

        if (process.env.__NEXT_I18N_SUPPORT) {
            this.locale =
                options.locale === false
                    ? this.defaultLocale
                    : options.locale || this.locale;

            if (typeof options.locale === "undefined") {
                options.locale = this.locale;
            }

            const parsedAs = parseRelativeUrl(
                hasBasePath(as) ? delBasePath(as) : as
            );
            const localePathResult = normalizeLocalePath(
                parsedAs.pathname,
                this.locales
            );

            if (localePathResult.detectedLocale) {
                this.locale = localePathResult.detectedLocale;
                parsedAs.pathname = addBasePath(parsedAs.pathname);
                as = formatWithValidation(parsedAs);
                url = addBasePath(
                    normalizeLocalePath(
                        hasBasePath(url) ? delBasePath(url) : url,
                        this.locales
                    ).pathname
                );
            }
            let didNavigate = false;

            // we need to wrap this in the env check again since regenerator runtime
            // moves this on its own due to the return
            if (process.env.__NEXT_I18N_SUPPORT) {
                // if the locale isn't configured hard navigate to show 404 page
                if (!this.locales?.includes(this.locale!)) {
                    parsedAs.pathname = addLocale(
                        parsedAs.pathname,
                        this.locale
                    );
                    window.location.href = formatWithValidation(parsedAs);
                    // this was previously a return but was removed in favor
                    // of better dead code elimination with regenerator runtime
                    didNavigate = true;
                }
            }

            const detectedDomain = detectDomainLocale(
                this.domainLocales,
                undefined,
                this.locale
            );

            // we need to wrap this in the env check again since regenerator runtime
            // moves this on its own due to the return
            if (process.env.__NEXT_I18N_SUPPORT) {
                // if we are navigating to a domain locale ensure we redirect to the
                // correct domain
                if (
                    !didNavigate &&
                    detectedDomain &&
                    this.isLocaleDomain &&
                    self.location.hostname !== detectedDomain.domain
                ) {
                    const asNoBasePath = delBasePath(as);
                    window.location.href = `http${
                        detectedDomain.http ? "" : "s"
                    }://${detectedDomain.domain}${addBasePath(
                        `${
                            this.locale === detectedDomain.defaultLocale
                                ? ""
                                : `/${this.locale}`
                        }${asNoBasePath === "/" ? "" : asNoBasePath}` || "/"
                    )}`;
                    // this was previously a return but was removed in favor
                    // of better dead code elimination with regenerator runtime
                    didNavigate = true;
                }
            }

            if (didNavigate) {
                return new Promise(() => {});
            }
        }

        if (!(options as any)._h) {
            this.isSsr = false;
        }
        // marking route changes as a navigation start entry
        if (ST) {
            performance.mark("routeChange");
        }

        const { shallow = false } = options;
        const routeProps = { shallow };

        if (this._inFlightRoute) {
            this.abortComponentLoad(this._inFlightRoute, routeProps);
        }

        as = addBasePath(
            addLocale(
                hasBasePath(as) ? delBasePath(as) : as,
                options.locale,
                this.defaultLocale
            )
        );
        const cleanedAs = delLocale(
            hasBasePath(as) ? delBasePath(as) : as,
            this.locale
        );
        this._inFlightRoute = as;

        let localeChange = prevLocale !== this.locale;

        // If the url change is only related to a hash change
        // We should not proceed. We should only change the state.

        // WARNING: `_h` is an internal option for handing Next.js client-side
        // hydration. Your app should _never_ use this property. It may change at
        // any time without notice.
        if (
            !(options as any)._h &&
            this.onlyAHashChange(cleanedAs) &&
            !localeChange
        ) {
            this.asPath = cleanedAs;
            Router.events.emit("hashChangeStart", as, routeProps);
            // TODO: do we need the resolved href when only a hash change?
            this.changeState(method, url, as, options);
            this.scrollToHash(cleanedAs);
            this.notify(this.components[this.route], null);
            Router.events.emit("hashChangeComplete", as, routeProps);
            return true;
        }

        let parsed = parseRelativeUrl(url);
        let { pathname, query } = parsed;

        // The build manifest needs to be loaded before auto-static dynamic pages
        // get their query parameters to allow ensuring they can be parsed properly
        // when rewritten to
        let pages: any, rewrites: any;
        try {
            pages = await this.pageLoader.getPageList();
            ({ __rewrites: rewrites } = await getClientBuildManifest());
        } catch (err) {
            // If we fail to resolve the page list or client-build manifest, we must
            // do a server-side transition:
            window.location.href = as;
            return false;
        }

        // If asked to change the current URL we should reload the current page
        // (not location.reload() but reload getInitialProps and other Next.js stuffs)
        // We also need to set the method = replaceState always
        // as this should not go into the history (That's how browsers work)
        // We should compare the new asPath to the current asPath, not the url
        if (!this.urlIsNew(cleanedAs) && !localeChange) {
            method = "replaceState";
        }

        // we need to resolve the as value using rewrites for dynamic SSG
        // pages to allow building the data URL correctly
        let resolvedAs = as;

        // url and as should always be prefixed with basePath by this
        // point by either next/link or router.push/replace so strip the
        // basePath from the pathname to match the pages dir 1-to-1
        pathname = pathname
            ? removePathTrailingSlash(delBasePath(pathname))
            : pathname;

        if (shouldResolveHref && pathname !== "/_error") {
            (options as any)._shouldResolveHref = true;

            if (process.env.__NEXT_HAS_REWRITES && as.startsWith("/")) {
                const rewritesResult = resolveRewrites(
                    addBasePath(addLocale(cleanedAs, this.locale)),
                    pages,
                    rewrites,
                    query,
                    (p: string) => resolveDynamicRoute(p, pages),
                    this.locales
                );
                resolvedAs = rewritesResult.asPath;

                if (rewritesResult.matchedPage && rewritesResult.resolvedHref) {
                    // if this directly matches a page we need to update the href to
                    // allow the correct page chunk to be loaded
                    pathname = rewritesResult.resolvedHref;
                    parsed.pathname = addBasePath(pathname);
                    url = formatWithValidation(parsed);
                }
            } else {
                parsed.pathname = resolveDynamicRoute(pathname, pages);

                if (parsed.pathname !== pathname) {
                    pathname = parsed.pathname;
                    parsed.pathname = addBasePath(pathname);
                    url = formatWithValidation(parsed);
                }
            }
        }

        const route = removePathTrailingSlash(pathname);

        if (!isLocalURL(as)) {
            if (process.env.NODE_ENV !== "production") {
                throw new Error(
                    `Invalid href: "${url}" and as: "${as}", received relative href and external as` +
                        `\nSee more info: https://nextjs.org/docs/messages/invalid-relative-url-external-as`
                );
            }

            window.location.href = as;
            return false;
        }

        resolvedAs = delLocale(delBasePath(resolvedAs), this.locale);

        if (isDynamicRoute(route)) {
            const parsedAs = parseRelativeUrl(resolvedAs);
            const asPathname = parsedAs.pathname;

            const routeRegex = getRouteRegex(route);
            const routeMatch = getRouteMatcher(routeRegex)(asPathname);
            const shouldInterpolate = route === asPathname;
            const interpolatedAs = shouldInterpolate
                ? interpolateAs(route, asPathname, query)
                : ({} as { result: undefined; params: undefined });

            if (!routeMatch || (shouldInterpolate && !interpolatedAs.result)) {
                const missingParams = Object.keys(routeRegex.groups).filter(
                    (param) => !query[param]
                );

                if (missingParams.length > 0) {
                    if (process.env.NODE_ENV !== "production") {
                        console.warn(
                            `${
                                shouldInterpolate
                                    ? `Interpolating href`
                                    : `Mismatching \`as\` and \`href\``
                            } failed to manually provide ` +
                                `the params: ${missingParams.join(
                                    ", "
                                )} in the \`href\`'s \`query\``
                        );
                    }

                    throw new Error(
                        (shouldInterpolate
                            ? `The provided \`href\` (${url}) value is missing query values (${missingParams.join(
                                  ", "
                              )}) to be interpolated properly. `
                            : `The provided \`as\` value (${asPathname}) is incompatible with the \`href\` value (${route}). `) +
                            `Read more: https://nextjs.org/docs/messages/${
                                shouldInterpolate
                                    ? "href-interpolation-failed"
                                    : "incompatible-href-as"
                            }`
                    );
                }
            } else if (shouldInterpolate) {
                as = formatWithValidation(
                    Object.assign({}, parsedAs, {
                        pathname: interpolatedAs.result,
                        query: omitParmsFromQuery(
                            query,
                            interpolatedAs.params!
                        ),
                    })
                );
            } else {
                // Merge params into `query`, overwriting any specified in search
                Object.assign(query, routeMatch);
            }
        }

        Router.events.emit("routeChangeStart", as, routeProps);

        try {
            let routeInfo = await this.getRouteInfo(
                route,
                pathname,
                query,
                as,
                resolvedAs,
                routeProps
            );
            let { error, props, __N_SSG, __N_SSP } = routeInfo;

            // handle redirect on client-transition
            if ((__N_SSG || __N_SSP) && props) {
                if (props.pageProps && props.pageProps.__N_REDIRECT) {
                    const destination = props.pageProps.__N_REDIRECT;

                    // check if destination is internal (resolves to a page) and attempt
                    // client-navigation if it is falling back to hard navigation if
                    // it's not
                    if (
                        destination.startsWith("/") &&
                        props.pageProps.__N_REDIRECT_BASE_PATH !== false
                    ) {
                        const parsedHref = parseRelativeUrl(destination);
                        parsedHref.pathname = resolveDynamicRoute(
                            parsedHref.pathname,
                            pages
                        );

                        const { url: newUrl, as: newAs } = prepareUrlAs(
                            this,
                            destination,
                            destination
                        );
                        return this.change(method, newUrl, newAs, options);
                    }

                    window.location.href = destination;
                    return new Promise(() => {});
                }

                this.isPreview = !!props.__N_PREVIEW;

                // handle SSG data 404
                if (props.notFound === SSG_DATA_NOT_FOUND) {
                    let notFoundRoute;

                    try {
                        await this.fetchComponent("/404");
                        notFoundRoute = "/404";
                    } catch (_) {
                        notFoundRoute = "/_error";
                    }

                    routeInfo = await this.getRouteInfo(
                        notFoundRoute,
                        notFoundRoute,
                        query,
                        as,
                        resolvedAs,
                        { shallow: false }
                    );
                }
            }

            Router.events.emit("beforeHistoryChange", as, routeProps);
            this.changeState(method, url, as, options);

            if (
                (options as any)._h &&
                pathname === "/_error" &&
                self.__NEXT_DATA__.props?.pageProps?.statusCode === 500 &&
                props?.pageProps
            ) {
                // ensure statusCode is still correct for static 500 page
                // when updating query information
                props.pageProps.statusCode = 500;
            }

            // shallow routing is only allowed for same page URL changes.
            const isValidShallowRoute = options.shallow && this.route === route;

            const shouldScroll = options.scroll ?? !isValidShallowRoute;
            const resetScroll = shouldScroll ? { x: 0, y: 0 } : null;
            await this.set(
                route,
                pathname!,
                query,
                cleanedAs,
                routeInfo,
                forcedScroll ?? resetScroll
            ).catch((e) => {
                if (e.cancelled) error = error || e;
                else throw e;
            });

            if (error) {
                Router.events.emit(
                    "routeChangeError",
                    error,
                    cleanedAs,
                    routeProps
                );
                throw error;
            }

            if (process.env.__NEXT_I18N_SUPPORT) {
                if (this.locale) {
                    document.documentElement.lang = this.locale;
                }
            }
            Router.events.emit("routeChangeComplete", as, routeProps);

            return true;
        } catch (err) {
            if (isError(err) && err.cancelled) {
                return false;
            }
            throw err;
        }
    }
}
