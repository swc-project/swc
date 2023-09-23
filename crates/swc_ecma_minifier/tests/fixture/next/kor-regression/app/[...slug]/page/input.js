(() => {
var exports = {};
exports.id = 877;
exports.ids = [877];
exports.modules = {

/***/ 2934:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ 5403:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/client/components/request-async-storage.external");

/***/ }),

/***/ 4580:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ 4749:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/client/components/static-generation-async-storage.external");

/***/ }),

/***/ 5869:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ 399:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.prod.js");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 7310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 1230:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GlobalError: () => (/* reexport default from dynamic */ next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2___default.a),
/* harmony export */   __next_app__: () => (/* binding */ __next_app__),
/* harmony export */   originalPathname: () => (/* binding */ originalPathname),
/* harmony export */   pages: () => (/* binding */ pages),
/* harmony export */   routeModule: () => (/* binding */ routeModule),
/* harmony export */   tree: () => (/* binding */ tree)
/* harmony export */ });
/* harmony import */ var next_dist_server_future_route_modules_app_page_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3137);
/* harmony import */ var next_dist_server_future_route_modules_app_page_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_page_module_compiled__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4647);
/* harmony import */ var next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4183);
/* harmony import */ var next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_client_components_error_boundary__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1775);
/* harmony import */ var next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__) if(["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => next_dist_server_app_render_entry_base__WEBPACK_IMPORTED_MODULE_3__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
// @ts-ignore this need to be imported from next/dist to be external


const AppPageRouteModule = next_dist_server_future_route_modules_app_page_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppPageRouteModule;
// We inject the tree and pages here so that we can use them in the route
// module.
const tree = {
        children: [
        '',
        {
        children: [
        '[...slug]',
        {
        children: ['__PAGE__', {}, {
          page: [() => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 6560)), "/Users/kdy1/projects/repros/shaneafsar/test-mdx-korean/app/[...slug]/page.tsx"],
          
        }]
      },
        {
        
        metadata: {
    icon: [(async (props) => (await Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 7481))).default(props))],
    apple: [],
    openGraph: [],
    twitter: [],
    manifest: undefined
  }
      }
      ]
      },
        {
        'layout': [() => Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 9958)), "/Users/kdy1/projects/repros/shaneafsar/test-mdx-korean/app/layout.tsx"],
'not-found': [() => Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 1918, 23)), "next/dist/client/components/not-found-error"],
        metadata: {
    icon: [(async (props) => (await Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 7481))).default(props))],
    apple: [],
    openGraph: [],
    twitter: [],
    manifest: undefined
  }
      }
      ]
      }.children;
const pages = ["/Users/kdy1/projects/repros/shaneafsar/test-mdx-korean/app/[...slug]/page.tsx"];

// @ts-expect-error - replaced by webpack/turbopack loader

const __next_app_require__ = __webpack_require__
const __next_app_load_chunk__ = () => Promise.resolve()
const originalPathname = "/[...slug]/page";
const __next_app__ = {
    require: __next_app_require__,
    loadChunk: __next_app_load_chunk__
};

// Create and export the route module that will be consumed.
const routeModule = new AppPageRouteModule({
    definition: {
        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__/* .RouteKind */ .x.APP_PAGE,
        page: "/[...slug]/page",
        pathname: "/[...slug]",
        // The following aren't used in production.
        bundlePath: "",
        filename: "",
        appPaths: []
    },
    userland: {
        loaderTree: tree
    }
});

//# sourceMappingURL=app-page.js.map

/***/ }),

/***/ 714:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 2721, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 2796, 23))

/***/ }),

/***/ 6560:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ DocPage),
  dynamic: () => (/* binding */ dynamic),
  generateMetadata: () => (/* binding */ generateMetadata),
  generateStaticParams: () => (/* binding */ generateStaticParams)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-page/vendored/shared/react-jsx-runtime.js
var react_jsx_runtime = __webpack_require__(8144);
// EXTERNAL MODULE: ./node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(1872);
// EXTERNAL MODULE: ./node_modules/next-contentlayer/dist/hooks/useMDXComponent.js
var useMDXComponent = __webpack_require__(6050);
;// CONCATENATED MODULE: ./components/MDXComponents.tsx



function Mdx({ code, className }) {
    const Component = (0,useMDXComponent/* useMDXComponent */.z)(code);
    return /*#__PURE__*/ react_jsx_runtime.jsx(Component, {
        className: (0,clsx/* default */.Z)(className)
    });
}

