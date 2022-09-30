(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[357],{

/***/ 1334:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({ value: true });

var core = __webpack_require__(6027);
var authApp = __webpack_require__(1843);
var oauthApp = __webpack_require__(7785);
var authUnauthenticated = __webpack_require__(5643);
var webhooks$1 = __webpack_require__(5798);
var pluginPaginateRest = __webpack_require__(5745);

const VERSION = "13.0.9";

function webhooks(appOctokit, options // Explict return type for better debugability and performance,
// see https://github.com/octokit/app.js/pull/201
) {
  return new webhooks$1.Webhooks({
    secret: options.secret,
    transform: async event => {
      if (!("installation" in event.payload) || typeof event.payload.installation !== "object") {
        const octokit = new appOctokit.constructor({
          authStrategy: authUnauthenticated.createUnauthenticatedAuth,
          auth: {
            reason: `"installation" key missing in webhook event payload`
          }
        });
        return { ...event,
          octokit: octokit
        };
      }

      const installationId = event.payload.installation.id;
      const octokit = await appOctokit.auth({
        type: "installation",
        installationId,

        factory(auth) {
          return new auth.octokit.constructor({ ...auth.octokitOptions,
            authStrategy: authApp.createAppAuth,
            ...{
              auth: { ...auth,
                installationId
              }
            }
          });
        }

      });
      return { ...event,
        octokit: octokit
      };
    }
  });
}

async function getInstallationOctokit(app, installationId) {
  return app.octokit.auth({
    type: "installation",
    installationId: installationId,

    factory(auth) {
      const options = { ...auth.octokitOptions,
        authStrategy: authApp.createAppAuth,
        ...{
          auth: { ...auth,
            installationId: installationId
          }
        }
      };
      return new auth.octokit.constructor(options);
    }

  });
}

function eachInstallationFactory(app) {
  return Object.assign(eachInstallation.bind(null, app), {
    iterator: eachInstallationIterator.bind(null, app)
  });
}
async function eachInstallation(app, callback) {
  const i = eachInstallationIterator(app)[Symbol.asyncIterator]();
  let result = await i.next();

  while (!result.done) {
    await callback(result.value);
    result = await i.next();
  }
}
function eachInstallationIterator(app) {
  return {
    async *[Symbol.asyncIterator]() {
      const iterator = pluginPaginateRest.composePaginateRest.iterator(app.octokit, "GET /app/installations");

      for await (const {
        data: installations
      } of iterator) {
        for (const installation of installations) {
          const installationOctokit = await getInstallationOctokit(app, installation.id);
          yield {
            octokit: installationOctokit,
            installation
          };
        }
      }
    }

  };
}

function eachRepositoryFactory(app) {
  return Object.assign(eachRepository.bind(null, app), {
    iterator: eachRepositoryIterator.bind(null, app)
  });
}
async function eachRepository(app, queryOrCallback, callback) {
  const i = eachRepositoryIterator(app, callback ? queryOrCallback : undefined)[Symbol.asyncIterator]();
  let result = await i.next();

  while (!result.done) {
    if (callback) {
      await callback(result.value);
    } else {
      await queryOrCallback(result.value);
    }

    result = await i.next();
  }
}

function singleInstallationIterator(app, installationId) {
  return {
    async *[Symbol.asyncIterator]() {
      yield {
        octokit: await app.getInstallationOctokit(installationId)
      };
    }

  };
}

function eachRepositoryIterator(app, query) {
  return {
    async *[Symbol.asyncIterator]() {
      const iterator = query ? singleInstallationIterator(app, query.installationId) : app.eachInstallation.iterator();

      for await (const {
        octokit
      } of iterator) {
        const repositoriesIterator = pluginPaginateRest.composePaginateRest.iterator(octokit, "GET /installation/repositories");

        for await (const {
          data: repositories
        } of repositoriesIterator) {
          for (const repository of repositories) {
            yield {
              octokit: octokit,
              repository
            };
          }
        }
      }
    }

  };
}

function onUnhandledRequestDefault(request, response) {
  response.writeHead(404, {
    "content-type": "application/json"
  });
  response.end(JSON.stringify({
    error: `Unknown route: ${request.method} ${request.url}`
  }));
}

function noop() {}

function createNodeMiddleware(app, options = {}) {
  const log = Object.assign({
    debug: noop,
    info: noop,
    warn: console.warn.bind(console),
    error: console.error.bind(console)
  }, options.log);
  const optionsWithDefaults = {
    onUnhandledRequest: onUnhandledRequestDefault,
    pathPrefix: "/api/github",
    ...options,
    log
  };
  const webhooksMiddleware = webhooks$1.createNodeMiddleware(app.webhooks, {
    path: optionsWithDefaults.pathPrefix + "/webhooks",
    log,
    onUnhandledRequest: optionsWithDefaults.onUnhandledRequest
  });
  const oauthMiddleware = oauthApp.createNodeMiddleware(app.oauth, {
    pathPrefix: optionsWithDefaults.pathPrefix + "/oauth",
    onUnhandledRequest: optionsWithDefaults.onUnhandledRequest
  });
  return middleware.bind(null, optionsWithDefaults, {
    webhooksMiddleware,
    oauthMiddleware
  });
}
async function middleware(options, {
  webhooksMiddleware,
  oauthMiddleware
}, request, response, next) {
  const {
    pathname
  } = new URL(request.url, "http://localhost");

  if (pathname === `${options.pathPrefix}/webhooks`) {
    return webhooksMiddleware(request, response, next);
  }

  if (pathname.startsWith(`${options.pathPrefix}/oauth/`)) {
    return oauthMiddleware(request, response, next);
  }

  const isExpressMiddleware = typeof next === "function";

  if (isExpressMiddleware) {
    // @ts-ignore `next` must be a function as we check two lines above
    return next();
  }

  return options.onUnhandledRequest(request, response);
}

class App {
  constructor(options) {
    const Octokit = options.Octokit || core.Octokit;
    const authOptions = Object.assign({
      appId: options.appId,
      privateKey: options.privateKey
    }, options.oauth ? {
      clientId: options.oauth.clientId,
      clientSecret: options.oauth.clientSecret
    } : {});
    this.octokit = new Octokit({
      authStrategy: authApp.createAppAuth,
      auth: authOptions,
      log: options.log
    });
    this.log = Object.assign({
      debug: () => {},
      info: () => {},
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    }, options.log); // set app.webhooks depending on whether "webhooks" option has been passed

    if (options.webhooks) {
      // @ts-expect-error TODO: figure this out
      this.webhooks = webhooks(this.octokit, options.webhooks);
    } else {
      Object.defineProperty(this, "webhooks", {
        get() {
          throw new Error("[@octokit/app] webhooks option not set");
        }

      });
    } // set app.oauth depending on whether "oauth" option has been passed


    if (options.oauth) {
      this.oauth = new oauthApp.OAuthApp({ ...options.oauth,
        clientType: "github-app",
        Octokit
      });
    } else {
      Object.defineProperty(this, "oauth", {
        get() {
          throw new Error("[@octokit/app] oauth.clientId / oauth.clientSecret options are not set");
        }

      });
    }

    this.getInstallationOctokit = getInstallationOctokit.bind(null, this);
    this.eachInstallation = eachInstallationFactory(this);
    this.eachRepository = eachRepositoryFactory(this);
  }

  static defaults(defaults) {
    const AppWithDefaults = class extends this {
      constructor(...args) {
        super({ ...defaults,
          ...args[0]
        });
      }

    };
    return AppWithDefaults;
  }

}
App.VERSION = VERSION;

exports.gV = App;
__webpack_unused_export__ = createNodeMiddleware;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 1843:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "createAppAuth": function() { return /* binding */ createAppAuth; },
  "createOAuthUserAuth": function() { return /* reexport */ auth_oauth_user_dist_web.createOAuthUserAuth; }
});

// EXTERNAL MODULE: ./node_modules/universal-user-agent/dist-web/index.js
var dist_web = __webpack_require__(350);
// EXTERNAL MODULE: ./node_modules/@octokit/request/dist-web/index.js + 2 modules
var request_dist_web = __webpack_require__(2363);
// EXTERNAL MODULE: ./node_modules/@octokit/auth-oauth-app/dist-web/index.js
var auth_oauth_app_dist_web = __webpack_require__(2352);
// EXTERNAL MODULE: ./node_modules/deprecation/dist-web/index.js
var deprecation_dist_web = __webpack_require__(2327);
;// CONCATENATED MODULE: ./node_modules/universal-github-app-jwt/dist-web/index.bundled.js
function t(t,n,r,e,i,a,o){try{var u=t[a](o),c=u.value}catch(t){return void r(t)}u.done?n(c):Promise.resolve(c).then(e,i)}function n(n){return function(){var r=this,e=arguments;return new Promise((function(i,a){var o=n.apply(r,e);function u(n){t(o,i,a,u,c,"next",n)}function c(n){t(o,i,a,u,c,"throw",n)}u(void 0)}))}}function r(t){for(var n=new ArrayBuffer(t.length),r=new Uint8Array(n),e=0,i=t.length;e<i;e++)r[e]=t.charCodeAt(e);return n}function e(t){return t.replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function i(t){return e(btoa(JSON.stringify(t)))}var a=function(){var t=n((function*(t){var{privateKey:n,payload:a}=t;if(/BEGIN RSA PRIVATE KEY/.test(n))throw new Error("[universal-github-app-jwt] Private Key is in PKCS#1 format, but only PKCS#8 is supported. See https://github.com/gr2m/universal-github-app-jwt#readme");var o,u={name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}},c=(o=n.trim().split("\n").slice(1,-1).join(""),r(atob(o))),p=yield crypto.subtle.importKey("pkcs8",c,u,!1,["sign"]),f=function(t,n){return"".concat(i(t),".").concat(i(n))}({alg:"RS256",typ:"JWT"},a),l=r(f),s=function(t){for(var n="",r=new Uint8Array(t),i=r.byteLength,a=0;a<i;a++)n+=String.fromCharCode(r[a]);return e(btoa(n))}(yield crypto.subtle.sign(u.name,p,l));return"".concat(f,".").concat(s)}));return function(n){return t.apply(this,arguments)}}();function o(t){return u.apply(this,arguments)}function u(){return(u=n((function*(t){var{id:n,privateKey:r,now:e=Math.floor(Date.now()/1e3)}=t,i=e-30,o=i+600,u={iat:i,exp:o,iss:n};return{appId:n,expiration:o,token:yield a({privateKey:r,payload:u})}}))).apply(this,arguments)}
//# sourceMappingURL=index.bundled.js.map

// EXTERNAL MODULE: ./node_modules/lru-cache/index.js
var lru_cache = __webpack_require__(9593);
var lru_cache_default = /*#__PURE__*/__webpack_require__.n(lru_cache);
// EXTERNAL MODULE: ./node_modules/@octokit/auth-oauth-user/dist-web/index.js + 1 modules
var auth_oauth_user_dist_web = __webpack_require__(9925);
;// CONCATENATED MODULE: ./node_modules/@octokit/auth-app/dist-web/index.js









async function getAppAuthentication({ appId, privateKey, timeDifference, }) {
    try {
        const appAuthentication = await o({
            id: +appId,
            privateKey,
            now: timeDifference && Math.floor(Date.now() / 1000) + timeDifference,
        });
        return {
            type: "app",
            token: appAuthentication.token,
            appId: appAuthentication.appId,
            expiresAt: new Date(appAuthentication.expiration * 1000).toISOString(),
        };
    }
    catch (error) {
        if (privateKey === "-----BEGIN RSA PRIVATE KEY-----") {
            throw new Error("The 'privateKey` option contains only the first line '-----BEGIN RSA PRIVATE KEY-----'. If you are setting it using a `.env` file, make sure it is set on a single line with newlines replaced by '\n'");
        }
        else {
            throw error;
        }
    }
}

// https://github.com/isaacs/node-lru-cache#readme
function getCache() {
    return new (lru_cache_default())({
        // cache max. 15000 tokens, that will use less than 10mb memory
        max: 15000,
        // Cache for 1 minute less than GitHub expiry
        maxAge: 1000 * 60 * 59,
    });
}
async function get(cache, options) {
    const cacheKey = optionsToCacheKey(options);
    const result = await cache.get(cacheKey);
    if (!result) {
        return;
    }
    const [token, createdAt, expiresAt, repositorySelection, permissionsString, singleFileName,] = result.split("|");
    const permissions = options.permissions ||
        permissionsString.split(/,/).reduce((permissions, string) => {
            if (/!$/.test(string)) {
                permissions[string.slice(0, -1)] = "write";
            }
            else {
                permissions[string] = "read";
            }
            return permissions;
        }, {});
    return {
        token,
        createdAt,
        expiresAt,
        permissions,
        repositoryIds: options.repositoryIds,
        repositoryNames: options.repositoryNames,
        singleFileName,
        repositorySelection: repositorySelection,
    };
}
async function set(cache, options, data) {
    const key = optionsToCacheKey(options);
    const permissionsString = options.permissions
        ? ""
        : Object.keys(data.permissions)
            .map((name) => `${name}${data.permissions[name] === "write" ? "!" : ""}`)
            .join(",");
    const value = [
        data.token,
        data.createdAt,
        data.expiresAt,
        data.repositorySelection,
        permissionsString,
        data.singleFileName,
    ].join("|");
    await cache.set(key, value);
}
function optionsToCacheKey({ installationId, permissions = {}, repositoryIds = [], repositoryNames = [], }) {
    const permissionsString = Object.keys(permissions)
        .sort()
        .map((name) => (permissions[name] === "read" ? name : `${name}!`))
        .join(",");
    const repositoryIdsString = repositoryIds.sort().join(",");
    const repositoryNamesString = repositoryNames.join(",");
    return [
        installationId,
        repositoryIdsString,
        repositoryNamesString,
        permissionsString,
    ]
        .filter(Boolean)
        .join("|");
}

function toTokenAuthentication({ installationId, token, createdAt, expiresAt, repositorySelection, permissions, repositoryIds, repositoryNames, singleFileName, }) {
    return Object.assign({
        type: "token",
        tokenType: "installation",
        token,
        installationId,
        permissions,
        createdAt,
        expiresAt,
        repositorySelection,
    }, repositoryIds ? { repositoryIds } : null, repositoryNames ? { repositoryNames } : null, singleFileName ? { singleFileName } : null);
}

async function getInstallationAuthentication(state, options, customRequest) {
    const installationId = Number(options.installationId || state.installationId);
    if (!installationId) {
        throw new Error("[@octokit/auth-app] installationId option is required for installation authentication.");
    }
    if (options.factory) {
        const { type, factory, oauthApp, ...factoryAuthOptions } = {
            ...state,
            ...options,
        };
        // @ts-expect-error if `options.factory` is set, the return type for `auth()` should be `Promise<ReturnType<options.factory>>`
        return factory(factoryAuthOptions);
    }
    const optionsWithInstallationTokenFromState = Object.assign({ installationId }, options);
    if (!options.refresh) {
        const result = await get(state.cache, optionsWithInstallationTokenFromState);
        if (result) {
            const { token, createdAt, expiresAt, permissions, repositoryIds, repositoryNames, singleFileName, repositorySelection, } = result;
            return toTokenAuthentication({
                installationId,
                token,
                createdAt,
                expiresAt,
                permissions,
                repositorySelection,
                repositoryIds,
                repositoryNames,
                singleFileName,
            });
        }
    }
    const appAuthentication = await getAppAuthentication(state);
    const request = customRequest || state.request;
    const { data: { token, expires_at: expiresAt, repositories, permissions: permissionsOptional, repository_selection: repositorySelectionOptional, single_file: singleFileName, }, } = await request("POST /app/installations/{installation_id}/access_tokens", {
        installation_id: installationId,
        repository_ids: options.repositoryIds,
        repositories: options.repositoryNames,
        permissions: options.permissions,
        mediaType: {
            previews: ["machine-man"],
        },
        headers: {
            authorization: `bearer ${appAuthentication.token}`,
        },
    });
    /* istanbul ignore next - permissions are optional per OpenAPI spec, but we think that is incorrect */
    const permissions = permissionsOptional || {};
    /* istanbul ignore next - repositorySelection are optional per OpenAPI spec, but we think that is incorrect */
    const repositorySelection = repositorySelectionOptional || "all";
    const repositoryIds = repositories
        ? repositories.map((r) => r.id)
        : void 0;
    const repositoryNames = repositories
        ? repositories.map((repo) => repo.name)
        : void 0;
    const createdAt = new Date().toISOString();
    await set(state.cache, optionsWithInstallationTokenFromState, {
        token,
        createdAt,
        expiresAt,
        repositorySelection,
        permissions,
        repositoryIds,
        repositoryNames,
        singleFileName,
    });
    return toTokenAuthentication({
        installationId,
        token,
        createdAt,
        expiresAt,
        repositorySelection,
        permissions,
        repositoryIds,
        repositoryNames,
        singleFileName,
    });
}

async function auth(state, authOptions) {
    switch (authOptions.type) {
        case "app":
            return getAppAuthentication(state);
        // @ts-expect-error "oauth" is not supperted in types
        case "oauth":
            state.log.warn(
            // @ts-expect-error `log.warn()` expects string
            new deprecation_dist_web/* Deprecation */.$(`[@octokit/auth-app] {type: "oauth"} is deprecated. Use {type: "oauth-app"} instead`));
        case "oauth-app":
            return state.oauthApp({ type: "oauth-app" });
        case "installation":
            return getInstallationAuthentication(state, {
                ...authOptions,
                type: "installation",
            });
        case "oauth-user":
            // @ts-expect-error TODO: infer correct auth options type based on type. authOptions should be typed as "WebFlowAuthOptions | OAuthAppDeviceFlowAuthOptions | GitHubAppDeviceFlowAuthOptions"
            return state.oauthApp(authOptions);
        default:
            // @ts-expect-error type is "never" at this point
            throw new Error(`Invalid auth type: ${authOptions.type}`);
    }
}

const PATHS = [
    "/app",
    "/app/hook/config",
    "/app/hook/deliveries",
    "/app/hook/deliveries/{delivery_id}",
    "/app/hook/deliveries/{delivery_id}/attempts",
    "/app/installations",
    "/app/installations/{installation_id}",
    "/app/installations/{installation_id}/access_tokens",
    "/app/installations/{installation_id}/suspended",
    "/marketplace_listing/accounts/{account_id}",
    "/marketplace_listing/plan",
    "/marketplace_listing/plans",
    "/marketplace_listing/plans/{plan_id}/accounts",
    "/marketplace_listing/stubbed/accounts/{account_id}",
    "/marketplace_listing/stubbed/plan",
    "/marketplace_listing/stubbed/plans",
    "/marketplace_listing/stubbed/plans/{plan_id}/accounts",
    "/orgs/{org}/installation",
    "/repos/{owner}/{repo}/installation",
    "/users/{username}/installation",
];
// CREDIT: Simon Grondin (https://github.com/SGrondin)
// https://github.com/octokit/plugin-throttling.js/blob/45c5d7f13b8af448a9dbca468d9c9150a73b3948/lib/route-matcher.js
function routeMatcher(paths) {
    // EXAMPLE. For the following paths:
    /* [
        "/orgs/{org}/invitations",
        "/repos/{owner}/{repo}/collaborators/{username}"
    ] */
    const regexes = paths.map((p) => p
        .split("/")
        .map((c) => (c.startsWith("{") ? "(?:.+?)" : c))
        .join("/"));
    // 'regexes' would contain:
    /* [
        '/orgs/(?:.+?)/invitations',
        '/repos/(?:.+?)/(?:.+?)/collaborators/(?:.+?)'
    ] */
    const regex = `^(?:${regexes.map((r) => `(?:${r})`).join("|")})[^/]*$`;
    // 'regex' would contain:
    /*
      ^(?:(?:\/orgs\/(?:.+?)\/invitations)|(?:\/repos\/(?:.+?)\/(?:.+?)\/collaborators\/(?:.+?)))[^\/]*$
  
      It may look scary, but paste it into https://www.debuggex.com/
      and it will make a lot more sense!
    */
    return new RegExp(regex, "i");
}
const REGEX = routeMatcher(PATHS);
function requiresAppAuth(url) {
    return !!url && REGEX.test(url);
}

const FIVE_SECONDS_IN_MS = 5 * 1000;
function isNotTimeSkewError(error) {
    return !(error.message.match(/'Expiration time' claim \('exp'\) must be a numeric value representing the future time at which the assertion expires/) ||
        error.message.match(/'Issued at' claim \('iat'\) must be an Integer representing the time that the assertion was issued/));
}
async function hook(state, request, route, parameters) {
    const endpoint = request.endpoint.merge(route, parameters);
    const url = endpoint.url;
    // Do not intercept request to retrieve a new token
    if (/\/login\/oauth\/access_token$/.test(url)) {
        return request(endpoint);
    }
    if (requiresAppAuth(url.replace(request.endpoint.DEFAULTS.baseUrl, ""))) {
        const { token } = await getAppAuthentication(state);
        endpoint.headers.authorization = `bearer ${token}`;
        let response;
        try {
            response = await request(endpoint);
        }
        catch (error) {
            // If there's an issue with the expiration, regenerate the token and try again.
            // Otherwise rethrow the error for upstream handling.
            if (isNotTimeSkewError(error)) {
                throw error;
            }
            // If the date header is missing, we can't correct the system time skew.
            // Throw the error to be handled upstream.
            if (typeof error.response.headers.date === "undefined") {
                throw error;
            }
            const diff = Math.floor((Date.parse(error.response.headers.date) -
                Date.parse(new Date().toString())) /
                1000);
            state.log.warn(error.message);
            state.log.warn(`[@octokit/auth-app] GitHub API time and system time are different by ${diff} seconds. Retrying request with the difference accounted for.`);
            const { token } = await getAppAuthentication({
                ...state,
                timeDifference: diff,
            });
            endpoint.headers.authorization = `bearer ${token}`;
            return request(endpoint);
        }
        return response;
    }
    if ((0,auth_oauth_user_dist_web.requiresBasicAuth)(url)) {
        const authentication = await state.oauthApp({ type: "oauth-app" });
        endpoint.headers.authorization = authentication.headers.authorization;
        return request(endpoint);
    }
    const { token, createdAt } = await getInstallationAuthentication(state, 
    // @ts-expect-error TBD
    {}, request);
    endpoint.headers.authorization = `token ${token}`;
    return sendRequestWithRetries(state, request, endpoint, createdAt);
}
/**
 * Newly created tokens might not be accessible immediately after creation.
 * In case of a 401 response, we retry with an exponential delay until more
 * than five seconds pass since the creation of the token.
 *
 * @see https://github.com/octokit/auth-app.js/issues/65
 */
async function sendRequestWithRetries(state, request, options, createdAt, retries = 0) {
    const timeSinceTokenCreationInMs = +new Date() - +new Date(createdAt);
    try {
        return await request(options);
    }
    catch (error) {
        if (error.status !== 401) {
            throw error;
        }
        if (timeSinceTokenCreationInMs >= FIVE_SECONDS_IN_MS) {
            if (retries > 0) {
                error.message = `After ${retries} retries within ${timeSinceTokenCreationInMs / 1000}s of creating the installation access token, the response remains 401. At this point, the cause may be an authentication problem or a system outage. Please check https://www.githubstatus.com for status information`;
            }
            throw error;
        }
        ++retries;
        const awaitTime = retries * 1000;
        state.log.warn(`[@octokit/auth-app] Retrying after 401 response to account for token replication delay (retry: ${retries}, wait: ${awaitTime / 1000}s)`);
        await new Promise((resolve) => setTimeout(resolve, awaitTime));
        return sendRequestWithRetries(state, request, options, createdAt, retries);
    }
}

const VERSION = "4.0.6";

function createAppAuth(options) {
    if (!options.appId) {
        throw new Error("[@octokit/auth-app] appId option is required");
    }
    if (!Number.isFinite(+options.appId)) {
        throw new Error("[@octokit/auth-app] appId option must be a number or numeric string");
    }
    if (!options.privateKey) {
        throw new Error("[@octokit/auth-app] privateKey option is required");
    }
    if ("installationId" in options && !options.installationId) {
        throw new Error("[@octokit/auth-app] installationId is set to a falsy value");
    }
    const log = Object.assign({
        warn: console.warn.bind(console),
    }, options.log);
    const request$1 = options.request ||
        request_dist_web.request.defaults({
            headers: {
                "user-agent": `octokit-auth-app.js/${VERSION} ${(0,dist_web.getUserAgent)()}`,
            },
        });
    const state = Object.assign({
        request: request$1,
        cache: getCache(),
    }, options, options.installationId
        ? { installationId: Number(options.installationId) }
        : {}, {
        log,
        oauthApp: (0,auth_oauth_app_dist_web.createOAuthAppAuth)({
            clientType: "github-app",
            clientId: options.clientId || "",
            clientSecret: options.clientSecret || "",
            request: request$1,
        }),
    });
    // @ts-expect-error not worth the extra code to appease TS
    return Object.assign(auth.bind(null, state), {
        hook: hook.bind(null, state),
    });
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 2352:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createOAuthAppAuth": function() { return /* binding */ createOAuthAppAuth; },
/* harmony export */   "createOAuthUserAuth": function() { return /* reexport safe */ _octokit_auth_oauth_user__WEBPACK_IMPORTED_MODULE_1__.createOAuthUserAuth; }
/* harmony export */ });
/* harmony import */ var universal_user_agent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(350);
/* harmony import */ var _octokit_request__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2363);
/* harmony import */ var btoa_lite__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1483);
/* harmony import */ var btoa_lite__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(btoa_lite__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit_auth_oauth_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9925);






async function auth(state, authOptions) {
    if (authOptions.type === "oauth-app") {
        return {
            type: "oauth-app",
            clientId: state.clientId,
            clientSecret: state.clientSecret,
            clientType: state.clientType,
            headers: {
                authorization: `basic ${btoa_lite__WEBPACK_IMPORTED_MODULE_0___default()(`${state.clientId}:${state.clientSecret}`)}`,
            },
        };
    }
    if ("factory" in authOptions) {
        const { type, ...options } = {
            ...authOptions,
            ...state,
        };
        // @ts-expect-error TODO: `option` cannot be never, is this a bug?
        return authOptions.factory(options);
    }
    const common = {
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        request: state.request,
        ...authOptions,
    };
    // TS: Look what you made me do
    const userAuth = state.clientType === "oauth-app"
        ? await (0,_octokit_auth_oauth_user__WEBPACK_IMPORTED_MODULE_1__.createOAuthUserAuth)({
            ...common,
            clientType: state.clientType,
        })
        : await (0,_octokit_auth_oauth_user__WEBPACK_IMPORTED_MODULE_1__.createOAuthUserAuth)({
            ...common,
            clientType: state.clientType,
        });
    return userAuth();
}

async function hook(state, request, route, parameters) {
    let endpoint = request.endpoint.merge(route, parameters);
    // Do not intercept OAuth Web/Device flow request
    if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint.url)) {
        return request(endpoint);
    }
    if (state.clientType === "github-app" && !(0,_octokit_auth_oauth_user__WEBPACK_IMPORTED_MODULE_1__.requiresBasicAuth)(endpoint.url)) {
        throw new Error(`[@octokit/auth-oauth-app] GitHub Apps cannot use their client ID/secret for basic authentication for endpoints other than "/applications/{client_id}/**". "${endpoint.method} ${endpoint.url}" is not supported.`);
    }
    const credentials = btoa_lite__WEBPACK_IMPORTED_MODULE_0___default()(`${state.clientId}:${state.clientSecret}`);
    endpoint.headers.authorization = `basic ${credentials}`;
    try {
        return await request(endpoint);
    }
    catch (error) {
        /* istanbul ignore if */
        if (error.status !== 401)
            throw error;
        error.message = `[@octokit/auth-oauth-app] "${endpoint.method} ${endpoint.url}" does not support clientId/clientSecret basic authentication.`;
        throw error;
    }
}

const VERSION = "5.0.3";

function createOAuthAppAuth(options) {
    const state = Object.assign({
        request: _octokit_request__WEBPACK_IMPORTED_MODULE_2__.request.defaults({
            headers: {
                "user-agent": `octokit-auth-oauth-app.js/${VERSION} ${(0,universal_user_agent__WEBPACK_IMPORTED_MODULE_3__.getUserAgent)()}`,
            },
        }),
        clientType: "oauth-app",
    }, options);
    // @ts-expect-error not worth the extra code to appease TS
    return Object.assign(auth.bind(null, state), {
        hook: hook.bind(null, state),
    });
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 9925:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "createOAuthUserAuth": function() { return /* binding */ createOAuthUserAuth; },
  "requiresBasicAuth": function() { return /* binding */ requiresBasicAuth; }
});

// EXTERNAL MODULE: ./node_modules/universal-user-agent/dist-web/index.js
var dist_web = __webpack_require__(350);
// EXTERNAL MODULE: ./node_modules/@octokit/request/dist-web/index.js + 2 modules
var request_dist_web = __webpack_require__(2363);
// EXTERNAL MODULE: ./node_modules/@octokit/oauth-methods/dist-node/index.js
var dist_node = __webpack_require__(2272);
;// CONCATENATED MODULE: ./node_modules/@octokit/auth-oauth-device/dist-web/index.js




async function getOAuthAccessToken(state, options) {
    const cachedAuthentication = getCachedAuthentication(state, options.auth);
    if (cachedAuthentication)
        return cachedAuthentication;
    // Step 1: Request device and user codes
    // https://docs.github.com/en/developers/apps/authorizing-oauth-apps#step-1-app-requests-the-device-and-user-verification-codes-from-github
    const { data: verification } = await (0,dist_node.createDeviceCode)({
        clientType: state.clientType,
        clientId: state.clientId,
        request: options.request || state.request,
        // @ts-expect-error the extra code to make TS happy is not worth it
        scopes: options.auth.scopes || state.scopes,
    });
    // Step 2: User must enter the user code on https://github.com/login/device
    // See https://docs.github.com/en/developers/apps/authorizing-oauth-apps#step-2-prompt-the-user-to-enter-the-user-code-in-a-browser
    await state.onVerification(verification);
    // Step 3: Exchange device code for access token
    // See https://docs.github.com/en/developers/apps/authorizing-oauth-apps#step-3-app-polls-github-to-check-if-the-user-authorized-the-device
    const authentication = await waitForAccessToken(options.request || state.request, state.clientId, state.clientType, verification);
    state.authentication = authentication;
    return authentication;
}
function getCachedAuthentication(state, auth) {
    if (auth.refresh === true)
        return false;
    if (!state.authentication)
        return false;
    if (state.clientType === "github-app") {
        return state.authentication;
    }
    const authentication = state.authentication;
    const newScope = (("scopes" in auth && auth.scopes) || state.scopes).join(" ");
    const currentScope = authentication.scopes.join(" ");
    return newScope === currentScope ? authentication : false;
}
async function wait(seconds) {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
async function waitForAccessToken(request, clientId, clientType, verification) {
    try {
        const options = {
            clientId,
            request,
            code: verification.device_code,
        };
        // WHY TYPESCRIPT WHY ARE YOU DOING THIS TO ME
        const { authentication } = clientType === "oauth-app"
            ? await (0,dist_node.exchangeDeviceCode)({
                ...options,
                clientType: "oauth-app",
            })
            : await (0,dist_node.exchangeDeviceCode)({
                ...options,
                clientType: "github-app",
            });
        return {
            type: "token",
            tokenType: "oauth",
            ...authentication,
        };
    }
    catch (error) {
        // istanbul ignore if
        // @ts-ignore
        if (!error.response)
            throw error;
        // @ts-ignore
        const errorType = error.response.data.error;
        if (errorType === "authorization_pending") {
            await wait(verification.interval);
            return waitForAccessToken(request, clientId, clientType, verification);
        }
        if (errorType === "slow_down") {
            await wait(verification.interval + 5);
            return waitForAccessToken(request, clientId, clientType, verification);
        }
        throw error;
    }
}

async function auth(state, authOptions) {
    return getOAuthAccessToken(state, {
        auth: authOptions,
    });
}

async function hook(state, request, route, parameters) {
    let endpoint = request.endpoint.merge(route, parameters);
    // Do not intercept request to retrieve codes or token
    if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint.url)) {
        return request(endpoint);
    }
    const { token } = await getOAuthAccessToken(state, {
        request,
        auth: { type: "oauth" },
    });
    endpoint.headers.authorization = `token ${token}`;
    return request(endpoint);
}

const VERSION = "4.0.2";

function createOAuthDeviceAuth(options) {
    const requestWithDefaults = options.request ||
        request_dist_web.request.defaults({
            headers: {
                "user-agent": `octokit-auth-oauth-device.js/${VERSION} ${(0,dist_web.getUserAgent)()}`,
            },
        });
    const { request: request$1 = requestWithDefaults, ...otherOptions } = options;
    const state = options.clientType === "github-app"
        ? {
            ...otherOptions,
            clientType: "github-app",
            request: request$1,
        }
        : {
            ...otherOptions,
            clientType: "oauth-app",
            request: request$1,
            scopes: options.scopes || [],
        };
    if (!options.clientId) {
        throw new Error('[@octokit/auth-oauth-device] "clientId" option must be set (https://github.com/octokit/auth-oauth-device.js#usage)');
    }
    if (!options.onVerification) {
        throw new Error('[@octokit/auth-oauth-device] "onVerification" option must be a function (https://github.com/octokit/auth-oauth-device.js#usage)');
    }
    // @ts-ignore too much for tsc / ts-jest ¯\_(ツ)_/¯
    return Object.assign(auth.bind(null, state), {
        hook: hook.bind(null, state),
    });
}


//# sourceMappingURL=index.js.map

// EXTERNAL MODULE: ./node_modules/btoa-lite/btoa-browser.js
var btoa_browser = __webpack_require__(1483);
var btoa_browser_default = /*#__PURE__*/__webpack_require__.n(btoa_browser);
;// CONCATENATED MODULE: ./node_modules/@octokit/auth-oauth-user/dist-web/index.js






const dist_web_VERSION = "2.0.3";

// @ts-nocheck there is only place for one of us in this file. And it's not you, TS
async function getAuthentication(state) {
    // handle code exchange form OAuth Web Flow
    if ("code" in state.strategyOptions) {
        const { authentication } = await (0,dist_node.exchangeWebFlowCode)({
            clientId: state.clientId,
            clientSecret: state.clientSecret,
            clientType: state.clientType,
            ...state.strategyOptions,
            request: state.request,
        });
        return {
            type: "token",
            tokenType: "oauth",
            ...authentication,
        };
    }
    // handle OAuth device flow
    if ("onVerification" in state.strategyOptions) {
        const deviceAuth = createOAuthDeviceAuth({
            clientType: state.clientType,
            clientId: state.clientId,
            ...state.strategyOptions,
            request: state.request,
        });
        const authentication = await deviceAuth({
            type: "oauth",
        });
        return {
            clientSecret: state.clientSecret,
            ...authentication,
        };
    }
    // use existing authentication
    if ("token" in state.strategyOptions) {
        return {
            type: "token",
            tokenType: "oauth",
            clientId: state.clientId,
            clientSecret: state.clientSecret,
            clientType: state.clientType,
            ...state.strategyOptions,
        };
    }
    throw new Error("[@octokit/auth-oauth-user] Invalid strategy options");
}

