import regeneratorRuntime from "regenerator-runtime";
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var Router = /*#__PURE__*/ function() {
    "use strict";
    function Router() {
        _classCallCheck(this, Router);
    }
    _createClass(Router, [
        {
            key: "change",
            value: function change(method, url, as, options, forcedScroll) {
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var shouldResolveHref, prevLocale, parsedAs, localePathResult, didNavigate, ref, detectedDomain, asNoBasePath, _shallow, shallow, routeProps, cleanedAs, localeChange, parsed, pathname, query, pages, rewrites, ref1, resolvedAs, rewritesResult, route, parsedAs1, asPathname, routeRegex, routeMatch, shouldInterpolate, interpolatedAs, missingParams, ref2, ref3, routeInfo, error, props, __N_SSG, __N_SSP, destination, parsedHref, ref4, newUrl, newAs, notFoundRoute, isValidShallowRoute, _scroll, shouldScroll, resetScroll;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                if (isLocalURL(url)) {
                                    _ctx.next = 3;
                                    break;
                                }
                                window.location.href = url;
                                return _ctx.abrupt("return", false);
                            case 3:
                                shouldResolveHref = options._h || options._shouldResolveHref || pathNoQueryHash(url) === pathNoQueryHash(as);
                                // for static pages with query params in the URL we delay
                                // marking the router ready until after the query is updated
                                if (options._h) {
                                    this.isReady = true;
                                }
                                prevLocale = this.locale;
                                if (!process.env.__NEXT_I18N_SUPPORT) {
                                    _ctx.next = 18;
                                    break;
                                }
                                this.locale = options.locale === false ? this.defaultLocale : options.locale || this.locale;
                                if (typeof options.locale === 'undefined') {
                                    options.locale = this.locale;
                                }
                                parsedAs = parseRelativeUrl(hasBasePath(as) ? delBasePath(as) : as);
                                localePathResult = normalizeLocalePath(parsedAs.pathname, this.locales);
                                if (localePathResult.detectedLocale) {
                                    this.locale = localePathResult.detectedLocale;
                                    parsedAs.pathname = addBasePath(parsedAs.pathname);
                                    as = formatWithValidation(parsedAs);
                                    url = addBasePath(normalizeLocalePath(hasBasePath(url) ? delBasePath(url) : url, this.locales).pathname);
                                }
                                didNavigate = false;
                                // we need to wrap this in the env check again since regenerator runtime
                                // moves this on its own due to the return
                                if (process.env.__NEXT_I18N_SUPPORT) {
                                    ;
                                    // if the locale isn't configured hard navigate to show 404 page
                                    if (!((ref = this.locales) === null || ref === void 0 ? void 0 : ref.includes(this.locale))) {
                                        parsedAs.pathname = addLocale(parsedAs.pathname, this.locale);
                                        window.location.href = formatWithValidation(parsedAs);
                                        // this was previously a return but was removed in favor
                                        // of better dead code elimination with regenerator runtime
                                        didNavigate = true;
                                    }
                                }
                                detectedDomain = detectDomainLocale(this.domainLocales, undefined, this.locale);
                                // we need to wrap this in the env check again since regenerator runtime
                                // moves this on its own due to the return
                                if (process.env.__NEXT_I18N_SUPPORT) {
                                    // if we are navigating to a domain locale ensure we redirect to the
                                    // correct domain
                                    if (!didNavigate && detectedDomain && this.isLocaleDomain && self.location.hostname !== detectedDomain.domain) {
                                        asNoBasePath = delBasePath(as);
                                        window.location.href = "http".concat(detectedDomain.http ? '' : 's', "://").concat(detectedDomain.domain).concat(addBasePath("".concat(this.locale === detectedDomain.defaultLocale ? '' : "/".concat(this.locale)).concat(asNoBasePath === '/' ? '' : asNoBasePath) || '/'));
                                        // this was previously a return but was removed in favor
                                        // of better dead code elimination with regenerator runtime
                                        didNavigate = true;
                                    }
                                }
                                if (!didNavigate) {
                                    _ctx.next = 18;
                                    break;
                                }
                                return _ctx.abrupt("return", new Promise(function() {
                                }));
                            case 18:
                                if (!options._h) {
                                    this.isSsr = false;
                                }
                                // marking route changes as a navigation start entry
                                if (ST) {
                                    performance.mark('routeChange');
                                }
                                _shallow = options.shallow, shallow = _shallow === void 0 ? false : _shallow;
                                routeProps = {
                                    shallow: shallow
                                };
                                if (this._inFlightRoute) {
                                    this.abortComponentLoad(this._inFlightRoute, routeProps);
                                }
                                as = addBasePath(addLocale(hasBasePath(as) ? delBasePath(as) : as, options.locale, this.defaultLocale));
                                cleanedAs = delLocale(hasBasePath(as) ? delBasePath(as) : as, this.locale);
                                this._inFlightRoute = as;
                                localeChange = prevLocale !== this.locale;
                                if (!(!options._h && this.onlyAHashChange(cleanedAs) && !localeChange)) {
                                    _ctx.next = 35;
                                    break;
                                }
                                this.asPath = cleanedAs;
                                Router.events.emit('hashChangeStart', as, routeProps);
                                // TODO: do we need the resolved href when only a hash change?
                                this.changeState(method, url, as, options);
                                this.scrollToHash(cleanedAs);
                                this.notify(this.components[this.route], null);
                                Router.events.emit('hashChangeComplete', as, routeProps);
                                return _ctx.abrupt("return", true);
                            case 35:
                                parsed = parseRelativeUrl(url);
                                pathname = parsed.pathname, query = parsed.query;
                                ;
                                _ctx.prev = 38;
                                _ctx.next = 41;
                                return this.pageLoader.getPageList();
                            case 41:
                                pages = _ctx.sent;
                                ;
                                _ctx.next = 45;
                                return getClientBuildManifest();
                            case 45:
                                ref1 = _ctx.sent;
                                rewrites = ref1.__rewrites;
                                ref1;
                                _ctx.next = 54;
                                break;
                            case 50:
                                _ctx.prev = 50;
                                _ctx.t0 = _ctx["catch"](38);
                                // If we fail to resolve the page list or client-build manifest, we must
                                // do a server-side transition:
                                window.location.href = as;
                                return _ctx.abrupt("return", false);
                            case 54:
                                // If asked to change the current URL we should reload the current page
                                // (not location.reload() but reload getInitialProps and other Next.js stuffs)
                                // We also need to set the method = replaceState always
                                // as this should not go into the history (That's how browsers work)
                                // We should compare the new asPath to the current asPath, not the url
                                if (!this.urlIsNew(cleanedAs) && !localeChange) {
                                    method = 'replaceState';
                                }
                                resolvedAs = as;
                                // url and as should always be prefixed with basePath by this
                                // point by either next/link or router.push/replace so strip the
                                // basePath from the pathname to match the pages dir 1-to-1
                                pathname = pathname ? removePathTrailingSlash(delBasePath(pathname)) : pathname;
                                if (shouldResolveHref && pathname !== '/_error') {
                                    options._shouldResolveHref = true;
                                    if (process.env.__NEXT_HAS_REWRITES && as.startsWith('/')) {
                                        rewritesResult = resolveRewrites(addBasePath(addLocale(cleanedAs, this.locale)), pages, rewrites, query, function(p) {
                                            return resolveDynamicRoute(p, pages);
                                        }, this.locales);
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
                                if (isLocalURL(as)) {
                                    _ctx.next = 64;
                                    break;
                                }
                                if (!(process.env.NODE_ENV !== 'production')) {
                                    _ctx.next = 62;
                                    break;
                                }
                                throw new Error("Invalid href: \"".concat(url, "\" and as: \"").concat(as, "\", received relative href and external as") + "\nSee more info: https://nextjs.org/docs/messages/invalid-relative-url-external-as");
                            case 62:
                                window.location.href = as;
                                return _ctx.abrupt("return", false);
                            case 64:
                                resolvedAs = delLocale(delBasePath(resolvedAs), this.locale);
                                if (!isDynamicRoute(route)) {
                                    _ctx.next = 80;
                                    break;
                                }
                                parsedAs1 = parseRelativeUrl(resolvedAs);
                                asPathname = parsedAs1.pathname;
                                routeRegex = getRouteRegex(route);
                                routeMatch = getRouteMatcher(routeRegex)(asPathname);
                                shouldInterpolate = route === asPathname;
                                interpolatedAs = shouldInterpolate ? interpolateAs(route, asPathname, query) : {
                                };
                                if (!(!routeMatch || shouldInterpolate && !interpolatedAs.result)) {
                                    _ctx.next = 79;
                                    break;
                                }
                                missingParams = Object.keys(routeRegex.groups).filter(function(param) {
                                    return !query[param];
                                });
                                if (!(missingParams.length > 0)) {
                                    _ctx.next = 77;
                                    break;
                                }
                                if (process.env.NODE_ENV !== 'production') {
                                    console.warn("".concat(shouldInterpolate ? "Interpolating href" : "Mismatching `as` and `href`", " failed to manually provide ") + "the params: ".concat(missingParams.join(', '), " in the `href`'s `query`"));
                                }
                                throw new Error((shouldInterpolate ? "The provided `href` (".concat(url, ") value is missing query values (").concat(missingParams.join(', '), ") to be interpolated properly. ") : "The provided `as` value (".concat(asPathname, ") is incompatible with the `href` value (").concat(route, "). ")) + "Read more: https://nextjs.org/docs/messages/".concat(shouldInterpolate ? 'href-interpolation-failed' : 'incompatible-href-as'));
                            case 77:
                                _ctx.next = 80;
                                break;
                            case 79:
                                if (shouldInterpolate) {
                                    as = formatWithValidation(Object.assign({
                                    }, parsedAs1, {
                                        pathname: interpolatedAs.result,
                                        query: omitParmsFromQuery(query, interpolatedAs.params)
                                    }));
                                } else {
                                    // Merge params into `query`, overwriting any specified in search
                                    Object.assign(query, routeMatch);
                                }
                            case 80:
                                Router.events.emit('routeChangeStart', as, routeProps);
                                _ctx.prev = 81;
                                ;
                                _ctx.next = 85;
                                return this.getRouteInfo(route, pathname, query, as, resolvedAs, routeProps);
                            case 85:
                                routeInfo = _ctx.sent;
                                error = routeInfo.error, props = routeInfo.props, __N_SSG = routeInfo.__N_SSG, __N_SSP = routeInfo.__N_SSP;
                                if (!((__N_SSG || __N_SSP) && props)) {
                                    _ctx.next = 112;
                                    break;
                                }
                                if (!(props.pageProps && props.pageProps.__N_REDIRECT)) {
                                    _ctx.next = 97;
                                    break;
                                }
                                destination = props.pageProps.__N_REDIRECT;
                                if (!(destination.startsWith('/') && props.pageProps.__N_REDIRECT_BASE_PATH !== false)) {
                                    _ctx.next = 95;
                                    break;
                                }
                                parsedHref = parseRelativeUrl(destination);
                                parsedHref.pathname = resolveDynamicRoute(parsedHref.pathname, pages);
                                ref4 = prepareUrlAs(this, destination, destination), newUrl = ref4.url, newAs = ref4.as;
                                return _ctx.abrupt("return", this.change(method, newUrl, newAs, options));
                            case 95:
                                window.location.href = destination;
                                return _ctx.abrupt("return", new Promise(function() {
                                }));
                            case 97:
                                this.isPreview = !!props.__N_PREVIEW;
                                if (!(props.notFound === SSG_DATA_NOT_FOUND)) {
                                    _ctx.next = 112;
                                    break;
                                }
                                ;
                                _ctx.prev = 100;
                                _ctx.next = 103;
                                return this.fetchComponent('/404');
                            case 103:
                                notFoundRoute = '/404';
                                _ctx.next = 109;
                                break;
                            case 106:
                                _ctx.prev = 106;
                                _ctx.t1 = _ctx["catch"](100);
                                notFoundRoute = '/_error';
                            case 109:
                                _ctx.next = 111;
                                return this.getRouteInfo(notFoundRoute, notFoundRoute, query, as, resolvedAs, {
                                    shallow: false
                                });
                            case 111:
                                routeInfo = _ctx.sent;
                            case 112:
                                Router.events.emit('beforeHistoryChange', as, routeProps);
                                this.changeState(method, url, as, options);
                                if (options._h && pathname === '/_error' && ((ref2 = self.__NEXT_DATA__.props) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.pageProps) === null || ref3 === void 0 ? void 0 : ref3.statusCode) === 500 && (props === null || props === void 0 ? void 0 : props.pageProps)) {
                                    // ensure statusCode is still correct for static 500 page
                                    // when updating query information
                                    props.pageProps.statusCode = 500;
                                }
                                isValidShallowRoute = options.shallow && this.route === route;
                                ;
                                shouldScroll = (_scroll = options.scroll) !== null && _scroll !== void 0 ? _scroll : !isValidShallowRoute;
                                resetScroll = shouldScroll ? {
                                    x: 0,
                                    y: 0
                                } : null;
                                _ctx.next = 121;
                                return this.set(route, pathname, query, cleanedAs, routeInfo, forcedScroll !== null && forcedScroll !== void 0 ? forcedScroll : resetScroll).catch(function(e) {
                                    if (e.cancelled) error = error || e;
                                    else throw e;
                                });
                            case 121:
                                if (!error) {
                                    _ctx.next = 124;
                                    break;
                                }
                                Router.events.emit('routeChangeError', error, cleanedAs, routeProps);
                                throw error;
                            case 124:
                                if (process.env.__NEXT_I18N_SUPPORT) {
                                    if (this.locale) {
                                        document.documentElement.lang = this.locale;
                                    }
                                }
                                Router.events.emit('routeChangeComplete', as, routeProps);
                                return _ctx.abrupt("return", true);
                            case 129:
                                _ctx.prev = 129;
                                _ctx.t2 = _ctx["catch"](81);
                                if (!(isError(_ctx.t2) && _ctx.t2.cancelled)) {
                                    _ctx.next = 133;
                                    break;
                                }
                                return _ctx.abrupt("return", false);
                            case 133:
                                throw _ctx.t2;
                            case 134:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee, this, [
                        [
                            38,
                            50
                        ],
                        [
                            81,
                            129
                        ],
                        [
                            100,
                            106
                        ]
                    ]);
                }).bind(this))();
            }
        }
    ]);
    return Router;
}();
export { Router as default };