// EXTERNAL MODULE: ./node_modules/contentlayer/dist/client/index.js + 2 modules
var client = __webpack_require__(1451);
;// CONCATENATED MODULE: ./.contentlayer/generated/Doc/_index.json
const _index_namespaceObject = JSON.parse('[{"title":"Localization","slug":"integration/zendesk/localization","description":"The Algolia integration for Zendesk supports help centers in many languages.","navigation":"zendesk","unpublished":false,"no_index":false,"body":{"raw":"\\n\\nThe Algolia integration for Zendesk supports help centers with multiple languages.\\nUsers see the results in the language they select.\\n\\n## Supported languages\\n\\nThe Algolia integration supports these languages _(locales)_:\\n\\n\\n\\n- **ar**: العربية / Arabic\\n- **ar-eg**: العربية (مصر) / Arabic (Egypt)\\n- **bg**: Български / Bulgarian\\n- **cs**: Čeština / Czech\\n- **da**: Dansk / Danish\\n- **de**: Deutsch / German\\n- **de-at**: Deutsch (Österreich) / German (Austria)\\n- **de-ch**: Deutsch (Schweiz) / German (Switzerland)\\n- **el**: Ελληνικά / Greek\\n- **en-au**: English (Australia)\\n- **en-ca**: English (Canada)\\n- **en-gb**: English (Great Britain)\\n- **en-ie**: English (Ireland)\\n- **en-us**: English (United States)\\n- **en-150**: English (Europe)\\n- **es**: Español / Spanish\\n- **es-es**: Español (España) / Spanish (Spain)\\n- **es-mx**: Español (Mexico) / Spanish (Mexico)\\n- **es-419**: Español (Latinoamérica) / Spanish (Latin America)\\n- **fi**: Suomi / Finnish\\n- **fr**: Français / French\\n- **fr-be**: Français (Belgique) / French (Belgium)\\n- **fr-ca**: Français (Canada) / French (Canada)\\n- **fr-ch**: Français (Suisse) / French (Switzerland)\\n- **fr-fr**: Français (France) / French (France)\\n- **hu**: Magyar / Hungarian\\n- **id**: Bahasa Indonesia / Indonesian\\n- **it**: Italiano / Italian\\n- **ja**: 日本語 / Japanese\\n- **ko**: 한국어 / Korean\\n- **nl**: Nederlands / Dutch\\n- **nl-be**: Nederlands (België) / Dutch (Belgium)\\n- **no**: Norsk / Norwegian\\n- **pl**: Polski / Polish\\n- **pt**: Português / Portuguese\\n- **pt-br**: Português do Brasil / Brazilian Portuguese\\n- **ro**: Română / Romanian\\n- **ru**: Русский / Russian\\n- **sk**: Slovenčina / Slovak\\n- **sv**: Svenska / Swedish\\n- **th**: ไทย / Thai\\n- **tr**: Türkçe / Turkish\\n- **uk**: Українська / Ukrainian\\n- **vi**: Tiếng Việt / Vietnamese\\n- **zh-cn**: 简体中文 / Simplified Chinese\\n- **zh-tw**: 繁體中文 / Traditional Chinese\\n\\n\\n\\n## Update translated strings\\n\\nIf you want to update some translations,\\nedit the `translation` object in the [`algoliasearchZendeskHC`](/integration/zendesk/theming/) function.\\n\\nFor example:\\n\\n```javascript\\ntranslations: {\\n  placeholder: {\\n    de: \'In unserem Help Center suchen\',\\n    \'en-us\': \'Search in our Help Center\',\\n    fr: \'Recherchez dans notre Help Center\'\\n  }\\n}\\n```\\n\\n## Reference of translatable strings\\n\\nThe following code lists all available translatable strings with the default values for the `en-US` locale:\\n\\n```javascript\\ntranslations: {\\n  categories: {\\n    \'en-us\': \'Categories\'\\n  },\\n  change_query: {\\n    \'en-us\': \'Change your query\'\\n  },\\n  clear_filters: {\\n    \'en-us\': \'clear your filters\'\\n  },\\n  format_number: {\\n    \'en-us\': function (n) { return n.toString().replace(/\\\\B(?=(\\\\d{3})+(?!\\\\d))/g, \',\'); }\\n  },\\n  filter: {\\n    \'en-us\': \'Filter results\'\\n  },\\n  nb_results: {\\n    \'en-us\': function (nb) {\\n      return this.format_number(nb) + \' result\' + (nb > 1 ? \'s\' : \'\');\\n    }\\n  },\\n  no_result_for: {\\n    \'en-us\': function (query) {\\n      return \'No result found for \' + this.quoted(query);\\n    }\\n  },\\n  no_result_actions: {\\n    \'en-us\': function () {\\n      return this.change_query + \' or \' + this.clear_filters;\\n    }\\n  },\\n  placeholder: {\\n    \'en-us\': \'Search in our articles\'\\n  },\\n  quoted: {\\n    \'en-us\': function (text) { return \'\\"\' + escapeHTML(text) + \'\\"\'; }\\n  },\\n  stats: {\\n    \'en-us\': function (nbHits, processing) {\\n      return this.nb_results(nbHits) + \' found in \' + processing + \' ms\';\\n    }\\n  },\\n  search_by_algolia: {\\n    \'en-us\': function (algolia) { return \'Search by \' + algolia; }\\n  },\\n  tags: {\\n    \'en-us\': \'Tags\'\\n  }\\n}\\n```\\n\\n## Localized tags\\n\\nYou can prefix your tags with a locale, separated by a colon.\\nFor example, if the tags of an article are:\\n\\n```javascript\\n[ \'Wow\', \'en:Awesome\', \'en-gb:Good\', \'fr:Incroyable\' ]\\n```\\n\\nThe indices for each locale will contain only the tags matching their locale:\\n\\n| Locales           | Tags                                |\\n| ----------------- | ----------------------------------- |\\n| All `fr` locales  | `{ \\"label_names\\": [\\"Incroyable\\"] }` |\\n| `en-gb`           | `{ label_names: [\\"Good\\"] }`         |\\n| Other `en` locales, for example, `en-us` | `{ \\"label_names\\": [\\"Awesome\\"] }` |\\n| All other locales | `{ label_names: [\\"Wow\\"] }`          |\\n","code":"var Component=(()=>{var d=Object.create;var s=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var p=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var m=(r,n)=>()=>(n||r((n={exports:{}}).exports,n),n.exports),b=(r,n)=>{for(var i in n)s(r,i,{get:n[i],enumerable:!0})},t=(r,n,i,a)=>{if(n&&typeof n==\\"object\\"||typeof n==\\"function\\")for(let l of u(n))!f.call(r,l)&&l!==i&&s(r,l,{get:()=>n[l],enumerable:!(a=g(n,l))||a.enumerable});return r};var _=(r,n,i)=>(i=r!=null?d(p(r)):{},t(n||!r||!r.__esModule?s(i,\\"default\\",{value:r,enumerable:!0}):i,r)),S=r=>t(s({},\\"__esModule\\",{value:!0}),r);var o=m((z,c)=>{c.exports=_jsx_runtime});var F={};b(F,{default:()=>x,frontmatter:()=>y});var e=_(o()),y={navigation:\\"zendesk\\",title:\\"Localization\\",description:\\"The Algolia integration for Zendesk supports help centers in many languages.\\",slug:\\"integration/zendesk/localization\\"};function h(r){let n=Object.assign({p:\\"p\\",h2:\\"h2\\",em:\\"em\\",ul:\\"ul\\",li:\\"li\\",strong:\\"strong\\",code:\\"code\\",a:\\"a\\",pre:\\"pre\\"},r.components);return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(n.p,{children:`The Algolia integration for Zendesk supports help centers with multiple languages.\\nUsers see the results in the language they select.`}),`\\n`,(0,e.jsx)(n.h2,{id:\\"supported-languages\\",children:\\"Supported languages\\"}),`\\n`,(0,e.jsxs)(n.p,{children:[\\"The Algolia integration supports these languages \\",(0,e.jsx)(n.em,{children:\\"(locales)\\"}),\\":\\"]}),`\\n`,(0,e.jsxs)(n.ul,{children:[`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"ar\\"}),\\": \\\\u0627\\\\u0644\\\\u0639\\\\u0631\\\\u0628\\\\u064A\\\\u0629 / Arabic\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"ar-eg\\"}),\\": \\\\u0627\\\\u0644\\\\u0639\\\\u0631\\\\u0628\\\\u064A\\\\u0629 (\\\\u0645\\\\u0635\\\\u0631) / Arabic (Egypt)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"bg\\"}),\\": \\\\u0411\\\\u044A\\\\u043B\\\\u0433\\\\u0430\\\\u0440\\\\u0441\\\\u043A\\\\u0438 / Bulgarian\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"cs\\"}),\\": \\\\u010Ce\\\\u0161tina / Czech\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"da\\"}),\\": Dansk / Danish\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"de\\"}),\\": Deutsch / German\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"de-at\\"}),\\": Deutsch (\\\\xD6sterreich) / German (Austria)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"de-ch\\"}),\\": Deutsch (Schweiz) / German (Switzerland)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"el\\"}),\\": \\\\u0395\\\\u03BB\\\\u03BB\\\\u03B7\\\\u03BD\\\\u03B9\\\\u03BA\\\\u03AC / Greek\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"en-au\\"}),\\": English (Australia)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"en-ca\\"}),\\": English (Canada)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"en-gb\\"}),\\": English (Great Britain)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"en-ie\\"}),\\": English (Ireland)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"en-us\\"}),\\": English (United States)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"en-150\\"}),\\": English (Europe)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"es\\"}),\\": Espa\\\\xF1ol / Spanish\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"es-es\\"}),\\": Espa\\\\xF1ol (Espa\\\\xF1a) / Spanish (Spain)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"es-mx\\"}),\\": Espa\\\\xF1ol (Mexico) / Spanish (Mexico)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"es-419\\"}),\\": Espa\\\\xF1ol (Latinoam\\\\xE9rica) / Spanish (Latin America)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"fi\\"}),\\": Suomi / Finnish\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"fr\\"}),\\": Fran\\\\xE7ais / French\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"fr-be\\"}),\\": Fran\\\\xE7ais (Belgique) / French (Belgium)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"fr-ca\\"}),\\": Fran\\\\xE7ais (Canada) / French (Canada)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"fr-ch\\"}),\\": Fran\\\\xE7ais (Suisse) / French (Switzerland)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"fr-fr\\"}),\\": Fran\\\\xE7ais (France) / French (France)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"hu\\"}),\\": Magyar / Hungarian\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"id\\"}),\\": Bahasa Indonesia / Indonesian\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"it\\"}),\\": Italiano / Italian\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"ja\\"}),\\": \\\\u65E5\\\\u672C\\\\u8A9E / Japanese\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"ko\\"}),\\": \\\\uD55C\\\\uAD6D\\\\uC5B4 / Korean\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"nl\\"}),\\": Nederlands / Dutch\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"nl-be\\"}),\\": Nederlands (Belgi\\\\xEB) / Dutch (Belgium)\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"no\\"}),\\": Norsk / Norwegian\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"pl\\"}),\\": Polski / Polish\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"pt\\"}),\\": Portugu\\\\xEAs / Portuguese\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"pt-br\\"}),\\": Portugu\\\\xEAs do Brasil / Brazilian Portuguese\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"ro\\"}),\\": Rom\\\\xE2n\\\\u0103 / Romanian\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"ru\\"}),\\": \\\\u0420\\\\u0443\\\\u0441\\\\u0441\\\\u043A\\\\u0438\\\\u0439 / Russian\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"sk\\"}),\\": Sloven\\\\u010Dina / Slovak\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"sv\\"}),\\": Svenska / Swedish\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"th\\"}),\\": \\\\u0E44\\\\u0E17\\\\u0E22 / Thai\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"tr\\"}),\\": T\\\\xFCrk\\\\xE7e / Turkish\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"uk\\"}),\\": \\\\u0423\\\\u043A\\\\u0440\\\\u0430\\\\u0457\\\\u043D\\\\u0441\\\\u044C\\\\u043A\\\\u0430 / Ukrainian\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"vi\\"}),\\": Ti\\\\u1EBFng Vi\\\\u1EC7t / Vietnamese\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"zh-cn\\"}),\\": \\\\u7B80\\\\u4F53\\\\u4E2D\\\\u6587 / Simplified Chinese\\"]}),`\\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\\"zh-tw\\"}),\\": \\\\u7E41\\\\u9AD4\\\\u4E2D\\\\u6587 / Traditional Chinese\\"]}),`\\n`]}),`\\n`,(0,e.jsx)(n.h2,{id:\\"update-translated-strings\\",children:\\"Update translated strings\\"}),`\\n`,(0,e.jsxs)(n.p,{children:[`If you want to update some translations,\\nedit the `,(0,e.jsx)(n.code,{children:\\"translation\\"}),\\" object in the \\",(0,e.jsx)(n.a,{href:\\"/integration/zendesk/theming/\\",children:(0,e.jsx)(n.code,{children:\\"algoliasearchZendeskHC\\"})}),\\" function.\\"]}),`\\n`,(0,e.jsx)(n.p,{children:\\"For example:\\"}),`\\n`,(0,e.jsx)(n.pre,{children:(0,e.jsx)(n.code,{className:\\"language-javascript\\",children:`translations: {\\n  placeholder: {\\n    de: \'In unserem Help Center suchen\',\\n    \'en-us\': \'Search in our Help Center\',\\n    fr: \'Recherchez dans notre Help Center\'\\n  }\\n}\\n`})}),`\\n`,(0,e.jsx)(n.h2,{id:\\"reference-of-translatable-strings\\",children:\\"Reference of translatable strings\\"}),`\\n`,(0,e.jsxs)(n.p,{children:[\\"The following code lists all available translatable strings with the default values for the \\",(0,e.jsx)(n.code,{children:\\"en-US\\"}),\\" locale:\\"]}),`\\n`,(0,e.jsx)(n.pre,{children:(0,e.jsx)(n.code,{className:\\"language-javascript\\",children:`translations: {\\n  categories: {\\n    \'en-us\': \'Categories\'\\n  },\\n  change_query: {\\n    \'en-us\': \'Change your query\'\\n  },\\n  clear_filters: {\\n    \'en-us\': \'clear your filters\'\\n  },\\n  format_number: {\\n    \'en-us\': function (n) { return n.toString().replace(/\\\\\\\\B(?=(\\\\\\\\d{3})+(?!\\\\\\\\d))/g, \',\'); }\\n  },\\n  filter: {\\n    \'en-us\': \'Filter results\'\\n  },\\n  nb_results: {\\n    \'en-us\': function (nb) {\\n      return this.format_number(nb) + \' result\' + (nb > 1 ? \'s\' : \'\');\\n    }\\n  },\\n  no_result_for: {\\n    \'en-us\': function (query) {\\n      return \'No result found for \' + this.quoted(query);\\n    }\\n  },\\n  no_result_actions: {\\n    \'en-us\': function () {\\n      return this.change_query + \' or \' + this.clear_filters;\\n    }\\n  },\\n  placeholder: {\\n    \'en-us\': \'Search in our articles\'\\n  },\\n  quoted: {\\n    \'en-us\': function (text) { return \'\\"\' + escapeHTML(text) + \'\\"\'; }\\n  },\\n  stats: {\\n    \'en-us\': function (nbHits, processing) {\\n      return this.nb_results(nbHits) + \' found in \' + processing + \' ms\';\\n    }\\n  },\\n  search_by_algolia: {\\n    \'en-us\': function (algolia) { return \'Search by \' + algolia; }\\n  },\\n  tags: {\\n    \'en-us\': \'Tags\'\\n  }\\n}\\n`})}),`\\n`,(0,e.jsx)(n.h2,{id:\\"localized-tags\\",children:\\"Localized tags\\"}),`\\n`,(0,e.jsx)(n.p,{children:`You can prefix your tags with a locale, separated by a colon.\\nFor example, if the tags of an article are:`}),`\\n`,(0,e.jsx)(n.pre,{children:(0,e.jsx)(n.code,{className:\\"language-javascript\\",children:`[ \'Wow\', \'en:Awesome\', \'en-gb:Good\', \'fr:Incroyable\' ]\\n`})}),`\\n`,(0,e.jsx)(n.p,{children:\\"The indices for each locale will contain only the tags matching their locale:\\"}),`\\n`,(0,e.jsxs)(n.p,{children:[`| Locales           | Tags                                |\\n| ----------------- | ----------------------------------- |\\n| All `,(0,e.jsx)(n.code,{children:\\"fr\\"}),\\" locales  | \\",(0,e.jsx)(n.code,{children:\'{ \\"label_names\\": [\\"Incroyable\\"] }\'}),` |\\n| `,(0,e.jsx)(n.code,{children:\\"en-gb\\"}),\\"           | \\",(0,e.jsx)(n.code,{children:\'{ label_names: [\\"Good\\"] }\'}),`         |\\n| Other `,(0,e.jsx)(n.code,{children:\\"en\\"}),\\" locales, for example, \\",(0,e.jsx)(n.code,{children:\\"en-us\\"}),\\" | \\",(0,e.jsx)(n.code,{children:\'{ \\"label_names\\": [\\"Awesome\\"] }\'}),` |\\n| All other locales | `,(0,e.jsx)(n.code,{children:\'{ label_names: [\\"Wow\\"] }\'}),\\"          |\\"]})]})}function k(r={}){let{wrapper:n}=r.components||{};return n?(0,e.jsx)(n,Object.assign({},r,{children:(0,e.jsx)(h,r)})):h(r)}var x=k;return S(F);})();\\n;return Component;"},"_id":"pages/integration/zendesk/localization.mdx","_raw":{"sourceFilePath":"pages/integration/zendesk/localization.mdx","sourceFileName":"localization.mdx","sourceFileDir":"pages/integration/zendesk","contentType":"mdx","flattenedPath":"pages/integration/zendesk/localization"},"type":"Doc"}]');
;// CONCATENATED MODULE: ./.contentlayer/generated/index.mjs
// NOTE This file is auto-generated by Contentlayer