async function dist_web_auth(state, options = {}) {
    if (!state.authentication) {
        // This is what TS makes us do ¯\_(ツ)_/¯
        state.authentication =
            state.clientType === "oauth-app"
                ? await getAuthentication(state)
                : await getAuthentication(state);
    }
    if (state.authentication.invalid) {
        throw new Error("[@octokit/auth-oauth-user] Token is invalid");
    }
    const currentAuthentication = state.authentication;
    // (auto) refresh for user-to-server tokens
    if ("expiresAt" in currentAuthentication) {
        if (options.type === "refresh" ||
            new Date(currentAuthentication.expiresAt) < new Date()) {
            const { authentication } = await (0,dist_node.refreshToken)({
                clientType: "github-app",
                clientId: state.clientId,
                clientSecret: state.clientSecret,
                refreshToken: currentAuthentication.refreshToken,
                request: state.request,
            });
            state.authentication = {
                tokenType: "oauth",
                type: "token",
                ...authentication,
            };
        }
    }
    // throw error for invalid refresh call
    if (options.type === "refresh") {
        if (state.clientType === "oauth-app") {
            throw new Error("[@octokit/auth-oauth-user] OAuth Apps do not support expiring tokens");
        }
        if (!currentAuthentication.hasOwnProperty("expiresAt")) {
            throw new Error("[@octokit/auth-oauth-user] Refresh token missing");
        }
    }
    // check or reset token
    if (options.type === "check" || options.type === "reset") {
        const method = options.type === "check" ? dist_node.checkToken : dist_node.resetToken;
        try {
            const { authentication } = await method({
                // @ts-expect-error making TS happy would require unnecessary code so no
                clientType: state.clientType,
                clientId: state.clientId,
                clientSecret: state.clientSecret,
                token: state.authentication.token,
                request: state.request,
            });
            state.authentication = {
                tokenType: "oauth",
                type: "token",
                // @ts-expect-error TBD
                ...authentication,
            };
            return state.authentication;
        }
        catch (error) {
            // istanbul ignore else
            if (error.status === 404) {
                error.message = "[@octokit/auth-oauth-user] Token is invalid";
                // @ts-expect-error TBD
                state.authentication.invalid = true;
            }
            throw error;
        }
    }
    // invalidate
    if (options.type === "delete" || options.type === "deleteAuthorization") {
        const method = options.type === "delete" ? dist_node.deleteToken : dist_node.deleteAuthorization;
        try {
            await method({
                // @ts-expect-error making TS happy would require unnecessary code so no
                clientType: state.clientType,
                clientId: state.clientId,
                clientSecret: state.clientSecret,
                token: state.authentication.token,
                request: state.request,
            });
        }
        catch (error) {
            // istanbul ignore if
            if (error.status !== 404)
                throw error;
        }
        state.authentication.invalid = true;
        return state.authentication;
    }
    return state.authentication;
}

/**
 * The following endpoints require an OAuth App to authenticate using its client_id and client_secret.
 *
 * - [`POST /applications/{client_id}/token`](https://docs.github.com/en/rest/reference/apps#check-a-token) - Check a token
 * - [`PATCH /applications/{client_id}/token`](https://docs.github.com/en/rest/reference/apps#reset-a-token) - Reset a token
 * - [`POST /applications/{client_id}/token/scoped`](https://docs.github.com/en/rest/reference/apps#create-a-scoped-access-token) - Create a scoped access token
 * - [`DELETE /applications/{client_id}/token`](https://docs.github.com/en/rest/reference/apps#delete-an-app-token) - Delete an app token
 * - [`DELETE /applications/{client_id}/grant`](https://docs.github.com/en/rest/reference/apps#delete-an-app-authorization) - Delete an app authorization
 *
 * deprecated:
 *
 * - [`GET /applications/{client_id}/tokens/{access_token}`](https://docs.github.com/en/rest/reference/apps#check-an-authorization) - Check an authorization
 * - [`POST /applications/{client_id}/tokens/{access_token}`](https://docs.github.com/en/rest/reference/apps#reset-an-authorization) - Reset an authorization
 * - [`DELETE /applications/{client_id}/tokens/{access_token}`](https://docs.github.com/en/rest/reference/apps#revoke-an-authorization-for-an-application) - Revoke an authorization for an application
 * - [`DELETE /applications/{client_id}/grants/{access_token}`](https://docs.github.com/en/rest/reference/apps#revoke-a-grant-for-an-application) - Revoke a grant for an application
 */
const ROUTES_REQUIRING_BASIC_AUTH = /\/applications\/[^/]+\/(token|grant)s?/;
function requiresBasicAuth(url) {
    return url && ROUTES_REQUIRING_BASIC_AUTH.test(url);
}

async function dist_web_hook(state, request, route, parameters = {}) {
    const endpoint = request.endpoint.merge(route, parameters);
    // Do not intercept OAuth Web/Device flow request
    if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint.url)) {
        return request(endpoint);
    }
    if (requiresBasicAuth(endpoint.url)) {
        const credentials = btoa_browser_default()(`${state.clientId}:${state.clientSecret}`);
        endpoint.headers.authorization = `basic ${credentials}`;
        return request(endpoint);
    }
    // TS makes us do this ¯\_(ツ)_/¯
    const { token } = state.clientType === "oauth-app"
        ? await dist_web_auth({ ...state, request })
        : await dist_web_auth({ ...state, request });
    endpoint.headers.authorization = "token " + token;
    return request(endpoint);
}

function createOAuthUserAuth({ clientId, clientSecret, clientType = "oauth-app", request: request$1 = request_dist_web.request.defaults({
    headers: {
        "user-agent": `octokit-auth-oauth-app.js/${dist_web_VERSION} ${(0,dist_web.getUserAgent)()}`,
    },
}), ...strategyOptions }) {
    const state = Object.assign({
        clientType,
        clientId,
        clientSecret,
        strategyOptions,
        request: request$1,
    });
    // @ts-expect-error not worth the extra code needed to appease TS
    return Object.assign(dist_web_auth.bind(null, state), {
        // @ts-expect-error not worth the extra code needed to appease TS
        hook: dist_web_hook.bind(null, state),
    });
}
createOAuthUserAuth.VERSION = dist_web_VERSION;


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 5643:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createUnauthenticatedAuth": function() { return /* binding */ createUnauthenticatedAuth; }
/* harmony export */ });
async function auth(reason) {
    return {
        type: "unauthenticated",
        reason,
    };
}

function isRateLimitError(error) {
    if (error.status !== 403) {
        return false;
    }
    /* istanbul ignore if */
    if (!error.response) {
        return false;
    }
    return error.response.headers["x-ratelimit-remaining"] === "0";
}

const REGEX_ABUSE_LIMIT_MESSAGE = /\babuse\b/i;
function isAbuseLimitError(error) {
    if (error.status !== 403) {
        return false;
    }
    return REGEX_ABUSE_LIMIT_MESSAGE.test(error.message);
}

async function hook(reason, request, route, parameters) {
    const endpoint = request.endpoint.merge(route, parameters);
    return request(endpoint).catch((error) => {
        if (error.status === 404) {
            error.message = `Not found. May be due to lack of authentication. Reason: ${reason}`;
            throw error;
        }
        if (isRateLimitError(error)) {
            error.message = `API rate limit exceeded. This maybe caused by the lack of authentication. Reason: ${reason}`;
            throw error;
        }
        if (isAbuseLimitError(error)) {
            error.message = `You have triggered an abuse detection mechanism. This maybe caused by the lack of authentication. Reason: ${reason}`;
            throw error;
        }
        if (error.status === 401) {
            error.message = `Unauthorized. "${endpoint.method} ${endpoint.url}" failed most likely due to lack of authentication. Reason: ${reason}`;
            throw error;
        }
        if (error.status >= 400 && error.status < 500) {
            error.message = error.message.replace(/\.?$/, `. May be caused by lack of authentication (${reason}).`);
        }
        throw error;
    });
}

const createUnauthenticatedAuth = function createUnauthenticatedAuth(options) {
    if (!options || !options.reason) {
        throw new Error("[@octokit/auth-unauthenticated] No reason passed to createUnauthenticatedAuth");
    }
    return Object.assign(auth.bind(null, options.reason), {
        hook: hook.bind(null, options.reason),
    });
};


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6027:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Octokit": function() { return /* binding */ Octokit; }
});

// EXTERNAL MODULE: ./node_modules/universal-user-agent/dist-web/index.js
var dist_web = __webpack_require__(350);
// EXTERNAL MODULE: ./node_modules/before-after-hook/index.js
var before_after_hook = __webpack_require__(5186);
// EXTERNAL MODULE: ./node_modules/@octokit/request/dist-web/index.js + 2 modules
var request_dist_web = __webpack_require__(2363);
;// CONCATENATED MODULE: ./node_modules/@octokit/graphql/dist-web/index.js



const VERSION = "5.0.1";

