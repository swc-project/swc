import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var Router = /*#__PURE__*/ function() {
    "use strict";
    function Router() {
        _class_call_check(this, Router);
    }
    var _proto = Router.prototype;
    _proto.change = function change(method, url, as, options, forcedScroll) {
        var _this = this;
        return _async_to_generator(function() {
            var shouldResolveHref, prevLocale, parsedAs, localePathResult, didNavigate, ref, detectedDomain, asNoBasePath, _shallow, shallow, routeProps, _tmp, cleanedAs, localeChange, parsed, pathname, query, pages, rewrites, ref1, err, resolvedAs, rewritesResult, route, parsedAs1, asPathname, routeRegex, routeMatch, shouldInterpolate, interpolatedAs, _tmp1, missingParams, ref2, ref3, routeInfo, error, props, __N_SSG, __N_SSP, destination, parsedHref, ref4, newUrl, newAs, notFoundRoute, _, _tmp2, isValidShallowRoute, _scroll, shouldScroll, resetScroll, _tmp3, err1;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!isLocalURL(url)) {
                            window.location.href = url;
                            return [
                                2,
                                false
                            ];
                        }
                        shouldResolveHref = options._h || options._shouldResolveHref || pathNoQueryHash(url) === pathNoQueryHash(as);
                        // for static pages with query params in the URL we delay
                        // marking the router ready until after the query is updated
                        if (options._h) {
                            _this.isReady = true;
                        }
                        prevLocale = _this.locale;
                        if (process.env.__NEXT_I18N_SUPPORT) {
                            _this.locale = options.locale === false ? _this.defaultLocale : options.locale || _this.locale;
                            if (typeof options.locale === "undefined") {
                                options.locale = _this.locale;
                            }
                            parsedAs = parseRelativeUrl(hasBasePath(as) ? delBasePath(as) : as);
                            localePathResult = normalizeLocalePath(parsedAs.pathname, _this.locales);
                            if (localePathResult.detectedLocale) {
                                _this.locale = localePathResult.detectedLocale;
                                parsedAs.pathname = addBasePath(parsedAs.pathname);
                                as = formatWithValidation(parsedAs);
                                url = addBasePath(normalizeLocalePath(hasBasePath(url) ? delBasePath(url) : url, _this.locales).pathname);
                            }
                            didNavigate = false;
                            // we need to wrap this in the env check again since regenerator runtime
                            // moves this on its own due to the return
                            if (process.env.__NEXT_I18N_SUPPORT) {
                                ;
                                // if the locale isn't configured hard navigate to show 404 page
                                if (!((ref = _this.locales) === null || ref === void 0 ? void 0 : ref.includes(_this.locale))) {
                                    parsedAs.pathname = addLocale(parsedAs.pathname, _this.locale);
                                    window.location.href = formatWithValidation(parsedAs);
                                    // this was previously a return but was removed in favor
                                    // of better dead code elimination with regenerator runtime
                                    didNavigate = true;
                                }
                            }
                            detectedDomain = detectDomainLocale(_this.domainLocales, undefined, _this.locale);
                            // we need to wrap this in the env check again since regenerator runtime
                            // moves this on its own due to the return
                            if (process.env.__NEXT_I18N_SUPPORT) {
                                // if we are navigating to a domain locale ensure we redirect to the
                                // correct domain
                                if (!didNavigate && detectedDomain && _this.isLocaleDomain && self.location.hostname !== detectedDomain.domain) {
                                    asNoBasePath = delBasePath(as);
                                    window.location.href = "http".concat(detectedDomain.http ? "" : "s", "://").concat(detectedDomain.domain).concat(addBasePath("".concat(_this.locale === detectedDomain.defaultLocale ? "" : "/".concat(_this.locale)).concat(asNoBasePath === "/" ? "" : asNoBasePath) || "/"));
                                    // this was previously a return but was removed in favor
                                    // of better dead code elimination with regenerator runtime
                                    didNavigate = true;
                                }
                            }
                            if (didNavigate) {
                                return [
                                    2,
                                    new Promise(function() {})
                                ];
                            }
                        }
                        if (!options._h) {
                            _this.isSsr = false;
                        }
                        // marking route changes as a navigation start entry
                        if (ST) {
                            performance.mark("routeChange");
                        }
                        _shallow = options.shallow, shallow = _shallow === void 0 ? false : _shallow;
                        _tmp = {};
                        routeProps = (_tmp.shallow = shallow, _tmp);
                        if (_this._inFlightRoute) {
                            _this.abortComponentLoad(_this._inFlightRoute, routeProps);
                        }
                        as = addBasePath(addLocale(hasBasePath(as) ? delBasePath(as) : as, options.locale, _this.defaultLocale));
                        cleanedAs = delLocale(hasBasePath(as) ? delBasePath(as) : as, _this.locale);
                        _this._inFlightRoute = as;
                        localeChange = prevLocale !== _this.locale;
                        // If the url change is only related to a hash change
                        // We should not proceed. We should only change the state.
                        // WARNING: `_h` is an internal option for handing Next.js client-side
                        // hydration. Your app should _never_ use this property. It may change at
                        // any time without notice.
                        if (!options._h && _this.onlyAHashChange(cleanedAs) && !localeChange) {
                            _this.asPath = cleanedAs;
                            Router.events.emit("hashChangeStart", as, routeProps);
                            // TODO: do we need the resolved href when only a hash change?
                            _this.changeState(method, url, as, options);
                            _this.scrollToHash(cleanedAs);
                            _this.notify(_this.components[_this.route], null);
                            Router.events.emit("hashChangeComplete", as, routeProps);
                            return [
                                2,
                                true
                            ];
                        }
                        parsed = parseRelativeUrl(url);
                        pathname = parsed.pathname, query = parsed.query;
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            4,
                            ,
                            5
                        ]);
                        return [
                            4,
                            _this.pageLoader.getPageList()
                        ];
                    case 2:
                        pages = _state.sent();
                        return [
                            4,
                            getClientBuildManifest()
                        ];
                    case 3:
                        ref1 = _state.sent(), rewrites = ref1.__rewrites, ref1;
                        return [
                            3,
                            5
                        ];
                    case 4:
                        err = _state.sent();
                        // If we fail to resolve the page list or client-build manifest, we must
                        // do a server-side transition:
                        window.location.href = as;
                        return [
                            2,
                            false
                        ];
                    case 5:
                        // If asked to change the current URL we should reload the current page
                        // (not location.reload() but reload getInitialProps and other Next.js stuffs)
                        // We also need to set the method = replaceState always
                        // as this should not go into the history (That's how browsers work)
                        // We should compare the new asPath to the current asPath, not the url
                        if (!_this.urlIsNew(cleanedAs) && !localeChange) {
                            method = "replaceState";
                        }
                        resolvedAs = as;
                        // url and as should always be prefixed with basePath by this
                        // point by either next/link or router.push/replace so strip the
                        // basePath from the pathname to match the pages dir 1-to-1
                        pathname = pathname ? removePathTrailingSlash(delBasePath(pathname)) : pathname;
                        if (shouldResolveHref && pathname !== "/_error") {
                            options._shouldResolveHref = true;
                            if (process.env.__NEXT_HAS_REWRITES && as.startsWith("/")) {
                                rewritesResult = resolveRewrites(addBasePath(addLocale(cleanedAs, _this.locale)), pages, rewrites, query, function(p) {
                                    return resolveDynamicRoute(p, pages);
                                }, _this.locales);
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
                        route = removePathTrailingSlash(pathname);
                        if (!isLocalURL(as)) {
                            if (process.env.NODE_ENV !== "production") {
                                throw new Error('Invalid href: "'.concat(url, '" and as: "').concat(as, '", received relative href and external as') + "\nSee more info: https://nextjs.org/docs/messages/invalid-relative-url-external-as");
                            }
                            window.location.href = as;
                            return [
                                2,
                                false
                            ];
                        }
                        resolvedAs = delLocale(delBasePath(resolvedAs), _this.locale);
                        _tmp1 = {};
                        if (isDynamicRoute(route)) {
                            parsedAs1 = parseRelativeUrl(resolvedAs);
                            asPathname = parsedAs1.pathname;
                            routeRegex = getRouteRegex(route);
                            routeMatch = getRouteMatcher(routeRegex)(asPathname);
                            shouldInterpolate = route === asPathname;
                            interpolatedAs = shouldInterpolate ? interpolateAs(route, asPathname, query) : _tmp1;
                            if (!routeMatch || shouldInterpolate && !interpolatedAs.result) {
                                missingParams = Object.keys(routeRegex.groups).filter(function(param) {
                                    return !query[param];
                                });
                                if (missingParams.length > 0) {
                                    if (process.env.NODE_ENV !== "production") {
                                        console.warn("".concat(shouldInterpolate ? "Interpolating href" : "Mismatching `as` and `href`", " failed to manually provide ") + "the params: ".concat(missingParams.join(", "), " in the `href`'s `query`"));
                                    }
                                    throw new Error((shouldInterpolate ? "The provided `href` (".concat(url, ") value is missing query values (").concat(missingParams.join(", "), ") to be interpolated properly. ") : "The provided `as` value (".concat(asPathname, ") is incompatible with the `href` value (").concat(route, "). ")) + "Read more: https://nextjs.org/docs/messages/".concat(shouldInterpolate ? "href-interpolation-failed" : "incompatible-href-as"));
                                }
                            } else if (shouldInterpolate) {
                                as = formatWithValidation(Object.assign({}, parsedAs1, {
                                    pathname: interpolatedAs.result,
                                    query: omitParmsFromQuery(query, interpolatedAs.params)
                                }));
                            } else {
                                // Merge params into `query`, overwriting any specified in search
                                Object.assign(query, routeMatch);
                            }
                        }
                        Router.events.emit("routeChangeStart", as, routeProps);
                        _state.label = 6;
                    case 6:
                        _state.trys.push([
                            6,
                            15,
                            ,
                            16
                        ]);
                        return [
                            4,
                            _this.getRouteInfo(route, pathname, query, as, resolvedAs, routeProps)
                        ];
                    case 7:
                        routeInfo = _state.sent();
                        error = routeInfo.error, props = routeInfo.props, __N_SSG = routeInfo.__N_SSG, __N_SSP = routeInfo.__N_SSP;
                        if (!((__N_SSG || __N_SSP) && props)) return [
                            3,
                            13
                        ];
                        if (props.pageProps && props.pageProps.__N_REDIRECT) {
                            destination = props.pageProps.__N_REDIRECT;
                            // check if destination is internal (resolves to a page) and attempt
                            // client-navigation if it is falling back to hard navigation if
                            // it's not
                            if (destination.startsWith("/") && props.pageProps.__N_REDIRECT_BASE_PATH !== false) {
                                parsedHref = parseRelativeUrl(destination);
                                parsedHref.pathname = resolveDynamicRoute(parsedHref.pathname, pages);
                                ref4 = prepareUrlAs(_this, destination, destination), newUrl = ref4.url, newAs = ref4.as;
                                return [
                                    2,
                                    _this.change(method, newUrl, newAs, options)
                                ];
                            }
                            window.location.href = destination;
                            return [
                                2,
                                new Promise(function() {})
                            ];
                        }
                        _this.isPreview = !!props.__N_PREVIEW;
                        if (!(props.notFound === SSG_DATA_NOT_FOUND)) return [
                            3,
                            13
                        ];
                        _state.label = 8;
                    case 8:
                        _state.trys.push([
                            8,
                            10,
                            ,
                            11
                        ]);
                        return [
                            4,
                            _this.fetchComponent("/404")
                        ];
                    case 9:
                        _state.sent();
                        notFoundRoute = "/404";
                        return [
                            3,
                            11
                        ];
                    case 10:
                        _ = _state.sent();
                        notFoundRoute = "/_error";
                        return [
                            3,
                            11
                        ];
                    case 11:
                        _tmp2 = {};
                        return [
                            4,
                            _this.getRouteInfo(notFoundRoute, notFoundRoute, query, as, resolvedAs, (_tmp2.shallow = false, _tmp2))
                        ];
                    case 12:
                        routeInfo = _state.sent();
                        _state.label = 13;
                    case 13:
                        Router.events.emit("beforeHistoryChange", as, routeProps);
                        _this.changeState(method, url, as, options);
                        if (options._h && pathname === "/_error" && ((ref2 = self.__NEXT_DATA__.props) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.pageProps) === null || ref3 === void 0 ? void 0 : ref3.statusCode) === 500 && (props === null || props === void 0 ? void 0 : props.pageProps)) {
                            // ensure statusCode is still correct for static 500 page
                            // when updating query information
                            props.pageProps.statusCode = 500;
                        }
                        isValidShallowRoute = options.shallow && _this.route === route;
                        shouldScroll = (_scroll = options.scroll) !== null && _scroll !== void 0 ? _scroll : !isValidShallowRoute;
                        _tmp3 = {};
                        resetScroll = shouldScroll ? (_tmp3.x = 0, _tmp3.y = 0, _tmp3) : null;
                        return [
                            4,
                            _this.set(route, pathname, query, cleanedAs, routeInfo, forcedScroll !== null && forcedScroll !== void 0 ? forcedScroll : resetScroll).catch(function(e) {
                                if (e.cancelled) error = error || e;
                                else throw e;
                            })
                        ];
                    case 14:
                        _state.sent();
                        if (error) {
                            Router.events.emit("routeChangeError", error, cleanedAs, routeProps);
                            throw error;
                        }
                        if (process.env.__NEXT_I18N_SUPPORT) {
                            if (_this.locale) {
                                document.documentElement.lang = _this.locale;
                            }
                        }
                        Router.events.emit("routeChangeComplete", as, routeProps);
                        return [
                            2,
                            true
                        ];
                    case 15:
                        err1 = _state.sent();
                        if (isError(err1) && err1.cancelled) {
                            return [
                                2,
                                false
                            ];
                        }
                        throw err1;
                    case 16:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    return Router;
}();
export { Router as default };