// NOTE During development Contentlayer imports from `.mjs` files to improve HMR speeds.
// During (production) builds Contentlayer it imports from `.json` files to improve build performance.


const allDocuments = [
    ..._index_namespaceObject
];

// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(6465);
// EXTERNAL MODULE: ./node_modules/param-case/dist/index.js
var dist = __webpack_require__(9042);
;// CONCATENATED MODULE: ./app/[...slug]/page.tsx





// for info visit: https://nextjs.org/docs/messages/app-static-to-dynamic-error
const dynamic = "force-dynamic";
const publishedDocs = _index_namespaceObject.filter((doc)=>!doc.unpublished);
async function generateStaticParams() {
    const docsSlugs = publishedDocs.map((doc)=>({
            slug: [
                doc._raw.flattenedPath
            ]
        }));
    return docsSlugs;
}
function getDocFromParams(params) {
    const slug = params.slug?.join("/") || "";
    return publishedDocs.find((doc)=>doc.slug === slug);
}
async function generateMetadata({ params }) {
    const doc = getDocFromParams(params);
    if (!doc) {
        return {};
    }
    return {
        title: doc.title,
        description: doc.description,
        twitter: {
            title: doc.title,
            description: doc.description
        },
        openGraph: {
            title: doc.title,
            description: doc.description
        },
        robots: {
            index: doc.no_index ? false : true
        }
    };
}
async function DocPage({ params }) {
    // Display homepage is no slug is provided
    if (!params.slug) {
        return (0,navigation.notFound)();
    }
    const doc = getDocFromParams(params);
    if (!doc) {
        return (0,navigation.notFound)();
    }
    return /*#__PURE__*/ react_jsx_runtime.jsx(react_jsx_runtime.Fragment, {
        children: /*#__PURE__*/ react_jsx_runtime.jsx("div", {
            className: "page lg:gap-10",
            children: /*#__PURE__*/ (0,react_jsx_runtime.jsxs)("article", {
                className: "prose col-span-9 scroll-mt-4 dark:prose-invert",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime.jsxs)("div", {
                        className: "mb-6 max-w-none",
                        children: [
                            doc.slug && /*#__PURE__*/ react_jsx_runtime.jsx("h1", {
                                className: "mb-1 max-w-none text-5xl font-bold tracking-tight",
                                id: (0,dist/* paramCase */.o)(doc.title),
                                children: doc.title
                            }),
                            /*#__PURE__*/ react_jsx_runtime.jsx("p", {
                                className: "mt-4 text-xl leading-relaxed",
                                children: doc.description
                            })
                        ]
                    }),
                    /*#__PURE__*/ react_jsx_runtime.jsx(Mdx, {
                        code: doc.body.code
                    })
                ]
            })
        })
    });
}


/***/ }),

/***/ 7481:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6885);
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__);
  

  /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((props) => {
    const imageData = {"type":"image/x-icon","sizes":"16x16"}
    const imageUrl = (0,next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__.fillMetadataSegment)(".", props.params, "favicon.ico")

    return [{
      ...imageData,
      url: imageUrl + "",
    }]
  });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [255,309,743], () => (__webpack_exec__(1230)));
module.exports = __webpack_exports__;

})();