function _buildMessageForResponseErrors(data) {
    return (`Request failed due to following response errors:\n` +
        data.errors.map((e) => ` - ${e.message}`).join("\n"));
}
class GraphqlResponseError extends Error {
    constructor(request, headers, response) {
        super(_buildMessageForResponseErrors(response));
        this.request = request;
        this.headers = headers;
        this.response = response;
        this.name = "GraphqlResponseError";
        // Expose the errors and response data in their shorthand properties.
        this.errors = response.errors;
        this.data = response.data;
        // Maintains proper stack trace (only available on V8)
        /* istanbul ignore next */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

const NON_VARIABLE_OPTIONS = [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "query",
    "mediaType",
];
const FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
const GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request, query, options) {
    if (options) {
        if (typeof query === "string" && "query" in options) {
            return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
        }
        for (const key in options) {
            if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key))
                continue;
            return Promise.reject(new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`));
        }
    }
    const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
    const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
        if (NON_VARIABLE_OPTIONS.includes(key)) {
            result[key] = parsedOptions[key];
            return result;
        }
        if (!result.variables) {
            result.variables = {};
        }
        result.variables[key] = parsedOptions[key];
        return result;
    }, {});
    // workaround for GitHub Enterprise baseUrl set with /api/v3 suffix
    // https://github.com/octokit/auth-app.js/issues/111#issuecomment-657610451
    const baseUrl = parsedOptions.baseUrl || request.endpoint.DEFAULTS.baseUrl;
    if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
        requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
    }
    return request(requestOptions).then((response) => {
        if (response.data.errors) {
            const headers = {};
            for (const key of Object.keys(response.headers)) {
                headers[key] = response.headers[key];
            }
            throw new GraphqlResponseError(requestOptions, headers, response.data);
        }
        return response.data.data;
    });
}

function withDefaults(request$1, newDefaults) {
    const newRequest = request$1.defaults(newDefaults);
    const newApi = (query, options) => {
        return graphql(newRequest, query, options);
    };
    return Object.assign(newApi, {
        defaults: withDefaults.bind(null, newRequest),
        endpoint: request_dist_web.request.endpoint,
    });
}

const graphql$1 = withDefaults(request_dist_web.request, {
    headers: {
        "user-agent": `octokit-graphql.js/${VERSION} ${(0,dist_web.getUserAgent)()}`,
    },
    method: "POST",
    url: "/graphql",
});
function withCustomRequest(customRequest) {
    return withDefaults(customRequest, {
        method: "POST",
        url: "/graphql",
    });
}


//# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./node_modules/@octokit/auth-token/dist-web/index.js
const REGEX_IS_INSTALLATION_LEGACY = /^v1\./;
const REGEX_IS_INSTALLATION = /^ghs_/;
const REGEX_IS_USER_TO_SERVER = /^ghu_/;
async function auth(token) {
    const isApp = token.split(/\./).length === 3;
    const isInstallation = REGEX_IS_INSTALLATION_LEGACY.test(token) ||
        REGEX_IS_INSTALLATION.test(token);
    const isUserToServer = REGEX_IS_USER_TO_SERVER.test(token);
    const tokenType = isApp
        ? "app"
        : isInstallation
            ? "installation"
            : isUserToServer
                ? "user-to-server"
                : "oauth";
    return {
        type: "token",
        token: token,
        tokenType,
    };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
    if (token.split(/\./).length === 3) {
        return `bearer ${token}`;
    }
    return `token ${token}`;
}

async function hook(token, request, route, parameters) {
    const endpoint = request.endpoint.merge(route, parameters);
    endpoint.headers.authorization = withAuthorizationPrefix(token);
    return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
    if (!token) {
        throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
    }
    if (typeof token !== "string") {
        throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
    }
    token = token.replace(/^(token|bearer) +/i, "");
    return Object.assign(auth.bind(null, token), {
        hook: hook.bind(null, token),
    });
};


//# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./node_modules/@octokit/core/dist-web/index.js






const dist_web_VERSION = "4.0.5";

class Octokit {
    constructor(options = {}) {
        const hook = new before_after_hook.Collection();
        const requestDefaults = {
            baseUrl: request_dist_web.request.endpoint.DEFAULTS.baseUrl,
            headers: {},
            request: Object.assign({}, options.request, {
                // @ts-ignore internal usage only, no need to type
                hook: hook.bind(null, "request"),
            }),
            mediaType: {
                previews: [],
                format: "",
            },
        };
        // prepend default user agent with `options.userAgent` if set
        requestDefaults.headers["user-agent"] = [
            options.userAgent,
            `octokit-core.js/${dist_web_VERSION} ${(0,dist_web.getUserAgent)()}`,
        ]
            .filter(Boolean)
            .join(" ");
        if (options.baseUrl) {
            requestDefaults.baseUrl = options.baseUrl;
        }
        if (options.previews) {
            requestDefaults.mediaType.previews = options.previews;
        }
        if (options.timeZone) {
            requestDefaults.headers["time-zone"] = options.timeZone;
        }
        this.request = request_dist_web.request.defaults(requestDefaults);
        this.graphql = withCustomRequest(this.request).defaults(requestDefaults);
        this.log = Object.assign({
            debug: () => { },
            info: () => { },
            warn: console.warn.bind(console),
            error: console.error.bind(console),
        }, options.log);
        this.hook = hook;
        // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
        //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registered.
        // (2) If only `options.auth` is set, use the default token authentication strategy.
        // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
        // TODO: type `options.auth` based on `options.authStrategy`.
        if (!options.authStrategy) {
            if (!options.auth) {
                // (1)
                this.auth = async () => ({
                    type: "unauthenticated",
                });
            }
            else {
                // (2)
                const auth = createTokenAuth(options.auth);
                // @ts-ignore  ¯\_(ツ)_/¯
                hook.wrap("request", auth.hook);
                this.auth = auth;
            }
        }
        else {
            const { authStrategy, ...otherOptions } = options;
            const auth = authStrategy(Object.assign({
                request: this.request,
                log: this.log,
                // we pass the current octokit instance as well as its constructor options
                // to allow for authentication strategies that return a new octokit instance
                // that shares the same internal state as the current one. The original
                // requirement for this was the "event-octokit" authentication strategy
                // of https://github.com/probot/octokit-auth-probot.
                octokit: this,
                octokitOptions: otherOptions,
            }, options.auth));
            // @ts-ignore  ¯\_(ツ)_/¯
            hook.wrap("request", auth.hook);
            this.auth = auth;
        }
        // apply plugins
        // https://stackoverflow.com/a/16345172
        const classConstructor = this.constructor;
        classConstructor.plugins.forEach((plugin) => {
            Object.assign(this, plugin(this, options));
        });
    }
    static defaults(defaults) {
        const OctokitWithDefaults = class extends this {
            constructor(...args) {
                const options = args[0] || {};
                if (typeof defaults === "function") {
                    super(defaults(options));
                    return;
                }
                super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent
                    ? {
                        userAgent: `${options.userAgent} ${defaults.userAgent}`,
                    }
                    : null));
            }
        };
        return OctokitWithDefaults;
    }
    /**
     * Attach a plugin (or many) to your Octokit instance.
     *
     * @example
     * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
     */
    static plugin(...newPlugins) {
        var _a;
        const currentPlugins = this.plugins;
        const NewOctokit = (_a = class extends this {
            },
            _a.plugins = currentPlugins.concat(newPlugins.filter((plugin) => !currentPlugins.includes(plugin))),
            _a);
        return NewOctokit;
    }
}
Octokit.VERSION = dist_web_VERSION;
Octokit.plugins = [];


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 7785:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/* provided dependency */ var Buffer = __webpack_require__(1876)["Buffer"];


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var OAuthAppAuth = __webpack_require__(2352);
var core = __webpack_require__(6027);
var universalUserAgent = __webpack_require__(350);
var authOauthUser = __webpack_require__(9925);
var OAuthMethods = __webpack_require__(2272);
var authUnauthenticated = __webpack_require__(5643);
var fromEntries = _interopDefault(__webpack_require__(3405));

const VERSION = "4.1.0";

function addEventHandler(state, eventName, eventHandler) {
  if (Array.isArray(eventName)) {
    for (const singleEventName of eventName) {
      addEventHandler(state, singleEventName, eventHandler);
    }

    return;
  }

  if (!state.eventHandlers[eventName]) {
    state.eventHandlers[eventName] = [];
  }

  state.eventHandlers[eventName].push(eventHandler);
}

const OAuthAppOctokit = core.Octokit.defaults({
  userAgent: `octokit-oauth-app.js/${VERSION} ${universalUserAgent.getUserAgent()}`
});

async function emitEvent(state, context) {
  const {
    name,
    action
  } = context;

  if (state.eventHandlers[`${name}.${action}`]) {
    for (const eventHandler of state.eventHandlers[`${name}.${action}`]) {
      await eventHandler(context);
    }
  }

  if (state.eventHandlers[name]) {
    for (const eventHandler of state.eventHandlers[name]) {
      await eventHandler(context);
    }
  }
}

async function getUserOctokitWithState(state, options) {
  return state.octokit.auth({
    type: "oauth-user",
    ...options,

    async factory(options) {
      const octokit = new state.Octokit({
        authStrategy: authOauthUser.createOAuthUserAuth,
        auth: options
      });
      const authentication = await octokit.auth({
        type: "get"
      });
      await emitEvent(state, {
        name: "token",
        action: "created",
        token: authentication.token,
        scopes: authentication.scopes,
        authentication,
        octokit
      });
      return octokit;
    }

  });
}

function getWebFlowAuthorizationUrlWithState(state, options) {
  const optionsWithDefaults = {
    clientId: state.clientId,
    request: state.octokit.request,
    ...options,
    allowSignup: options.allowSignup || state.allowSignup,
    scopes: options.scopes || state.defaultScopes
  };
  return OAuthMethods.getWebFlowAuthorizationUrl({
    clientType: state.clientType,
    ...optionsWithDefaults
  });
}

async function createTokenWithState(state, options) {
  const authentication = await state.octokit.auth({
    type: "oauth-user",
    ...options
  });
  await emitEvent(state, {
    name: "token",
    action: "created",
    token: authentication.token,
    scopes: authentication.scopes,
    authentication,
    octokit: new state.Octokit({
      authStrategy: OAuthAppAuth.createOAuthUserAuth,
      auth: {
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: authentication.token,
        scopes: authentication.scopes,
        refreshToken: authentication.refreshToken,
        expiresAt: authentication.expiresAt,
        refreshTokenExpiresAt: authentication.refreshTokenExpiresAt
      }
    })
  });
  return {
    authentication
  };
}

async function checkTokenWithState(state, options) {
  const result = await OAuthMethods.checkToken({
    // @ts-expect-error not worth the extra code to appease TS
    clientType: state.clientType,
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  });
  Object.assign(result.authentication, {
    type: "token",
    tokenType: "oauth"
  });
  return result;
}

async function resetTokenWithState(state, options) {
  const optionsWithDefaults = {
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  };

  if (state.clientType === "oauth-app") {
    const response = await OAuthMethods.resetToken({
      clientType: "oauth-app",
      ...optionsWithDefaults
    });
    const authentication = Object.assign(response.authentication, {
      type: "token",
      tokenType: "oauth"
    });
    await emitEvent(state, {
      name: "token",
      action: "reset",
      token: response.authentication.token,
      scopes: response.authentication.scopes || undefined,
      authentication: authentication,
      octokit: new state.Octokit({
        authStrategy: authOauthUser.createOAuthUserAuth,
        auth: {
          clientType: state.clientType,
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          token: response.authentication.token,
          scopes: response.authentication.scopes
        }
      })
    });
    return { ...response,
      authentication
    };
  }

  const response = await OAuthMethods.resetToken({
    clientType: "github-app",
    ...optionsWithDefaults
  });
  const authentication = Object.assign(response.authentication, {
    type: "token",
    tokenType: "oauth"
  });
  await emitEvent(state, {
    name: "token",
    action: "reset",
    token: response.authentication.token,
    authentication: authentication,
    octokit: new state.Octokit({
      authStrategy: authOauthUser.createOAuthUserAuth,
      auth: {
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: response.authentication.token
      }
    })
  });
  return { ...response,
    authentication
  };
}

async function refreshTokenWithState(state, options) {
  if (state.clientType === "oauth-app") {
    throw new Error("[@octokit/oauth-app] app.refreshToken() is not supported for OAuth Apps");
  }

  const response = await OAuthMethods.refreshToken({
    clientType: "github-app",
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    refreshToken: options.refreshToken
  });
  const authentication = Object.assign(response.authentication, {
    type: "token",
    tokenType: "oauth"
  });
  await emitEvent(state, {
    name: "token",
    action: "refreshed",
    token: response.authentication.token,
    authentication: authentication,
    octokit: new state.Octokit({
      authStrategy: authOauthUser.createOAuthUserAuth,
      auth: {
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: response.authentication.token
      }
    })
  });
  return { ...response,
    authentication
  };
}

async function scopeTokenWithState(state, options) {
  if (state.clientType === "oauth-app") {
    throw new Error("[@octokit/oauth-app] app.scopeToken() is not supported for OAuth Apps");
  }

  const response = await OAuthMethods.scopeToken({
    clientType: "github-app",
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  });
  const authentication = Object.assign(response.authentication, {
    type: "token",
    tokenType: "oauth"
  });
  await emitEvent(state, {
    name: "token",
    action: "scoped",
    token: response.authentication.token,
    authentication: authentication,
    octokit: new state.Octokit({
      authStrategy: authOauthUser.createOAuthUserAuth,
      auth: {
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: response.authentication.token
      }
    })
  });
  return { ...response,
    authentication
  };
}

async function deleteTokenWithState(state, options) {
  const optionsWithDefaults = {
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  };
  const response = state.clientType === "oauth-app" ? await OAuthMethods.deleteToken({
    clientType: "oauth-app",
    ...optionsWithDefaults
  }) : // istanbul ignore next
  await OAuthMethods.deleteToken({
    clientType: "github-app",
    ...optionsWithDefaults
  });
  await emitEvent(state, {
    name: "token",
    action: "deleted",
    token: options.token,
    octokit: new state.Octokit({
      authStrategy: authUnauthenticated.createUnauthenticatedAuth,
      auth: {
        reason: `Handling "token.deleted" event. The access for the token has been revoked.`
      }
    })
  });
  return response;
}

async function deleteAuthorizationWithState(state, options) {
  const optionsWithDefaults = {
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  };
  const response = state.clientType === "oauth-app" ? await OAuthMethods.deleteAuthorization({
    clientType: "oauth-app",
    ...optionsWithDefaults
  }) : // istanbul ignore next
  await OAuthMethods.deleteAuthorization({
    clientType: "github-app",
    ...optionsWithDefaults
  });
  await emitEvent(state, {
    name: "token",
    action: "deleted",
    token: options.token,
    octokit: new state.Octokit({
      authStrategy: authUnauthenticated.createUnauthenticatedAuth,
      auth: {
        reason: `Handling "token.deleted" event. The access for the token has been revoked.`
      }
    })
  });
  await emitEvent(state, {
    name: "authorization",
    action: "deleted",
    token: options.token,
    octokit: new state.Octokit({
      authStrategy: authUnauthenticated.createUnauthenticatedAuth,
      auth: {
        reason: `Handling "authorization.deleted" event. The access for the app has been revoked.`
      }
    })
  });
  return response;
}

// @ts-ignore - requires esModuleInterop flag
async function handleRequest(app, {
  pathPrefix = "/api/github/oauth"
}, request) {
  if (request.method === "OPTIONS") {
    return {
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "*",
        "access-control-allow-headers": "Content-Type, User-Agent, Authorization"
      }
    };
  } // request.url may include ?query parameters which we don't want for `route`
  // hence the workaround using new URL()


  const {
    pathname
  } = new URL(request.url, "http://localhost");
  const route = [request.method, pathname].join(" ");
  const routes = {
    getLogin: `GET ${pathPrefix}/login`,
    getCallback: `GET ${pathPrefix}/callback`,
    createToken: `POST ${pathPrefix}/token`,
    getToken: `GET ${pathPrefix}/token`,
    patchToken: `PATCH ${pathPrefix}/token`,
    patchRefreshToken: `PATCH ${pathPrefix}/refresh-token`,
    scopeToken: `POST ${pathPrefix}/token/scoped`,
    deleteToken: `DELETE ${pathPrefix}/token`,
    deleteGrant: `DELETE ${pathPrefix}/grant`
  }; // handle unknown routes

  if (!Object.values(routes).includes(route)) {
    return null;
  }

  let json;

  try {
    const text = await request.text();
    json = text ? JSON.parse(text) : {};
  } catch (error) {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      text: JSON.stringify({
        error: "[@octokit/oauth-app] request error"
      })
    };
  }

  const {
    searchParams
  } = new URL(request.url, "http://localhost");
  const query = fromEntries(searchParams);
  const headers = request.headers;

  try {
    var _headers$authorizatio6;

    if (route === routes.getLogin) {
      const {
        url
      } = app.getWebFlowAuthorizationUrl({
        state: query.state,
        scopes: query.scopes ? query.scopes.split(",") : undefined,
        allowSignup: query.allowSignup !== "false",
        redirectUrl: query.redirectUrl
      });
      return {
        status: 302,
        headers: {
          location: url
        }
      };
    }

    if (route === routes.getCallback) {
      if (query.error) {
        throw new Error(`[@octokit/oauth-app] ${query.error} ${query.error_description}`);
      }

      if (!query.code) {
        throw new Error('[@octokit/oauth-app] "code" parameter is required');
      }

      const {
        authentication: {
          token
        }
      } = await app.createToken({
        code: query.code
      });
      return {
        status: 200,
        headers: {
          "content-type": "text/html"
        },
        text: `<h1>Token created successfully</h1>
    
<p>Your token is: <strong>${token}</strong>. Copy it now as it cannot be shown again.</p>`
      };
    }

    if (route === routes.createToken) {
      const {
        code,
        redirectUrl
      } = json;

      if (!code) {
        throw new Error('[@octokit/oauth-app] "code" parameter is required');
      }

      const result = await app.createToken({
        code,
        redirectUrl
      }); // @ts-ignore

      delete result.authentication.clientSecret;
      return {
        status: 201,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(result)
      };
    }

    if (route === routes.getToken) {
      var _headers$authorizatio;

      const token = (_headers$authorizatio = headers.authorization) === null || _headers$authorizatio === void 0 ? void 0 : _headers$authorizatio.substr("token ".length);

      if (!token) {
        throw new Error('[@octokit/oauth-app] "Authorization" header is required');
      }

      const result = await app.checkToken({
        token
      }); // @ts-ignore

      delete result.authentication.clientSecret;
      return {
        status: 200,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(result)
      };
    }

    if (route === routes.patchToken) {
      var _headers$authorizatio2;

      const token = (_headers$authorizatio2 = headers.authorization) === null || _headers$authorizatio2 === void 0 ? void 0 : _headers$authorizatio2.substr("token ".length);

      if (!token) {
        throw new Error('[@octokit/oauth-app] "Authorization" header is required');
      }

      const result = await app.resetToken({
        token
      }); // @ts-ignore

      delete result.authentication.clientSecret;
      return {
        status: 200,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(result)
      };
    }

    if (route === routes.patchRefreshToken) {
      var _headers$authorizatio3;

      const token = (_headers$authorizatio3 = headers.authorization) === null || _headers$authorizatio3 === void 0 ? void 0 : _headers$authorizatio3.substr("token ".length);

      if (!token) {
        throw new Error('[@octokit/oauth-app] "Authorization" header is required');
      }

      const {
        refreshToken
      } = json;

      if (!refreshToken) {
        throw new Error("[@octokit/oauth-app] refreshToken must be sent in request body");
      }

      const result = await app.refreshToken({
        refreshToken
      }); // @ts-ignore

      delete result.authentication.clientSecret;
      return {
        status: 200,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(result)
      };
    }

    if (route === routes.scopeToken) {
      var _headers$authorizatio4;

      const token = (_headers$authorizatio4 = headers.authorization) === null || _headers$authorizatio4 === void 0 ? void 0 : _headers$authorizatio4.substr("token ".length);

      if (!token) {
        throw new Error('[@octokit/oauth-app] "Authorization" header is required');
      }

      const result = await app.scopeToken({
        token,
        ...json
      }); // @ts-ignore

      delete result.authentication.clientSecret;
      return {
        status: 200,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(result)
      };
    }

    if (route === routes.deleteToken) {
      var _headers$authorizatio5;

      const token = (_headers$authorizatio5 = headers.authorization) === null || _headers$authorizatio5 === void 0 ? void 0 : _headers$authorizatio5.substr("token ".length);

      if (!token) {
        throw new Error('[@octokit/oauth-app] "Authorization" header is required');
      }

      await app.deleteToken({
        token
      });
      return {
        status: 204,
        headers: {
          "access-control-allow-origin": "*"
        }
      };
    } // route === routes.deleteGrant


    const token = (_headers$authorizatio6 = headers.authorization) === null || _headers$authorizatio6 === void 0 ? void 0 : _headers$authorizatio6.substr("token ".length);

    if (!token) {
      throw new Error('[@octokit/oauth-app] "Authorization" header is required');
    }

    await app.deleteAuthorization({
      token
    });
    return {
      status: 204,
      headers: {
        "access-control-allow-origin": "*"
      }
    };
  } catch (error) {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      text: JSON.stringify({
        error: error.message
      })
    };
  }
}

function parseRequest(request) {
  const {
    method,
    url,
    headers
  } = request;

  async function text() {
    const text = await new Promise((resolve, reject) => {
      let bodyChunks = [];
      request.on("error", reject).on("data", chunk => bodyChunks.push(chunk)).on("end", () => resolve(Buffer.concat(bodyChunks).toString()));
    });
    return text;
  }

  return {
    method,
    url,
    headers,
    text
  };
}

function sendResponse(octokitResponse, response) {
  response.writeHead(octokitResponse.status, octokitResponse.headers);
  response.end(octokitResponse.text);
}

function onUnhandledRequestDefault(request) {
  return {
    status: 404,
    headers: {
      "content-type": "application/json"
    },
    text: JSON.stringify({
      error: `Unknown route: ${request.method} ${request.url}`
    })
  };
}

function onUnhandledRequestDefaultNode(request, response) {
  const octokitRequest = parseRequest(request);
  const octokitResponse = onUnhandledRequestDefault(octokitRequest);
  sendResponse(octokitResponse, response);
}

function createNodeMiddleware(app, {
  pathPrefix,
  onUnhandledRequest
} = {}) {
  if (onUnhandledRequest) {
    app.octokit.log.warn("[@octokit/oauth-app] `onUnhandledRequest` is deprecated and will be removed from the next major version.");
  }

  onUnhandledRequest ?? (onUnhandledRequest = onUnhandledRequestDefaultNode);
  return async function (request, response, next) {
    const octokitRequest = parseRequest(request);
    const octokitResponse = await handleRequest(app, {
      pathPrefix
    }, octokitRequest);

    if (octokitResponse) {
      sendResponse(octokitResponse, response);
    } else if (typeof next === "function") {
      next();
    } else {
      onUnhandledRequest(request, response);
    }
  };
}

function parseRequest$1(request) {
  // @ts-ignore Worker environment supports fromEntries/entries.
  const headers = Object.fromEntries(request.headers.entries());
  return {
    method: request.method,
    url: request.url,
    headers,
    text: () => request.text()
  };
}

function sendResponse$1(octokitResponse) {
  return new Response(octokitResponse.text, {
    status: octokitResponse.status,
    headers: octokitResponse.headers
  });
}

async function onUnhandledRequestDefaultWebWorker(request) {
  const octokitRequest = parseRequest$1(request);
  const octokitResponse = onUnhandledRequestDefault(octokitRequest);
  return sendResponse$1(octokitResponse);
}

function createWebWorkerHandler(app, {
  pathPrefix,
  onUnhandledRequest
} = {}) {
  if (onUnhandledRequest) {
    app.octokit.log.warn("[@octokit/oauth-app] `onUnhandledRequest` is deprecated and will be removed from the next major version.");
  }

  onUnhandledRequest ?? (onUnhandledRequest = onUnhandledRequestDefaultWebWorker);
  return async function (request) {
    const octokitRequest = parseRequest$1(request);
    const octokitResponse = await handleRequest(app, {
      pathPrefix
    }, octokitRequest);
    return octokitResponse ? sendResponse$1(octokitResponse) : await onUnhandledRequest(request);
  };
}
/** @deprecated */

function createCloudflareHandler(...args) {
  args[0].octokit.log.warn("[@octokit/oauth-app] `createCloudflareHandler` is deprecated, use `createWebWorkerHandler` instead");
  return createWebWorkerHandler(...args);
}

function parseRequest$2(request) {
  const {
    method
  } = request.requestContext.http;
  let url = request.rawPath;
  const {
    stage
  } = request.requestContext;
  if (url.startsWith("/" + stage)) url = url.substring(stage.length + 1);
  if (request.rawQueryString) url += "?" + request.rawQueryString;
  const headers = request.headers;

  const text = async () => request.body || "";

  return {
    method,
    url,
    headers,
    text
  };
}

function sendResponse$2(octokitResponse) {
  return {
    statusCode: octokitResponse.status,
    headers: octokitResponse.headers,
    body: octokitResponse.text
  };
}

async function onUnhandledRequestDefaultAWSAPIGatewayV2(event) {
  const request = parseRequest$2(event);
  const response = onUnhandledRequestDefault(request);
  return sendResponse$2(response);
}

function createAWSLambdaAPIGatewayV2Handler(app, {
  pathPrefix,
  onUnhandledRequest
} = {}) {
  if (onUnhandledRequest) {
    app.octokit.log.warn("[@octokit/oauth-app] `onUnhandledRequest` is deprecated and will be removed from the next major version.");
  }

  onUnhandledRequest ?? (onUnhandledRequest = onUnhandledRequestDefaultAWSAPIGatewayV2);
  return async function (event) {
    const request = parseRequest$2(event);
    const response = await handleRequest(app, {
      pathPrefix
    }, request);
    return response ? sendResponse$2(response) : onUnhandledRequest(event);
  };
}

class OAuthApp {
  constructor(options) {
    const Octokit = options.Octokit || OAuthAppOctokit;
    this.type = options.clientType || "oauth-app";
    const octokit = new Octokit({
      authStrategy: OAuthAppAuth.createOAuthAppAuth,
      auth: {
        clientType: this.type,
        clientId: options.clientId,
        clientSecret: options.clientSecret
      }
    });
    const state = {
      clientType: this.type,
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      // @ts-expect-error defaultScopes not permitted for GitHub Apps
      defaultScopes: options.defaultScopes || [],
      allowSignup: options.allowSignup,
      baseUrl: options.baseUrl,
      log: options.log,
      Octokit,
      octokit,
      eventHandlers: {}
    };
    this.on = addEventHandler.bind(null, state); // @ts-expect-error TODO: figure this out

    this.octokit = octokit;
    this.getUserOctokit = getUserOctokitWithState.bind(null, state);
    this.getWebFlowAuthorizationUrl = getWebFlowAuthorizationUrlWithState.bind(null, state);
    this.createToken = createTokenWithState.bind(null, state);
    this.checkToken = checkTokenWithState.bind(null, state);
    this.resetToken = resetTokenWithState.bind(null, state);
    this.refreshToken = refreshTokenWithState.bind(null, state);
    this.scopeToken = scopeTokenWithState.bind(null, state);
    this.deleteToken = deleteTokenWithState.bind(null, state);
    this.deleteAuthorization = deleteAuthorizationWithState.bind(null, state);
  }

  static defaults(defaults) {
    const OAuthAppWithDefaults = class extends this {
      constructor(...args) {
        super({ ...defaults,
          ...args[0]
        });
      }

    };
    return OAuthAppWithDefaults;
  }

}
OAuthApp.VERSION = VERSION;

exports.OAuthApp = OAuthApp;
exports.createAWSLambdaAPIGatewayV2Handler = createAWSLambdaAPIGatewayV2Handler;
exports.createCloudflareHandler = createCloudflareHandler;
exports.createNodeMiddleware = createNodeMiddleware;
exports.createWebWorkerHandler = createWebWorkerHandler;
exports.handleRequest = handleRequest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6050:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "oauthAuthorizationUrl": function() { return /* binding */ oauthAuthorizationUrl; }
/* harmony export */ });
function oauthAuthorizationUrl(options) {
    const clientType = options.clientType || "oauth-app";
    const baseUrl = options.baseUrl || "https://github.com";
    const result = {
        clientType,
        allowSignup: options.allowSignup === false ? false : true,
        clientId: options.clientId,
        login: options.login || null,
        redirectUrl: options.redirectUrl || null,
        state: options.state || Math.random().toString(36).substr(2),
        url: "",
    };
    if (clientType === "oauth-app") {
        const scopes = "scopes" in options ? options.scopes : [];
        result.scopes =
            typeof scopes === "string"
                ? scopes.split(/[,\s]+/).filter(Boolean)
                : scopes;
    }
    result.url = urlBuilderAuthorize(`${baseUrl}/login/oauth/authorize`, result);
    return result;
}
function urlBuilderAuthorize(base, options) {
    const map = {
        allowSignup: "allow_signup",
        clientId: "client_id",
        login: "login",
        redirectUrl: "redirect_uri",
        scopes: "scope",
        state: "state",
    };
    let url = base;
    Object.keys(map)
        // Filter out keys that are null and remove the url key
        .filter((k) => options[k] !== null)
        // Filter out empty scopes array
        .filter((k) => {
        if (k !== "scopes")
            return true;
        if (options.clientType === "github-app")
            return false;
        return !Array.isArray(options[k]) || options[k].length > 0;
    })
        // Map Array with the proper URL parameter names and change the value to a string using template strings
        // @ts-ignore
        .map((key) => [map[key], `${options[key]}`])
        // Finally, build the URL
        .forEach(([key, value], index) => {
        url += index === 0 ? `?` : "&";
        url += `${key}=${encodeURIComponent(value)}`;
    });
    return url;
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 2272:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var oauthAuthorizationUrl = __webpack_require__(6050);
var request = __webpack_require__(2363);
var requestError = __webpack_require__(640);
var btoa = _interopDefault(__webpack_require__(1483));

const VERSION = "2.0.3";

function requestToOAuthBaseUrl(request) {
  const endpointDefaults = request.endpoint.DEFAULTS;
  return /^https:\/\/(api\.)?github\.com$/.test(endpointDefaults.baseUrl) ? "https://github.com" : endpointDefaults.baseUrl.replace("/api/v3", "");
}
async function oauthRequest(request, route, parameters) {
  const withOAuthParameters = {
    baseUrl: requestToOAuthBaseUrl(request),
    headers: {
      accept: "application/json"
    },
    ...parameters
  };
  const response = await request(route, withOAuthParameters);

  if ("error" in response.data) {
    const error = new requestError.RequestError(`${response.data.error_description} (${response.data.error}, ${response.data.error_uri})`, 400, {
      request: request.endpoint.merge(route, withOAuthParameters),
      headers: response.headers
    }); // @ts-ignore add custom response property until https://github.com/octokit/request-error.js/issues/169 is resolved

    error.response = response;
    throw error;
  }

  return response;
}

function getWebFlowAuthorizationUrl({
  request: request$1 = request.request,
  ...options
}) {
  const baseUrl = requestToOAuthBaseUrl(request$1); // @ts-expect-error TypeScript wants `clientType` to be set explicitly ¯\_(ツ)_/¯

  return oauthAuthorizationUrl.oauthAuthorizationUrl({ ...options,
    baseUrl
  });
}

async function exchangeWebFlowCode(options) {
  const request$1 = options.request ||
  /* istanbul ignore next: we always pass a custom request in tests */
  request.request;
  const response = await oauthRequest(request$1, "POST /login/oauth/access_token", {
    client_id: options.clientId,
    client_secret: options.clientSecret,
    code: options.code,
    redirect_uri: options.redirectUrl
  });
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.access_token,
    scopes: response.data.scope.split(/\s+/).filter(Boolean)
  };

  if (options.clientType === "github-app") {
    if ("refresh_token" in response.data) {
      const apiTimeInMs = new Date(response.headers.date).getTime();
      authentication.refreshToken = response.data.refresh_token, authentication.expiresAt = toTimestamp(apiTimeInMs, response.data.expires_in), authentication.refreshTokenExpiresAt = toTimestamp(apiTimeInMs, response.data.refresh_token_expires_in);
    }

    delete authentication.scopes;
  }

  return { ...response,
    authentication
  };
}

function toTimestamp(apiTimeInMs, expirationInSeconds) {
  return new Date(apiTimeInMs + expirationInSeconds * 1000).toISOString();
}

async function createDeviceCode(options) {
  const request$1 = options.request ||
  /* istanbul ignore next: we always pass a custom request in tests */
  request.request;
  const parameters = {
    client_id: options.clientId
  };

  if ("scopes" in options && Array.isArray(options.scopes)) {
    parameters.scope = options.scopes.join(" ");
  }

  return oauthRequest(request$1, "POST /login/device/code", parameters);
}

async function exchangeDeviceCode(options) {
  const request$1 = options.request ||
  /* istanbul ignore next: we always pass a custom request in tests */
  request.request;
  const response = await oauthRequest(request$1, "POST /login/oauth/access_token", {
    client_id: options.clientId,
    device_code: options.code,
    grant_type: "urn:ietf:params:oauth:grant-type:device_code"
  });
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    token: response.data.access_token,
    scopes: response.data.scope.split(/\s+/).filter(Boolean)
  };

  if ("clientSecret" in options) {
    authentication.clientSecret = options.clientSecret;
  }

  if (options.clientType === "github-app") {
    if ("refresh_token" in response.data) {
      const apiTimeInMs = new Date(response.headers.date).getTime();
      authentication.refreshToken = response.data.refresh_token, authentication.expiresAt = toTimestamp$1(apiTimeInMs, response.data.expires_in), authentication.refreshTokenExpiresAt = toTimestamp$1(apiTimeInMs, response.data.refresh_token_expires_in);
    }

    delete authentication.scopes;
  }

  return { ...response,
    authentication
  };
}

function toTimestamp$1(apiTimeInMs, expirationInSeconds) {
  return new Date(apiTimeInMs + expirationInSeconds * 1000).toISOString();
}

async function checkToken(options) {
  const request$1 = options.request ||
  /* istanbul ignore next: we always pass a custom request in tests */
  request.request; // @ts-expect-error - TODO: I don't get why TS is complaining here. It works with `defaultRequest` directly

  const response = await request$1("POST /applications/{client_id}/token", {
    headers: {
      authorization: `basic ${btoa(`${options.clientId}:${options.clientSecret}`)}`
    },
    client_id: options.clientId,
    access_token: options.token
  });
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: options.token,
    scopes: response.data.scopes
  };
  if (response.data.expires_at) authentication.expiresAt = response.data.expires_at;

  if (options.clientType === "github-app") {
    delete authentication.scopes;
  }

  return { ...response,
    authentication
  };
}

async function refreshToken(options) {
  const request$1 = options.request ||
  /* istanbul ignore next: we always pass a custom request in tests */
  request.request;
  const response = await oauthRequest(request$1, "POST /login/oauth/access_token", {
    client_id: options.clientId,
    client_secret: options.clientSecret,
    grant_type: "refresh_token",
    refresh_token: options.refreshToken
  });
  const apiTimeInMs = new Date(response.headers.date).getTime();
  const authentication = {
    clientType: "github-app",
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresAt: toTimestamp$2(apiTimeInMs, response.data.expires_in),
    refreshTokenExpiresAt: toTimestamp$2(apiTimeInMs, response.data.refresh_token_expires_in)
  };
  return { ...response,
    authentication
  };
}

function toTimestamp$2(apiTimeInMs, expirationInSeconds) {
  return new Date(apiTimeInMs + expirationInSeconds * 1000).toISOString();
}

async function scopeToken(options) {
  const {
    request: optionsRequest,
    clientType,
    clientId,
    clientSecret,
    token,
    ...requestOptions
  } = options;
  const request$1 = optionsRequest ||
  /* istanbul ignore next: we always pass a custom request in tests */
  request.request;
  const response = await request$1("POST /applications/{client_id}/token/scoped", // @ts-expect-error - TODO: I don't get why TS is complaining here. It works with `defaultRequest` directly
  {
    headers: {
      authorization: `basic ${btoa(`${clientId}:${clientSecret}`)}`
    },
    client_id: clientId,
    access_token: token,
    ...requestOptions
  });
  const authentication = Object.assign({
    clientType,
    clientId,
    clientSecret,
    token: response.data.token
  }, response.data.expires_at ? {
    expiresAt: response.data.expires_at
  } : {}); // @ts-expect-error - response.status type is incompatible (200 vs number)

  return { ...response,
    authentication
  };
}

async function resetToken(options) {
  const request$1 = options.request ||
  /* istanbul ignore next: we always pass a custom request in tests */
  request.request;
  const auth = btoa(`${options.clientId}:${options.clientSecret}`);
  const response = await request$1("PATCH /applications/{client_id}/token", // @ts-expect-error - TODO: I don't get why TS is complaining here. It works with `defaultRequest` directly
  {
    headers: {
      authorization: `basic ${auth}`
    },
    client_id: options.clientId,
    access_token: options.token
  });
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.token,
    scopes: response.data.scopes
  };
  if (response.data.expires_at) authentication.expiresAt = response.data.expires_at;

  if (options.clientType === "github-app") {
    delete authentication.scopes;
  }

  return { ...response,
    authentication
  };
}

async function deleteToken(options) {
  const request$1 = options.request ||
  /* istanbul ignore next: we always pass a custom request in tests */
  request.request;
  const auth = btoa(`${options.clientId}:${options.clientSecret}`);
  return request$1("DELETE /applications/{client_id}/token", // @ts-expect-error - TODO: I don't get why TS is complaining here. It works with `defaultRequest` directly
  {
    headers: {
      authorization: `basic ${auth}`
    },
    client_id: options.clientId,
    access_token: options.token
  });
}

async function deleteAuthorization(options) {
  const request$1 = options.request ||
  /* istanbul ignore next: we always pass a custom request in tests */
  request.request;
  const auth = btoa(`${options.clientId}:${options.clientSecret}`);
  return request$1("DELETE /applications/{client_id}/grant", // @ts-expect-error - TODO: I don't get why TS is complaining here. It works with `defaultRequest` directly
  {
    headers: {
      authorization: `basic ${auth}`
    },
    client_id: options.clientId,
    access_token: options.token
  });
}

exports.VERSION = VERSION;
exports.checkToken = checkToken;
exports.createDeviceCode = createDeviceCode;
exports.deleteAuthorization = deleteAuthorization;
exports.deleteToken = deleteToken;
exports.exchangeDeviceCode = exchangeDeviceCode;
exports.exchangeWebFlowCode = exchangeWebFlowCode;
exports.getWebFlowAuthorizationUrl = getWebFlowAuthorizationUrl;
exports.refreshToken = refreshToken;
exports.resetToken = resetToken;
exports.scopeToken = scopeToken;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 5745:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "composePaginateRest": function() { return /* binding */ composePaginateRest; },
/* harmony export */   "isPaginatingEndpoint": function() { return /* binding */ isPaginatingEndpoint; },
/* harmony export */   "paginateRest": function() { return /* binding */ paginateRest; },
/* harmony export */   "paginatingEndpoints": function() { return /* binding */ paginatingEndpoints; }
/* harmony export */ });
const VERSION = "4.3.1";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint.
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not.
 *
 * We check if a "total_count" key is present in the response data, but also make sure that
 * a "url" property is not, as the "Get the combined status for a specific ref" endpoint would
 * otherwise match: https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
 */
function normalizePaginatedListResponse(response) {
    // endpoints can respond with 204 if repository is empty
    if (!response.data) {
        return {
            ...response,
            data: [],
        };
    }
    const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
    if (!responseNeedsNormalization)
        return response;
    // keep the additional properties intact as there is currently no other way
    // to retrieve the same information.
    const incompleteResults = response.data.incomplete_results;
    const repositorySelection = response.data.repository_selection;
    const totalCount = response.data.total_count;
    delete response.data.incomplete_results;
    delete response.data.repository_selection;
    delete response.data.total_count;
    const namespaceKey = Object.keys(response.data)[0];
    const data = response.data[namespaceKey];
    response.data = data;
    if (typeof incompleteResults !== "undefined") {
        response.data.incomplete_results = incompleteResults;
    }
    if (typeof repositorySelection !== "undefined") {
        response.data.repository_selection = repositorySelection;
    }
    response.data.total_count = totalCount;
    return response;
}

function iterator(octokit, route, parameters) {
    const options = typeof route === "function"
        ? route.endpoint(parameters)
        : octokit.request.endpoint(route, parameters);
    const requestMethod = typeof route === "function" ? route : octokit.request;
    const method = options.method;
    const headers = options.headers;
    let url = options.url;
    return {
        [Symbol.asyncIterator]: () => ({
            async next() {
                if (!url)
                    return { done: true };
                try {
                    const response = await requestMethod({ method, url, headers });
                    const normalizedResponse = normalizePaginatedListResponse(response);
                    // `response.headers.link` format:
                    // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
                    // sets `url` to undefined if "next" URL is not present or `link` header is not set
                    url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
                    return { value: normalizedResponse };
                }
                catch (error) {
                    if (error.status !== 409)
                        throw error;
                    url = "";
                    return {
                        value: {
                            status: 200,
                            headers: {},
                            data: [],
                        },
                    };
                }
            },
        }),
    };
}

function paginate(octokit, route, parameters, mapFn) {
    if (typeof parameters === "function") {
        mapFn = parameters;
        parameters = undefined;
    }
    return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}
function gather(octokit, results, iterator, mapFn) {
    return iterator.next().then((result) => {
        if (result.done) {
            return results;
        }
        let earlyExit = false;
        function done() {
            earlyExit = true;
        }
        results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
        if (earlyExit) {
            return results;
        }
        return gather(octokit, results, iterator, mapFn);
    });
}

const composePaginateRest = Object.assign(paginate, {
    iterator,
});

const paginatingEndpoints = [
    "GET /app/hook/deliveries",
    "GET /app/installations",
    "GET /enterprises/{enterprise}/actions/permissions/organizations",
    "GET /enterprises/{enterprise}/actions/runner-groups",
    "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/organizations",
    "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/runners",
    "GET /enterprises/{enterprise}/actions/runners",
    "GET /enterprises/{enterprise}/audit-log",
    "GET /enterprises/{enterprise}/code-scanning/alerts",
    "GET /enterprises/{enterprise}/secret-scanning/alerts",
    "GET /enterprises/{enterprise}/settings/billing/advanced-security",
    "GET /events",
    "GET /gists",
    "GET /gists/public",
    "GET /gists/starred",
    "GET /gists/{gist_id}/comments",
    "GET /gists/{gist_id}/commits",
    "GET /gists/{gist_id}/forks",
    "GET /installation/repositories",
    "GET /issues",
    "GET /licenses",
    "GET /marketplace_listing/plans",
    "GET /marketplace_listing/plans/{plan_id}/accounts",
    "GET /marketplace_listing/stubbed/plans",
    "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts",
    "GET /networks/{owner}/{repo}/events",
    "GET /notifications",
    "GET /organizations",
    "GET /orgs/{org}/actions/cache/usage-by-repository",
    "GET /orgs/{org}/actions/permissions/repositories",
    "GET /orgs/{org}/actions/runner-groups",
    "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories",
    "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners",
    "GET /orgs/{org}/actions/runners",
    "GET /orgs/{org}/actions/secrets",
    "GET /orgs/{org}/actions/secrets/{secret_name}/repositories",
    "GET /orgs/{org}/audit-log",
    "GET /orgs/{org}/blocks",
    "GET /orgs/{org}/code-scanning/alerts",
    "GET /orgs/{org}/codespaces",
    "GET /orgs/{org}/credential-authorizations",
    "GET /orgs/{org}/dependabot/secrets",
    "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories",
    "GET /orgs/{org}/events",
    "GET /orgs/{org}/external-groups",
    "GET /orgs/{org}/failed_invitations",
    "GET /orgs/{org}/hooks",
    "GET /orgs/{org}/hooks/{hook_id}/deliveries",
    "GET /orgs/{org}/installations",
    "GET /orgs/{org}/invitations",
    "GET /orgs/{org}/invitations/{invitation_id}/teams",
    "GET /orgs/{org}/issues",
    "GET /orgs/{org}/members",
    "GET /orgs/{org}/migrations",
    "GET /orgs/{org}/migrations/{migration_id}/repositories",
    "GET /orgs/{org}/outside_collaborators",
    "GET /orgs/{org}/packages",
    "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
    "GET /orgs/{org}/projects",
    "GET /orgs/{org}/public_members",
    "GET /orgs/{org}/repos",
    "GET /orgs/{org}/secret-scanning/alerts",
    "GET /orgs/{org}/settings/billing/advanced-security",
    "GET /orgs/{org}/team-sync/groups",
    "GET /orgs/{org}/teams",
    "GET /orgs/{org}/teams/{team_slug}/discussions",
    "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
    "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
    "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
    "GET /orgs/{org}/teams/{team_slug}/invitations",
    "GET /orgs/{org}/teams/{team_slug}/members",
    "GET /orgs/{org}/teams/{team_slug}/projects",
    "GET /orgs/{org}/teams/{team_slug}/repos",
    "GET /orgs/{org}/teams/{team_slug}/teams",
    "GET /projects/columns/{column_id}/cards",
    "GET /projects/{project_id}/collaborators",
    "GET /projects/{project_id}/columns",
    "GET /repos/{owner}/{repo}/actions/artifacts",
    "GET /repos/{owner}/{repo}/actions/caches",
    "GET /repos/{owner}/{repo}/actions/runners",
    "GET /repos/{owner}/{repo}/actions/runs",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
    "GET /repos/{owner}/{repo}/actions/secrets",
    "GET /repos/{owner}/{repo}/actions/workflows",
    "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
    "GET /repos/{owner}/{repo}/assignees",
    "GET /repos/{owner}/{repo}/branches",
    "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations",
    "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs",
    "GET /repos/{owner}/{repo}/code-scanning/alerts",
    "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
    "GET /repos/{owner}/{repo}/code-scanning/analyses",
    "GET /repos/{owner}/{repo}/codespaces",
    "GET /repos/{owner}/{repo}/codespaces/devcontainers",
    "GET /repos/{owner}/{repo}/codespaces/secrets",
    "GET /repos/{owner}/{repo}/collaborators",
    "GET /repos/{owner}/{repo}/comments",
    "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions",
    "GET /repos/{owner}/{repo}/commits",
    "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments",
    "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
    "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
    "GET /repos/{owner}/{repo}/commits/{ref}/check-suites",
    "GET /repos/{owner}/{repo}/commits/{ref}/status",
    "GET /repos/{owner}/{repo}/commits/{ref}/statuses",
    "GET /repos/{owner}/{repo}/contributors",
    "GET /repos/{owner}/{repo}/dependabot/secrets",
    "GET /repos/{owner}/{repo}/deployments",
    "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
    "GET /repos/{owner}/{repo}/environments",
    "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies",
    "GET /repos/{owner}/{repo}/events",
    "GET /repos/{owner}/{repo}/forks",
    "GET /repos/{owner}/{repo}/hooks",
    "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries",
    "GET /repos/{owner}/{repo}/invitations",
    "GET /repos/{owner}/{repo}/issues",
    "GET /repos/{owner}/{repo}/issues/comments",
    "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
    "GET /repos/{owner}/{repo}/issues/events",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/events",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/labels",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
    "GET /repos/{owner}/{repo}/keys",
    "GET /repos/{owner}/{repo}/labels",
    "GET /repos/{owner}/{repo}/milestones",
    "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels",
    "GET /repos/{owner}/{repo}/notifications",
    "GET /repos/{owner}/{repo}/pages/builds",
    "GET /repos/{owner}/{repo}/projects",
    "GET /repos/{owner}/{repo}/pulls",
    "GET /repos/{owner}/{repo}/pulls/comments",
    "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments",
    "GET /repos/{owner}/{repo}/releases",
    "GET /repos/{owner}/{repo}/releases/{release_id}/assets",
    "GET /repos/{owner}/{repo}/releases/{release_id}/reactions",
    "GET /repos/{owner}/{repo}/secret-scanning/alerts",
    "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations",
    "GET /repos/{owner}/{repo}/stargazers",
    "GET /repos/{owner}/{repo}/subscribers",
    "GET /repos/{owner}/{repo}/tags",
    "GET /repos/{owner}/{repo}/teams",
    "GET /repos/{owner}/{repo}/topics",
    "GET /repositories",
    "GET /repositories/{repository_id}/environments/{environment_name}/secrets",
    "GET /search/code",
    "GET /search/commits",
    "GET /search/issues",
    "GET /search/labels",
    "GET /search/repositories",
    "GET /search/topics",
    "GET /search/users",
    "GET /teams/{team_id}/discussions",
    "GET /teams/{team_id}/discussions/{discussion_number}/comments",
    "GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions",
    "GET /teams/{team_id}/discussions/{discussion_number}/reactions",
    "GET /teams/{team_id}/invitations",
    "GET /teams/{team_id}/members",
    "GET /teams/{team_id}/projects",
    "GET /teams/{team_id}/repos",
    "GET /teams/{team_id}/teams",
    "GET /user/blocks",
    "GET /user/codespaces",
    "GET /user/codespaces/secrets",
    "GET /user/emails",
    "GET /user/followers",
    "GET /user/following",
    "GET /user/gpg_keys",
    "GET /user/installations",
    "GET /user/installations/{installation_id}/repositories",
    "GET /user/issues",
    "GET /user/keys",
    "GET /user/marketplace_purchases",
    "GET /user/marketplace_purchases/stubbed",
    "GET /user/memberships/orgs",
    "GET /user/migrations",
    "GET /user/migrations/{migration_id}/repositories",
    "GET /user/orgs",
    "GET /user/packages",
    "GET /user/packages/{package_type}/{package_name}/versions",
    "GET /user/public_emails",
    "GET /user/repos",
    "GET /user/repository_invitations",
    "GET /user/ssh_signing_keys",
    "GET /user/starred",
    "GET /user/subscriptions",
    "GET /user/teams",
    "GET /users",
    "GET /users/{username}/events",
    "GET /users/{username}/events/orgs/{org}",
    "GET /users/{username}/events/public",
    "GET /users/{username}/followers",
    "GET /users/{username}/following",
    "GET /users/{username}/gists",
    "GET /users/{username}/gpg_keys",
    "GET /users/{username}/keys",
    "GET /users/{username}/orgs",
    "GET /users/{username}/packages",
    "GET /users/{username}/projects",
    "GET /users/{username}/received_events",
    "GET /users/{username}/received_events/public",
    "GET /users/{username}/repos",
    "GET /users/{username}/ssh_signing_keys",
    "GET /users/{username}/starred",
    "GET /users/{username}/subscriptions",
];

function isPaginatingEndpoint(arg) {
    if (typeof arg === "string") {
        return paginatingEndpoints.includes(arg);
    }
    else {
        return false;
    }
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */
function paginateRest(octokit) {
    return {
        paginate: Object.assign(paginate.bind(null, octokit), {
            iterator: iterator.bind(null, octokit),
        }),
    };
}
paginateRest.VERSION = VERSION;


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6964:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "X": function() { return /* binding */ retry; }
/* harmony export */ });
/* unused harmony export VERSION */
/* harmony import */ var bottleneck_light__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1209);
/* harmony import */ var bottleneck_light__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bottleneck_light__WEBPACK_IMPORTED_MODULE_0__);


// @ts-ignore
async function errorRequest(octokit, state, error, options) {
    if (!error.request || !error.request.request) {
        // address https://github.com/octokit/plugin-retry.js/issues/8
        throw error;
    }
    // retry all >= 400 && not doNotRetry
    if (error.status >= 400 && !state.doNotRetry.includes(error.status)) {
        const retries = options.request.retries != null ? options.request.retries : state.retries;
        const retryAfter = Math.pow((options.request.retryCount || 0) + 1, 2);
        throw octokit.retry.retryRequest(error, retries, retryAfter);
    }
    // Maybe eventually there will be more cases here
    throw error;
}

// @ts-ignore
// @ts-ignore
async function wrapRequest(state, request, options) {
    const limiter = new (bottleneck_light__WEBPACK_IMPORTED_MODULE_0___default())();
    // @ts-ignore
    limiter.on("failed", function (error, info) {
        const maxRetries = ~~error.request.request.retries;
        const after = ~~error.request.request.retryAfter;
        options.request.retryCount = info.retryCount + 1;
        if (maxRetries > info.retryCount) {
            // Returning a number instructs the limiter to retry
            // the request after that number of milliseconds have passed
            return after * state.retryAfterBaseValue;
        }
    });
    return limiter.schedule(request, options);
}

const VERSION = "3.0.9";
function retry(octokit, octokitOptions) {
    const state = Object.assign({
        enabled: true,
        retryAfterBaseValue: 1000,
        doNotRetry: [400, 401, 403, 404, 422],
        retries: 3,
    }, octokitOptions.retry);
    if (state.enabled) {
        octokit.hook.error("request", errorRequest.bind(null, octokit, state));
        octokit.hook.wrap("request", wrapRequest.bind(null, state));
    }
    return {
        retry: {
            retryRequest: (error, retries, retryAfter) => {
                error.request.request = Object.assign({}, error.request.request, {
                    retries: retries,
                    retryAfter: retryAfter,
                });
                return error;
            },
        },
    };
}
retry.VERSION = VERSION;


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 640:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RequestError": function() { return /* binding */ RequestError; }
/* harmony export */ });
/* harmony import */ var deprecation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2327);
/* harmony import */ var once__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(778);
/* harmony import */ var once__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(once__WEBPACK_IMPORTED_MODULE_0__);



const logOnceCode = once__WEBPACK_IMPORTED_MODULE_0___default()((deprecation) => console.warn(deprecation));
const logOnceHeaders = once__WEBPACK_IMPORTED_MODULE_0___default()((deprecation) => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */
class RequestError extends Error {
    constructor(message, statusCode, options) {
        super(message);
        // Maintains proper stack trace (only available on V8)
        /* istanbul ignore next */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.status = statusCode;
        let headers;
        if ("headers" in options && typeof options.headers !== "undefined") {
            headers = options.headers;
        }
        if ("response" in options) {
            this.response = options.response;
            headers = options.response.headers;
        }
        // redact request credentials without mutating original request options
        const requestCopy = Object.assign({}, options.request);
        if (options.request.headers.authorization) {
            requestCopy.headers = Object.assign({}, options.request.headers, {
                authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]"),
            });
        }
        requestCopy.url = requestCopy.url
            // client_id & client_secret can be passed as URL query parameters to increase rate limit
            // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
            .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]")
            // OAuth tokens can be passed as URL query parameters, although it is not recommended
            // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
            .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
        this.request = requestCopy;
        // deprecations
        Object.defineProperty(this, "code", {
            get() {
                logOnceCode(new deprecation__WEBPACK_IMPORTED_MODULE_1__/* .Deprecation */ .$("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
                return statusCode;
            },
        });
        Object.defineProperty(this, "headers", {
            get() {
                logOnceHeaders(new deprecation__WEBPACK_IMPORTED_MODULE_1__/* .Deprecation */ .$("[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."));
                return headers || {};
            },
        });
    }
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 2363:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "request": function() { return /* binding */ request; }
});

;// CONCATENATED MODULE: ./node_modules/is-plain-object/dist/is-plain-object.mjs
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}



// EXTERNAL MODULE: ./node_modules/universal-user-agent/dist-web/index.js
var dist_web = __webpack_require__(350);
;// CONCATENATED MODULE: ./node_modules/@octokit/endpoint/dist-web/index.js



function lowercaseKeys(object) {
    if (!object) {
        return {};
    }
    return Object.keys(object).reduce((newObj, key) => {
        newObj[key.toLowerCase()] = object[key];
        return newObj;
    }, {});
}

function mergeDeep(defaults, options) {
    const result = Object.assign({}, defaults);
    Object.keys(options).forEach((key) => {
        if (isPlainObject(options[key])) {
            if (!(key in defaults))
                Object.assign(result, { [key]: options[key] });
            else
                result[key] = mergeDeep(defaults[key], options[key]);
        }
        else {
            Object.assign(result, { [key]: options[key] });
        }
    });
    return result;
}

function removeUndefinedProperties(obj) {
    for (const key in obj) {
        if (obj[key] === undefined) {
            delete obj[key];
        }
    }
    return obj;
}

function merge(defaults, route, options) {
    if (typeof route === "string") {
        let [method, url] = route.split(" ");
        options = Object.assign(url ? { method, url } : { url: method }, options);
    }
    else {
        options = Object.assign({}, route);
    }
    // lowercase header names before merging with defaults to avoid duplicates
    options.headers = lowercaseKeys(options.headers);
    // remove properties with undefined values before merging
    removeUndefinedProperties(options);
    removeUndefinedProperties(options.headers);
    const mergedOptions = mergeDeep(defaults || {}, options);
    // mediaType.previews arrays are merged, instead of overwritten
    if (defaults && defaults.mediaType.previews.length) {
        mergedOptions.mediaType.previews = defaults.mediaType.previews
            .filter((preview) => !mergedOptions.mediaType.previews.includes(preview))
            .concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map((preview) => preview.replace(/-preview/, ""));
    return mergedOptions;
}

function addQueryParameters(url, parameters) {
    const separator = /\?/.test(url) ? "&" : "?";
    const names = Object.keys(parameters);
    if (names.length === 0) {
        return url;
    }
    return (url +
        separator +
        names
            .map((name) => {
            if (name === "q") {
                return ("q=" + parameters.q.split("+").map(encodeURIComponent).join("+"));
            }
            return `${name}=${encodeURIComponent(parameters[name])}`;
        })
            .join("&"));
}

const urlVariableRegex = /\{[^}]+\}/g;
function removeNonChars(variableName) {
    return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
    const matches = url.match(urlVariableRegex);
    if (!matches) {
        return [];
    }
    return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
    return Object.keys(object)
        .filter((option) => !keysToOmit.includes(option))
        .reduce((obj, key) => {
        obj[key] = object[key];
        return obj;
    }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
/* istanbul ignore file */
function encodeReserved(str) {
    return str
        .split(/(%[0-9A-Fa-f]{2})/g)
        .map(function (part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
        }
        return part;
    })
        .join("");
}
function encodeUnreserved(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}
function encodeValue(operator, value, key) {
    value =
        operator === "+" || operator === "#"
            ? encodeReserved(value)
            : encodeUnreserved(value);
    if (key) {
        return encodeUnreserved(key) + "=" + value;
    }
    else {
        return value;
    }
}
function isDefined(value) {
    return value !== undefined && value !== null;
}
function isKeyOperator(operator) {
    return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
    var value = context[key], result = [];
    if (isDefined(value) && value !== "") {
        if (typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean") {
            value = value.toString();
            if (modifier && modifier !== "*") {
                value = value.substring(0, parseInt(modifier, 10));
            }
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
        }
        else {
            if (modifier === "*") {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
                    });
                }
                else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            }
            else {
                const tmp = [];
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        tmp.push(encodeValue(operator, value));
                    });
                }
                else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeUnreserved(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }
                if (isKeyOperator(operator)) {
                    result.push(encodeUnreserved(key) + "=" + tmp.join(","));
                }
                else if (tmp.length !== 0) {
                    result.push(tmp.join(","));
                }
            }
        }
    }
    else {
        if (operator === ";") {
            if (isDefined(value)) {
                result.push(encodeUnreserved(key));
            }
        }
        else if (value === "" && (operator === "&" || operator === "?")) {
            result.push(encodeUnreserved(key) + "=");
        }
        else if (value === "") {
            result.push("");
        }
    }
    return result;
}
function parseUrl(template) {
    return {
        expand: expand.bind(null, template),
    };
}
function expand(template, context) {
    var operators = ["+", "#", ".", "/", ";", "?", "&"];
    return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
        if (expression) {
            let operator = "";
            const values = [];
            if (operators.indexOf(expression.charAt(0)) !== -1) {
                operator = expression.charAt(0);
                expression = expression.substr(1);
            }
            expression.split(/,/g).forEach(function (variable) {
                var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
            });
            if (operator && operator !== "+") {
                var separator = ",";
                if (operator === "?") {
                    separator = "&";
                }
                else if (operator !== "#") {
                    separator = operator;
                }
                return (values.length !== 0 ? operator : "") + values.join(separator);
            }
            else {
                return values.join(",");
            }
        }
        else {
            return encodeReserved(literal);
        }
    });
}

function parse(options) {
    // https://fetch.spec.whatwg.org/#methods
    let method = options.method.toUpperCase();
    // replace :varname with {varname} to make it RFC 6570 compatible
    let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
    let headers = Object.assign({}, options.headers);
    let body;
    let parameters = omit(options, [
        "method",
        "baseUrl",
        "url",
        "headers",
        "request",
        "mediaType",
    ]);
    // extract variable names from URL to calculate remaining variables later
    const urlVariableNames = extractUrlVariableNames(url);
    url = parseUrl(url).expand(parameters);
    if (!/^http/.test(url)) {
        url = options.baseUrl + url;
    }
    const omittedParameters = Object.keys(options)
        .filter((option) => urlVariableNames.includes(option))
        .concat("baseUrl");
    const remainingParameters = omit(parameters, omittedParameters);
    const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
    if (!isBinaryRequest) {
        if (options.mediaType.format) {
            // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
            headers.accept = headers.accept
                .split(/,/)
                .map((preview) => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`))
                .join(",");
        }
        if (options.mediaType.previews.length) {
            const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
            headers.accept = previewsFromAcceptHeader
                .concat(options.mediaType.previews)
                .map((preview) => {
                const format = options.mediaType.format
                    ? `.${options.mediaType.format}`
                    : "+json";
                return `application/vnd.github.${preview}-preview${format}`;
            })
                .join(",");
        }
    }
    // for GET/HEAD requests, set URL query parameters from remaining parameters
    // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters
    if (["GET", "HEAD"].includes(method)) {
        url = addQueryParameters(url, remainingParameters);
    }
    else {
        if ("data" in remainingParameters) {
            body = remainingParameters.data;
        }
        else {
            if (Object.keys(remainingParameters).length) {
                body = remainingParameters;
            }
        }
    }
    // default content-type for JSON if body is set
    if (!headers["content-type"] && typeof body !== "undefined") {
        headers["content-type"] = "application/json; charset=utf-8";
    }
    // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
    // fetch does not allow to set `content-length` header, but we can set body to an empty string
    if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
        body = "";
    }
    // Only return body/request keys if present
    return Object.assign({ method, url, headers }, typeof body !== "undefined" ? { body } : null, options.request ? { request: options.request } : null);
}

function endpointWithDefaults(defaults, route, options) {
    return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
    const DEFAULTS = merge(oldDefaults, newDefaults);
    const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
    return Object.assign(endpoint, {
        DEFAULTS,
        defaults: withDefaults.bind(null, DEFAULTS),
        merge: merge.bind(null, DEFAULTS),
        parse,
    });
}

const VERSION = "7.0.2";

const userAgent = `octokit-endpoint.js/${VERSION} ${(0,dist_web.getUserAgent)()}`;
// DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.
const DEFAULTS = {
    method: "GET",
    baseUrl: "https://api.github.com",
    headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
    },
    mediaType: {
        format: "",
        previews: [],
    },
};

const endpoint = withDefaults(null, DEFAULTS);


//# sourceMappingURL=index.js.map

// EXTERNAL MODULE: ./node_modules/node-fetch/browser.js
var browser = __webpack_require__(3300);
var browser_default = /*#__PURE__*/__webpack_require__.n(browser);
// EXTERNAL MODULE: ./node_modules/@octokit/request-error/dist-web/index.js
var request_error_dist_web = __webpack_require__(640);
;// CONCATENATED MODULE: ./node_modules/@octokit/request/dist-web/index.js






const dist_web_VERSION = "6.2.1";

function getBufferResponse(response) {
    return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
    const log = requestOptions.request && requestOptions.request.log
        ? requestOptions.request.log
        : console;
    if (isPlainObject(requestOptions.body) ||
        Array.isArray(requestOptions.body)) {
        requestOptions.body = JSON.stringify(requestOptions.body);
    }
    let headers = {};
    let status;
    let url;
    const fetch = (requestOptions.request && requestOptions.request.fetch) ||
        globalThis.fetch ||
        /* istanbul ignore next */ (browser_default());
    return fetch(requestOptions.url, Object.assign({
        method: requestOptions.method,
        body: requestOptions.body,
        headers: requestOptions.headers,
        redirect: requestOptions.redirect,
    }, 
    // `requestOptions.request.agent` type is incompatible
    // see https://github.com/octokit/types.ts/pull/264
    requestOptions.request))
        .then(async (response) => {
        url = response.url;
        status = response.status;
        for (const keyAndValue of response.headers) {
            headers[keyAndValue[0]] = keyAndValue[1];
        }
        if ("deprecation" in headers) {
            const matches = headers.link && headers.link.match(/<([^>]+)>; rel="deprecation"/);
            const deprecationLink = matches && matches.pop();
            log.warn(`[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${headers.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`);
        }
        if (status === 204 || status === 205) {
            return;
        }
        // GitHub API returns 200 for HEAD requests
        if (requestOptions.method === "HEAD") {
            if (status < 400) {
                return;
            }
            throw new request_error_dist_web.RequestError(response.statusText, status, {
                response: {
                    url,
                    status,
                    headers,
                    data: undefined,
                },
                request: requestOptions,
            });
        }
        if (status === 304) {
            throw new request_error_dist_web.RequestError("Not modified", status, {
                response: {
                    url,
                    status,
                    headers,
                    data: await getResponseData(response),
                },
                request: requestOptions,
            });
        }
        if (status >= 400) {
            const data = await getResponseData(response);
            const error = new request_error_dist_web.RequestError(toErrorMessage(data), status, {
                response: {
                    url,
                    status,
                    headers,
                    data,
                },
                request: requestOptions,
            });
            throw error;
        }
        return getResponseData(response);
    })
        .then((data) => {
        return {
            status,
            url,
            headers,
            data,
        };
    })
        .catch((error) => {
        if (error instanceof request_error_dist_web.RequestError)
            throw error;
        else if (error.name === "AbortError")
            throw error;
        throw new request_error_dist_web.RequestError(error.message, 500, {
            request: requestOptions,
        });
    });
}
async function getResponseData(response) {
    const contentType = response.headers.get("content-type");
    if (/application\/json/.test(contentType)) {
        return response.json();
    }
    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
        return response.text();
    }
    return getBufferResponse(response);
}
function toErrorMessage(data) {
    if (typeof data === "string")
        return data;
    // istanbul ignore else - just in case
    if ("message" in data) {
        if (Array.isArray(data.errors)) {
            return `${data.message}: ${data.errors.map(JSON.stringify).join(", ")}`;
        }
        return data.message;
    }
    // istanbul ignore next - just in case
    return `Unknown error: ${JSON.stringify(data)}`;
}

function dist_web_withDefaults(oldEndpoint, newDefaults) {
    const endpoint = oldEndpoint.defaults(newDefaults);
    const newApi = function (route, parameters) {
        const endpointOptions = endpoint.merge(route, parameters);
        if (!endpointOptions.request || !endpointOptions.request.hook) {
            return fetchWrapper(endpoint.parse(endpointOptions));
        }
        const request = (route, parameters) => {
            return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
        };
        Object.assign(request, {
            endpoint,
            defaults: dist_web_withDefaults.bind(null, endpoint),
        });
        return endpointOptions.request.hook(request, endpointOptions);
    };
    return Object.assign(newApi, {
        endpoint,
        defaults: dist_web_withDefaults.bind(null, endpoint),
    });
}

const request = dist_web_withDefaults(endpoint, {
    headers: {
        "user-agent": `octokit-request.js/${dist_web_VERSION} ${(0,dist_web.getUserAgent)()}`,
    },
});


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 5798:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Webhooks": function() { return /* binding */ Webhooks; },
  "createEventHandler": function() { return /* binding */ createEventHandler; },
  "createNodeMiddleware": function() { return /* binding */ createNodeMiddleware; },
  "emitterEventNames": function() { return /* binding */ emitterEventNames; }
});

// EXTERNAL MODULE: ./node_modules/aggregate-error/index.js
var aggregate_error = __webpack_require__(6455);
var aggregate_error_default = /*#__PURE__*/__webpack_require__.n(aggregate_error);
;// CONCATENATED MODULE: ./node_modules/@octokit/webhooks-methods/dist-web/index.js
const enc = new TextEncoder();
async function sign(secret, data) {
    const signature = await crypto.subtle.sign("HMAC", await importKey(secret), enc.encode(data));
    return UInt8ArrayToHex(signature);
}
async function verify(secret, data, signature) {
    return await crypto.subtle.verify("HMAC", await importKey(secret), hexToUInt8Array(signature), enc.encode(data));
}
function hexToUInt8Array(string) {
    // convert string to pairs of 2 characters
    const pairs = string.match(/[\dA-F]{2}/gi);
    // convert the octets to integers
    const integers = pairs.map(function (s) {
        return parseInt(s, 16);
    });
    return new Uint8Array(integers);
}
function UInt8ArrayToHex(signature) {
    return Array.prototype.map
        .call(new Uint8Array(signature), (x) => x.toString(16).padStart(2, "0"))
        .join("");
}
async function importKey(secret) {
    return crypto.subtle.importKey("raw", // raw format of the key - should be Uint8Array
    enc.encode(secret), {
        // algorithm details
        name: "HMAC",
        hash: { name: "SHA-256" },
    }, false, // export = false
    ["sign", "verify"] // what this key can do
    );
}


//# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./node_modules/@octokit/webhooks/dist-web/index.js



const createLogger = (logger) => ({
    debug: () => { },
    info: () => { },
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    ...logger,
});

// THIS FILE IS GENERATED - DO NOT EDIT DIRECTLY
// make edits in scripts/generate-types.ts
const emitterEventNames = [
    "branch_protection_rule",
    "branch_protection_rule.created",
    "branch_protection_rule.deleted",
    "branch_protection_rule.edited",
    "check_run",
    "check_run.completed",
    "check_run.created",
    "check_run.requested_action",
    "check_run.rerequested",
    "check_suite",
    "check_suite.completed",
    "check_suite.requested",
    "check_suite.rerequested",
    "code_scanning_alert",
    "code_scanning_alert.appeared_in_branch",
    "code_scanning_alert.closed_by_user",
    "code_scanning_alert.created",
    "code_scanning_alert.fixed",
    "code_scanning_alert.reopened",
    "code_scanning_alert.reopened_by_user",
    "commit_comment",
    "commit_comment.created",
    "create",
    "delete",
    "deploy_key",
    "deploy_key.created",
    "deploy_key.deleted",
    "deployment",
    "deployment.created",
    "deployment_status",
    "deployment_status.created",
    "discussion",
    "discussion.answered",
    "discussion.category_changed",
    "discussion.created",
    "discussion.deleted",
    "discussion.edited",
    "discussion.labeled",
    "discussion.locked",
    "discussion.pinned",
    "discussion.transferred",
    "discussion.unanswered",
    "discussion.unlabeled",
    "discussion.unlocked",
    "discussion.unpinned",
    "discussion_comment",
    "discussion_comment.created",
    "discussion_comment.deleted",
    "discussion_comment.edited",
    "fork",
    "github_app_authorization",
    "github_app_authorization.revoked",
    "gollum",
    "installation",
    "installation.created",
    "installation.deleted",
    "installation.new_permissions_accepted",
    "installation.suspend",
    "installation.unsuspend",
    "installation_repositories",
    "installation_repositories.added",
    "installation_repositories.removed",
    "issue_comment",
    "issue_comment.created",
    "issue_comment.deleted",
    "issue_comment.edited",
    "issues",
    "issues.assigned",
    "issues.closed",
    "issues.deleted",
    "issues.demilestoned",
    "issues.edited",
    "issues.labeled",
    "issues.locked",
    "issues.milestoned",
    "issues.opened",
    "issues.pinned",
    "issues.reopened",
    "issues.transferred",
    "issues.unassigned",
    "issues.unlabeled",
    "issues.unlocked",
    "issues.unpinned",
    "label",
    "label.created",
    "label.deleted",
    "label.edited",
    "marketplace_purchase",
    "marketplace_purchase.cancelled",
    "marketplace_purchase.changed",
    "marketplace_purchase.pending_change",
    "marketplace_purchase.pending_change_cancelled",
    "marketplace_purchase.purchased",
    "member",
    "member.added",
    "member.edited",
    "member.removed",
    "membership",
    "membership.added",
    "membership.removed",
    "merge_group",
    "merge_group.checks_requested",
    "meta",
    "meta.deleted",
    "milestone",
    "milestone.closed",
    "milestone.created",
    "milestone.deleted",
    "milestone.edited",
    "milestone.opened",
    "org_block",
    "org_block.blocked",
    "org_block.unblocked",
    "organization",
    "organization.deleted",
    "organization.member_added",
    "organization.member_invited",
    "organization.member_removed",
    "organization.renamed",
    "package",
    "package.published",
    "package.updated",
    "page_build",
    "ping",
    "project",
    "project.closed",
    "project.created",
    "project.deleted",
    "project.edited",
    "project.reopened",
    "project_card",
    "project_card.converted",
    "project_card.created",
    "project_card.deleted",
    "project_card.edited",
    "project_card.moved",
    "project_column",
    "project_column.created",
    "project_column.deleted",
    "project_column.edited",
    "project_column.moved",
    "projects_v2_item",
    "projects_v2_item.archived",
    "projects_v2_item.converted",
    "projects_v2_item.created",
    "projects_v2_item.deleted",
    "projects_v2_item.edited",
    "projects_v2_item.reordered",
    "projects_v2_item.restored",
    "public",
    "pull_request",
    "pull_request.assigned",
    "pull_request.auto_merge_disabled",
    "pull_request.auto_merge_enabled",
    "pull_request.closed",
    "pull_request.converted_to_draft",
    "pull_request.edited",
    "pull_request.labeled",
    "pull_request.locked",
    "pull_request.opened",
    "pull_request.ready_for_review",
    "pull_request.reopened",
    "pull_request.review_request_removed",
    "pull_request.review_requested",
    "pull_request.synchronize",
    "pull_request.unassigned",
    "pull_request.unlabeled",
    "pull_request.unlocked",
    "pull_request_review",
    "pull_request_review.dismissed",
    "pull_request_review.edited",
    "pull_request_review.submitted",
    "pull_request_review_comment",
    "pull_request_review_comment.created",
    "pull_request_review_comment.deleted",
    "pull_request_review_comment.edited",
    "pull_request_review_thread",
    "pull_request_review_thread.resolved",
    "pull_request_review_thread.unresolved",
    "push",
    "release",
    "release.created",
    "release.deleted",
    "release.edited",
    "release.prereleased",
    "release.published",
    "release.released",
    "release.unpublished",
    "repository",
    "repository.archived",
    "repository.created",
    "repository.deleted",
    "repository.edited",
    "repository.privatized",
    "repository.publicized",
    "repository.renamed",
    "repository.transferred",
    "repository.unarchived",
    "repository_dispatch",
    "repository_import",
    "repository_vulnerability_alert",
    "repository_vulnerability_alert.create",
    "repository_vulnerability_alert.dismiss",
    "repository_vulnerability_alert.reopen",
    "repository_vulnerability_alert.resolve",
    "secret_scanning_alert",
    "secret_scanning_alert.created",
    "secret_scanning_alert.reopened",
    "secret_scanning_alert.resolved",
    "security_advisory",
    "security_advisory.performed",
    "security_advisory.published",
    "security_advisory.updated",
    "security_advisory.withdrawn",
    "sponsorship",
    "sponsorship.cancelled",
    "sponsorship.created",
    "sponsorship.edited",
    "sponsorship.pending_cancellation",
    "sponsorship.pending_tier_change",
    "sponsorship.tier_changed",
    "star",
    "star.created",
    "star.deleted",
    "status",
    "team",
    "team.added_to_repository",
    "team.created",
    "team.deleted",
    "team.edited",
    "team.removed_from_repository",
    "team_add",
    "watch",
    "watch.started",
    "workflow_dispatch",
    "workflow_job",
    "workflow_job.completed",
    "workflow_job.in_progress",
    "workflow_job.queued",
    "workflow_run",
    "workflow_run.completed",
    "workflow_run.requested",
];

function handleEventHandlers(state, webhookName, handler) {
    if (!state.hooks[webhookName]) {
        state.hooks[webhookName] = [];
    }
    state.hooks[webhookName].push(handler);
}
function receiverOn(state, webhookNameOrNames, handler) {
    if (Array.isArray(webhookNameOrNames)) {
        webhookNameOrNames.forEach((webhookName) => receiverOn(state, webhookName, handler));
        return;
    }
    if (["*", "error"].includes(webhookNameOrNames)) {
        const webhookName = webhookNameOrNames === "*" ? "any" : webhookNameOrNames;
        const message = `Using the "${webhookNameOrNames}" event with the regular Webhooks.on() function is not supported. Please use the Webhooks.on${webhookName.charAt(0).toUpperCase() + webhookName.slice(1)}() method instead`;
        throw new Error(message);
    }
    if (!emitterEventNames.includes(webhookNameOrNames)) {
        state.log.warn(`"${webhookNameOrNames}" is not a known webhook name (https://developer.github.com/v3/activity/events/types/)`);
    }
    handleEventHandlers(state, webhookNameOrNames, handler);
}
function receiverOnAny(state, handler) {
    handleEventHandlers(state, "*", handler);
}
function receiverOnError(state, handler) {
    handleEventHandlers(state, "error", handler);
}

// Errors thrown or rejected Promises in "error" event handlers are not handled
// as they are in the webhook event handlers. If errors occur, we log a
// "Fatal: Error occurred" message to stdout
function wrapErrorHandler(handler, error) {
    let returnValue;
    try {
        returnValue = handler(error);
    }
    catch (error) {
        console.log('FATAL: Error occurred in "error" event handler');
        console.log(error);
    }
    if (returnValue && returnValue.catch) {
        returnValue.catch((error) => {
            console.log('FATAL: Error occurred in "error" event handler');
            console.log(error);
        });
    }
}

// @ts-ignore to address #245
function getHooks(state, eventPayloadAction, eventName) {
    const hooks = [state.hooks[eventName], state.hooks["*"]];
    if (eventPayloadAction) {
        hooks.unshift(state.hooks[`${eventName}.${eventPayloadAction}`]);
    }
    return [].concat(...hooks.filter(Boolean));
}
// main handler function
function receiverHandle(state, event) {
    const errorHandlers = state.hooks.error || [];
    if (event instanceof Error) {
        const error = Object.assign(new (aggregate_error_default())([event]), {
            event,
            errors: [event],
        });
        errorHandlers.forEach((handler) => wrapErrorHandler(handler, error));
        return Promise.reject(error);
    }
    if (!event || !event.name) {
        throw new (aggregate_error_default())(["Event name not passed"]);
    }
    if (!event.payload) {
        throw new (aggregate_error_default())(["Event payload not passed"]);
    }
    // flatten arrays of event listeners and remove undefined values
    const hooks = getHooks(state, "action" in event.payload ? event.payload.action : null, event.name);
    if (hooks.length === 0) {
        return Promise.resolve();
    }
    const errors = [];
    const promises = hooks.map((handler) => {
        let promise = Promise.resolve(event);
        if (state.transform) {
            promise = promise.then(state.transform);
        }
        return promise
            .then((event) => {
            return handler(event);
        })
            .catch((error) => errors.push(Object.assign(error, { event })));
    });
    return Promise.all(promises).then(() => {
        if (errors.length === 0) {
            return;
        }
        const error = new (aggregate_error_default())(errors);
        Object.assign(error, {
            event,
            errors,
        });
        errorHandlers.forEach((handler) => wrapErrorHandler(handler, error));
        throw error;
    });
}

function removeListener(state, webhookNameOrNames, handler) {
    if (Array.isArray(webhookNameOrNames)) {
        webhookNameOrNames.forEach((webhookName) => removeListener(state, webhookName, handler));
        return;
    }
    if (!state.hooks[webhookNameOrNames]) {
        return;
    }
    // remove last hook that has been added, that way
    // it behaves the same as removeListener
    for (let i = state.hooks[webhookNameOrNames].length - 1; i >= 0; i--) {
        if (state.hooks[webhookNameOrNames][i] === handler) {
            state.hooks[webhookNameOrNames].splice(i, 1);
            return;
        }
    }
}

function createEventHandler(options) {
    const state = {
        hooks: {},
        log: createLogger(options && options.log),
    };
    if (options && options.transform) {
        state.transform = options.transform;
    }
    return {
        on: receiverOn.bind(null, state),
        onAny: receiverOnAny.bind(null, state),
        onError: receiverOnError.bind(null, state),
        removeListener: removeListener.bind(null, state),
        receive: receiverHandle.bind(null, state),
    };
}

/**
 * GitHub sends its JSON with an indentation of 2 spaces and a line break at the end
 */
function toNormalizedJsonString(payload) {
    const payloadString = JSON.stringify(payload);
    return payloadString.replace(/[^\\]\\u[\da-f]{4}/g, (s) => {
        return s.substr(0, 3) + s.substr(3).toUpperCase();
    });
}

async function dist_web_sign(secret, payload) {
    return sign(secret, typeof payload === "string" ? payload : toNormalizedJsonString(payload));
}

async function dist_web_verify(secret, payload, signature) {
    return verify(secret, typeof payload === "string" ? payload : toNormalizedJsonString(payload), signature);
}

async function verifyAndReceive(state, event) {
    // verify will validate that the secret is not undefined
    const matchesSignature = await verify(state.secret, typeof event.payload === "object"
        ? toNormalizedJsonString(event.payload)
        : event.payload, event.signature);
    if (!matchesSignature) {
        const error = new Error("[@octokit/webhooks] signature does not match event payload and secret");
        return state.eventHandler.receive(Object.assign(error, { event, status: 400 }));
    }
    return state.eventHandler.receive({
        id: event.id,
        name: event.name,
        payload: typeof event.payload === "string"
            ? JSON.parse(event.payload)
            : event.payload,
    });
}

const WEBHOOK_HEADERS = [
    "x-github-event",
    "x-hub-signature-256",
    "x-github-delivery",
];
// https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads#delivery-headers
function getMissingHeaders(request) {
    return WEBHOOK_HEADERS.filter((header) => !(header in request.headers));
}

// @ts-ignore to address #245
function getPayload(request) {
    // If request.body already exists we can stop here
    // See https://github.com/octokit/webhooks.js/pull/23
    if (request.body)
        return Promise.resolve(request.body);
    return new Promise((resolve, reject) => {
        let data = "";
        request.setEncoding("utf8");
        // istanbul ignore next
        request.on("error", (error) => reject(new (aggregate_error_default())([error])));
        request.on("data", (chunk) => (data += chunk));
        request.on("end", () => {
            try {
                resolve(JSON.parse(data));
            }
            catch (error) {
                error.message = "Invalid JSON";
                error.status = 400;
                reject(new (aggregate_error_default())([error]));
            }
        });
    });
}

async function middleware(webhooks, options, request, response, next) {
    let pathname;
    try {
        pathname = new URL(request.url, "http://localhost").pathname;
    }
    catch (error) {
        response.writeHead(422, {
            "content-type": "application/json",
        });
        response.end(JSON.stringify({
            error: `Request URL could not be parsed: ${request.url}`,
        }));
        return;
    }
    const isUnknownRoute = request.method !== "POST" || pathname !== options.path;
    const isExpressMiddleware = typeof next === "function";
    if (isUnknownRoute) {
        if (isExpressMiddleware) {
            return next();
        }
        else {
            return options.onUnhandledRequest(request, response);
        }
    }
    const missingHeaders = getMissingHeaders(request).join(", ");
    if (missingHeaders) {
        response.writeHead(400, {
            "content-type": "application/json",
        });
        response.end(JSON.stringify({
            error: `Required headers missing: ${missingHeaders}`,
        }));
        return;
    }
    const eventName = request.headers["x-github-event"];
    const signatureSHA256 = request.headers["x-hub-signature-256"];
    const id = request.headers["x-github-delivery"];
    options.log.debug(`${eventName} event received (id: ${id})`);
    // GitHub will abort the request if it does not receive a response within 10s
    // See https://github.com/octokit/webhooks.js/issues/185
    let didTimeout = false;
    const timeout = setTimeout(() => {
        didTimeout = true;
        response.statusCode = 202;
        response.end("still processing\n");
    }, 9000).unref();
    try {
        const payload = await getPayload(request);
        await webhooks.verifyAndReceive({
            id: id,
            name: eventName,
            payload: payload,
            signature: signatureSHA256,
        });
        clearTimeout(timeout);
        if (didTimeout)
            return;
        response.end("ok\n");
    }
    catch (error) {
        clearTimeout(timeout);
        if (didTimeout)
            return;
        const err = Array.from(error)[0];
        const errorMessage = err.message
            ? `${err.name}: ${err.message}`
            : "Error: An Unspecified error occurred";
        response.statusCode = typeof err.status !== "undefined" ? err.status : 500;
        options.log.error(error);
        response.end(JSON.stringify({
            error: errorMessage,
        }));
    }
}

function onUnhandledRequestDefault(request, response) {
    response.writeHead(404, {
        "content-type": "application/json",
    });
    response.end(JSON.stringify({
        error: `Unknown route: ${request.method} ${request.url}`,
    }));
}

function createNodeMiddleware(webhooks, { path = "/api/github/webhooks", onUnhandledRequest = onUnhandledRequestDefault, log = createLogger(), } = {}) {
    return middleware.bind(null, webhooks, {
        path,
        onUnhandledRequest,
        log,
    });
}

// U holds the return value of `transform` function in Options
class Webhooks {
    constructor(options) {
        if (!options || !options.secret) {
            throw new Error("[@octokit/webhooks] options.secret required");
        }
        const state = {
            eventHandler: createEventHandler(options),
            secret: options.secret,
            hooks: {},
            log: createLogger(options.log),
        };
        this.sign = dist_web_sign.bind(null, options.secret);
        this.verify = dist_web_verify.bind(null, options.secret);
        this.on = state.eventHandler.on;
        this.onAny = state.eventHandler.onAny;
        this.onError = state.eventHandler.onError;
        this.removeListener = state.eventHandler.removeListener;
        this.receive = state.eventHandler.receive;
        this.verifyAndReceive = verifyAndReceive.bind(null, state);
    }
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6455:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

const indentString = __webpack_require__(5602);
const cleanStack = __webpack_require__(5281);

const cleanInternalStack = stack => stack.replace(/\s+at .*aggregate-error\/index.js:\d+:\d+\)?/g, '');

class AggregateError extends Error {
	constructor(errors) {
		if (!Array.isArray(errors)) {
			throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
		}

		errors = [...errors].map(error => {
			if (error instanceof Error) {
				return error;
			}

			if (error !== null && typeof error === 'object') {
				// Handle plain error objects with message property and/or possibly other metadata
				return Object.assign(new Error(error.message), error);
			}

			return new Error(error);
		});

		let message = errors
			.map(error => {
				// The `stack` property is not standardized, so we can't assume it exists
				return typeof error.stack === 'string' ? cleanInternalStack(cleanStack(error.stack)) : String(error);
			})
			.join('\n');
		message = '\n' + indentString(message, 4);
		super(message);

		this.name = 'AggregateError';

		Object.defineProperty(this, '_errors', {value: errors});
	}

	* [Symbol.iterator]() {
		for (const error of this._errors) {
			yield error;
		}
	}
}

module.exports = AggregateError;


/***/ }),

/***/ 5186:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var register = __webpack_require__(3698)
var addHook = __webpack_require__(2505)
var removeHook = __webpack_require__(6417)

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),

/***/ 2505:
/***/ (function(module) {

module.exports = addHook;

function addHook(state, kind, name, hook) {
  var orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === "before") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options));
    };
  }

  if (kind === "after") {
    hook = function (method, options) {
      var result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_;
          return orig(result, options);
        })
        .then(function () {
          return result;
        });
    };
  }

  if (kind === "error") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options);
        });
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig,
  });
}


/***/ }),

/***/ 3698:
/***/ (function(module) {

module.exports = register;

function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options);
    }, method)();
  }

  return Promise.resolve().then(function () {
    if (!state.registry[name]) {
      return method(options);
    }

    return state.registry[name].reduce(function (method, registered) {
      return registered.hook.bind(null, method, options);
    }, method)();
  });
}


/***/ }),

/***/ 6417:
/***/ (function(module) {

module.exports = removeHook;

function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }

  var index = state.registry[name]
    .map(function (registered) {
      return registered.orig;
    })
    .indexOf(method);

  if (index === -1) {
    return;
  }

  state.registry[name].splice(index, 1);
}


/***/ }),

/***/ 1209:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
  * This file contains the Bottleneck library (MIT), compiled to ES2017, and without Clustering support.
  * https://github.com/SGrondin/bottleneck
  */
(function (global, factory) {
	 true ? module.exports = factory() :
	0;
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var load = function(received, defaults, onto = {}) {
	  var k, ref, v;
	  for (k in defaults) {
	    v = defaults[k];
	    onto[k] = (ref = received[k]) != null ? ref : v;
	  }
	  return onto;
	};

	var overwrite = function(received, defaults, onto = {}) {
	  var k, v;
	  for (k in received) {
	    v = received[k];
	    if (defaults[k] !== void 0) {
	      onto[k] = v;
	    }
	  }
	  return onto;
	};

	var parser = {
		load: load,
		overwrite: overwrite
	};

	var DLList;

	DLList = class DLList {
	  constructor(incr, decr) {
	    this.incr = incr;
	    this.decr = decr;
	    this._first = null;
	    this._last = null;
	    this.length = 0;
	  }

	  push(value) {
	    var node;
	    this.length++;
	    if (typeof this.incr === "function") {
	      this.incr();
	    }
	    node = {
	      value,
	      prev: this._last,
	      next: null
	    };
	    if (this._last != null) {
	      this._last.next = node;
	      this._last = node;
	    } else {
	      this._first = this._last = node;
	    }
	    return void 0;
	  }

	  shift() {
	    var value;
	    if (this._first == null) {
	      return;
	    } else {
	      this.length--;
	      if (typeof this.decr === "function") {
	        this.decr();
	      }
	    }
	    value = this._first.value;
	    if ((this._first = this._first.next) != null) {
	      this._first.prev = null;
	    } else {
	      this._last = null;
	    }
	    return value;
	  }

	  first() {
	    if (this._first != null) {
	      return this._first.value;
	    }
	  }

	  getArray() {
	    var node, ref, results;
	    node = this._first;
	    results = [];
	    while (node != null) {
	      results.push((ref = node, node = node.next, ref.value));
	    }
	    return results;
	  }

	  forEachShift(cb) {
	    var node;
	    node = this.shift();
	    while (node != null) {
	      (cb(node), node = this.shift());
	    }
	    return void 0;
	  }

	  debug() {
	    var node, ref, ref1, ref2, results;
	    node = this._first;
	    results = [];
	    while (node != null) {
	      results.push((ref = node, node = node.next, {
	        value: ref.value,
	        prev: (ref1 = ref.prev) != null ? ref1.value : void 0,
	        next: (ref2 = ref.next) != null ? ref2.value : void 0
	      }));
	    }
	    return results;
	  }

	};

	var DLList_1 = DLList;

	var Events;

	Events = class Events {
	  constructor(instance) {
	    this.instance = instance;
	    this._events = {};
	    if ((this.instance.on != null) || (this.instance.once != null) || (this.instance.removeAllListeners != null)) {
	      throw new Error("An Emitter already exists for this object");
	    }
	    this.instance.on = (name, cb) => {
	      return this._addListener(name, "many", cb);
	    };
	    this.instance.once = (name, cb) => {
	      return this._addListener(name, "once", cb);
	    };
	    this.instance.removeAllListeners = (name = null) => {
	      if (name != null) {
	        return delete this._events[name];
	      } else {
	        return this._events = {};
	      }
	    };
	  }

	  _addListener(name, status, cb) {
	    var base;
	    if ((base = this._events)[name] == null) {
	      base[name] = [];
	    }
	    this._events[name].push({cb, status});
	    return this.instance;
	  }

	  listenerCount(name) {
	    if (this._events[name] != null) {
	      return this._events[name].length;
	    } else {
	      return 0;
	    }
	  }

	  async trigger(name, ...args) {
	    var e, promises;
	    try {
	      if (name !== "debug") {
	        this.trigger("debug", `Event triggered: ${name}`, args);
	      }
	      if (this._events[name] == null) {
	        return;
	      }
	      this._events[name] = this._events[name].filter(function(listener) {
	        return listener.status !== "none";
	      });
	      promises = this._events[name].map(async(listener) => {
	        var e, returned;
	        if (listener.status === "none") {
	          return;
	        }
	        if (listener.status === "once") {
	          listener.status = "none";
	        }
	        try {
	          returned = typeof listener.cb === "function" ? listener.cb(...args) : void 0;
	          if (typeof (returned != null ? returned.then : void 0) === "function") {
	            return (await returned);
	          } else {
	            return returned;
	          }
	        } catch (error) {
	          e = error;
	          {
	            this.trigger("error", e);
	          }
	          return null;
	        }
	      });
	      return ((await Promise.all(promises))).find(function(x) {
	        return x != null;
	      });
	    } catch (error) {
	      e = error;
	      {
	        this.trigger("error", e);
	      }
	      return null;
	    }
	  }

	};

	var Events_1 = Events;

	var DLList$1, Events$1, Queues;

	DLList$1 = DLList_1;

	Events$1 = Events_1;

	Queues = class Queues {
	  constructor(num_priorities) {
	    var i;
	    this.Events = new Events$1(this);
	    this._length = 0;
	    this._lists = (function() {
	      var j, ref, results;
	      results = [];
	      for (i = j = 1, ref = num_priorities; (1 <= ref ? j <= ref : j >= ref); i = 1 <= ref ? ++j : --j) {
	        results.push(new DLList$1((() => {
	          return this.incr();
	        }), (() => {
	          return this.decr();
	        })));
	      }
	      return results;
	    }).call(this);
	  }

	  incr() {
	    if (this._length++ === 0) {
	      return this.Events.trigger("leftzero");
	    }
	  }

	  decr() {
	    if (--this._length === 0) {
	      return this.Events.trigger("zero");
	    }
	  }

	  push(job) {
	    return this._lists[job.options.priority].push(job);
	  }

	  queued(priority) {
	    if (priority != null) {
	      return this._lists[priority].length;
	    } else {
	      return this._length;
	    }
	  }

	  shiftAll(fn) {
	    return this._lists.forEach(function(list) {
	      return list.forEachShift(fn);
	    });
	  }

	  getFirst(arr = this._lists) {
	    var j, len, list;
	    for (j = 0, len = arr.length; j < len; j++) {
	      list = arr[j];
	      if (list.length > 0) {
	        return list;
	      }
	    }
	    return [];
	  }

	  shiftLastFrom(priority) {
	    return this.getFirst(this._lists.slice(priority).reverse()).shift();
	  }

	};

	var Queues_1 = Queues;

	var BottleneckError;

	BottleneckError = class BottleneckError extends Error {};

	var BottleneckError_1 = BottleneckError;

	var BottleneckError$1, DEFAULT_PRIORITY, Job, NUM_PRIORITIES, parser$1;

	NUM_PRIORITIES = 10;

	DEFAULT_PRIORITY = 5;

	parser$1 = parser;

	BottleneckError$1 = BottleneckError_1;

	Job = class Job {
	  constructor(task, args, options, jobDefaults, rejectOnDrop, Events, _states, Promise) {
	    this.task = task;
	    this.args = args;
	    this.rejectOnDrop = rejectOnDrop;
	    this.Events = Events;
	    this._states = _states;
	    this.Promise = Promise;
	    this.options = parser$1.load(options, jobDefaults);
	    this.options.priority = this._sanitizePriority(this.options.priority);
	    if (this.options.id === jobDefaults.id) {
	      this.options.id = `${this.options.id}-${this._randomIndex()}`;
	    }
	    this.promise = new this.Promise((_resolve, _reject) => {
	      this._resolve = _resolve;
	      this._reject = _reject;
	    });
	    this.retryCount = 0;
	  }

	  _sanitizePriority(priority) {
	    var sProperty;
	    sProperty = ~~priority !== priority ? DEFAULT_PRIORITY : priority;
	    if (sProperty < 0) {
	      return 0;
	    } else if (sProperty > NUM_PRIORITIES - 1) {
	      return NUM_PRIORITIES - 1;
	    } else {
	      return sProperty;
	    }
	  }

	  _randomIndex() {
	    return Math.random().toString(36).slice(2);
	  }

	  doDrop({error, message = "This job has been dropped by Bottleneck"} = {}) {
	    if (this._states.remove(this.options.id)) {
	      if (this.rejectOnDrop) {
	        this._reject(error != null ? error : new BottleneckError$1(message));
	      }
	      this.Events.trigger("dropped", {args: this.args, options: this.options, task: this.task, promise: this.promise});
	      return true;
	    } else {
	      return false;
	    }
	  }

	  _assertStatus(expected) {
	    var status;
	    status = this._states.jobStatus(this.options.id);
	    if (!(status === expected || (expected === "DONE" && status === null))) {
	      throw new BottleneckError$1(`Invalid job status ${status}, expected ${expected}. Please open an issue at https://github.com/SGrondin/bottleneck/issues`);
	    }
	  }

	  doReceive() {
	    this._states.start(this.options.id);
	    return this.Events.trigger("received", {args: this.args, options: this.options});
	  }

	  doQueue(reachedHWM, blocked) {
	    this._assertStatus("RECEIVED");
	    this._states.next(this.options.id);
	    return this.Events.trigger("queued", {args: this.args, options: this.options, reachedHWM, blocked});
	  }

	  doRun() {
	    if (this.retryCount === 0) {
	      this._assertStatus("QUEUED");
	      this._states.next(this.options.id);
	    } else {
	      this._assertStatus("EXECUTING");
	    }
	    return this.Events.trigger("scheduled", {args: this.args, options: this.options});
	  }

	  async doExecute(chained, clearGlobalState, run, free) {
	    var error, eventInfo, passed;
	    if (this.retryCount === 0) {
	      this._assertStatus("RUNNING");
	      this._states.next(this.options.id);
	    } else {
	      this._assertStatus("EXECUTING");
	    }
	    eventInfo = {args: this.args, options: this.options, retryCount: this.retryCount};
	    this.Events.trigger("executing", eventInfo);
	    try {
	      passed = (await (chained != null ? chained.schedule(this.options, this.task, ...this.args) : this.task(...this.args)));
	      if (clearGlobalState()) {
	        this.doDone(eventInfo);
	        await free(this.options, eventInfo);
	        this._assertStatus("DONE");
	        return this._resolve(passed);
	      }
	    } catch (error1) {
	      error = error1;
	      return this._onFailure(error, eventInfo, clearGlobalState, run, free);
	    }
	  }

	  doExpire(clearGlobalState, run, free) {
	    var error, eventInfo;
	    if (this._states.jobStatus(this.options.id === "RUNNING")) {
	      this._states.next(this.options.id);
	    }
	    this._assertStatus("EXECUTING");
	    eventInfo = {args: this.args, options: this.options, retryCount: this.retryCount};
	    error = new BottleneckError$1(`This job timed out after ${this.options.expiration} ms.`);
	    return this._onFailure(error, eventInfo, clearGlobalState, run, free);
	  }

	  async _onFailure(error, eventInfo, clearGlobalState, run, free) {
	    var retry, retryAfter;
	    if (clearGlobalState()) {
	      retry = (await this.Events.trigger("failed", error, eventInfo));
	      if (retry != null) {
	        retryAfter = ~~retry;
	        this.Events.trigger("retry", `Retrying ${this.options.id} after ${retryAfter} ms`, eventInfo);
	        this.retryCount++;
	        return run(retryAfter);
	      } else {
	        this.doDone(eventInfo);
	        await free(this.options, eventInfo);
	        this._assertStatus("DONE");
	        return this._reject(error);
	      }
	    }
	  }

	  doDone(eventInfo) {
	    this._assertStatus("EXECUTING");
	    this._states.next(this.options.id);
	    return this.Events.trigger("done", eventInfo);
	  }

	};

	var Job_1 = Job;

	var BottleneckError$2, LocalDatastore, parser$2;

	parser$2 = parser;

	BottleneckError$2 = BottleneckError_1;

	LocalDatastore = class LocalDatastore {
	  constructor(instance, storeOptions, storeInstanceOptions) {
	    this.instance = instance;
	    this.storeOptions = storeOptions;
	    this.clientId = this.instance._randomIndex();
	    parser$2.load(storeInstanceOptions, storeInstanceOptions, this);
	    this._nextRequest = this._lastReservoirRefresh = this._lastReservoirIncrease = Date.now();
	    this._running = 0;
	    this._done = 0;
	    this._unblockTime = 0;
	    this.ready = this.Promise.resolve();
	    this.clients = {};
	    this._startHeartbeat();
	  }

	  _startHeartbeat() {
	    var base;
	    if ((this.heartbeat == null) && (((this.storeOptions.reservoirRefreshInterval != null) && (this.storeOptions.reservoirRefreshAmount != null)) || ((this.storeOptions.reservoirIncreaseInterval != null) && (this.storeOptions.reservoirIncreaseAmount != null)))) {
	      return typeof (base = (this.heartbeat = setInterval(() => {
	        var amount, incr, maximum, now, reservoir;
	        now = Date.now();
	        if ((this.storeOptions.reservoirRefreshInterval != null) && now >= this._lastReservoirRefresh + this.storeOptions.reservoirRefreshInterval) {
	          this._lastReservoirRefresh = now;
	          this.storeOptions.reservoir = this.storeOptions.reservoirRefreshAmount;
	          this.instance._drainAll(this.computeCapacity());
	        }
	        if ((this.storeOptions.reservoirIncreaseInterval != null) && now >= this._lastReservoirIncrease + this.storeOptions.reservoirIncreaseInterval) {
	          ({
	            reservoirIncreaseAmount: amount,
	            reservoirIncreaseMaximum: maximum,
	            reservoir
	          } = this.storeOptions);
	          this._lastReservoirIncrease = now;
	          incr = maximum != null ? Math.min(amount, maximum - reservoir) : amount;
	          if (incr > 0) {
	            this.storeOptions.reservoir += incr;
	            return this.instance._drainAll(this.computeCapacity());
	          }
	        }
	      }, this.heartbeatInterval))).unref === "function" ? base.unref() : void 0;
	    } else {
	      return clearInterval(this.heartbeat);
	    }
	  }

	  async __publish__(message) {
	    await this.yieldLoop();
	    return this.instance.Events.trigger("message", message.toString());
	  }

	  async __disconnect__(flush) {
	    await this.yieldLoop();
	    clearInterval(this.heartbeat);
	    return this.Promise.resolve();
	  }

	  yieldLoop(t = 0) {
	    return new this.Promise(function(resolve, reject) {
	      return setTimeout(resolve, t);
	    });
	  }

	  computePenalty() {
	    var ref;
	    return (ref = this.storeOptions.penalty) != null ? ref : (15 * this.storeOptions.minTime) || 5000;
	  }

	  async __updateSettings__(options) {
	    await this.yieldLoop();
	    parser$2.overwrite(options, options, this.storeOptions);
	    this._startHeartbeat();
	    this.instance._drainAll(this.computeCapacity());
	    return true;
	  }

	  async __running__() {
	    await this.yieldLoop();
	    return this._running;
	  }

	  async __queued__() {
	    await this.yieldLoop();
	    return this.instance.queued();
	  }

	  async __done__() {
	    await this.yieldLoop();
	    return this._done;
	  }

	  async __groupCheck__(time) {
	    await this.yieldLoop();
	    return (this._nextRequest + this.timeout) < time;
	  }

	  computeCapacity() {
	    var maxConcurrent, reservoir;
	    ({maxConcurrent, reservoir} = this.storeOptions);
	    if ((maxConcurrent != null) && (reservoir != null)) {
	      return Math.min(maxConcurrent - this._running, reservoir);
	    } else if (maxConcurrent != null) {
	      return maxConcurrent - this._running;
	    } else if (reservoir != null) {
	      return reservoir;
	    } else {
	      return null;
	    }
	  }

	  conditionsCheck(weight) {
	    var capacity;
	    capacity = this.computeCapacity();
	    return (capacity == null) || weight <= capacity;
	  }

	  async __incrementReservoir__(incr) {
	    var reservoir;
	    await this.yieldLoop();
	    reservoir = this.storeOptions.reservoir += incr;
	    this.instance._drainAll(this.computeCapacity());
	    return reservoir;
	  }

	  async __currentReservoir__() {
	    await this.yieldLoop();
	    return this.storeOptions.reservoir;
	  }

	  isBlocked(now) {
	    return this._unblockTime >= now;
	  }

	  check(weight, now) {
	    return this.conditionsCheck(weight) && (this._nextRequest - now) <= 0;
	  }

	  async __check__(weight) {
	    var now;
	    await this.yieldLoop();
	    now = Date.now();
	    return this.check(weight, now);
	  }

	  async __register__(index, weight, expiration) {
	    var now, wait;
	    await this.yieldLoop();
	    now = Date.now();
	    if (this.conditionsCheck(weight)) {
	      this._running += weight;
	      if (this.storeOptions.reservoir != null) {
	        this.storeOptions.reservoir -= weight;
	      }
	      wait = Math.max(this._nextRequest - now, 0);
	      this._nextRequest = now + wait + this.storeOptions.minTime;
	      return {
	        success: true,
	        wait,
	        reservoir: this.storeOptions.reservoir
	      };
	    } else {
	      return {
	        success: false
	      };
	    }
	  }

	  strategyIsBlock() {
	    return this.storeOptions.strategy === 3;
	  }

	  async __submit__(queueLength, weight) {
	    var blocked, now, reachedHWM;
	    await this.yieldLoop();
	    if ((this.storeOptions.maxConcurrent != null) && weight > this.storeOptions.maxConcurrent) {
	      throw new BottleneckError$2(`Impossible to add a job having a weight of ${weight} to a limiter having a maxConcurrent setting of ${this.storeOptions.maxConcurrent}`);
	    }
	    now = Date.now();
	    reachedHWM = (this.storeOptions.highWater != null) && queueLength === this.storeOptions.highWater && !this.check(weight, now);
	    blocked = this.strategyIsBlock() && (reachedHWM || this.isBlocked(now));
	    if (blocked) {
	      this._unblockTime = now + this.computePenalty();
	      this._nextRequest = this._unblockTime + this.storeOptions.minTime;
	      this.instance._dropAllQueued();
	    }
	    return {
	      reachedHWM,
	      blocked,
	      strategy: this.storeOptions.strategy
	    };
	  }

	  async __free__(index, weight) {
	    await this.yieldLoop();
	    this._running -= weight;
	    this._done += weight;
	    this.instance._drainAll(this.computeCapacity());
	    return {
	      running: this._running
	    };
	  }

	};

	var LocalDatastore_1 = LocalDatastore;

	var BottleneckError$3, States;

	BottleneckError$3 = BottleneckError_1;

	States = class States {
	  constructor(status1) {
	    this.status = status1;
	    this._jobs = {};
	    this.counts = this.status.map(function() {
	      return 0;
	    });
	  }

	  next(id) {
	    var current, next;
	    current = this._jobs[id];
	    next = current + 1;
	    if ((current != null) && next < this.status.length) {
	      this.counts[current]--;
	      this.counts[next]++;
	      return this._jobs[id]++;
	    } else if (current != null) {
	      this.counts[current]--;
	      return delete this._jobs[id];
	    }
	  }

	  start(id) {
	    var initial;
	    initial = 0;
	    this._jobs[id] = initial;
	    return this.counts[initial]++;
	  }

	  remove(id) {
	    var current;
	    current = this._jobs[id];
	    if (current != null) {
	      this.counts[current]--;
	      delete this._jobs[id];
	    }
	    return current != null;
	  }

	  jobStatus(id) {
	    var ref;
	    return (ref = this.status[this._jobs[id]]) != null ? ref : null;
	  }

	  statusJobs(status) {
	    var k, pos, ref, results, v;
	    if (status != null) {
	      pos = this.status.indexOf(status);
	      if (pos < 0) {
	        throw new BottleneckError$3(`status must be one of ${this.status.join(', ')}`);
	      }
	      ref = this._jobs;
	      results = [];
	      for (k in ref) {
	        v = ref[k];
	        if (v === pos) {
	          results.push(k);
	        }
	      }
	      return results;
	    } else {
	      return Object.keys(this._jobs);
	    }
	  }

	  statusCounts() {
	    return this.counts.reduce(((acc, v, i) => {
	      acc[this.status[i]] = v;
	      return acc;
	    }), {});
	  }

	};

	var States_1 = States;

	var DLList$2, Sync;

	DLList$2 = DLList_1;

	Sync = class Sync {
	  constructor(name, Promise) {
	    this.schedule = this.schedule.bind(this);
	    this.name = name;
	    this.Promise = Promise;
	    this._running = 0;
	    this._queue = new DLList$2();
	  }

	  isEmpty() {
	    return this._queue.length === 0;
	  }

	  async _tryToRun() {
	    var args, cb, error, reject, resolve, returned, task;
	    if ((this._running < 1) && this._queue.length > 0) {
	      this._running++;
	      ({task, args, resolve, reject} = this._queue.shift());
	      cb = (await (async function() {
	        try {
	          returned = (await task(...args));
	          return function() {
	            return resolve(returned);
	          };
	        } catch (error1) {
	          error = error1;
	          return function() {
	            return reject(error);
	          };
	        }
	      })());
	      this._running--;
	      this._tryToRun();
	      return cb();
	    }
	  }

	  schedule(task, ...args) {
	    var promise, reject, resolve;
	    resolve = reject = null;
	    promise = new this.Promise(function(_resolve, _reject) {
	      resolve = _resolve;
	      return reject = _reject;
	    });
	    this._queue.push({task, args, resolve, reject});
	    this._tryToRun();
	    return promise;
	  }

	};

	var Sync_1 = Sync;

	var version = "2.19.5";
	var version$1 = {
		version: version
	};

	var version$2 = /*#__PURE__*/Object.freeze({
		version: version,
		default: version$1
	});

	var require$$2 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

	var require$$3 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

	var require$$4 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

	var Events$2, Group, IORedisConnection$1, RedisConnection$1, Scripts$1, parser$3;

	parser$3 = parser;

	Events$2 = Events_1;

	RedisConnection$1 = require$$2;

	IORedisConnection$1 = require$$3;

	Scripts$1 = require$$4;

	Group = (function() {
	  class Group {
	    constructor(limiterOptions = {}) {
	      this.deleteKey = this.deleteKey.bind(this);
	      this.limiterOptions = limiterOptions;
	      parser$3.load(this.limiterOptions, this.defaults, this);
	      this.Events = new Events$2(this);
	      this.instances = {};
	      this.Bottleneck = Bottleneck_1;
	      this._startAutoCleanup();
	      this.sharedConnection = this.connection != null;
	      if (this.connection == null) {
	        if (this.limiterOptions.datastore === "redis") {
	          this.connection = new RedisConnection$1(Object.assign({}, this.limiterOptions, {Events: this.Events}));
	        } else if (this.limiterOptions.datastore === "ioredis") {
	          this.connection = new IORedisConnection$1(Object.assign({}, this.limiterOptions, {Events: this.Events}));
	        }
	      }
	    }

	    key(key = "") {
	      var ref;
	      return (ref = this.instances[key]) != null ? ref : (() => {
	        var limiter;
	        limiter = this.instances[key] = new this.Bottleneck(Object.assign(this.limiterOptions, {
	          id: `${this.id}-${key}`,
	          timeout: this.timeout,
	          connection: this.connection
	        }));
	        this.Events.trigger("created", limiter, key);
	        return limiter;
	      })();
	    }

	    async deleteKey(key = "") {
	      var deleted, instance;
	      instance = this.instances[key];
	      if (this.connection) {
	        deleted = (await this.connection.__runCommand__(['del', ...Scripts$1.allKeys(`${this.id}-${key}`)]));
	      }
	      if (instance != null) {
	        delete this.instances[key];
	        await instance.disconnect();
	      }
	      return (instance != null) || deleted > 0;
	    }

	    limiters() {
	      var k, ref, results, v;
	      ref = this.instances;
	      results = [];
	      for (k in ref) {
	        v = ref[k];
	        results.push({
	          key: k,
	          limiter: v
	        });
	      }
	      return results;
	    }

	    keys() {
	      return Object.keys(this.instances);
	    }

	    async clusterKeys() {
	      var cursor, end, found, i, k, keys, len, next, start;
	      if (this.connection == null) {
	        return this.Promise.resolve(this.keys());
	      }
	      keys = [];
	      cursor = null;
	      start = `b_${this.id}-`.length;
	      end = "_settings".length;
	      while (cursor !== 0) {
	        [next, found] = (await this.connection.__runCommand__(["scan", cursor != null ? cursor : 0, "match", `b_${this.id}-*_settings`, "count", 10000]));
	        cursor = ~~next;
	        for (i = 0, len = found.length; i < len; i++) {
	          k = found[i];
	          keys.push(k.slice(start, -end));
	        }
	      }
	      return keys;
	    }

	    _startAutoCleanup() {
	      var base;
	      clearInterval(this.interval);
	      return typeof (base = (this.interval = setInterval(async() => {
	        var e, k, ref, results, time, v;
	        time = Date.now();
	        ref = this.instances;
	        results = [];
	        for (k in ref) {
	          v = ref[k];
	          try {
	            if ((await v._store.__groupCheck__(time))) {
	              results.push(this.deleteKey(k));
	            } else {
	              results.push(void 0);
	            }
	          } catch (error) {
	            e = error;
	            results.push(v.Events.trigger("error", e));
	          }
	        }
	        return results;
	      }, this.timeout / 2))).unref === "function" ? base.unref() : void 0;
	    }

	    updateSettings(options = {}) {
	      parser$3.overwrite(options, this.defaults, this);
	      parser$3.overwrite(options, options, this.limiterOptions);
	      if (options.timeout != null) {
	        return this._startAutoCleanup();
	      }
	    }

	    disconnect(flush = true) {
	      var ref;
	      if (!this.sharedConnection) {
	        return (ref = this.connection) != null ? ref.disconnect(flush) : void 0;
	      }
	    }

	  }
	  Group.prototype.defaults = {
	    timeout: 1000 * 60 * 5,
	    connection: null,
	    Promise: Promise,
	    id: "group-key"
	  };

	  return Group;

	}).call(commonjsGlobal);

	var Group_1 = Group;

	var Batcher, Events$3, parser$4;

	parser$4 = parser;

	Events$3 = Events_1;

	Batcher = (function() {
	  class Batcher {
	    constructor(options = {}) {
	      this.options = options;
	      parser$4.load(this.options, this.defaults, this);
	      this.Events = new Events$3(this);
	      this._arr = [];
	      this._resetPromise();
	      this._lastFlush = Date.now();
	    }

	    _resetPromise() {
	      return this._promise = new this.Promise((res, rej) => {
	        return this._resolve = res;
	      });
	    }

	    _flush() {
	      clearTimeout(this._timeout);
	      this._lastFlush = Date.now();
	      this._resolve();
	      this.Events.trigger("batch", this._arr);
	      this._arr = [];
	      return this._resetPromise();
	    }

	    add(data) {
	      var ret;
	      this._arr.push(data);
	      ret = this._promise;
	      if (this._arr.length === this.maxSize) {
	        this._flush();
	      } else if ((this.maxTime != null) && this._arr.length === 1) {
	        this._timeout = setTimeout(() => {
	          return this._flush();
	        }, this.maxTime);
	      }
	      return ret;
	    }

	  }
	  Batcher.prototype.defaults = {
	    maxTime: null,
	    maxSize: null,
	    Promise: Promise
	  };

	  return Batcher;

	}).call(commonjsGlobal);

	var Batcher_1 = Batcher;

	var require$$4$1 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

	var require$$8 = getCjsExportFromNamespace(version$2);

	var Bottleneck, DEFAULT_PRIORITY$1, Events$4, Job$1, LocalDatastore$1, NUM_PRIORITIES$1, Queues$1, RedisDatastore$1, States$1, Sync$1, parser$5,
	  splice = [].splice;

	NUM_PRIORITIES$1 = 10;

	DEFAULT_PRIORITY$1 = 5;

	parser$5 = parser;

	Queues$1 = Queues_1;

	Job$1 = Job_1;

	LocalDatastore$1 = LocalDatastore_1;

	RedisDatastore$1 = require$$4$1;

	Events$4 = Events_1;

	States$1 = States_1;

	Sync$1 = Sync_1;

	Bottleneck = (function() {
	  class Bottleneck {
	    constructor(options = {}, ...invalid) {
	      var storeInstanceOptions, storeOptions;
	      this._addToQueue = this._addToQueue.bind(this);
	      this._validateOptions(options, invalid);
	      parser$5.load(options, this.instanceDefaults, this);
	      this._queues = new Queues$1(NUM_PRIORITIES$1);
	      this._scheduled = {};
	      this._states = new States$1(["RECEIVED", "QUEUED", "RUNNING", "EXECUTING"].concat(this.trackDoneStatus ? ["DONE"] : []));
	      this._limiter = null;
	      this.Events = new Events$4(this);
	      this._submitLock = new Sync$1("submit", this.Promise);
	      this._registerLock = new Sync$1("register", this.Promise);
	      storeOptions = parser$5.load(options, this.storeDefaults, {});
	      this._store = (function() {
	        if (this.datastore === "redis" || this.datastore === "ioredis" || (this.connection != null)) {
	          storeInstanceOptions = parser$5.load(options, this.redisStoreDefaults, {});
	          return new RedisDatastore$1(this, storeOptions, storeInstanceOptions);
	        } else if (this.datastore === "local") {
	          storeInstanceOptions = parser$5.load(options, this.localStoreDefaults, {});
	          return new LocalDatastore$1(this, storeOptions, storeInstanceOptions);
	        } else {
	          throw new Bottleneck.prototype.BottleneckError(`Invalid datastore type: ${this.datastore}`);
	        }
	      }).call(this);
	      this._queues.on("leftzero", () => {
	        var ref;
	        return (ref = this._store.heartbeat) != null ? typeof ref.ref === "function" ? ref.ref() : void 0 : void 0;
	      });
	      this._queues.on("zero", () => {
	        var ref;
	        return (ref = this._store.heartbeat) != null ? typeof ref.unref === "function" ? ref.unref() : void 0 : void 0;
	      });
	    }

	    _validateOptions(options, invalid) {
	      if (!((options != null) && typeof options === "object" && invalid.length === 0)) {
	        throw new Bottleneck.prototype.BottleneckError("Bottleneck v2 takes a single object argument. Refer to https://github.com/SGrondin/bottleneck#upgrading-to-v2 if you're upgrading from Bottleneck v1.");
	      }
	    }

	    ready() {
	      return this._store.ready;
	    }

	    clients() {
	      return this._store.clients;
	    }

	    channel() {
	      return `b_${this.id}`;
	    }

	    channel_client() {
	      return `b_${this.id}_${this._store.clientId}`;
	    }

	    publish(message) {
	      return this._store.__publish__(message);
	    }

	    disconnect(flush = true) {
	      return this._store.__disconnect__(flush);
	    }

	    chain(_limiter) {
	      this._limiter = _limiter;
	      return this;
	    }

	    queued(priority) {
	      return this._queues.queued(priority);
	    }

	    clusterQueued() {
	      return this._store.__queued__();
	    }

	    empty() {
	      return this.queued() === 0 && this._submitLock.isEmpty();
	    }

	    running() {
	      return this._store.__running__();
	    }

	    done() {
	      return this._store.__done__();
	    }

	    jobStatus(id) {
	      return this._states.jobStatus(id);
	    }

	    jobs(status) {
	      return this._states.statusJobs(status);
	    }

	    counts() {
	      return this._states.statusCounts();
	    }

	    _randomIndex() {
	      return Math.random().toString(36).slice(2);
	    }

	    check(weight = 1) {
	      return this._store.__check__(weight);
	    }

	    _clearGlobalState(index) {
	      if (this._scheduled[index] != null) {
	        clearTimeout(this._scheduled[index].expiration);
	        delete this._scheduled[index];
	        return true;
	      } else {
	        return false;
	      }
	    }

	    async _free(index, job, options, eventInfo) {
	      var e, running;
	      try {
	        ({running} = (await this._store.__free__(index, options.weight)));
	        this.Events.trigger("debug", `Freed ${options.id}`, eventInfo);
	        if (running === 0 && this.empty()) {
	          return this.Events.trigger("idle");
	        }
	      } catch (error1) {
	        e = error1;
	        return this.Events.trigger("error", e);
	      }
	    }

	    _run(index, job, wait) {
	      var clearGlobalState, free, run;
	      job.doRun();
	      clearGlobalState = this._clearGlobalState.bind(this, index);
	      run = this._run.bind(this, index, job);
	      free = this._free.bind(this, index, job);
	      return this._scheduled[index] = {
	        timeout: setTimeout(() => {
	          return job.doExecute(this._limiter, clearGlobalState, run, free);
	        }, wait),
	        expiration: job.options.expiration != null ? setTimeout(function() {
	          return job.doExpire(clearGlobalState, run, free);
	        }, wait + job.options.expiration) : void 0,
	        job: job
	      };
	    }

	    _drainOne(capacity) {
	      return this._registerLock.schedule(() => {
	        var args, index, next, options, queue;
	        if (this.queued() === 0) {
	          return this.Promise.resolve(null);
	        }
	        queue = this._queues.getFirst();
	        ({options, args} = next = queue.first());
	        if ((capacity != null) && options.weight > capacity) {
	          return this.Promise.resolve(null);
	        }
	        this.Events.trigger("debug", `Draining ${options.id}`, {args, options});
	        index = this._randomIndex();
	        return this._store.__register__(index, options.weight, options.expiration).then(({success, wait, reservoir}) => {
	          var empty;
	          this.Events.trigger("debug", `Drained ${options.id}`, {success, args, options});
	          if (success) {
	            queue.shift();
	            empty = this.empty();
	            if (empty) {
	              this.Events.trigger("empty");
	            }
	            if (reservoir === 0) {
	              this.Events.trigger("depleted", empty);
	            }
	            this._run(index, next, wait);
	            return this.Promise.resolve(options.weight);
	          } else {
	            return this.Promise.resolve(null);
	          }
	        });
	      });
	    }

	    _drainAll(capacity, total = 0) {
	      return this._drainOne(capacity).then((drained) => {
	        var newCapacity;
	        if (drained != null) {
	          newCapacity = capacity != null ? capacity - drained : capacity;
	          return this._drainAll(newCapacity, total + drained);
	        } else {
	          return this.Promise.resolve(total);
	        }
	      }).catch((e) => {
	        return this.Events.trigger("error", e);
	      });
	    }

	    _dropAllQueued(message) {
	      return this._queues.shiftAll(function(job) {
	        return job.doDrop({message});
	      });
	    }

	    stop(options = {}) {
	      var done, waitForExecuting;
	      options = parser$5.load(options, this.stopDefaults);
	      waitForExecuting = (at) => {
	        var finished;
	        finished = () => {
	          var counts;
	          counts = this._states.counts;
	          return (counts[0] + counts[1] + counts[2] + counts[3]) === at;
	        };
	        return new this.Promise((resolve, reject) => {
	          if (finished()) {
	            return resolve();
	          } else {
	            return this.on("done", () => {
	              if (finished()) {
	                this.removeAllListeners("done");
	                return resolve();
	              }
	            });
	          }
	        });
	      };
	      done = options.dropWaitingJobs ? (this._run = function(index, next) {
	        return next.doDrop({
	          message: options.dropErrorMessage
	        });
	      }, this._drainOne = () => {
	        return this.Promise.resolve(null);
	      }, this._registerLock.schedule(() => {
	        return this._submitLock.schedule(() => {
	          var k, ref, v;
	          ref = this._scheduled;
	          for (k in ref) {
	            v = ref[k];
	            if (this.jobStatus(v.job.options.id) === "RUNNING") {
	              clearTimeout(v.timeout);
	              clearTimeout(v.expiration);
	              v.job.doDrop({
	                message: options.dropErrorMessage
	              });
	            }
	          }
	          this._dropAllQueued(options.dropErrorMessage);
	          return waitForExecuting(0);
	        });
	      })) : this.schedule({
	        priority: NUM_PRIORITIES$1 - 1,
	        weight: 0
	      }, () => {
	        return waitForExecuting(1);
	      });
	      this._receive = function(job) {
	        return job._reject(new Bottleneck.prototype.BottleneckError(options.enqueueErrorMessage));
	      };
	      this.stop = () => {
	        return this.Promise.reject(new Bottleneck.prototype.BottleneckError("stop() has already been called"));
	      };
	      return done;
	    }

	    async _addToQueue(job) {
	      var args, blocked, error, options, reachedHWM, shifted, strategy;
	      ({args, options} = job);
	      try {
	        ({reachedHWM, blocked, strategy} = (await this._store.__submit__(this.queued(), options.weight)));
	      } catch (error1) {
	        error = error1;
	        this.Events.trigger("debug", `Could not queue ${options.id}`, {args, options, error});
	        job.doDrop({error});
	        return false;
	      }
	      if (blocked) {
	        job.doDrop();
	        return true;
	      } else if (reachedHWM) {
	        shifted = strategy === Bottleneck.prototype.strategy.LEAK ? this._queues.shiftLastFrom(options.priority) : strategy === Bottleneck.prototype.strategy.OVERFLOW_PRIORITY ? this._queues.shiftLastFrom(options.priority + 1) : strategy === Bottleneck.prototype.strategy.OVERFLOW ? job : void 0;
	        if (shifted != null) {
	          shifted.doDrop();
	        }
	        if ((shifted == null) || strategy === Bottleneck.prototype.strategy.OVERFLOW) {
	          if (shifted == null) {
	            job.doDrop();
	          }
	          return reachedHWM;
	        }
	      }
	      job.doQueue(reachedHWM, blocked);
	      this._queues.push(job);
	      await this._drainAll();
	      return reachedHWM;
	    }

	    _receive(job) {
	      if (this._states.jobStatus(job.options.id) != null) {
	        job._reject(new Bottleneck.prototype.BottleneckError(`A job with the same id already exists (id=${job.options.id})`));
	        return false;
	      } else {
	        job.doReceive();
	        return this._submitLock.schedule(this._addToQueue, job);
	      }
	    }

	    submit(...args) {
	      var cb, fn, job, options, ref, ref1, task;
	      if (typeof args[0] === "function") {
	        ref = args, [fn, ...args] = ref, [cb] = splice.call(args, -1);
	        options = parser$5.load({}, this.jobDefaults);
	      } else {
	        ref1 = args, [options, fn, ...args] = ref1, [cb] = splice.call(args, -1);
	        options = parser$5.load(options, this.jobDefaults);
	      }
	      task = (...args) => {
	        return new this.Promise(function(resolve, reject) {
	          return fn(...args, function(...args) {
	            return (args[0] != null ? reject : resolve)(args);
	          });
	        });
	      };
	      job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
	      job.promise.then(function(args) {
	        return typeof cb === "function" ? cb(...args) : void 0;
	      }).catch(function(args) {
	        if (Array.isArray(args)) {
	          return typeof cb === "function" ? cb(...args) : void 0;
	        } else {
	          return typeof cb === "function" ? cb(args) : void 0;
	        }
	      });
	      return this._receive(job);
	    }

	    schedule(...args) {
	      var job, options, task;
	      if (typeof args[0] === "function") {
	        [task, ...args] = args;
	        options = {};
	      } else {
	        [options, task, ...args] = args;
	      }
	      job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
	      this._receive(job);
	      return job.promise;
	    }

	    wrap(fn) {
	      var schedule, wrapped;
	      schedule = this.schedule.bind(this);
	      wrapped = function(...args) {
	        return schedule(fn.bind(this), ...args);
	      };
	      wrapped.withOptions = function(options, ...args) {
	        return schedule(options, fn, ...args);
	      };
	      return wrapped;
	    }

	    async updateSettings(options = {}) {
	      await this._store.__updateSettings__(parser$5.overwrite(options, this.storeDefaults));
	      parser$5.overwrite(options, this.instanceDefaults, this);
	      return this;
	    }

	    currentReservoir() {
	      return this._store.__currentReservoir__();
	    }

	    incrementReservoir(incr = 0) {
	      return this._store.__incrementReservoir__(incr);
	    }

	  }
	  Bottleneck.default = Bottleneck;

	  Bottleneck.Events = Events$4;

	  Bottleneck.version = Bottleneck.prototype.version = require$$8.version;

	  Bottleneck.strategy = Bottleneck.prototype.strategy = {
	    LEAK: 1,
	    OVERFLOW: 2,
	    OVERFLOW_PRIORITY: 4,
	    BLOCK: 3
	  };

	  Bottleneck.BottleneckError = Bottleneck.prototype.BottleneckError = BottleneckError_1;

	  Bottleneck.Group = Bottleneck.prototype.Group = Group_1;

	  Bottleneck.RedisConnection = Bottleneck.prototype.RedisConnection = require$$2;

	  Bottleneck.IORedisConnection = Bottleneck.prototype.IORedisConnection = require$$3;

	  Bottleneck.Batcher = Bottleneck.prototype.Batcher = Batcher_1;

	  Bottleneck.prototype.jobDefaults = {
	    priority: DEFAULT_PRIORITY$1,
	    weight: 1,
	    expiration: null,
	    id: "<no-id>"
	  };

	  Bottleneck.prototype.storeDefaults = {
	    maxConcurrent: null,
	    minTime: 0,
	    highWater: null,
	    strategy: Bottleneck.prototype.strategy.LEAK,
	    penalty: null,
	    reservoir: null,
	    reservoirRefreshInterval: null,
	    reservoirRefreshAmount: null,
	    reservoirIncreaseInterval: null,
	    reservoirIncreaseAmount: null,
	    reservoirIncreaseMaximum: null
	  };

	  Bottleneck.prototype.localStoreDefaults = {
	    Promise: Promise,
	    timeout: null,
	    heartbeatInterval: 250
	  };

	  Bottleneck.prototype.redisStoreDefaults = {
	    Promise: Promise,
	    timeout: null,
	    heartbeatInterval: 5000,
	    clientTimeout: 10000,
	    Redis: null,
	    clientOptions: {},
	    clusterNodes: null,
	    clearDatastore: false,
	    connection: null
	  };

	  Bottleneck.prototype.instanceDefaults = {
	    datastore: "local",
	    connection: null,
	    id: "<no-id>",
	    rejectOnDrop: true,
	    trackDoneStatus: false,
	    Promise: Promise
	  };

	  Bottleneck.prototype.stopDefaults = {
	    enqueueErrorMessage: "This limiter has been stopped and cannot accept new jobs.",
	    dropWaitingJobs: true,
	    dropErrorMessage: "This limiter has been stopped."
	  };

	  return Bottleneck;

	}).call(commonjsGlobal);

	var Bottleneck_1 = Bottleneck;

	var lib = Bottleneck_1;

	return lib;

})));


/***/ }),

/***/ 1483:
/***/ (function(module) {

module.exports = function _btoa(str) {
  return btoa(str)
}


/***/ }),

/***/ 5281:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(5696);

const extractPathRegex = /\s+at.*(?:\(|\s)(.*)\)?/;
const pathRegex = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:babel-polyfill|pirates)\/.*)?\w+)\.js:\d+:\d+)|native)/;
const homeDir = typeof os.homedir === 'undefined' ? '' : os.homedir();

module.exports = (stack, options) => {
	options = Object.assign({pretty: false}, options);

	return stack.replace(/\\/g, '/')
		.split('\n')
		.filter(line => {
			const pathMatches = line.match(extractPathRegex);
			if (pathMatches === null || !pathMatches[1]) {
				return true;
			}

			const match = pathMatches[1];

			// Electron
			if (
				match.includes('.app/Contents/Resources/electron.asar') ||
				match.includes('.app/Contents/Resources/default_app.asar')
			) {
				return false;
			}

			return !pathRegex.test(match);
		})
		.filter(line => line.trim() !== '')
		.map(line => {
			if (options.pretty) {
				return line.replace(extractPathRegex, (m, p1) => m.replace(p1, p1.replace(homeDir, '~')));
			}

			return line;
		})
		.join('\n');
};


/***/ }),

/***/ 2327:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$": function() { return /* binding */ Deprecation; }
/* harmony export */ });
class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}




/***/ }),

/***/ 3405:
/***/ (function(module) {

/*! fromentries. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
module.exports = function fromEntries (iterable) {
  return [...iterable].reduce((obj, [key, val]) => {
    obj[key] = val
    return obj
  }, {})
}


/***/ }),

/***/ 5602:
/***/ (function(module) {

"use strict";


module.exports = (string, count = 1, options) => {
	options = {
		indent: ' ',
		includeEmptyLines: false,
		...options
	};

	if (typeof string !== 'string') {
		throw new TypeError(
			`Expected \`input\` to be a \`string\`, got \`${typeof string}\``
		);
	}

	if (typeof count !== 'number') {
		throw new TypeError(
			`Expected \`count\` to be a \`number\`, got \`${typeof count}\``
		);
	}

	if (typeof options.indent !== 'string') {
		throw new TypeError(
			`Expected \`options.indent\` to be a \`string\`, got \`${typeof options.indent}\``
		);
	}

	if (count === 0) {
		return string;
	}

	const regex = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;

	return string.replace(regex, options.indent.repeat(count));
};


/***/ }),

/***/ 9593:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


// A linked list to keep track of recently-used-ness
const Yallist = __webpack_require__(4411)

const MAX = Symbol('max')
const LENGTH = Symbol('length')
const LENGTH_CALCULATOR = Symbol('lengthCalculator')
const ALLOW_STALE = Symbol('allowStale')
const MAX_AGE = Symbol('maxAge')
const DISPOSE = Symbol('dispose')
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet')
const LRU_LIST = Symbol('lruList')
const CACHE = Symbol('cache')
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet')

const naiveLength = () => 1

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options }

    if (!options)
      options = {}

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))
    }

    this[CACHE] = new Map() // hash of items by key
    this[LRU_LIST] = new Yallist() // list of items in order of use recency
    this[LENGTH] = 0 // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE]

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0
    const len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const node = this[CACHE].get(key)
      const item = node.value

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value)
      }

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail
    if (!node)
      return null

    del(this, node)
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key))
  }

  load (arr) {
    // reset the cache
    this.reset()

    const now = Date.now()
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l]
      const expiresAt = hit.e || 0
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge)
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (node) {
    const hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now()
        self[LRU_LIST].unshiftNode(node)
      }
    }
    return hit.value
  }
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
}

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

const del = (self, node) => {
  if (node) {
    const hit = node.value
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value)

    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE])
      hit = undefined
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache


/***/ }),

/***/ 3454:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ref, ref1;
module.exports = ((ref = __webpack_require__.g.process) == null ? void 0 : ref.env) && typeof ((ref1 = __webpack_require__.g.process) == null ? void 0 : ref1.env) === "object" ? __webpack_require__.g.process : __webpack_require__(7663);

//# sourceMappingURL=process.js.map

/***/ }),

/***/ 1876:
/***/ (function(module) {

var __dirname = "/";
(function(){var e={675:function(e,r){"use strict";r.byteLength=byteLength;r.toByteArray=toByteArray;r.fromByteArray=fromByteArray;var t=[];var f=[];var n=typeof Uint8Array!=="undefined"?Uint8Array:Array;var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var o=0,u=i.length;o<u;++o){t[o]=i[o];f[i.charCodeAt(o)]=o}f["-".charCodeAt(0)]=62;f["_".charCodeAt(0)]=63;function getLens(e){var r=e.length;if(r%4>0){throw new Error("Invalid string. Length must be a multiple of 4")}var t=e.indexOf("=");if(t===-1)t=r;var f=t===r?0:4-t%4;return[t,f]}function byteLength(e){var r=getLens(e);var t=r[0];var f=r[1];return(t+f)*3/4-f}function _byteLength(e,r,t){return(r+t)*3/4-t}function toByteArray(e){var r;var t=getLens(e);var i=t[0];var o=t[1];var u=new n(_byteLength(e,i,o));var a=0;var s=o>0?i-4:i;var h;for(h=0;h<s;h+=4){r=f[e.charCodeAt(h)]<<18|f[e.charCodeAt(h+1)]<<12|f[e.charCodeAt(h+2)]<<6|f[e.charCodeAt(h+3)];u[a++]=r>>16&255;u[a++]=r>>8&255;u[a++]=r&255}if(o===2){r=f[e.charCodeAt(h)]<<2|f[e.charCodeAt(h+1)]>>4;u[a++]=r&255}if(o===1){r=f[e.charCodeAt(h)]<<10|f[e.charCodeAt(h+1)]<<4|f[e.charCodeAt(h+2)]>>2;u[a++]=r>>8&255;u[a++]=r&255}return u}function tripletToBase64(e){return t[e>>18&63]+t[e>>12&63]+t[e>>6&63]+t[e&63]}function encodeChunk(e,r,t){var f;var n=[];for(var i=r;i<t;i+=3){f=(e[i]<<16&16711680)+(e[i+1]<<8&65280)+(e[i+2]&255);n.push(tripletToBase64(f))}return n.join("")}function fromByteArray(e){var r;var f=e.length;var n=f%3;var i=[];var o=16383;for(var u=0,a=f-n;u<a;u+=o){i.push(encodeChunk(e,u,u+o>a?a:u+o))}if(n===1){r=e[f-1];i.push(t[r>>2]+t[r<<4&63]+"==")}else if(n===2){r=(e[f-2]<<8)+e[f-1];i.push(t[r>>10]+t[r>>4&63]+t[r<<2&63]+"=")}return i.join("")}},72:function(e,r,t){"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var f=t(675);var n=t(783);var i=typeof Symbol==="function"&&typeof Symbol.for==="function"?Symbol.for("nodejs.util.inspect.custom"):null;r.Buffer=Buffer;r.SlowBuffer=SlowBuffer;r.INSPECT_MAX_BYTES=50;var o=2147483647;r.kMaxLength=o;Buffer.TYPED_ARRAY_SUPPORT=typedArraySupport();if(!Buffer.TYPED_ARRAY_SUPPORT&&typeof console!=="undefined"&&typeof console.error==="function"){console.error("This browser lacks typed array (Uint8Array) support which is required by "+"`buffer` v5.x. Use `buffer` v4.x if you require old browser support.")}function typedArraySupport(){try{var e=new Uint8Array(1);var r={foo:function(){return 42}};Object.setPrototypeOf(r,Uint8Array.prototype);Object.setPrototypeOf(e,r);return e.foo()===42}catch(e){return false}}Object.defineProperty(Buffer.prototype,"parent",{enumerable:true,get:function(){if(!Buffer.isBuffer(this))return undefined;return this.buffer}});Object.defineProperty(Buffer.prototype,"offset",{enumerable:true,get:function(){if(!Buffer.isBuffer(this))return undefined;return this.byteOffset}});function createBuffer(e){if(e>o){throw new RangeError('The value "'+e+'" is invalid for option "size"')}var r=new Uint8Array(e);Object.setPrototypeOf(r,Buffer.prototype);return r}function Buffer(e,r,t){if(typeof e==="number"){if(typeof r==="string"){throw new TypeError('The "string" argument must be of type string. Received type number')}return allocUnsafe(e)}return from(e,r,t)}Buffer.poolSize=8192;function from(e,r,t){if(typeof e==="string"){return fromString(e,r)}if(ArrayBuffer.isView(e)){return fromArrayLike(e)}if(e==null){throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, "+"or Array-like Object. Received type "+typeof e)}if(isInstance(e,ArrayBuffer)||e&&isInstance(e.buffer,ArrayBuffer)){return fromArrayBuffer(e,r,t)}if(typeof SharedArrayBuffer!=="undefined"&&(isInstance(e,SharedArrayBuffer)||e&&isInstance(e.buffer,SharedArrayBuffer))){return fromArrayBuffer(e,r,t)}if(typeof e==="number"){throw new TypeError('The "value" argument must not be of type number. Received type number')}var f=e.valueOf&&e.valueOf();if(f!=null&&f!==e){return Buffer.from(f,r,t)}var n=fromObject(e);if(n)return n;if(typeof Symbol!=="undefined"&&Symbol.toPrimitive!=null&&typeof e[Symbol.toPrimitive]==="function"){return Buffer.from(e[Symbol.toPrimitive]("string"),r,t)}throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, "+"or Array-like Object. Received type "+typeof e)}Buffer.from=function(e,r,t){return from(e,r,t)};Object.setPrototypeOf(Buffer.prototype,Uint8Array.prototype);Object.setPrototypeOf(Buffer,Uint8Array);function assertSize(e){if(typeof e!=="number"){throw new TypeError('"size" argument must be of type number')}else if(e<0){throw new RangeError('The value "'+e+'" is invalid for option "size"')}}function alloc(e,r,t){assertSize(e);if(e<=0){return createBuffer(e)}if(r!==undefined){return typeof t==="string"?createBuffer(e).fill(r,t):createBuffer(e).fill(r)}return createBuffer(e)}Buffer.alloc=function(e,r,t){return alloc(e,r,t)};function allocUnsafe(e){assertSize(e);return createBuffer(e<0?0:checked(e)|0)}Buffer.allocUnsafe=function(e){return allocUnsafe(e)};Buffer.allocUnsafeSlow=function(e){return allocUnsafe(e)};function fromString(e,r){if(typeof r!=="string"||r===""){r="utf8"}if(!Buffer.isEncoding(r)){throw new TypeError("Unknown encoding: "+r)}var t=byteLength(e,r)|0;var f=createBuffer(t);var n=f.write(e,r);if(n!==t){f=f.slice(0,n)}return f}function fromArrayLike(e){var r=e.length<0?0:checked(e.length)|0;var t=createBuffer(r);for(var f=0;f<r;f+=1){t[f]=e[f]&255}return t}function fromArrayBuffer(e,r,t){if(r<0||e.byteLength<r){throw new RangeError('"offset" is outside of buffer bounds')}if(e.byteLength<r+(t||0)){throw new RangeError('"length" is outside of buffer bounds')}var f;if(r===undefined&&t===undefined){f=new Uint8Array(e)}else if(t===undefined){f=new Uint8Array(e,r)}else{f=new Uint8Array(e,r,t)}Object.setPrototypeOf(f,Buffer.prototype);return f}function fromObject(e){if(Buffer.isBuffer(e)){var r=checked(e.length)|0;var t=createBuffer(r);if(t.length===0){return t}e.copy(t,0,0,r);return t}if(e.length!==undefined){if(typeof e.length!=="number"||numberIsNaN(e.length)){return createBuffer(0)}return fromArrayLike(e)}if(e.type==="Buffer"&&Array.isArray(e.data)){return fromArrayLike(e.data)}}function checked(e){if(e>=o){throw new RangeError("Attempt to allocate Buffer larger than maximum "+"size: 0x"+o.toString(16)+" bytes")}return e|0}function SlowBuffer(e){if(+e!=e){e=0}return Buffer.alloc(+e)}Buffer.isBuffer=function isBuffer(e){return e!=null&&e._isBuffer===true&&e!==Buffer.prototype};Buffer.compare=function compare(e,r){if(isInstance(e,Uint8Array))e=Buffer.from(e,e.offset,e.byteLength);if(isInstance(r,Uint8Array))r=Buffer.from(r,r.offset,r.byteLength);if(!Buffer.isBuffer(e)||!Buffer.isBuffer(r)){throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array')}if(e===r)return 0;var t=e.length;var f=r.length;for(var n=0,i=Math.min(t,f);n<i;++n){if(e[n]!==r[n]){t=e[n];f=r[n];break}}if(t<f)return-1;if(f<t)return 1;return 0};Buffer.isEncoding=function isEncoding(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return true;default:return false}};Buffer.concat=function concat(e,r){if(!Array.isArray(e)){throw new TypeError('"list" argument must be an Array of Buffers')}if(e.length===0){return Buffer.alloc(0)}var t;if(r===undefined){r=0;for(t=0;t<e.length;++t){r+=e[t].length}}var f=Buffer.allocUnsafe(r);var n=0;for(t=0;t<e.length;++t){var i=e[t];if(isInstance(i,Uint8Array)){i=Buffer.from(i)}if(!Buffer.isBuffer(i)){throw new TypeError('"list" argument must be an Array of Buffers')}i.copy(f,n);n+=i.length}return f};function byteLength(e,r){if(Buffer.isBuffer(e)){return e.length}if(ArrayBuffer.isView(e)||isInstance(e,ArrayBuffer)){return e.byteLength}if(typeof e!=="string"){throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. '+"Received type "+typeof e)}var t=e.length;var f=arguments.length>2&&arguments[2]===true;if(!f&&t===0)return 0;var n=false;for(;;){switch(r){case"ascii":case"latin1":case"binary":return t;case"utf8":case"utf-8":return utf8ToBytes(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return t*2;case"hex":return t>>>1;case"base64":return base64ToBytes(e).length;default:if(n){return f?-1:utf8ToBytes(e).length}r=(""+r).toLowerCase();n=true}}}Buffer.byteLength=byteLength;function slowToString(e,r,t){var f=false;if(r===undefined||r<0){r=0}if(r>this.length){return""}if(t===undefined||t>this.length){t=this.length}if(t<=0){return""}t>>>=0;r>>>=0;if(t<=r){return""}if(!e)e="utf8";while(true){switch(e){case"hex":return hexSlice(this,r,t);case"utf8":case"utf-8":return utf8Slice(this,r,t);case"ascii":return asciiSlice(this,r,t);case"latin1":case"binary":return latin1Slice(this,r,t);case"base64":return base64Slice(this,r,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,r,t);default:if(f)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase();f=true}}}Buffer.prototype._isBuffer=true;function swap(e,r,t){var f=e[r];e[r]=e[t];e[t]=f}Buffer.prototype.swap16=function swap16(){var e=this.length;if(e%2!==0){throw new RangeError("Buffer size must be a multiple of 16-bits")}for(var r=0;r<e;r+=2){swap(this,r,r+1)}return this};Buffer.prototype.swap32=function swap32(){var e=this.length;if(e%4!==0){throw new RangeError("Buffer size must be a multiple of 32-bits")}for(var r=0;r<e;r+=4){swap(this,r,r+3);swap(this,r+1,r+2)}return this};Buffer.prototype.swap64=function swap64(){var e=this.length;if(e%8!==0){throw new RangeError("Buffer size must be a multiple of 64-bits")}for(var r=0;r<e;r+=8){swap(this,r,r+7);swap(this,r+1,r+6);swap(this,r+2,r+5);swap(this,r+3,r+4)}return this};Buffer.prototype.toString=function toString(){var e=this.length;if(e===0)return"";if(arguments.length===0)return utf8Slice(this,0,e);return slowToString.apply(this,arguments)};Buffer.prototype.toLocaleString=Buffer.prototype.toString;Buffer.prototype.equals=function equals(e){if(!Buffer.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(this===e)return true;return Buffer.compare(this,e)===0};Buffer.prototype.inspect=function inspect(){var e="";var t=r.INSPECT_MAX_BYTES;e=this.toString("hex",0,t).replace(/(.{2})/g,"$1 ").trim();if(this.length>t)e+=" ... ";return"<Buffer "+e+">"};if(i){Buffer.prototype[i]=Buffer.prototype.inspect}Buffer.prototype.compare=function compare(e,r,t,f,n){if(isInstance(e,Uint8Array)){e=Buffer.from(e,e.offset,e.byteLength)}if(!Buffer.isBuffer(e)){throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. '+"Received type "+typeof e)}if(r===undefined){r=0}if(t===undefined){t=e?e.length:0}if(f===undefined){f=0}if(n===undefined){n=this.length}if(r<0||t>e.length||f<0||n>this.length){throw new RangeError("out of range index")}if(f>=n&&r>=t){return 0}if(f>=n){return-1}if(r>=t){return 1}r>>>=0;t>>>=0;f>>>=0;n>>>=0;if(this===e)return 0;var i=n-f;var o=t-r;var u=Math.min(i,o);var a=this.slice(f,n);var s=e.slice(r,t);for(var h=0;h<u;++h){if(a[h]!==s[h]){i=a[h];o=s[h];break}}if(i<o)return-1;if(o<i)return 1;return 0};function bidirectionalIndexOf(e,r,t,f,n){if(e.length===0)return-1;if(typeof t==="string"){f=t;t=0}else if(t>2147483647){t=2147483647}else if(t<-2147483648){t=-2147483648}t=+t;if(numberIsNaN(t)){t=n?0:e.length-1}if(t<0)t=e.length+t;if(t>=e.length){if(n)return-1;else t=e.length-1}else if(t<0){if(n)t=0;else return-1}if(typeof r==="string"){r=Buffer.from(r,f)}if(Buffer.isBuffer(r)){if(r.length===0){return-1}return arrayIndexOf(e,r,t,f,n)}else if(typeof r==="number"){r=r&255;if(typeof Uint8Array.prototype.indexOf==="function"){if(n){return Uint8Array.prototype.indexOf.call(e,r,t)}else{return Uint8Array.prototype.lastIndexOf.call(e,r,t)}}return arrayIndexOf(e,[r],t,f,n)}throw new TypeError("val must be string, number or Buffer")}function arrayIndexOf(e,r,t,f,n){var i=1;var o=e.length;var u=r.length;if(f!==undefined){f=String(f).toLowerCase();if(f==="ucs2"||f==="ucs-2"||f==="utf16le"||f==="utf-16le"){if(e.length<2||r.length<2){return-1}i=2;o/=2;u/=2;t/=2}}function read(e,r){if(i===1){return e[r]}else{return e.readUInt16BE(r*i)}}var a;if(n){var s=-1;for(a=t;a<o;a++){if(read(e,a)===read(r,s===-1?0:a-s)){if(s===-1)s=a;if(a-s+1===u)return s*i}else{if(s!==-1)a-=a-s;s=-1}}}else{if(t+u>o)t=o-u;for(a=t;a>=0;a--){var h=true;for(var c=0;c<u;c++){if(read(e,a+c)!==read(r,c)){h=false;break}}if(h)return a}}return-1}Buffer.prototype.includes=function includes(e,r,t){return this.indexOf(e,r,t)!==-1};Buffer.prototype.indexOf=function indexOf(e,r,t){return bidirectionalIndexOf(this,e,r,t,true)};Buffer.prototype.lastIndexOf=function lastIndexOf(e,r,t){return bidirectionalIndexOf(this,e,r,t,false)};function hexWrite(e,r,t,f){t=Number(t)||0;var n=e.length-t;if(!f){f=n}else{f=Number(f);if(f>n){f=n}}var i=r.length;if(f>i/2){f=i/2}for(var o=0;o<f;++o){var u=parseInt(r.substr(o*2,2),16);if(numberIsNaN(u))return o;e[t+o]=u}return o}function utf8Write(e,r,t,f){return blitBuffer(utf8ToBytes(r,e.length-t),e,t,f)}function asciiWrite(e,r,t,f){return blitBuffer(asciiToBytes(r),e,t,f)}function latin1Write(e,r,t,f){return asciiWrite(e,r,t,f)}function base64Write(e,r,t,f){return blitBuffer(base64ToBytes(r),e,t,f)}function ucs2Write(e,r,t,f){return blitBuffer(utf16leToBytes(r,e.length-t),e,t,f)}Buffer.prototype.write=function write(e,r,t,f){if(r===undefined){f="utf8";t=this.length;r=0}else if(t===undefined&&typeof r==="string"){f=r;t=this.length;r=0}else if(isFinite(r)){r=r>>>0;if(isFinite(t)){t=t>>>0;if(f===undefined)f="utf8"}else{f=t;t=undefined}}else{throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported")}var n=this.length-r;if(t===undefined||t>n)t=n;if(e.length>0&&(t<0||r<0)||r>this.length){throw new RangeError("Attempt to write outside buffer bounds")}if(!f)f="utf8";var i=false;for(;;){switch(f){case"hex":return hexWrite(this,e,r,t);case"utf8":case"utf-8":return utf8Write(this,e,r,t);case"ascii":return asciiWrite(this,e,r,t);case"latin1":case"binary":return latin1Write(this,e,r,t);case"base64":return base64Write(this,e,r,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,e,r,t);default:if(i)throw new TypeError("Unknown encoding: "+f);f=(""+f).toLowerCase();i=true}}};Buffer.prototype.toJSON=function toJSON(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function base64Slice(e,r,t){if(r===0&&t===e.length){return f.fromByteArray(e)}else{return f.fromByteArray(e.slice(r,t))}}function utf8Slice(e,r,t){t=Math.min(e.length,t);var f=[];var n=r;while(n<t){var i=e[n];var o=null;var u=i>239?4:i>223?3:i>191?2:1;if(n+u<=t){var a,s,h,c;switch(u){case 1:if(i<128){o=i}break;case 2:a=e[n+1];if((a&192)===128){c=(i&31)<<6|a&63;if(c>127){o=c}}break;case 3:a=e[n+1];s=e[n+2];if((a&192)===128&&(s&192)===128){c=(i&15)<<12|(a&63)<<6|s&63;if(c>2047&&(c<55296||c>57343)){o=c}}break;case 4:a=e[n+1];s=e[n+2];h=e[n+3];if((a&192)===128&&(s&192)===128&&(h&192)===128){c=(i&15)<<18|(a&63)<<12|(s&63)<<6|h&63;if(c>65535&&c<1114112){o=c}}}}if(o===null){o=65533;u=1}else if(o>65535){o-=65536;f.push(o>>>10&1023|55296);o=56320|o&1023}f.push(o);n+=u}return decodeCodePointsArray(f)}var u=4096;function decodeCodePointsArray(e){var r=e.length;if(r<=u){return String.fromCharCode.apply(String,e)}var t="";var f=0;while(f<r){t+=String.fromCharCode.apply(String,e.slice(f,f+=u))}return t}function asciiSlice(e,r,t){var f="";t=Math.min(e.length,t);for(var n=r;n<t;++n){f+=String.fromCharCode(e[n]&127)}return f}function latin1Slice(e,r,t){var f="";t=Math.min(e.length,t);for(var n=r;n<t;++n){f+=String.fromCharCode(e[n])}return f}function hexSlice(e,r,t){var f=e.length;if(!r||r<0)r=0;if(!t||t<0||t>f)t=f;var n="";for(var i=r;i<t;++i){n+=s[e[i]]}return n}function utf16leSlice(e,r,t){var f=e.slice(r,t);var n="";for(var i=0;i<f.length;i+=2){n+=String.fromCharCode(f[i]+f[i+1]*256)}return n}Buffer.prototype.slice=function slice(e,r){var t=this.length;e=~~e;r=r===undefined?t:~~r;if(e<0){e+=t;if(e<0)e=0}else if(e>t){e=t}if(r<0){r+=t;if(r<0)r=0}else if(r>t){r=t}if(r<e)r=e;var f=this.subarray(e,r);Object.setPrototypeOf(f,Buffer.prototype);return f};function checkOffset(e,r,t){if(e%1!==0||e<0)throw new RangeError("offset is not uint");if(e+r>t)throw new RangeError("Trying to access beyond buffer length")}Buffer.prototype.readUIntLE=function readUIntLE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=this[e];var n=1;var i=0;while(++i<r&&(n*=256)){f+=this[e+i]*n}return f};Buffer.prototype.readUIntBE=function readUIntBE(e,r,t){e=e>>>0;r=r>>>0;if(!t){checkOffset(e,r,this.length)}var f=this[e+--r];var n=1;while(r>0&&(n*=256)){f+=this[e+--r]*n}return f};Buffer.prototype.readUInt8=function readUInt8(e,r){e=e>>>0;if(!r)checkOffset(e,1,this.length);return this[e]};Buffer.prototype.readUInt16LE=function readUInt16LE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);return this[e]|this[e+1]<<8};Buffer.prototype.readUInt16BE=function readUInt16BE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);return this[e]<<8|this[e+1]};Buffer.prototype.readUInt32LE=function readUInt32LE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return(this[e]|this[e+1]<<8|this[e+2]<<16)+this[e+3]*16777216};Buffer.prototype.readUInt32BE=function readUInt32BE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]*16777216+(this[e+1]<<16|this[e+2]<<8|this[e+3])};Buffer.prototype.readIntLE=function readIntLE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=this[e];var n=1;var i=0;while(++i<r&&(n*=256)){f+=this[e+i]*n}n*=128;if(f>=n)f-=Math.pow(2,8*r);return f};Buffer.prototype.readIntBE=function readIntBE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=r;var n=1;var i=this[e+--f];while(f>0&&(n*=256)){i+=this[e+--f]*n}n*=128;if(i>=n)i-=Math.pow(2,8*r);return i};Buffer.prototype.readInt8=function readInt8(e,r){e=e>>>0;if(!r)checkOffset(e,1,this.length);if(!(this[e]&128))return this[e];return(255-this[e]+1)*-1};Buffer.prototype.readInt16LE=function readInt16LE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);var t=this[e]|this[e+1]<<8;return t&32768?t|4294901760:t};Buffer.prototype.readInt16BE=function readInt16BE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);var t=this[e+1]|this[e]<<8;return t&32768?t|4294901760:t};Buffer.prototype.readInt32LE=function readInt32LE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24};Buffer.prototype.readInt32BE=function readInt32BE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]};Buffer.prototype.readFloatLE=function readFloatLE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return n.read(this,e,true,23,4)};Buffer.prototype.readFloatBE=function readFloatBE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return n.read(this,e,false,23,4)};Buffer.prototype.readDoubleLE=function readDoubleLE(e,r){e=e>>>0;if(!r)checkOffset(e,8,this.length);return n.read(this,e,true,52,8)};Buffer.prototype.readDoubleBE=function readDoubleBE(e,r){e=e>>>0;if(!r)checkOffset(e,8,this.length);return n.read(this,e,false,52,8)};function checkInt(e,r,t,f,n,i){if(!Buffer.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>n||r<i)throw new RangeError('"value" argument is out of bounds');if(t+f>e.length)throw new RangeError("Index out of range")}Buffer.prototype.writeUIntLE=function writeUIntLE(e,r,t,f){e=+e;r=r>>>0;t=t>>>0;if(!f){var n=Math.pow(2,8*t)-1;checkInt(this,e,r,t,n,0)}var i=1;var o=0;this[r]=e&255;while(++o<t&&(i*=256)){this[r+o]=e/i&255}return r+t};Buffer.prototype.writeUIntBE=function writeUIntBE(e,r,t,f){e=+e;r=r>>>0;t=t>>>0;if(!f){var n=Math.pow(2,8*t)-1;checkInt(this,e,r,t,n,0)}var i=t-1;var o=1;this[r+i]=e&255;while(--i>=0&&(o*=256)){this[r+i]=e/o&255}return r+t};Buffer.prototype.writeUInt8=function writeUInt8(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,1,255,0);this[r]=e&255;return r+1};Buffer.prototype.writeUInt16LE=function writeUInt16LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,65535,0);this[r]=e&255;this[r+1]=e>>>8;return r+2};Buffer.prototype.writeUInt16BE=function writeUInt16BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,65535,0);this[r]=e>>>8;this[r+1]=e&255;return r+2};Buffer.prototype.writeUInt32LE=function writeUInt32LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,4294967295,0);this[r+3]=e>>>24;this[r+2]=e>>>16;this[r+1]=e>>>8;this[r]=e&255;return r+4};Buffer.prototype.writeUInt32BE=function writeUInt32BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,4294967295,0);this[r]=e>>>24;this[r+1]=e>>>16;this[r+2]=e>>>8;this[r+3]=e&255;return r+4};Buffer.prototype.writeIntLE=function writeIntLE(e,r,t,f){e=+e;r=r>>>0;if(!f){var n=Math.pow(2,8*t-1);checkInt(this,e,r,t,n-1,-n)}var i=0;var o=1;var u=0;this[r]=e&255;while(++i<t&&(o*=256)){if(e<0&&u===0&&this[r+i-1]!==0){u=1}this[r+i]=(e/o>>0)-u&255}return r+t};Buffer.prototype.writeIntBE=function writeIntBE(e,r,t,f){e=+e;r=r>>>0;if(!f){var n=Math.pow(2,8*t-1);checkInt(this,e,r,t,n-1,-n)}var i=t-1;var o=1;var u=0;this[r+i]=e&255;while(--i>=0&&(o*=256)){if(e<0&&u===0&&this[r+i+1]!==0){u=1}this[r+i]=(e/o>>0)-u&255}return r+t};Buffer.prototype.writeInt8=function writeInt8(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,1,127,-128);if(e<0)e=255+e+1;this[r]=e&255;return r+1};Buffer.prototype.writeInt16LE=function writeInt16LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,32767,-32768);this[r]=e&255;this[r+1]=e>>>8;return r+2};Buffer.prototype.writeInt16BE=function writeInt16BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,32767,-32768);this[r]=e>>>8;this[r+1]=e&255;return r+2};Buffer.prototype.writeInt32LE=function writeInt32LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,2147483647,-2147483648);this[r]=e&255;this[r+1]=e>>>8;this[r+2]=e>>>16;this[r+3]=e>>>24;return r+4};Buffer.prototype.writeInt32BE=function writeInt32BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,2147483647,-2147483648);if(e<0)e=4294967295+e+1;this[r]=e>>>24;this[r+1]=e>>>16;this[r+2]=e>>>8;this[r+3]=e&255;return r+4};function checkIEEE754(e,r,t,f,n,i){if(t+f>e.length)throw new RangeError("Index out of range");if(t<0)throw new RangeError("Index out of range")}function writeFloat(e,r,t,f,i){r=+r;t=t>>>0;if(!i){checkIEEE754(e,r,t,4,34028234663852886e22,-34028234663852886e22)}n.write(e,r,t,f,23,4);return t+4}Buffer.prototype.writeFloatLE=function writeFloatLE(e,r,t){return writeFloat(this,e,r,true,t)};Buffer.prototype.writeFloatBE=function writeFloatBE(e,r,t){return writeFloat(this,e,r,false,t)};function writeDouble(e,r,t,f,i){r=+r;t=t>>>0;if(!i){checkIEEE754(e,r,t,8,17976931348623157e292,-17976931348623157e292)}n.write(e,r,t,f,52,8);return t+8}Buffer.prototype.writeDoubleLE=function writeDoubleLE(e,r,t){return writeDouble(this,e,r,true,t)};Buffer.prototype.writeDoubleBE=function writeDoubleBE(e,r,t){return writeDouble(this,e,r,false,t)};Buffer.prototype.copy=function copy(e,r,t,f){if(!Buffer.isBuffer(e))throw new TypeError("argument should be a Buffer");if(!t)t=0;if(!f&&f!==0)f=this.length;if(r>=e.length)r=e.length;if(!r)r=0;if(f>0&&f<t)f=t;if(f===t)return 0;if(e.length===0||this.length===0)return 0;if(r<0){throw new RangeError("targetStart out of bounds")}if(t<0||t>=this.length)throw new RangeError("Index out of range");if(f<0)throw new RangeError("sourceEnd out of bounds");if(f>this.length)f=this.length;if(e.length-r<f-t){f=e.length-r+t}var n=f-t;if(this===e&&typeof Uint8Array.prototype.copyWithin==="function"){this.copyWithin(r,t,f)}else if(this===e&&t<r&&r<f){for(var i=n-1;i>=0;--i){e[i+r]=this[i+t]}}else{Uint8Array.prototype.set.call(e,this.subarray(t,f),r)}return n};Buffer.prototype.fill=function fill(e,r,t,f){if(typeof e==="string"){if(typeof r==="string"){f=r;r=0;t=this.length}else if(typeof t==="string"){f=t;t=this.length}if(f!==undefined&&typeof f!=="string"){throw new TypeError("encoding must be a string")}if(typeof f==="string"&&!Buffer.isEncoding(f)){throw new TypeError("Unknown encoding: "+f)}if(e.length===1){var n=e.charCodeAt(0);if(f==="utf8"&&n<128||f==="latin1"){e=n}}}else if(typeof e==="number"){e=e&255}else if(typeof e==="boolean"){e=Number(e)}if(r<0||this.length<r||this.length<t){throw new RangeError("Out of range index")}if(t<=r){return this}r=r>>>0;t=t===undefined?this.length:t>>>0;if(!e)e=0;var i;if(typeof e==="number"){for(i=r;i<t;++i){this[i]=e}}else{var o=Buffer.isBuffer(e)?e:Buffer.from(e,f);var u=o.length;if(u===0){throw new TypeError('The value "'+e+'" is invalid for argument "value"')}for(i=0;i<t-r;++i){this[i+r]=o[i%u]}}return this};var a=/[^+/0-9A-Za-z-_]/g;function base64clean(e){e=e.split("=")[0];e=e.trim().replace(a,"");if(e.length<2)return"";while(e.length%4!==0){e=e+"="}return e}function utf8ToBytes(e,r){r=r||Infinity;var t;var f=e.length;var n=null;var i=[];for(var o=0;o<f;++o){t=e.charCodeAt(o);if(t>55295&&t<57344){if(!n){if(t>56319){if((r-=3)>-1)i.push(239,191,189);continue}else if(o+1===f){if((r-=3)>-1)i.push(239,191,189);continue}n=t;continue}if(t<56320){if((r-=3)>-1)i.push(239,191,189);n=t;continue}t=(n-55296<<10|t-56320)+65536}else if(n){if((r-=3)>-1)i.push(239,191,189)}n=null;if(t<128){if((r-=1)<0)break;i.push(t)}else if(t<2048){if((r-=2)<0)break;i.push(t>>6|192,t&63|128)}else if(t<65536){if((r-=3)<0)break;i.push(t>>12|224,t>>6&63|128,t&63|128)}else if(t<1114112){if((r-=4)<0)break;i.push(t>>18|240,t>>12&63|128,t>>6&63|128,t&63|128)}else{throw new Error("Invalid code point")}}return i}function asciiToBytes(e){var r=[];for(var t=0;t<e.length;++t){r.push(e.charCodeAt(t)&255)}return r}function utf16leToBytes(e,r){var t,f,n;var i=[];for(var o=0;o<e.length;++o){if((r-=2)<0)break;t=e.charCodeAt(o);f=t>>8;n=t%256;i.push(n);i.push(f)}return i}function base64ToBytes(e){return f.toByteArray(base64clean(e))}function blitBuffer(e,r,t,f){for(var n=0;n<f;++n){if(n+t>=r.length||n>=e.length)break;r[n+t]=e[n]}return n}function isInstance(e,r){return e instanceof r||e!=null&&e.constructor!=null&&e.constructor.name!=null&&e.constructor.name===r.name}function numberIsNaN(e){return e!==e}var s=function(){var e="0123456789abcdef";var r=new Array(256);for(var t=0;t<16;++t){var f=t*16;for(var n=0;n<16;++n){r[f+n]=e[t]+e[n]}}return r}()},783:function(e,r){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
r.read=function(e,r,t,f,n){var i,o;var u=n*8-f-1;var a=(1<<u)-1;var s=a>>1;var h=-7;var c=t?n-1:0;var l=t?-1:1;var p=e[r+c];c+=l;i=p&(1<<-h)-1;p>>=-h;h+=u;for(;h>0;i=i*256+e[r+c],c+=l,h-=8){}o=i&(1<<-h)-1;i>>=-h;h+=f;for(;h>0;o=o*256+e[r+c],c+=l,h-=8){}if(i===0){i=1-s}else if(i===a){return o?NaN:(p?-1:1)*Infinity}else{o=o+Math.pow(2,f);i=i-s}return(p?-1:1)*o*Math.pow(2,i-f)};r.write=function(e,r,t,f,n,i){var o,u,a;var s=i*8-n-1;var h=(1<<s)-1;var c=h>>1;var l=n===23?Math.pow(2,-24)-Math.pow(2,-77):0;var p=f?0:i-1;var y=f?1:-1;var g=r<0||r===0&&1/r<0?1:0;r=Math.abs(r);if(isNaN(r)||r===Infinity){u=isNaN(r)?1:0;o=h}else{o=Math.floor(Math.log(r)/Math.LN2);if(r*(a=Math.pow(2,-o))<1){o--;a*=2}if(o+c>=1){r+=l/a}else{r+=l*Math.pow(2,1-c)}if(r*a>=2){o++;a/=2}if(o+c>=h){u=0;o=h}else if(o+c>=1){u=(r*a-1)*Math.pow(2,n);o=o+c}else{u=r*Math.pow(2,c-1)*Math.pow(2,n);o=0}}for(;n>=8;e[t+p]=u&255,p+=y,u/=256,n-=8){}o=o<<n|u;s+=n;for(;s>0;e[t+p]=o&255,p+=y,o/=256,s-=8){}e[t+p-y]|=g*128}}};var r={};function __nccwpck_require__(t){var f=r[t];if(f!==undefined){return f.exports}var n=r[t]={exports:{}};var i=true;try{e[t](n,n.exports,__nccwpck_require__);i=false}finally{if(i)delete r[t]}return n.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var t=__nccwpck_require__(72);module.exports=t})();

/***/ }),

/***/ 7663:
/***/ (function(module) {

var __dirname = "/";
(function(){var e={229:function(e){var t=e.exports={};var r;var n;function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}(function(){try{if(typeof setTimeout==="function"){r=setTimeout}else{r=defaultSetTimout}}catch(e){r=defaultSetTimout}try{if(typeof clearTimeout==="function"){n=clearTimeout}else{n=defaultClearTimeout}}catch(e){n=defaultClearTimeout}})();function runTimeout(e){if(r===setTimeout){return setTimeout(e,0)}if((r===defaultSetTimout||!r)&&setTimeout){r=setTimeout;return setTimeout(e,0)}try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}function runClearTimeout(e){if(n===clearTimeout){return clearTimeout(e)}if((n===defaultClearTimeout||!n)&&clearTimeout){n=clearTimeout;return clearTimeout(e)}try{return n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}var i=[];var o=false;var u;var a=-1;function cleanUpNextTick(){if(!o||!u){return}o=false;if(u.length){i=u.concat(i)}else{a=-1}if(i.length){drainQueue()}}function drainQueue(){if(o){return}var e=runTimeout(cleanUpNextTick);o=true;var t=i.length;while(t){u=i;i=[];while(++a<t){if(u){u[a].run()}}a=-1;t=i.length}u=null;o=false;runClearTimeout(e)}t.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1){for(var r=1;r<arguments.length;r++){t[r-1]=arguments[r]}}i.push(new Item(e,t));if(i.length===1&&!o){runTimeout(drainQueue)}};function Item(e,t){this.fun=e;this.array=t}Item.prototype.run=function(){this.fun.apply(null,this.array)};t.title="browser";t.browser=true;t.env={};t.argv=[];t.version="";t.versions={};function noop(){}t.on=noop;t.addListener=noop;t.once=noop;t.off=noop;t.removeListener=noop;t.removeAllListeners=noop;t.emit=noop;t.prependListener=noop;t.prependOnceListener=noop;t.listeners=function(e){return[]};t.binding=function(e){throw new Error("process.binding is not supported")};t.cwd=function(){return"/"};t.chdir=function(e){throw new Error("process.chdir is not supported")};t.umask=function(){return 0}}};var t={};function __nccwpck_require__(r){var n=t[r];if(n!==undefined){return n.exports}var i=t[r]={exports:{}};var o=true;try{e[r](i,i.exports,__nccwpck_require__);o=false}finally{if(o)delete t[r]}return i.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var r=__nccwpck_require__(229);module.exports=r})();

/***/ }),

/***/ 3300:
/***/ (function(module, exports) {

"use strict";


// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
if (global.fetch) {
	exports["default"] = global.fetch.bind(global);
}

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;

/***/ }),

/***/ 3529:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "vd": function() { return /* binding */ Octokit; }
});

// UNUSED EXPORTS: App, OAuthApp, createNodeMiddleware

// EXTERNAL MODULE: ./node_modules/@octokit/core/dist-web/index.js + 2 modules
var dist_web = __webpack_require__(6027);
// EXTERNAL MODULE: ./node_modules/@octokit/plugin-paginate-rest/dist-web/index.js
var plugin_paginate_rest_dist_web = __webpack_require__(5745);
;// CONCATENATED MODULE: ./node_modules/@octokit/plugin-rest-endpoint-methods/dist-web/index.js
const Endpoints = {
    actions: {
        addCustomLabelsToSelfHostedRunnerForOrg: [
            "POST /orgs/{org}/actions/runners/{runner_id}/labels",
        ],
        addCustomLabelsToSelfHostedRunnerForRepo: [
            "POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels",
        ],
        addSelectedRepoToOrgSecret: [
            "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}",
        ],
        approveWorkflowRun: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve",
        ],
        cancelWorkflowRun: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel",
        ],
        createOrUpdateEnvironmentSecret: [
            "PUT /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}",
        ],
        createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
        createOrUpdateRepoSecret: [
            "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}",
        ],
        createRegistrationTokenForOrg: [
            "POST /orgs/{org}/actions/runners/registration-token",
        ],
        createRegistrationTokenForRepo: [
            "POST /repos/{owner}/{repo}/actions/runners/registration-token",
        ],
        createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
        createRemoveTokenForRepo: [
            "POST /repos/{owner}/{repo}/actions/runners/remove-token",
        ],
        createWorkflowDispatch: [
            "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
        ],
        deleteActionsCacheById: [
            "DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}",
        ],
        deleteActionsCacheByKey: [
            "DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}",
        ],
        deleteArtifact: [
            "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}",
        ],
        deleteEnvironmentSecret: [
            "DELETE /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}",
        ],
        deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
        deleteRepoSecret: [
            "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}",
        ],
        deleteSelfHostedRunnerFromOrg: [
            "DELETE /orgs/{org}/actions/runners/{runner_id}",
        ],
        deleteSelfHostedRunnerFromRepo: [
            "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}",
        ],
        deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
        deleteWorkflowRunLogs: [
            "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs",
        ],
        disableSelectedRepositoryGithubActionsOrganization: [
            "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}",
        ],
        disableWorkflow: [
            "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable",
        ],
        downloadArtifact: [
            "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}",
        ],
        downloadJobLogsForWorkflowRun: [
            "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs",
        ],
        downloadWorkflowRunAttemptLogs: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs",
        ],
        downloadWorkflowRunLogs: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs",
        ],
        enableSelectedRepositoryGithubActionsOrganization: [
            "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}",
        ],
        enableWorkflow: [
            "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable",
        ],
        getActionsCacheList: ["GET /repos/{owner}/{repo}/actions/caches"],
        getActionsCacheUsage: ["GET /repos/{owner}/{repo}/actions/cache/usage"],
        getActionsCacheUsageByRepoForOrg: [
            "GET /orgs/{org}/actions/cache/usage-by-repository",
        ],
        getActionsCacheUsageForEnterprise: [
            "GET /enterprises/{enterprise}/actions/cache/usage",
        ],
        getActionsCacheUsageForOrg: ["GET /orgs/{org}/actions/cache/usage"],
        getAllowedActionsOrganization: [
            "GET /orgs/{org}/actions/permissions/selected-actions",
        ],
        getAllowedActionsRepository: [
            "GET /repos/{owner}/{repo}/actions/permissions/selected-actions",
        ],
        getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
        getEnvironmentPublicKey: [
            "GET /repositories/{repository_id}/environments/{environment_name}/secrets/public-key",
        ],
        getEnvironmentSecret: [
            "GET /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}",
        ],
        getGithubActionsDefaultWorkflowPermissionsEnterprise: [
            "GET /enterprises/{enterprise}/actions/permissions/workflow",
        ],
        getGithubActionsDefaultWorkflowPermissionsOrganization: [
            "GET /orgs/{org}/actions/permissions/workflow",
        ],
        getGithubActionsDefaultWorkflowPermissionsRepository: [
            "GET /repos/{owner}/{repo}/actions/permissions/workflow",
        ],
        getGithubActionsPermissionsOrganization: [
            "GET /orgs/{org}/actions/permissions",
        ],
        getGithubActionsPermissionsRepository: [
            "GET /repos/{owner}/{repo}/actions/permissions",
        ],
        getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
        getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
        getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
        getPendingDeploymentsForRun: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments",
        ],
        getRepoPermissions: [
            "GET /repos/{owner}/{repo}/actions/permissions",
            {},
            { renamed: ["actions", "getGithubActionsPermissionsRepository"] },
        ],
        getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
        getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
        getReviewsForRun: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals",
        ],
        getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
        getSelfHostedRunnerForRepo: [
            "GET /repos/{owner}/{repo}/actions/runners/{runner_id}",
        ],
        getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
        getWorkflowAccessToRepository: [
            "GET /repos/{owner}/{repo}/actions/permissions/access",
        ],
        getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
        getWorkflowRunAttempt: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}",
        ],
        getWorkflowRunUsage: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing",
        ],
        getWorkflowUsage: [
            "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing",
        ],
        listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
        listEnvironmentSecrets: [
            "GET /repositories/{repository_id}/environments/{environment_name}/secrets",
        ],
        listJobsForWorkflowRun: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
        ],
        listJobsForWorkflowRunAttempt: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs",
        ],
        listLabelsForSelfHostedRunnerForOrg: [
            "GET /orgs/{org}/actions/runners/{runner_id}/labels",
        ],
        listLabelsForSelfHostedRunnerForRepo: [
            "GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels",
        ],
        listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
        listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
        listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
        listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
        listRunnerApplicationsForRepo: [
            "GET /repos/{owner}/{repo}/actions/runners/downloads",
        ],
        listSelectedReposForOrgSecret: [
            "GET /orgs/{org}/actions/secrets/{secret_name}/repositories",
        ],
        listSelectedRepositoriesEnabledGithubActionsOrganization: [
            "GET /orgs/{org}/actions/permissions/repositories",
        ],
        listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
        listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
        listWorkflowRunArtifacts: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts",
        ],
        listWorkflowRuns: [
            "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
        ],
        listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
        reRunJobForWorkflowRun: [
            "POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun",
        ],
        reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
        reRunWorkflowFailedJobs: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs",
        ],
        removeAllCustomLabelsFromSelfHostedRunnerForOrg: [
            "DELETE /orgs/{org}/actions/runners/{runner_id}/labels",
        ],
        removeAllCustomLabelsFromSelfHostedRunnerForRepo: [
            "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels",
        ],
        removeCustomLabelFromSelfHostedRunnerForOrg: [
            "DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}",
        ],
        removeCustomLabelFromSelfHostedRunnerForRepo: [
            "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}",
        ],
        removeSelectedRepoFromOrgSecret: [
            "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}",
        ],
        reviewPendingDeploymentsForRun: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments",
        ],
        setAllowedActionsOrganization: [
            "PUT /orgs/{org}/actions/permissions/selected-actions",
        ],
        setAllowedActionsRepository: [
            "PUT /repos/{owner}/{repo}/actions/permissions/selected-actions",
        ],
        setCustomLabelsForSelfHostedRunnerForOrg: [
            "PUT /orgs/{org}/actions/runners/{runner_id}/labels",
        ],
        setCustomLabelsForSelfHostedRunnerForRepo: [
            "PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels",
        ],
        setGithubActionsDefaultWorkflowPermissionsEnterprise: [
            "PUT /enterprises/{enterprise}/actions/permissions/workflow",
        ],
        setGithubActionsDefaultWorkflowPermissionsOrganization: [
            "PUT /orgs/{org}/actions/permissions/workflow",
        ],
        setGithubActionsDefaultWorkflowPermissionsRepository: [
            "PUT /repos/{owner}/{repo}/actions/permissions/workflow",
        ],
        setGithubActionsPermissionsOrganization: [
            "PUT /orgs/{org}/actions/permissions",
        ],
        setGithubActionsPermissionsRepository: [
            "PUT /repos/{owner}/{repo}/actions/permissions",
        ],
        setSelectedReposForOrgSecret: [
            "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories",
        ],
        setSelectedRepositoriesEnabledGithubActionsOrganization: [
            "PUT /orgs/{org}/actions/permissions/repositories",
        ],
        setWorkflowAccessToRepository: [
            "PUT /repos/{owner}/{repo}/actions/permissions/access",
        ],
    },
    activity: {
        checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
        deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
        deleteThreadSubscription: [
            "DELETE /notifications/threads/{thread_id}/subscription",
        ],
        getFeeds: ["GET /feeds"],
        getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
        getThread: ["GET /notifications/threads/{thread_id}"],
        getThreadSubscriptionForAuthenticatedUser: [
            "GET /notifications/threads/{thread_id}/subscription",
        ],
        listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
        listNotificationsForAuthenticatedUser: ["GET /notifications"],
        listOrgEventsForAuthenticatedUser: [
            "GET /users/{username}/events/orgs/{org}",
        ],
        listPublicEvents: ["GET /events"],
        listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
        listPublicEventsForUser: ["GET /users/{username}/events/public"],
        listPublicOrgEvents: ["GET /orgs/{org}/events"],
        listReceivedEventsForUser: ["GET /users/{username}/received_events"],
        listReceivedPublicEventsForUser: [
            "GET /users/{username}/received_events/public",
        ],
        listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
        listRepoNotificationsForAuthenticatedUser: [
            "GET /repos/{owner}/{repo}/notifications",
        ],
        listReposStarredByAuthenticatedUser: ["GET /user/starred"],
        listReposStarredByUser: ["GET /users/{username}/starred"],
        listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
        listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
        listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
        listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
        markNotificationsAsRead: ["PUT /notifications"],
        markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
        markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
        setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
        setThreadSubscription: [
            "PUT /notifications/threads/{thread_id}/subscription",
        ],
        starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
        unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"],
    },
    apps: {
        addRepoToInstallation: [
            "PUT /user/installations/{installation_id}/repositories/{repository_id}",
            {},
            { renamed: ["apps", "addRepoToInstallationForAuthenticatedUser"] },
        ],
        addRepoToInstallationForAuthenticatedUser: [
            "PUT /user/installations/{installation_id}/repositories/{repository_id}",
        ],
        checkToken: ["POST /applications/{client_id}/token"],
        createFromManifest: ["POST /app-manifests/{code}/conversions"],
        createInstallationAccessToken: [
            "POST /app/installations/{installation_id}/access_tokens",
        ],
        deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
        deleteInstallation: ["DELETE /app/installations/{installation_id}"],
        deleteToken: ["DELETE /applications/{client_id}/token"],
        getAuthenticated: ["GET /app"],
        getBySlug: ["GET /apps/{app_slug}"],
        getInstallation: ["GET /app/installations/{installation_id}"],
        getOrgInstallation: ["GET /orgs/{org}/installation"],
        getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
        getSubscriptionPlanForAccount: [
            "GET /marketplace_listing/accounts/{account_id}",
        ],
        getSubscriptionPlanForAccountStubbed: [
            "GET /marketplace_listing/stubbed/accounts/{account_id}",
        ],
        getUserInstallation: ["GET /users/{username}/installation"],
        getWebhookConfigForApp: ["GET /app/hook/config"],
        getWebhookDelivery: ["GET /app/hook/deliveries/{delivery_id}"],
        listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
        listAccountsForPlanStubbed: [
            "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts",
        ],
        listInstallationReposForAuthenticatedUser: [
            "GET /user/installations/{installation_id}/repositories",
        ],
        listInstallations: ["GET /app/installations"],
        listInstallationsForAuthenticatedUser: ["GET /user/installations"],
        listPlans: ["GET /marketplace_listing/plans"],
        listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
        listReposAccessibleToInstallation: ["GET /installation/repositories"],
        listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
        listSubscriptionsForAuthenticatedUserStubbed: [
            "GET /user/marketplace_purchases/stubbed",
        ],
        listWebhookDeliveries: ["GET /app/hook/deliveries"],
        redeliverWebhookDelivery: [
            "POST /app/hook/deliveries/{delivery_id}/attempts",
        ],
        removeRepoFromInstallation: [
            "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
            {},
            { renamed: ["apps", "removeRepoFromInstallationForAuthenticatedUser"] },
        ],
        removeRepoFromInstallationForAuthenticatedUser: [
            "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
        ],
        resetToken: ["PATCH /applications/{client_id}/token"],
        revokeInstallationAccessToken: ["DELETE /installation/token"],
        scopeToken: ["POST /applications/{client_id}/token/scoped"],
        suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
        unsuspendInstallation: [
            "DELETE /app/installations/{installation_id}/suspended",
        ],
        updateWebhookConfigForApp: ["PATCH /app/hook/config"],
    },
    billing: {
        getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
        getGithubActionsBillingUser: [
            "GET /users/{username}/settings/billing/actions",
        ],
        getGithubAdvancedSecurityBillingGhe: [
            "GET /enterprises/{enterprise}/settings/billing/advanced-security",
        ],
        getGithubAdvancedSecurityBillingOrg: [
            "GET /orgs/{org}/settings/billing/advanced-security",
        ],
        getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
        getGithubPackagesBillingUser: [
            "GET /users/{username}/settings/billing/packages",
        ],
        getSharedStorageBillingOrg: [
            "GET /orgs/{org}/settings/billing/shared-storage",
        ],
        getSharedStorageBillingUser: [
            "GET /users/{username}/settings/billing/shared-storage",
        ],
    },
    checks: {
        create: ["POST /repos/{owner}/{repo}/check-runs"],
        createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
        get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
        getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
        listAnnotations: [
            "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations",
        ],
        listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
        listForSuite: [
            "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs",
        ],
        listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
        rerequestRun: [
            "POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest",
        ],
        rerequestSuite: [
            "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest",
        ],
        setSuitesPreferences: [
            "PATCH /repos/{owner}/{repo}/check-suites/preferences",
        ],
        update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    },
    codeScanning: {
        deleteAnalysis: [
            "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}",
        ],
        getAlert: [
            "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
            {},
            { renamedParameters: { alert_id: "alert_number" } },
        ],
        getAnalysis: [
            "GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}",
        ],
        getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
        listAlertInstances: [
            "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
        ],
        listAlertsForEnterprise: [
            "GET /enterprises/{enterprise}/code-scanning/alerts",
        ],
        listAlertsForOrg: ["GET /orgs/{org}/code-scanning/alerts"],
        listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
        listAlertsInstances: [
            "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
            {},
            { renamed: ["codeScanning", "listAlertInstances"] },
        ],
        listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
        updateAlert: [
            "PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
        ],
        uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"],
    },
    codesOfConduct: {
        getAllCodesOfConduct: ["GET /codes_of_conduct"],
        getConductCode: ["GET /codes_of_conduct/{key}"],
    },
    codespaces: {
        addRepositoryForSecretForAuthenticatedUser: [
            "PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}",
        ],
        codespaceMachinesForAuthenticatedUser: [
            "GET /user/codespaces/{codespace_name}/machines",
        ],
        createForAuthenticatedUser: ["POST /user/codespaces"],
        createOrUpdateRepoSecret: [
            "PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}",
        ],
        createOrUpdateSecretForAuthenticatedUser: [
            "PUT /user/codespaces/secrets/{secret_name}",
        ],
        createWithPrForAuthenticatedUser: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces",
        ],
        createWithRepoForAuthenticatedUser: [
            "POST /repos/{owner}/{repo}/codespaces",
        ],
        deleteForAuthenticatedUser: ["DELETE /user/codespaces/{codespace_name}"],
        deleteFromOrganization: [
            "DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}",
        ],
        deleteRepoSecret: [
            "DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}",
        ],
        deleteSecretForAuthenticatedUser: [
            "DELETE /user/codespaces/secrets/{secret_name}",
        ],
        exportForAuthenticatedUser: [
            "POST /user/codespaces/{codespace_name}/exports",
        ],
        getExportDetailsForAuthenticatedUser: [
            "GET /user/codespaces/{codespace_name}/exports/{export_id}",
        ],
        getForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}"],
        getPublicKeyForAuthenticatedUser: [
            "GET /user/codespaces/secrets/public-key",
        ],
        getRepoPublicKey: [
            "GET /repos/{owner}/{repo}/codespaces/secrets/public-key",
        ],
        getRepoSecret: [
            "GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}",
        ],
        getSecretForAuthenticatedUser: [
            "GET /user/codespaces/secrets/{secret_name}",
        ],
        listDevcontainersInRepositoryForAuthenticatedUser: [
            "GET /repos/{owner}/{repo}/codespaces/devcontainers",
        ],
        listForAuthenticatedUser: ["GET /user/codespaces"],
        listInOrganization: [
            "GET /orgs/{org}/codespaces",
            {},
            { renamedParameters: { org_id: "org" } },
        ],
        listInRepositoryForAuthenticatedUser: [
            "GET /repos/{owner}/{repo}/codespaces",
        ],
        listRepoSecrets: ["GET /repos/{owner}/{repo}/codespaces/secrets"],
        listRepositoriesForSecretForAuthenticatedUser: [
            "GET /user/codespaces/secrets/{secret_name}/repositories",
        ],
        listSecretsForAuthenticatedUser: ["GET /user/codespaces/secrets"],
        preFlightWithRepoForAuthenticatedUser: [
            "GET /repos/{owner}/{repo}/codespaces/new",
        ],
        removeRepositoryForSecretForAuthenticatedUser: [
            "DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}",
        ],
        repoMachinesForAuthenticatedUser: [
            "GET /repos/{owner}/{repo}/codespaces/machines",
        ],
        setRepositoriesForSecretForAuthenticatedUser: [
            "PUT /user/codespaces/secrets/{secret_name}/repositories",
        ],
        startForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/start"],
        stopForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/stop"],
        stopInOrganization: [
            "POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop",
        ],
        updateForAuthenticatedUser: ["PATCH /user/codespaces/{codespace_name}"],
    },
    dependabot: {
        addSelectedRepoToOrgSecret: [
            "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}",
        ],
        createOrUpdateOrgSecret: [
            "PUT /orgs/{org}/dependabot/secrets/{secret_name}",
        ],
        createOrUpdateRepoSecret: [
            "PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}",
        ],
        deleteOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],
        deleteRepoSecret: [
            "DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}",
        ],
        getOrgPublicKey: ["GET /orgs/{org}/dependabot/secrets/public-key"],
        getOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}"],
        getRepoPublicKey: [
            "GET /repos/{owner}/{repo}/dependabot/secrets/public-key",
        ],
        getRepoSecret: [
            "GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}",
        ],
        listOrgSecrets: ["GET /orgs/{org}/dependabot/secrets"],
        listRepoSecrets: ["GET /repos/{owner}/{repo}/dependabot/secrets"],
        listSelectedReposForOrgSecret: [
            "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories",
        ],
        removeSelectedRepoFromOrgSecret: [
            "DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}",
        ],
        setSelectedReposForOrgSecret: [
            "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories",
        ],
    },
    dependencyGraph: {
        createRepositorySnapshot: [
            "POST /repos/{owner}/{repo}/dependency-graph/snapshots",
        ],
        diffRange: [
            "GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}",
        ],
    },
    emojis: { get: ["GET /emojis"] },
    enterpriseAdmin: {
        addCustomLabelsToSelfHostedRunnerForEnterprise: [
            "POST /enterprises/{enterprise}/actions/runners/{runner_id}/labels",
        ],
        disableSelectedOrganizationGithubActionsEnterprise: [
            "DELETE /enterprises/{enterprise}/actions/permissions/organizations/{org_id}",
        ],
        enableSelectedOrganizationGithubActionsEnterprise: [
            "PUT /enterprises/{enterprise}/actions/permissions/organizations/{org_id}",
        ],
        getAllowedActionsEnterprise: [
            "GET /enterprises/{enterprise}/actions/permissions/selected-actions",
        ],
        getGithubActionsPermissionsEnterprise: [
            "GET /enterprises/{enterprise}/actions/permissions",
        ],
        getServerStatistics: [
            "GET /enterprise-installation/{enterprise_or_org}/server-statistics",
        ],
        listLabelsForSelfHostedRunnerForEnterprise: [
            "GET /enterprises/{enterprise}/actions/runners/{runner_id}/labels",
        ],
        listSelectedOrganizationsEnabledGithubActionsEnterprise: [
            "GET /enterprises/{enterprise}/actions/permissions/organizations",
        ],
        removeAllCustomLabelsFromSelfHostedRunnerForEnterprise: [
            "DELETE /enterprises/{enterprise}/actions/runners/{runner_id}/labels",
        ],
        removeCustomLabelFromSelfHostedRunnerForEnterprise: [
            "DELETE /enterprises/{enterprise}/actions/runners/{runner_id}/labels/{name}",
        ],
        setAllowedActionsEnterprise: [
            "PUT /enterprises/{enterprise}/actions/permissions/selected-actions",
        ],
        setCustomLabelsForSelfHostedRunnerForEnterprise: [
            "PUT /enterprises/{enterprise}/actions/runners/{runner_id}/labels",
        ],
        setGithubActionsPermissionsEnterprise: [
            "PUT /enterprises/{enterprise}/actions/permissions",
        ],
        setSelectedOrganizationsEnabledGithubActionsEnterprise: [
            "PUT /enterprises/{enterprise}/actions/permissions/organizations",
        ],
    },
    gists: {
        checkIsStarred: ["GET /gists/{gist_id}/star"],
        create: ["POST /gists"],
        createComment: ["POST /gists/{gist_id}/comments"],
        delete: ["DELETE /gists/{gist_id}"],
        deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
        fork: ["POST /gists/{gist_id}/forks"],
        get: ["GET /gists/{gist_id}"],
        getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
        getRevision: ["GET /gists/{gist_id}/{sha}"],
        list: ["GET /gists"],
        listComments: ["GET /gists/{gist_id}/comments"],
        listCommits: ["GET /gists/{gist_id}/commits"],
        listForUser: ["GET /users/{username}/gists"],
        listForks: ["GET /gists/{gist_id}/forks"],
        listPublic: ["GET /gists/public"],
        listStarred: ["GET /gists/starred"],
        star: ["PUT /gists/{gist_id}/star"],
        unstar: ["DELETE /gists/{gist_id}/star"],
        update: ["PATCH /gists/{gist_id}"],
        updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"],
    },
    git: {
        createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
        createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
        createRef: ["POST /repos/{owner}/{repo}/git/refs"],
        createTag: ["POST /repos/{owner}/{repo}/git/tags"],
        createTree: ["POST /repos/{owner}/{repo}/git/trees"],
        deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
        getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
        getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
        getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
        getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
        getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
        listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
        updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"],
    },
    gitignore: {
        getAllTemplates: ["GET /gitignore/templates"],
        getTemplate: ["GET /gitignore/templates/{name}"],
    },
    interactions: {
        getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
        getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
        getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
        getRestrictionsForYourPublicRepos: [
            "GET /user/interaction-limits",
            {},
            { renamed: ["interactions", "getRestrictionsForAuthenticatedUser"] },
        ],
        removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
        removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
        removeRestrictionsForRepo: [
            "DELETE /repos/{owner}/{repo}/interaction-limits",
        ],
        removeRestrictionsForYourPublicRepos: [
            "DELETE /user/interaction-limits",
            {},
            { renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"] },
        ],
        setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
        setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
        setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
        setRestrictionsForYourPublicRepos: [
            "PUT /user/interaction-limits",
            {},
            { renamed: ["interactions", "setRestrictionsForAuthenticatedUser"] },
        ],
    },
    issues: {
        addAssignees: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees",
        ],
        addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
        create: ["POST /repos/{owner}/{repo}/issues"],
        createComment: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
        ],
        createLabel: ["POST /repos/{owner}/{repo}/labels"],
        createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
        deleteComment: [
            "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}",
        ],
        deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
        deleteMilestone: [
            "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}",
        ],
        get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
        getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
        getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
        getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
        getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
        list: ["GET /issues"],
        listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
        listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
        listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
        listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
        listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
        listEventsForTimeline: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
        ],
        listForAuthenticatedUser: ["GET /user/issues"],
        listForOrg: ["GET /orgs/{org}/issues"],
        listForRepo: ["GET /repos/{owner}/{repo}/issues"],
        listLabelsForMilestone: [
            "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels",
        ],
        listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
        listLabelsOnIssue: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/labels",
        ],
        listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
        lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
        removeAllLabels: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels",
        ],
        removeAssignees: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees",
        ],
        removeLabel: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}",
        ],
        setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
        update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
        updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
        updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
        updateMilestone: [
            "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}",
        ],
    },
    licenses: {
        get: ["GET /licenses/{license}"],
        getAllCommonlyUsed: ["GET /licenses"],
        getForRepo: ["GET /repos/{owner}/{repo}/license"],
    },
    markdown: {
        render: ["POST /markdown"],
        renderRaw: [
            "POST /markdown/raw",
            { headers: { "content-type": "text/plain; charset=utf-8" } },
        ],
    },
    meta: {
        get: ["GET /meta"],
        getOctocat: ["GET /octocat"],
        getZen: ["GET /zen"],
        root: ["GET /"],
    },
    migrations: {
        cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
        deleteArchiveForAuthenticatedUser: [
            "DELETE /user/migrations/{migration_id}/archive",
        ],
        deleteArchiveForOrg: [
            "DELETE /orgs/{org}/migrations/{migration_id}/archive",
        ],
        downloadArchiveForOrg: [
            "GET /orgs/{org}/migrations/{migration_id}/archive",
        ],
        getArchiveForAuthenticatedUser: [
            "GET /user/migrations/{migration_id}/archive",
        ],
        getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
        getImportStatus: ["GET /repos/{owner}/{repo}/import"],
        getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
        getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}"],
        getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}"],
        listForAuthenticatedUser: ["GET /user/migrations"],
        listForOrg: ["GET /orgs/{org}/migrations"],
        listReposForAuthenticatedUser: [
            "GET /user/migrations/{migration_id}/repositories",
        ],
        listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories"],
        listReposForUser: [
            "GET /user/migrations/{migration_id}/repositories",
            {},
            { renamed: ["migrations", "listReposForAuthenticatedUser"] },
        ],
        mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
        setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
        startForAuthenticatedUser: ["POST /user/migrations"],
        startForOrg: ["POST /orgs/{org}/migrations"],
        startImport: ["PUT /repos/{owner}/{repo}/import"],
        unlockRepoForAuthenticatedUser: [
            "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock",
        ],
        unlockRepoForOrg: [
            "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock",
        ],
        updateImport: ["PATCH /repos/{owner}/{repo}/import"],
    },
    orgs: {
        addSecurityManagerTeam: [
            "PUT /orgs/{org}/security-managers/teams/{team_slug}",
        ],
        blockUser: ["PUT /orgs/{org}/blocks/{username}"],
        cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
        checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
        checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
        checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
        convertMemberToOutsideCollaborator: [
            "PUT /orgs/{org}/outside_collaborators/{username}",
        ],
        createCustomRole: ["POST /orgs/{org}/custom_roles"],
        createInvitation: ["POST /orgs/{org}/invitations"],
        createWebhook: ["POST /orgs/{org}/hooks"],
        deleteCustomRole: ["DELETE /orgs/{org}/custom_roles/{role_id}"],
        deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
        enableOrDisableSecurityProductOnAllOrgRepos: [
            "POST /orgs/{org}/{security_product}/{enablement}",
        ],
        get: ["GET /orgs/{org}"],
        getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
        getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
        getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
        getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
        getWebhookDelivery: [
            "GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}",
        ],
        list: ["GET /organizations"],
        listAppInstallations: ["GET /orgs/{org}/installations"],
        listBlockedUsers: ["GET /orgs/{org}/blocks"],
        listCustomRoles: ["GET /organizations/{organization_id}/custom_roles"],
        listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
        listFineGrainedPermissions: ["GET /orgs/{org}/fine_grained_permissions"],
        listForAuthenticatedUser: ["GET /user/orgs"],
        listForUser: ["GET /users/{username}/orgs"],
        listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
        listMembers: ["GET /orgs/{org}/members"],
        listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
        listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
        listPendingInvitations: ["GET /orgs/{org}/invitations"],
        listPublicMembers: ["GET /orgs/{org}/public_members"],
        listSecurityManagerTeams: ["GET /orgs/{org}/security-managers"],
        listWebhookDeliveries: ["GET /orgs/{org}/hooks/{hook_id}/deliveries"],
        listWebhooks: ["GET /orgs/{org}/hooks"],
        pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
        redeliverWebhookDelivery: [
            "POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts",
        ],
        removeMember: ["DELETE /orgs/{org}/members/{username}"],
        removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
        removeOutsideCollaborator: [
            "DELETE /orgs/{org}/outside_collaborators/{username}",
        ],
        removePublicMembershipForAuthenticatedUser: [
            "DELETE /orgs/{org}/public_members/{username}",
        ],
        removeSecurityManagerTeam: [
            "DELETE /orgs/{org}/security-managers/teams/{team_slug}",
        ],
        setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
        setPublicMembershipForAuthenticatedUser: [
            "PUT /orgs/{org}/public_members/{username}",
        ],
        unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
        update: ["PATCH /orgs/{org}"],
        updateCustomRole: ["PATCH /orgs/{org}/custom_roles/{role_id}"],
        updateMembershipForAuthenticatedUser: [
            "PATCH /user/memberships/orgs/{org}",
        ],
        updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
        updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"],
    },
    packages: {
        deletePackageForAuthenticatedUser: [
            "DELETE /user/packages/{package_type}/{package_name}",
        ],
        deletePackageForOrg: [
            "DELETE /orgs/{org}/packages/{package_type}/{package_name}",
        ],
        deletePackageForUser: [
            "DELETE /users/{username}/packages/{package_type}/{package_name}",
        ],
        deletePackageVersionForAuthenticatedUser: [
            "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}",
        ],
        deletePackageVersionForOrg: [
            "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}",
        ],
        deletePackageVersionForUser: [
            "DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}",
        ],
        getAllPackageVersionsForAPackageOwnedByAnOrg: [
            "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
            {},
            { renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"] },
        ],
        getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
            "GET /user/packages/{package_type}/{package_name}/versions",
            {},
            {
                renamed: [
                    "packages",
                    "getAllPackageVersionsForPackageOwnedByAuthenticatedUser",
                ],
            },
        ],
        getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
            "GET /user/packages/{package_type}/{package_name}/versions",
        ],
        getAllPackageVersionsForPackageOwnedByOrg: [
            "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
        ],
        getAllPackageVersionsForPackageOwnedByUser: [
            "GET /users/{username}/packages/{package_type}/{package_name}/versions",
        ],
        getPackageForAuthenticatedUser: [
            "GET /user/packages/{package_type}/{package_name}",
        ],
        getPackageForOrganization: [
            "GET /orgs/{org}/packages/{package_type}/{package_name}",
        ],
        getPackageForUser: [
            "GET /users/{username}/packages/{package_type}/{package_name}",
        ],
        getPackageVersionForAuthenticatedUser: [
            "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}",
        ],
        getPackageVersionForOrganization: [
            "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}",
        ],
        getPackageVersionForUser: [
            "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}",
        ],
        listPackagesForAuthenticatedUser: ["GET /user/packages"],
        listPackagesForOrganization: ["GET /orgs/{org}/packages"],
        listPackagesForUser: ["GET /users/{username}/packages"],
        restorePackageForAuthenticatedUser: [
            "POST /user/packages/{package_type}/{package_name}/restore{?token}",
        ],
        restorePackageForOrg: [
            "POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}",
        ],
        restorePackageForUser: [
            "POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}",
        ],
        restorePackageVersionForAuthenticatedUser: [
            "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore",
        ],
        restorePackageVersionForOrg: [
            "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore",
        ],
        restorePackageVersionForUser: [
            "POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore",
        ],
    },
    projects: {
        addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}"],
        createCard: ["POST /projects/columns/{column_id}/cards"],
        createColumn: ["POST /projects/{project_id}/columns"],
        createForAuthenticatedUser: ["POST /user/projects"],
        createForOrg: ["POST /orgs/{org}/projects"],
        createForRepo: ["POST /repos/{owner}/{repo}/projects"],
        delete: ["DELETE /projects/{project_id}"],
        deleteCard: ["DELETE /projects/columns/cards/{card_id}"],
        deleteColumn: ["DELETE /projects/columns/{column_id}"],
        get: ["GET /projects/{project_id}"],
        getCard: ["GET /projects/columns/cards/{card_id}"],
        getColumn: ["GET /projects/columns/{column_id}"],
        getPermissionForUser: [
            "GET /projects/{project_id}/collaborators/{username}/permission",
        ],
        listCards: ["GET /projects/columns/{column_id}/cards"],
        listCollaborators: ["GET /projects/{project_id}/collaborators"],
        listColumns: ["GET /projects/{project_id}/columns"],
        listForOrg: ["GET /orgs/{org}/projects"],
        listForRepo: ["GET /repos/{owner}/{repo}/projects"],
        listForUser: ["GET /users/{username}/projects"],
        moveCard: ["POST /projects/columns/cards/{card_id}/moves"],
        moveColumn: ["POST /projects/columns/{column_id}/moves"],
        removeCollaborator: [
            "DELETE /projects/{project_id}/collaborators/{username}",
        ],
        update: ["PATCH /projects/{project_id}"],
        updateCard: ["PATCH /projects/columns/cards/{card_id}"],
        updateColumn: ["PATCH /projects/columns/{column_id}"],
    },
    pulls: {
        checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
        create: ["POST /repos/{owner}/{repo}/pulls"],
        createReplyForReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
        ],
        createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
        createReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments",
        ],
        deletePendingReview: [
            "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}",
        ],
        deleteReviewComment: [
            "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}",
        ],
        dismissReview: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals",
        ],
        get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
        getReview: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}",
        ],
        getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
        list: ["GET /repos/{owner}/{repo}/pulls"],
        listCommentsForReview: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments",
        ],
        listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
        listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
        listRequestedReviewers: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
        ],
        listReviewComments: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments",
        ],
        listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
        listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
        merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
        removeRequestedReviewers: [
            "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
        ],
        requestReviewers: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
        ],
        submitReview: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events",
        ],
        update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
        updateBranch: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch",
        ],
        updateReview: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}",
        ],
        updateReviewComment: [
            "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}",
        ],
    },
    rateLimit: { get: ["GET /rate_limit"] },
    reactions: {
        createForCommitComment: [
            "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions",
        ],
        createForIssue: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions",
        ],
        createForIssueComment: [
            "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
        ],
        createForPullRequestReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
        ],
        createForRelease: [
            "POST /repos/{owner}/{repo}/releases/{release_id}/reactions",
        ],
        createForTeamDiscussionCommentInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
        ],
        createForTeamDiscussionInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
        ],
        deleteForCommitComment: [
            "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}",
        ],
        deleteForIssue: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}",
        ],
        deleteForIssueComment: [
            "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}",
        ],
        deleteForPullRequestComment: [
            "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}",
        ],
        deleteForRelease: [
            "DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}",
        ],
        deleteForTeamDiscussion: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}",
        ],
        deleteForTeamDiscussionComment: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}",
        ],
        listForCommitComment: [
            "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions",
        ],
        listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
        listForIssueComment: [
            "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
        ],
        listForPullRequestReviewComment: [
            "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
        ],
        listForRelease: [
            "GET /repos/{owner}/{repo}/releases/{release_id}/reactions",
        ],
        listForTeamDiscussionCommentInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
        ],
        listForTeamDiscussionInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
        ],
    },
    repos: {
        acceptInvitation: [
            "PATCH /user/repository_invitations/{invitation_id}",
            {},
            { renamed: ["repos", "acceptInvitationForAuthenticatedUser"] },
        ],
        acceptInvitationForAuthenticatedUser: [
            "PATCH /user/repository_invitations/{invitation_id}",
        ],
        addAppAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps" },
        ],
        addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
        addStatusCheckContexts: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts" },
        ],
        addTeamAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams" },
        ],
        addUserAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users" },
        ],
        checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
        checkVulnerabilityAlerts: [
            "GET /repos/{owner}/{repo}/vulnerability-alerts",
        ],
        codeownersErrors: ["GET /repos/{owner}/{repo}/codeowners/errors"],
        compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
        compareCommitsWithBasehead: [
            "GET /repos/{owner}/{repo}/compare/{basehead}",
        ],
        createAutolink: ["POST /repos/{owner}/{repo}/autolinks"],
        createCommitComment: [
            "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments",
        ],
        createCommitSignatureProtection: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
        ],
        createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
        createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
        createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
        createDeploymentBranchPolicy: [
            "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies",
        ],
        createDeploymentStatus: [
            "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
        ],
        createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
        createForAuthenticatedUser: ["POST /user/repos"],
        createFork: ["POST /repos/{owner}/{repo}/forks"],
        createInOrg: ["POST /orgs/{org}/repos"],
        createOrUpdateEnvironment: [
            "PUT /repos/{owner}/{repo}/environments/{environment_name}",
        ],
        createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
        createPagesDeployment: ["POST /repos/{owner}/{repo}/pages/deployment"],
        createPagesSite: ["POST /repos/{owner}/{repo}/pages"],
        createRelease: ["POST /repos/{owner}/{repo}/releases"],
        createTagProtection: ["POST /repos/{owner}/{repo}/tags/protection"],
        createUsingTemplate: [
            "POST /repos/{template_owner}/{template_repo}/generate",
        ],
        createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
        declineInvitation: [
            "DELETE /user/repository_invitations/{invitation_id}",
            {},
            { renamed: ["repos", "declineInvitationForAuthenticatedUser"] },
        ],
        declineInvitationForAuthenticatedUser: [
            "DELETE /user/repository_invitations/{invitation_id}",
        ],
        delete: ["DELETE /repos/{owner}/{repo}"],
        deleteAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions",
        ],
        deleteAdminBranchProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
        ],
        deleteAnEnvironment: [
            "DELETE /repos/{owner}/{repo}/environments/{environment_name}",
        ],
        deleteAutolink: ["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],
        deleteBranchProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection",
        ],
        deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
        deleteCommitSignatureProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
        ],
        deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
        deleteDeployment: [
            "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}",
        ],
        deleteDeploymentBranchPolicy: [
            "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}",
        ],
        deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
        deleteInvitation: [
            "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}",
        ],
        deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages"],
        deletePullRequestReviewProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
        ],
        deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
        deleteReleaseAsset: [
            "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}",
        ],
        deleteTagProtection: [
            "DELETE /repos/{owner}/{repo}/tags/protection/{tag_protection_id}",
        ],
        deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
        disableAutomatedSecurityFixes: [
            "DELETE /repos/{owner}/{repo}/automated-security-fixes",
        ],
        disableLfsForRepo: ["DELETE /repos/{owner}/{repo}/lfs"],
        disableVulnerabilityAlerts: [
            "DELETE /repos/{owner}/{repo}/vulnerability-alerts",
        ],
        downloadArchive: [
            "GET /repos/{owner}/{repo}/zipball/{ref}",
            {},
            { renamed: ["repos", "downloadZipballArchive"] },
        ],
        downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
        downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
        enableAutomatedSecurityFixes: [
            "PUT /repos/{owner}/{repo}/automated-security-fixes",
        ],
        enableLfsForRepo: ["PUT /repos/{owner}/{repo}/lfs"],
        enableVulnerabilityAlerts: [
            "PUT /repos/{owner}/{repo}/vulnerability-alerts",
        ],
        generateReleaseNotes: [
            "POST /repos/{owner}/{repo}/releases/generate-notes",
        ],
        get: ["GET /repos/{owner}/{repo}"],
        getAccessRestrictions: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions",
        ],
        getAdminBranchProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
        ],
        getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
        getAllStatusCheckContexts: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
        ],
        getAllTopics: ["GET /repos/{owner}/{repo}/topics"],
        getAppsWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
        ],
        getAutolink: ["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],
        getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
        getBranchProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection",
        ],
        getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
        getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
        getCollaboratorPermissionLevel: [
            "GET /repos/{owner}/{repo}/collaborators/{username}/permission",
        ],
        getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
        getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
        getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
        getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
        getCommitSignatureProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
        ],
        getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
        getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
        getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
        getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
        getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
        getDeploymentBranchPolicy: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}",
        ],
        getDeploymentStatus: [
            "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}",
        ],
        getEnvironment: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}",
        ],
        getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
        getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
        getPages: ["GET /repos/{owner}/{repo}/pages"],
        getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
        getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
        getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
        getPullRequestReviewProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
        ],
        getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
        getReadme: ["GET /repos/{owner}/{repo}/readme"],
        getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
        getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
        getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
        getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
        getStatusChecksProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        ],
        getTeamsWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
        ],
        getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
        getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
        getUsersWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
        ],
        getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
        getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
        getWebhookConfigForRepo: [
            "GET /repos/{owner}/{repo}/hooks/{hook_id}/config",
        ],
        getWebhookDelivery: [
            "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}",
        ],
        listAutolinks: ["GET /repos/{owner}/{repo}/autolinks"],
        listBranches: ["GET /repos/{owner}/{repo}/branches"],
        listBranchesForHeadCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head",
        ],
        listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
        listCommentsForCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments",
        ],
        listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
        listCommitStatusesForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/statuses",
        ],
        listCommits: ["GET /repos/{owner}/{repo}/commits"],
        listContributors: ["GET /repos/{owner}/{repo}/contributors"],
        listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
        listDeploymentBranchPolicies: [
            "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies",
        ],
        listDeploymentStatuses: [
            "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
        ],
        listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
        listForAuthenticatedUser: ["GET /user/repos"],
        listForOrg: ["GET /orgs/{org}/repos"],
        listForUser: ["GET /users/{username}/repos"],
        listForks: ["GET /repos/{owner}/{repo}/forks"],
        listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
        listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
        listLanguages: ["GET /repos/{owner}/{repo}/languages"],
        listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
        listPublic: ["GET /repositories"],
        listPullRequestsAssociatedWithCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
        ],
        listReleaseAssets: [
            "GET /repos/{owner}/{repo}/releases/{release_id}/assets",
        ],
        listReleases: ["GET /repos/{owner}/{repo}/releases"],
        listTagProtection: ["GET /repos/{owner}/{repo}/tags/protection"],
        listTags: ["GET /repos/{owner}/{repo}/tags"],
        listTeams: ["GET /repos/{owner}/{repo}/teams"],
        listWebhookDeliveries: [
            "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries",
        ],
        listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
        merge: ["POST /repos/{owner}/{repo}/merges"],
        mergeUpstream: ["POST /repos/{owner}/{repo}/merge-upstream"],
        pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
        redeliverWebhookDelivery: [
            "POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts",
        ],
        removeAppAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps" },
        ],
        removeCollaborator: [
            "DELETE /repos/{owner}/{repo}/collaborators/{username}",
        ],
        removeStatusCheckContexts: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts" },
        ],
        removeStatusCheckProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        ],
        removeTeamAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams" },
        ],
        removeUserAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users" },
        ],
        renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
        replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics"],
        requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
        setAdminBranchProtection: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
        ],
        setAppAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps" },
        ],
        setStatusCheckContexts: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts" },
        ],
        setTeamAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams" },
        ],
        setUserAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users" },
        ],
        testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
        transfer: ["POST /repos/{owner}/{repo}/transfer"],
        update: ["PATCH /repos/{owner}/{repo}"],
        updateBranchProtection: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection",
        ],
        updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
        updateDeploymentBranchPolicy: [
            "PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}",
        ],
        updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
        updateInvitation: [
            "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}",
        ],
        updatePullRequestReviewProtection: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
        ],
        updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
        updateReleaseAsset: [
            "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}",
        ],
        updateStatusCheckPotection: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
            {},
            { renamed: ["repos", "updateStatusCheckProtection"] },
        ],
        updateStatusCheckProtection: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        ],
        updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
        updateWebhookConfigForRepo: [
            "PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config",
        ],
        uploadReleaseAsset: [
            "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
            { baseUrl: "https://uploads.github.com" },
        ],
    },
    search: {
        code: ["GET /search/code"],
        commits: ["GET /search/commits"],
        issuesAndPullRequests: ["GET /search/issues"],
        labels: ["GET /search/labels"],
        repos: ["GET /search/repositories"],
        topics: ["GET /search/topics"],
        users: ["GET /search/users"],
    },
    secretScanning: {
        getAlert: [
            "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}",
        ],
        listAlertsForEnterprise: [
            "GET /enterprises/{enterprise}/secret-scanning/alerts",
        ],
        listAlertsForOrg: ["GET /orgs/{org}/secret-scanning/alerts"],
        listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
        listLocationsForAlert: [
            "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations",
        ],
        updateAlert: [
            "PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}",
        ],
    },
    teams: {
        addOrUpdateMembershipForUserInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}",
        ],
        addOrUpdateProjectPermissionsInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}",
        ],
        addOrUpdateRepoPermissionsInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
        ],
        checkPermissionsForProjectInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/projects/{project_id}",
        ],
        checkPermissionsForRepoInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
        ],
        create: ["POST /orgs/{org}/teams"],
        createDiscussionCommentInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
        ],
        createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
        deleteDiscussionCommentInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}",
        ],
        deleteDiscussionInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}",
        ],
        deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
        getByName: ["GET /orgs/{org}/teams/{team_slug}"],
        getDiscussionCommentInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}",
        ],
        getDiscussionInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}",
        ],
        getMembershipForUserInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/memberships/{username}",
        ],
        list: ["GET /orgs/{org}/teams"],
        listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
        listDiscussionCommentsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
        ],
        listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
        listForAuthenticatedUser: ["GET /user/teams"],
        listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
        listPendingInvitationsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/invitations",
        ],
        listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects"],
        listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
        removeMembershipForUserInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}",
        ],
        removeProjectInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}",
        ],
        removeRepoInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
        ],
        updateDiscussionCommentInOrg: [
            "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}",
        ],
        updateDiscussionInOrg: [
            "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}",
        ],
        updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"],
    },
    users: {
        addEmailForAuthenticated: [
            "POST /user/emails",
            {},
            { renamed: ["users", "addEmailForAuthenticatedUser"] },
        ],
        addEmailForAuthenticatedUser: ["POST /user/emails"],
        block: ["PUT /user/blocks/{username}"],
        checkBlocked: ["GET /user/blocks/{username}"],
        checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
        checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
        createGpgKeyForAuthenticated: [
            "POST /user/gpg_keys",
            {},
            { renamed: ["users", "createGpgKeyForAuthenticatedUser"] },
        ],
        createGpgKeyForAuthenticatedUser: ["POST /user/gpg_keys"],
        createPublicSshKeyForAuthenticated: [
            "POST /user/keys",
            {},
            { renamed: ["users", "createPublicSshKeyForAuthenticatedUser"] },
        ],
        createPublicSshKeyForAuthenticatedUser: ["POST /user/keys"],
        createSshSigningKeyForAuthenticatedUser: ["POST /user/ssh_signing_keys"],
        deleteEmailForAuthenticated: [
            "DELETE /user/emails",
            {},
            { renamed: ["users", "deleteEmailForAuthenticatedUser"] },
        ],
        deleteEmailForAuthenticatedUser: ["DELETE /user/emails"],
        deleteGpgKeyForAuthenticated: [
            "DELETE /user/gpg_keys/{gpg_key_id}",
            {},
            { renamed: ["users", "deleteGpgKeyForAuthenticatedUser"] },
        ],
        deleteGpgKeyForAuthenticatedUser: ["DELETE /user/gpg_keys/{gpg_key_id}"],
        deletePublicSshKeyForAuthenticated: [
            "DELETE /user/keys/{key_id}",
            {},
            { renamed: ["users", "deletePublicSshKeyForAuthenticatedUser"] },
        ],
        deletePublicSshKeyForAuthenticatedUser: ["DELETE /user/keys/{key_id}"],
        deleteSshSigningKeyForAuthenticatedUser: [
            "DELETE /user/ssh_signing_keys/{ssh_signing_key_id}",
        ],
        follow: ["PUT /user/following/{username}"],
        getAuthenticated: ["GET /user"],
        getByUsername: ["GET /users/{username}"],
        getContextForUser: ["GET /users/{username}/hovercard"],
        getGpgKeyForAuthenticated: [
            "GET /user/gpg_keys/{gpg_key_id}",
            {},
            { renamed: ["users", "getGpgKeyForAuthenticatedUser"] },
        ],
        getGpgKeyForAuthenticatedUser: ["GET /user/gpg_keys/{gpg_key_id}"],
        getPublicSshKeyForAuthenticated: [
            "GET /user/keys/{key_id}",
            {},
            { renamed: ["users", "getPublicSshKeyForAuthenticatedUser"] },
        ],
        getPublicSshKeyForAuthenticatedUser: ["GET /user/keys/{key_id}"],
        getSshSigningKeyForAuthenticatedUser: [
            "GET /user/ssh_signing_keys/{ssh_signing_key_id}",
        ],
        list: ["GET /users"],
        listBlockedByAuthenticated: [
            "GET /user/blocks",
            {},
            { renamed: ["users", "listBlockedByAuthenticatedUser"] },
        ],
        listBlockedByAuthenticatedUser: ["GET /user/blocks"],
        listEmailsForAuthenticated: [
            "GET /user/emails",
            {},
            { renamed: ["users", "listEmailsForAuthenticatedUser"] },
        ],
        listEmailsForAuthenticatedUser: ["GET /user/emails"],
        listFollowedByAuthenticated: [
            "GET /user/following",
            {},
            { renamed: ["users", "listFollowedByAuthenticatedUser"] },
        ],
        listFollowedByAuthenticatedUser: ["GET /user/following"],
        listFollowersForAuthenticatedUser: ["GET /user/followers"],
        listFollowersForUser: ["GET /users/{username}/followers"],
        listFollowingForUser: ["GET /users/{username}/following"],
        listGpgKeysForAuthenticated: [
            "GET /user/gpg_keys",
            {},
            { renamed: ["users", "listGpgKeysForAuthenticatedUser"] },
        ],
        listGpgKeysForAuthenticatedUser: ["GET /user/gpg_keys"],
        listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
        listPublicEmailsForAuthenticated: [
            "GET /user/public_emails",
            {},
            { renamed: ["users", "listPublicEmailsForAuthenticatedUser"] },
        ],
        listPublicEmailsForAuthenticatedUser: ["GET /user/public_emails"],
        listPublicKeysForUser: ["GET /users/{username}/keys"],
        listPublicSshKeysForAuthenticated: [
            "GET /user/keys",
            {},
            { renamed: ["users", "listPublicSshKeysForAuthenticatedUser"] },
        ],
        listPublicSshKeysForAuthenticatedUser: ["GET /user/keys"],
        listSshSigningKeysForAuthenticatedUser: ["GET /user/ssh_signing_keys"],
        listSshSigningKeysForUser: ["GET /users/{username}/ssh_signing_keys"],
        setPrimaryEmailVisibilityForAuthenticated: [
            "PATCH /user/email/visibility",
            {},
            { renamed: ["users", "setPrimaryEmailVisibilityForAuthenticatedUser"] },
        ],
        setPrimaryEmailVisibilityForAuthenticatedUser: [
            "PATCH /user/email/visibility",
        ],
        unblock: ["DELETE /user/blocks/{username}"],
        unfollow: ["DELETE /user/following/{username}"],
        updateAuthenticated: ["PATCH /user"],
    },
};

const VERSION = "6.6.2";

function endpointsToMethods(octokit, endpointsMap) {
    const newMethods = {};
    for (const [scope, endpoints] of Object.entries(endpointsMap)) {
        for (const [methodName, endpoint] of Object.entries(endpoints)) {
            const [route, defaults, decorations] = endpoint;
            const [method, url] = route.split(/ /);
            const endpointDefaults = Object.assign({ method, url }, defaults);
            if (!newMethods[scope]) {
                newMethods[scope] = {};
            }
            const scopeMethods = newMethods[scope];
            if (decorations) {
                scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
                continue;
            }
            scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
        }
    }
    return newMethods;
}
function decorate(octokit, scope, methodName, defaults, decorations) {
    const requestWithDefaults = octokit.request.defaults(defaults);
    /* istanbul ignore next */
    function withDecorations(...args) {
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
        let options = requestWithDefaults.endpoint.merge(...args);
        // There are currently no other decorations than `.mapToData`
        if (decorations.mapToData) {
            options = Object.assign({}, options, {
                data: options[decorations.mapToData],
                [decorations.mapToData]: undefined,
            });
            return requestWithDefaults(options);
        }
        if (decorations.renamed) {
            const [newScope, newMethodName] = decorations.renamed;
            octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
        }
        if (decorations.deprecated) {
            octokit.log.warn(decorations.deprecated);
        }
        if (decorations.renamedParameters) {
            // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
            const options = requestWithDefaults.endpoint.merge(...args);
            for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
                if (name in options) {
                    octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);
                    if (!(alias in options)) {
                        options[alias] = options[name];
                    }
                    delete options[name];
                }
            }
            return requestWithDefaults(options);
        }
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
        return requestWithDefaults(...args);
    }
    return Object.assign(withDecorations, requestWithDefaults);
}

function restEndpointMethods(octokit) {
    const api = endpointsToMethods(octokit, Endpoints);
    return {
        rest: api,
    };
}
restEndpointMethods.VERSION = VERSION;
function legacyRestEndpointMethods(octokit) {
    const api = endpointsToMethods(octokit, Endpoints);
    return {
        ...api,
        rest: api,
    };
}
legacyRestEndpointMethods.VERSION = VERSION;


//# sourceMappingURL=index.js.map

// EXTERNAL MODULE: ./node_modules/@octokit/plugin-retry/dist-web/index.js
var plugin_retry_dist_web = __webpack_require__(6964);
// EXTERNAL MODULE: ./node_modules/bottleneck/light.js
var light = __webpack_require__(1209);
var light_default = /*#__PURE__*/__webpack_require__.n(light);
;// CONCATENATED MODULE: ./node_modules/@octokit/plugin-throttling/dist-web/index.js


const dist_web_VERSION = "4.3.0";

const noop = () => Promise.resolve();
// @ts-expect-error
function wrapRequest(state, request, options) {
    return state.retryLimiter.schedule(doRequest, state, request, options);
}
// @ts-expect-error
async function doRequest(state, request, options) {
    const isWrite = options.method !== "GET" && options.method !== "HEAD";
    const { pathname } = new URL(options.url, "http://github.test");
    const isSearch = options.method === "GET" && pathname.startsWith("/search/");
    const isGraphQL = pathname.startsWith("/graphql");
    const retryCount = ~~options.request.retryCount;
    const jobOptions = retryCount > 0 ? { priority: 0, weight: 0 } : {};
    if (state.clustering) {
        // Remove a job from Redis if it has not completed or failed within 60s
        // Examples: Node process terminated, client disconnected, etc.
        // @ts-expect-error
        jobOptions.expiration = 1000 * 60;
    }
    // Guarantee at least 1000ms between writes
    // GraphQL can also trigger writes
    if (isWrite || isGraphQL) {
        await state.write.key(state.id).schedule(jobOptions, noop);
    }
    // Guarantee at least 3000ms between requests that trigger notifications
    if (isWrite && state.triggersNotification(pathname)) {
        await state.notifications.key(state.id).schedule(jobOptions, noop);
    }
    // Guarantee at least 2000ms between search requests
    if (isSearch) {
        await state.search.key(state.id).schedule(jobOptions, noop);
    }
    const req = state.global.key(state.id).schedule(jobOptions, request, options);
    if (isGraphQL) {
        const res = await req;
        if (res.data.errors != null &&
            // @ts-expect-error
            res.data.errors.some((error) => error.type === "RATE_LIMITED")) {
            const error = Object.assign(new Error("GraphQL Rate Limit Exceeded"), {
                response: res,
                data: res.data,
            });
            throw error;
        }
    }
    return req;
}

var triggersNotificationPaths = [
    "/orgs/{org}/invitations",
    "/orgs/{org}/invitations/{invitation_id}",
    "/orgs/{org}/teams/{team_slug}/discussions",
    "/orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
    "/repos/{owner}/{repo}/collaborators/{username}",
    "/repos/{owner}/{repo}/commits/{commit_sha}/comments",
    "/repos/{owner}/{repo}/issues",
    "/repos/{owner}/{repo}/issues/{issue_number}/comments",
    "/repos/{owner}/{repo}/pulls",
    "/repos/{owner}/{repo}/pulls/{pull_number}/comments",
    "/repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
    "/repos/{owner}/{repo}/pulls/{pull_number}/merge",
    "/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
    "/repos/{owner}/{repo}/pulls/{pull_number}/reviews",
    "/repos/{owner}/{repo}/releases",
    "/teams/{team_id}/discussions",
    "/teams/{team_id}/discussions/{discussion_number}/comments",
];

function routeMatcher(paths) {
    // EXAMPLE. For the following paths:
    /* [
        "/orgs/{org}/invitations",
        "/repos/{owner}/{repo}/collaborators/{username}"
    ] */
    const regexes = paths.map((path) => path
        .split("/")
        .map((c) => (c.startsWith("{") ? "(?:.+?)" : c))
        .join("/"));
    // 'regexes' would contain:
    /* [
        '/orgs/(?:.+?)/invitations',
        '/repos/(?:.+?)/(?:.+?)/collaborators/(?:.+?)'
    ] */
    const regex = `^(?:${regexes.map((r) => `(?:${r})`).join("|")})[^/]*$`;
    // 'regex' would contain:
    /*
      ^(?:(?:\/orgs\/(?:.+?)\/invitations)|(?:\/repos\/(?:.+?)\/(?:.+?)\/collaborators\/(?:.+?)))[^\/]*$
  
      It may look scary, but paste it into https://www.debuggex.com/
      and it will make a lot more sense!
    */
    return new RegExp(regex, "i");
}

// @ts-expect-error
// Workaround to allow tests to directly access the triggersNotification function.
const regex = routeMatcher(triggersNotificationPaths);
const triggersNotification = regex.test.bind(regex);
const groups = {};
// @ts-expect-error
const createGroups = function (Bottleneck, common) {
    groups.global = new Bottleneck.Group({
        id: "octokit-global",
        maxConcurrent: 10,
        ...common,
    });
    groups.search = new Bottleneck.Group({
        id: "octokit-search",
        maxConcurrent: 1,
        minTime: 2000,
        ...common,
    });
    groups.write = new Bottleneck.Group({
        id: "octokit-write",
        maxConcurrent: 1,
        minTime: 1000,
        ...common,
    });
    groups.notifications = new Bottleneck.Group({
        id: "octokit-notifications",
        maxConcurrent: 1,
        minTime: 3000,
        ...common,
    });
};
function throttling(octokit, octokitOptions) {
    const { enabled = true, Bottleneck = (light_default()), id = "no-id", timeout = 1000 * 60 * 2, // Redis TTL: 2 minutes
    connection, } = octokitOptions.throttle || {};
    if (!enabled) {
        return {};
    }
    const common = { connection, timeout };
    if (groups.global == null) {
        createGroups(Bottleneck, common);
    }
    const state = Object.assign({
        clustering: connection != null,
        triggersNotification,
        minimumSecondaryRateRetryAfter: 5,
        retryAfterBaseValue: 1000,
        retryLimiter: new Bottleneck(),
        id,
        ...groups,
    }, octokitOptions.throttle);
    const isUsingDeprecatedOnAbuseLimitHandler = typeof state.onAbuseLimit === "function" && state.onAbuseLimit;
    if (typeof (isUsingDeprecatedOnAbuseLimitHandler
        ? state.onAbuseLimit
        : state.onSecondaryRateLimit) !== "function" ||
        typeof state.onRateLimit !== "function") {
        throw new Error(`octokit/plugin-throttling error:
        You must pass the onSecondaryRateLimit and onRateLimit error handlers.
        See https://github.com/octokit/rest.js#throttling

        const octokit = new Octokit({
          throttle: {
            onSecondaryRateLimit: (retryAfter, options) => {/* ... */},
            onRateLimit: (retryAfter, options) => {/* ... */}
          }
        })
    `);
    }
    const events = {};
    const emitter = new Bottleneck.Events(events);
    // @ts-expect-error
    events.on("secondary-limit", isUsingDeprecatedOnAbuseLimitHandler
        ? function (...args) {
            octokit.log.warn("[@octokit/plugin-throttling] `onAbuseLimit()` is deprecated and will be removed in a future release of `@octokit/plugin-throttling`, please use the `onSecondaryRateLimit` handler instead");
            return state.onAbuseLimit(...args);
        }
        : state.onSecondaryRateLimit);
    // @ts-expect-error
    events.on("rate-limit", state.onRateLimit);
    // @ts-expect-error
    events.on("error", (e) => octokit.log.warn("Error in throttling-plugin limit handler", e));
    // @ts-expect-error
    state.retryLimiter.on("failed", async function (error, info) {
        const options = info.args[info.args.length - 1];
        const { pathname } = new URL(options.url, "http://github.test");
        const shouldRetryGraphQL = pathname.startsWith("/graphql") && error.status !== 401;
        if (!(shouldRetryGraphQL || error.status === 403)) {
            return;
        }
        const retryCount = ~~options.request.retryCount;
        options.request.retryCount = retryCount;
        const { wantRetry, retryAfter = 0 } = await (async function () {
            if (/\bsecondary rate\b/i.test(error.message)) {
                // The user has hit the secondary rate limit. (REST and GraphQL)
                // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#secondary-rate-limits
                // The Retry-After header can sometimes be blank when hitting a secondary rate limit,
                // but is always present after 2-3s, so make sure to set `retryAfter` to at least 5s by default.
                const retryAfter = Math.max(~~error.response.headers["retry-after"], state.minimumSecondaryRateRetryAfter);
                const wantRetry = await emitter.trigger("secondary-limit", retryAfter, options, octokit);
                return { wantRetry, retryAfter };
            }
            if (error.response.headers != null &&
                error.response.headers["x-ratelimit-remaining"] === "0") {
                // The user has used all their allowed calls for the current time period (REST and GraphQL)
                // https://docs.github.com/en/rest/reference/rate-limit (REST)
                // https://docs.github.com/en/graphql/overview/resource-limitations#rate-limit (GraphQL)
                const rateLimitReset = new Date(~~error.response.headers["x-ratelimit-reset"] * 1000).getTime();
                const retryAfter = Math.max(Math.ceil((rateLimitReset - Date.now()) / 1000), 0);
                const wantRetry = await emitter.trigger("rate-limit", retryAfter, options, octokit);
                return { wantRetry, retryAfter };
            }
            return {};
        })();
        if (wantRetry) {
            options.request.retryCount++;
            return retryAfter * state.retryAfterBaseValue;
        }
    });
    octokit.hook.wrap("request", wrapRequest.bind(null, state));
    return {};
}
throttling.VERSION = dist_web_VERSION;
throttling.triggersNotification = triggersNotification;


//# sourceMappingURL=index.js.map

// EXTERNAL MODULE: ./node_modules/@octokit/app/dist-node/index.js
var dist_node = __webpack_require__(1334);
// EXTERNAL MODULE: ./node_modules/@octokit/oauth-app/dist-node/index.js
var oauth_app_dist_node = __webpack_require__(7785);
;// CONCATENATED MODULE: ./node_modules/octokit/dist-web/index.js









const octokit_dist_web_VERSION = "2.0.7";

const Octokit = dist_web.Octokit.plugin(restEndpointMethods, plugin_paginate_rest_dist_web.paginateRest, plugin_retry_dist_web/* retry */.X, throttling).defaults({
    userAgent: `octokit.js/${octokit_dist_web_VERSION}`,
    throttle: {
        onRateLimit,
        onSecondaryRateLimit,
    },
});
// istanbul ignore next no need to test internals of the throttle plugin
function onRateLimit(retryAfter, options, octokit) {
    octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);
    if (options.request.retryCount === 0) {
        // only retries once
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
    }
}
// istanbul ignore next no need to test internals of the throttle plugin
function onSecondaryRateLimit(retryAfter, options, octokit) {
    octokit.log.warn(`SecondaryRateLimit detected for request ${options.method} ${options.url}`);
    if (options.request.retryCount === 0) {
        // only retries once
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
    }
}

const App = dist_node/* App.defaults */.gV.defaults({ Octokit });
const OAuthApp = oauth_app_dist_node.OAuthApp.defaults({ Octokit });


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 778:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wrappy = __webpack_require__(2479)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 350:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getUserAgent": function() { return /* binding */ getUserAgent; }
/* harmony export */ });
/* provided dependency */ var process = __webpack_require__(3454);
function getUserAgent() {
    if (typeof navigator === "object" && "userAgent" in navigator) {
        return navigator.userAgent;
    }
    if (typeof process === "object" && "version" in process) {
        return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
    }
    return "<environment undetectable>";
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 2479:
/***/ (function(module) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 9602:
/***/ (function(module) {

"use strict";

module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}


/***/ }),

/***/ 4411:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  __webpack_require__(9602)(Yallist)
} catch (er) {}


/***/ }),

/***/ 7568:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _asyncToGenerator; }
/* harmony export */ });
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
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
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


/***/ })

}]);