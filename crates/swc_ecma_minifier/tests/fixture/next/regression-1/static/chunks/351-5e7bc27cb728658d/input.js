"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[351],{

/***/ 5351:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PB": function() { return /* binding */ NextSeo; }
/* harmony export */ });
/* unused harmony exports ArticleJsonLd, BrandJsonLd, BreadcrumbJsonLd, CarouselJsonLd, CollectionPageJsonLd, CorporateContactJsonLd, CourseJsonLd, DatasetJsonLd, DefaultSeo, EventJsonLd, FAQPageJsonLd, JobPostingJsonLd, LocalBusinessJsonLd, LogoJsonLd, NewsArticleJsonLd, OrganizationJsonLd, ProductJsonLd, ProfilePageJsonLd, QAPageJsonLd, RecipeJsonLd, SiteLinksSearchBoxJsonLd, SocialProfileJsonLd, SoftwareAppJsonLd, VideoGameJsonLd, VideoJsonLd, WebPageJsonLd */
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7729);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2784);



function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var defaults = {
  templateTitle: '',
  noindex: false,
  nofollow: false,
  defaultOpenGraphImageWidth: 0,
  defaultOpenGraphImageHeight: 0,
  defaultOpenGraphVideoWidth: 0,
  defaultOpenGraphVideoHeight: 0
};

var buildOpenGraphMediaTags = function buildOpenGraphMediaTags(mediaType, media, _temp) {
  if (media === void 0) {
    media = [];
  }

  var _ref = _temp === void 0 ? {} : _temp,
      defaultWidth = _ref.defaultWidth,
      defaultHeight = _ref.defaultHeight;

  return media.reduce(function (tags, medium, index) {
    tags.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
      key: "og:" + mediaType + ":0" + index,
      property: "og:" + mediaType,
      content: medium.url
    }));

    if (medium.alt) {
      tags.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "og:" + mediaType + ":alt0" + index,
        property: "og:" + mediaType + ":alt",
        content: medium.alt
      }));
    }

    if (medium.secureUrl) {
      tags.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "og:" + mediaType + ":secure_url0" + index,
        property: "og:" + mediaType + ":secure_url",
        content: medium.secureUrl.toString()
      }));
    }

    if (medium.type) {
      tags.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "og:" + mediaType + ":type0" + index,
        property: "og:" + mediaType + ":type",
        content: medium.type.toString()
      }));
    }

    if (medium.width) {
      tags.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "og:" + mediaType + ":width0" + index,
        property: "og:" + mediaType + ":width",
        content: medium.width.toString()
      }));
    } else if (defaultWidth) {
      tags.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "og:" + mediaType + ":width0" + index,
        property: "og:" + mediaType + ":width",
        content: defaultWidth.toString()
      }));
    }

    if (medium.height) {
      tags.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "og:" + mediaType + ":height" + index,
        property: "og:" + mediaType + ":height",
        content: medium.height.toString()
      }));
    } else if (defaultHeight) {
      tags.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "og:" + mediaType + ":height" + index,
        property: "og:" + mediaType + ":height",
        content: defaultHeight.toString()
      }));
    }

    return tags;
  }, []);
};

var buildTags = function buildTags(config) {
  var _config$openGraph, _config$openGraph3, _config$additionalLin;

  var tagsToRender = [];

  if (config.titleTemplate) {
    defaults.templateTitle = config.titleTemplate;
  }

  var updatedTitle = '';

  if (config.title) {
    updatedTitle = config.title;

    if (defaults.templateTitle) {
      updatedTitle = defaults.templateTitle.replace(/%s/g, function () {
        return updatedTitle;
      });
    }
  } else if (config.defaultTitle) {
    updatedTitle = config.defaultTitle;
  }

  if (updatedTitle) {
    tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("title", {
      key: "title"
    }, updatedTitle));
  }

  var noindex = config.noindex || defaults.noindex || config.dangerouslySetAllPagesToNoIndex;
  var nofollow = config.nofollow || defaults.nofollow || config.dangerouslySetAllPagesToNoFollow;
  var robotsParams = '';

  if (config.robotsProps) {
    var _config$robotsProps = config.robotsProps,
        nosnippet = _config$robotsProps.nosnippet,
        maxSnippet = _config$robotsProps.maxSnippet,
        maxImagePreview = _config$robotsProps.maxImagePreview,
        maxVideoPreview = _config$robotsProps.maxVideoPreview,
        noarchive = _config$robotsProps.noarchive,
        noimageindex = _config$robotsProps.noimageindex,
        notranslate = _config$robotsProps.notranslate,
        unavailableAfter = _config$robotsProps.unavailableAfter;
    robotsParams = "" + (nosnippet ? ',nosnippet' : '') + (maxSnippet ? ",max-snippet:" + maxSnippet : '') + (maxImagePreview ? ",max-image-preview:" + maxImagePreview : '') + (noarchive ? ',noarchive' : '') + (unavailableAfter ? ",unavailable_after:" + unavailableAfter : '') + (noimageindex ? ',noimageindex' : '') + (maxVideoPreview ? ",max-video-preview:" + maxVideoPreview : '') + (notranslate ? ',notranslate' : '');
  }

  if (noindex || nofollow) {
    if (config.dangerouslySetAllPagesToNoIndex) {
      defaults.noindex = true;
    }

    if (config.dangerouslySetAllPagesToNoFollow) {
      defaults.nofollow = true;
    }

    tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
      key: "robots",
      name: "robots",
      content: (noindex ? 'noindex' : 'index') + "," + (nofollow ? 'nofollow' : 'follow') + robotsParams
    }));
  } else {
    tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
      key: "robots",
      name: "robots",
      content: "index,follow" + robotsParams
    }));
  }

  if (config.description) {
    tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
      key: "description",
      name: "description",
      content: config.description
    }));
  }

  if (config.mobileAlternate) {
    tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("link", {
      rel: "alternate",
      key: "mobileAlternate",
      media: config.mobileAlternate.media,
      href: config.mobileAlternate.href
    }));
  }

  if (config.languageAlternates && config.languageAlternates.length > 0) {
    config.languageAlternates.forEach(function (languageAlternate) {
      tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("link", {
        rel: "alternate",
        key: "languageAlternate-" + languageAlternate.hrefLang,
        hrefLang: languageAlternate.hrefLang,
        href: languageAlternate.href
      }));
    });
  }

  if (config.twitter) {
    if (config.twitter.cardType) {
      tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "twitter:card",
        name: "twitter:card",
        content: config.twitter.cardType
      }));
    }

    if (config.twitter.site) {
      tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "twitter:site",
        name: "twitter:site",
        content: config.twitter.site
      }));
    }

    if (config.twitter.handle) {
      tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "twitter:creator",
        name: "twitter:creator",
        content: config.twitter.handle
      }));
    }
  }

  if (config.facebook) {
    if (config.facebook.appId) {
      tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "fb:app_id",
        property: "fb:app_id",
        content: config.facebook.appId
      }));
    }
  }

  if ((_config$openGraph = config.openGraph) != null && _config$openGraph.title || updatedTitle) {
    var _config$openGraph2;

    tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
      key: "og:title",
      property: "og:title",
      content: ((_config$openGraph2 = config.openGraph) == null ? void 0 : _config$openGraph2.title) || updatedTitle
    }));
  }

  if ((_config$openGraph3 = config.openGraph) != null && _config$openGraph3.description || config.description) {
    var _config$openGraph4;

    tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
      key: "og:description",
      property: "og:description",
      content: ((_config$openGraph4 = config.openGraph) == null ? void 0 : _config$openGraph4.description) || config.description
    }));
  }

  if (config.openGraph) {
    if (config.openGraph.url || config.canonical) {
      tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "og:url",
        property: "og:url",
        content: config.openGraph.url || config.canonical
      }));
    }

    if (config.openGraph.type) {
      var type = config.openGraph.type.toLowerCase();
      tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "og:type",
        property: "og:type",
        content: type
      }));

      if (type === 'profile' && config.openGraph.profile) {
        if (config.openGraph.profile.firstName) {
          tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
            key: "profile:first_name",
            property: "profile:first_name",
            content: config.openGraph.profile.firstName
          }));
        }

        if (config.openGraph.profile.lastName) {
          tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
            key: "profile:last_name",
            property: "profile:last_name",
            content: config.openGraph.profile.lastName
          }));
        }

        if (config.openGraph.profile.username) {
          tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
            key: "profile:username",
            property: "profile:username",
            content: config.openGraph.profile.username
          }));
        }

        if (config.openGraph.profile.gender) {
          tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
            key: "profile:gender",
            property: "profile:gender",
            content: config.openGraph.profile.gender
          }));
        }
      } else if (type === 'book' && config.openGraph.book) {
        if (config.openGraph.book.authors && config.openGraph.book.authors.length) {
          config.openGraph.book.authors.forEach(function (author, index) {
            tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
              key: "book:author:0" + index,
              property: "book:author",
              content: author
            }));
          });
        }

        if (config.openGraph.book.isbn) {
          tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
            key: "book:isbn",
            property: "book:isbn",
            content: config.openGraph.book.isbn
          }));
        }

        if (config.openGraph.book.releaseDate) {
          tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
            key: "book:release_date",
            property: "book:release_date",
            content: config.openGraph.book.releaseDate
          }));
        }

        if (config.openGraph.book.tags && config.openGraph.book.tags.length) {
          config.openGraph.book.tags.forEach(function (tag, index) {
            tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
              key: "book:tag:0" + index,
              property: "book:tag",
              content: tag
            }));
          });
        }
      } else if (type === 'article' && config.openGraph.article) {
        if (config.openGraph.article.publishedTime) {
          tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
            key: "article:published_time",
            property: "article:published_time",
            content: config.openGraph.article.publishedTime
          }));
        }

        if (config.openGraph.article.modifiedTime) {
          tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
            key: "article:modified_time",
            property: "article:modified_time",
            content: config.openGraph.article.modifiedTime
          }));
        }

        if (config.openGraph.article.expirationTime) {
          tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
            key: "article:expiration_time",
            property: "article:expiration_time",
            content: config.openGraph.article.expirationTime
          }));
        }

        if (config.openGraph.article.authors && config.openGraph.article.authors.length) {
          config.openGraph.article.authors.forEach(function (author, index) {
            tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
              key: "article:author:0" + index,
              property: "article:author",
              content: author
            }));
          });
        }

        if (config.openGraph.article.section) {
          tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
            key: "article:section",
            property: "article:section",
            content: config.openGraph.article.section
          }));
        }

        if (config.openGraph.article.tags && config.openGraph.article.tags.length) {
          config.openGraph.article.tags.forEach(function (tag, index) {
            tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
              key: "article:tag:0" + index,
              property: "article:tag",
              content: tag
            }));
          });
        }
      } else if ((type === 'video.movie' || type === 'video.episode' || type === 'video.tv_show' || type === 'video.other') && config.openGraph.video) {
        if (config.openGraph.video.actors && config.openGraph.video.actors.length) {
          config.openGraph.video.actors.forEach(function (actor, index) {
            if (actor.profile) {
              tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
                key: "video:actor:0" + index,
                property: "video:actor",
                content: actor.profile
              }));
            }

            if (actor.role) {
              tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
                key: "video:actor:role:0" + index,
                property: "video:actor:role",
                content: actor.role
              }));
            }
          });
        }

        if (config.openGraph.video.directors && config.openGraph.video.directors.length) {
          config.openGraph.video.directors.forEach(function (director, index) {
            tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
              key: "video:director:0" + index,
              property: "video:director",
              content: director
            }));
          });
        }

        if (config.openGraph.video.writers && config.openGraph.video.writers.length) {
          config.openGraph.video.writers.forEach(function (writer, index) {
            tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
              key: "video:writer:0" + index,
              property: "video:writer",
              content: writer
            }));
          });
        }

        if (config.openGraph.video.duration) {
          tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
            key: "video:duration",
            property: "video:duration",
            content: config.openGraph.video.duration.toString()
          }));
        }

        if (config.openGraph.video.releaseDate) {
          tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
            key: "video:release_date",
            property: "video:release_date",
            content: config.openGraph.video.releaseDate
          }));
        }

        if (config.openGraph.video.tags && config.openGraph.video.tags.length) {
          config.openGraph.video.tags.forEach(function (tag, index) {
            tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
              key: "video:tag:0" + index,
              property: "video:tag",
              content: tag
            }));
          });
        }

        if (config.openGraph.video.series) {
          tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
            key: "video:series",
            property: "video:series",
            content: config.openGraph.video.series
          }));
        }
      }
    } // images


    if (config.defaultOpenGraphImageWidth) {
      defaults.defaultOpenGraphImageWidth = config.defaultOpenGraphImageWidth;
    }

    if (config.defaultOpenGraphImageHeight) {
      defaults.defaultOpenGraphImageHeight = config.defaultOpenGraphImageHeight;
    }

    if (config.openGraph.images && config.openGraph.images.length) {
      tagsToRender.push.apply(tagsToRender, buildOpenGraphMediaTags('image', config.openGraph.images, {
        defaultWidth: defaults.defaultOpenGraphImageWidth,
        defaultHeight: defaults.defaultOpenGraphImageHeight
      }));
    } // videos


    if (config.defaultOpenGraphVideoWidth) {
      defaults.defaultOpenGraphVideoWidth = config.defaultOpenGraphVideoWidth;
    }

    if (config.defaultOpenGraphVideoHeight) {
      defaults.defaultOpenGraphVideoHeight = config.defaultOpenGraphVideoHeight;
    }

    if (config.openGraph.videos && config.openGraph.videos.length) {
      tagsToRender.push.apply(tagsToRender, buildOpenGraphMediaTags('video', config.openGraph.videos, {
        defaultWidth: defaults.defaultOpenGraphVideoWidth,
        defaultHeight: defaults.defaultOpenGraphVideoHeight
      }));
    }

    if (config.openGraph.locale) {
      tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "og:locale",
        property: "og:locale",
        content: config.openGraph.locale
      }));
    }

    if (config.openGraph.site_name) {
      tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", {
        key: "og:site_name",
        property: "og:site_name",
        content: config.openGraph.site_name
      }));
    }
  }

  if (config.canonical) {
    tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("link", {
      rel: "canonical",
      href: config.canonical,
      key: "canonical"
    }));
  }

  if (config.additionalMetaTags && config.additionalMetaTags.length > 0) {
    config.additionalMetaTags.forEach(function (tag) {
      var _ref2, _ref3, _tag$keyOverride;

      tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("meta", _extends({
        key: "meta:" + ((_ref2 = (_ref3 = (_tag$keyOverride = tag.keyOverride) != null ? _tag$keyOverride : tag.name) != null ? _ref3 : tag.property) != null ? _ref2 : tag.httpEquiv)
      }, tag)));
    });
  }

  if ((_config$additionalLin = config.additionalLinkTags) != null && _config$additionalLin.length) {
    config.additionalLinkTags.forEach(function (tag) {
      var _tag$keyOverride2;

      tagsToRender.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("link", _extends({
        key: "link" + ((_tag$keyOverride2 = tag.keyOverride) != null ? _tag$keyOverride2 : tag.href) + tag.rel
      }, tag)));
    });
  }

  return tagsToRender;
};

var DefaultSeo = /*#__PURE__*/function (_Component) {
  _inheritsLoose(DefaultSeo, _Component);

  function DefaultSeo() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = DefaultSeo.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        title = _this$props.title,
        titleTemplate = _this$props.titleTemplate,
        defaultTitle = _this$props.defaultTitle,
        _this$props$dangerous = _this$props.dangerouslySetAllPagesToNoIndex,
        dangerouslySetAllPagesToNoIndex = _this$props$dangerous === void 0 ? false : _this$props$dangerous,
        _this$props$dangerous2 = _this$props.dangerouslySetAllPagesToNoFollow,
        dangerouslySetAllPagesToNoFollow = _this$props$dangerous2 === void 0 ? false : _this$props$dangerous2,
        description = _this$props.description,
        canonical = _this$props.canonical,
        facebook = _this$props.facebook,
        openGraph = _this$props.openGraph,
        additionalMetaTags = _this$props.additionalMetaTags,
        twitter = _this$props.twitter,
        defaultOpenGraphImageWidth = _this$props.defaultOpenGraphImageWidth,
        defaultOpenGraphImageHeight = _this$props.defaultOpenGraphImageHeight,
        defaultOpenGraphVideoWidth = _this$props.defaultOpenGraphVideoWidth,
        defaultOpenGraphVideoHeight = _this$props.defaultOpenGraphVideoHeight,
        mobileAlternate = _this$props.mobileAlternate,
        languageAlternates = _this$props.languageAlternates,
        additionalLinkTags = _this$props.additionalLinkTags,
        robotsProps = _this$props.robotsProps;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement((next_head__WEBPACK_IMPORTED_MODULE_0___default()), null, buildTags({
      title: title,
      titleTemplate: titleTemplate,
      defaultTitle: defaultTitle,
      dangerouslySetAllPagesToNoIndex: dangerouslySetAllPagesToNoIndex,
      dangerouslySetAllPagesToNoFollow: dangerouslySetAllPagesToNoFollow,
      description: description,
      canonical: canonical,
      facebook: facebook,
      openGraph: openGraph,
      additionalMetaTags: additionalMetaTags,
      twitter: twitter,
      defaultOpenGraphImageWidth: defaultOpenGraphImageWidth,
      defaultOpenGraphImageHeight: defaultOpenGraphImageHeight,
      defaultOpenGraphVideoWidth: defaultOpenGraphVideoWidth,
      defaultOpenGraphVideoHeight: defaultOpenGraphVideoHeight,
      mobileAlternate: mobileAlternate,
      languageAlternates: languageAlternates,
      additionalLinkTags: additionalLinkTags,
      robotsProps: robotsProps
    }));
  };

  return DefaultSeo;
}(react__WEBPACK_IMPORTED_MODULE_1__.Component);

var NextSeo = /*#__PURE__*/function (_Component) {
  _inheritsLoose(NextSeo, _Component);

  function NextSeo() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = NextSeo.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        title = _this$props.title,
        _this$props$noindex = _this$props.noindex,
        noindex = _this$props$noindex === void 0 ? false : _this$props$noindex,
        nofollow = _this$props.nofollow,
        robotsProps = _this$props.robotsProps,
        description = _this$props.description,
        canonical = _this$props.canonical,
        openGraph = _this$props.openGraph,
        facebook = _this$props.facebook,
        twitter = _this$props.twitter,
        additionalMetaTags = _this$props.additionalMetaTags,
        titleTemplate = _this$props.titleTemplate,
        mobileAlternate = _this$props.mobileAlternate,
        languageAlternates = _this$props.languageAlternates,
        additionalLinkTags = _this$props.additionalLinkTags;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement((next_head__WEBPACK_IMPORTED_MODULE_0___default()), null, buildTags({
      title: title,
      noindex: noindex,
      nofollow: nofollow,
      robotsProps: robotsProps,
      description: description,
      canonical: canonical,
      facebook: facebook,
      openGraph: openGraph,
      additionalMetaTags: additionalMetaTags,
      twitter: twitter,
      titleTemplate: titleTemplate,
      mobileAlternate: mobileAlternate,
      languageAlternates: languageAlternates,
      additionalLinkTags: additionalLinkTags
    }));
  };

  return NextSeo;
}(react__WEBPACK_IMPORTED_MODULE_1__.Component);

var toJson = function toJson(type, jsonld) {
  var _jsonld$id = jsonld.id,
      id = _jsonld$id === void 0 ? undefined : _jsonld$id;

  var updated = _extends({}, id ? {
    '@id': jsonld.id
  } : {}, jsonld);

  delete updated.id;
  return {
    __html: JSON.stringify(_extends({
      '@context': 'https://schema.org',
      '@type': type
    }, updated), safeJsonLdReplacer)
  };
};

var ESCAPE_ENTITIES = Object.freeze({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;'
});
var ESCAPE_REGEX = new RegExp("[" + Object.keys(ESCAPE_ENTITIES).join('') + "]", 'g');

var ESCAPE_REPLACER = function ESCAPE_REPLACER(t) {
  return ESCAPE_ENTITIES[t];
};
/**
 * A replacer for JSON.stringify to strip JSON-LD of illegal HTML entities
 * per https://www.w3.org/TR/json-ld11/#restrictions-for-contents-of-json-ld-script-elements
 */


var safeJsonLdReplacer = function () {
  // Replace per https://www.w3.org/TR/json-ld11/#restrictions-for-contents-of-json-ld-script-elements
  // Solution from https://stackoverflow.com/a/5499821/864313
  return function (_, value) {
    switch (typeof value) {
      case 'object':
        // Omit null values.
        if (value === null) {
          return undefined;
        }

        return value;
      // JSON.stringify will recursively call replacer.

      case 'number':
      case 'boolean':
      case 'bigint':
        return value;
      // These values are not risky.

      case 'string':
        return value.replace(ESCAPE_REGEX, ESCAPE_REPLACER);

      default:
        {

          return undefined;
        }
    }
  };
}(); // Utility: Assert never

function JsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Thing' : _ref$type,
      keyOverride = _ref.keyOverride,
      scriptKey = _ref.scriptKey,
      _ref$scriptId = _ref.scriptId,
      scriptId = _ref$scriptId === void 0 ? undefined : _ref$scriptId,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "scriptKey", "scriptId"]);

  return /*#__PURE__*/React.createElement(Head, null, /*#__PURE__*/React.createElement("script", {
    type: "application/ld+json",
    id: scriptId,
    dangerouslySetInnerHTML: toJson(type, _extends({}, rest)),
    key: "jsonld-" + scriptKey + (keyOverride ? "-" + keyOverride : '')
  }));
}

function setAuthor(authorName) {
  if (Array.isArray(authorName)) {
    return authorName.map(function (author) {
      return {
        '@type': 'Person',
        name: author
      };
    });
  } else if (authorName) {
    return {
      '@type': 'Person',
      name: authorName
    };
  }

  return undefined;
}

function setImage(image) {
  if (image) {
    return {
      '@type': 'ImageObject',
      url: image
    };
  }

  return undefined;
}

function setPublisher(publisherName, publisherLogo) {
  if (!publisherName) {
    return undefined;
  }

  return {
    '@type': 'Organization',
    name: publisherName,
    logo: setImage(publisherLogo)
  };
}

function setReviewRating(rating) {
  if (rating) {
    return _extends({}, rating, {
      '@type': 'Rating'
    });
  }

  return undefined;
}

function setReviews(reviews) {
  function mapReview(_ref) {
    var reviewRating = _ref.reviewRating,
        author = _ref.author,
        publisher = _ref.publisher,
        rest = _objectWithoutPropertiesLoose(_ref, ["reviewRating", "author", "publisher"]);

    return _extends({}, rest, {
      '@type': 'Review'
    }, author && {
      author: setAuthor(author)
    }, reviewRating && {
      reviewRating: setReviewRating(reviewRating)
    }, publisher && {
      publisher: setPublisher(publisher.name)
    });
  }

  if (Array.isArray(reviews)) {
    return reviews.map(mapReview);
  } else if (reviews) {
    return mapReview(reviews);
  }

  return undefined;
}

function setNutrition(calories) {
  if (calories) {
    return {
      '@type': 'NutritionInformation',
      calories: calories + " calories"
    };
  }

  return undefined;
}

function setAggregateRating(aggregateRating) {
  if (aggregateRating) {
    return {
      '@type': 'AggregateRating',
      ratingCount: aggregateRating.ratingCount,
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating,
      ratingValue: aggregateRating.ratingValue
    };
  }

  return undefined;
}

function setClip(clips) {
  function mapClip(clip) {
    return _extends({}, clip, {
      '@type': 'Clip'
    });
  }

  if (Array.isArray(clips)) {
    return clips.map(mapClip);
  } else if (clips) {
    return mapClip(clips);
  }

  return undefined;
}

function setInteractionStatistic(watchCount) {
  if (watchCount) {
    return {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/WatchAction',
      userInteractionCount: watchCount
    };
  }

  return undefined;
}

function setBroadcastEvent(publication) {
  function mapBroadcastEvent(publication) {
    return _extends({}, publication, {
      '@type': 'BroadcastEvent'
    });
  }

  if (publication) {
    if (Array.isArray(publication)) {
      return publication.map(mapBroadcastEvent);
    }

    return mapBroadcastEvent(publication);
  }

  return undefined;
}

function setVideo(video, setContext) {
  if (setContext === void 0) {
    setContext = false;
  }

  function mapVideo(_ref, context) {
    var thumbnailUrls = _ref.thumbnailUrls,
        hasPart = _ref.hasPart,
        watchCount = _ref.watchCount,
        publication = _ref.publication,
        rest = _objectWithoutPropertiesLoose(_ref, ["thumbnailUrls", "hasPart", "watchCount", "publication"]);

    return _extends({}, rest, {
      '@type': 'VideoObject'
    }, context && {
      '@context': 'https://schema.org'
    }, {
      thumbnailUrl: thumbnailUrls,
      hasPart: setClip(hasPart),
      interactionStatistic: setInteractionStatistic(watchCount),
      publication: setBroadcastEvent(publication)
    });
  }

  if (video) {
    return mapVideo(video, setContext);
  }

  return undefined;
}

function setInstruction(instruction) {
  if (instruction) {
    return _extends({}, instruction, {
      '@type': 'HowToStep'
    });
  }

  return undefined;
}

function CarouselJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Carousel' : _ref$type,
      keyOverride = _ref.keyOverride,
      ofType = _ref.ofType,
      data = _ref.data;

  function generateList(data, ofType) {
    switch (ofType) {
      case 'default':
        return data.map(function (item, index) {
          return {
            '@type': 'ListItem',
            position: "" + (index + 1),
            url: item.url
          };
        });

      case 'course':
        return data.map(function (item, index) {
          return {
            '@type': 'ListItem',
            position: "" + (index + 1),
            item: {
              '@context': 'https://schema.org',
              '@type': 'Course',
              url: item.url,
              name: item.courseName,
              description: item.description,
              provider: {
                '@type': 'Organization',
                name: item.providerName,
                sameAs: item.providerUrl
              }
            }
          };
        });

      case 'movie':
        return data.map(function (item, index) {
          return {
            '@type': 'ListItem',
            position: "" + (index + 1),
            item: {
              '@context': 'https://schema.org',
              '@type': 'Movie',
              name: item.name,
              url: item.url,
              image: item.image,
              dateCreated: item.dateCreated,
              director: item.director ? Array.isArray(item.director) ? item.director.map(function (director) {
                return {
                  '@type': 'Person',
                  name: director.name
                };
              }) : {
                '@type': 'Person',
                name: item.director.name
              } : undefined,
              review: setReviews(item.review)
            }
          };
        });

      case 'recipe':
        return data.map(function (_ref2, index) {
          var authorName = _ref2.authorName,
              images = _ref2.images,
              yields = _ref2.yields,
              category = _ref2.category,
              calories = _ref2.calories,
              aggregateRating = _ref2.aggregateRating,
              video = _ref2.video,
              ingredients = _ref2.ingredients,
              instructions = _ref2.instructions,
              cuisine = _ref2.cuisine,
              rest = _objectWithoutPropertiesLoose(_ref2, ["authorName", "images", "yields", "category", "calories", "aggregateRating", "video", "ingredients", "instructions", "cuisine"]);

          return {
            '@type': 'ListItem',
            position: "" + (index + 1),
            item: _extends({
              '@context': 'https://schema.org',
              '@type': 'Recipe'
            }, rest, {
              author: setAuthor(authorName),
              image: images,
              recipeYield: yields,
              recipeCategory: category,
              recipeCuisine: cuisine,
              nutrition: setNutrition(calories),
              aggregateRating: setAggregateRating(aggregateRating),
              video: setVideo(video),
              recipeIngredient: ingredients,
              recipeInstructions: instructions.map(setInstruction)
            })
          };
        });
    }
  }

  var d = {
    '@type': 'ItemList',
    itemListElement: generateList(data, ofType)
  };
  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, d, {
    scriptKey: "Carousel"
  }));
}

function NewsArticleJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'NewsArticle' : _ref$type,
      keyOverride = _ref.keyOverride,
      url = _ref.url,
      title = _ref.title,
      images = _ref.images,
      section = _ref.section,
      dateCreated = _ref.dateCreated,
      datePublished = _ref.datePublished,
      dateModified = _ref.dateModified,
      authorName = _ref.authorName,
      publisherName = _ref.publisherName,
      publisherLogo = _ref.publisherLogo,
      body = _ref.body,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "url", "title", "images", "section", "dateCreated", "datePublished", "dateModified", "authorName", "publisherName", "publisherLogo", "body"]);

  var data = _extends({}, rest, {
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    headline: title,
    image: images,
    articleSection: section,
    dateCreated: dateCreated || datePublished,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: setAuthor(authorName),
    publisher: setPublisher(publisherName, publisherLogo),
    articleBody: body
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "NewsArticle"
  }));
}

function JobPostingJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'JobPosting' : _ref$type,
      keyOverride = _ref.keyOverride,
      baseSalary = _ref.baseSalary,
      hiringOrganization = _ref.hiringOrganization,
      applicantLocationRequirements = _ref.applicantLocationRequirements,
      jobLocation = _ref.jobLocation,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "baseSalary", "hiringOrganization", "applicantLocationRequirements", "jobLocation"]);

  function setBaseSalary(baseSalary) {
    if (baseSalary) {
      return {
        '@type': 'MonetaryAmount',
        currency: baseSalary.currency,
        value: _extends({
          '@type': 'QuantitativeValue',
          unitText: baseSalary.unitText
        }, Array.isArray(baseSalary.value) ? {
          minValue: baseSalary.value[0],
          maxValue: baseSalary.value[1]
        } : {
          value: baseSalary.value
        })
      };
    }

    return undefined;
  }

  function setHiringOrganization(org) {
    return {
      '@type': 'Organization',
      name: org.name,
      sameAs: org.sameAs,
      logo: org.logo
    };
  }

  function setJobLocation(location) {
    if (location) {
      return {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressCountry: location.addressCountry,
          addressLocality: location.addressLocality,
          addressRegion: location.addressRegion,
          postalCode: location.postalCode,
          streetAddress: location.streetAddress
        }
      };
    }

    return undefined;
  }

  function setApplicantLocationRequirements(requirements) {
    if (requirements) {
      return {
        '@type': 'Country',
        name: requirements
      };
    }

    return undefined;
  }

  var data = _extends({}, rest, {
    baseSalary: setBaseSalary(baseSalary),
    hiringOrganization: setHiringOrganization(hiringOrganization),
    jobLocation: setJobLocation(jobLocation),
    applicantLocationRequirements: setApplicantLocationRequirements(applicantLocationRequirements)
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "JobPosting"
  }));
}

function setAddress(address) {
  if (address) {
    return _extends({
      '@type': 'PostalAddress'
    }, address);
  }

  return undefined;
}

function setGeo(geo) {
  if (geo) {
    return _extends({}, geo, {
      '@type': 'GeoCoordinates'
    });
  }

  return undefined;
}

function setAction(action) {
  if (action) {
    return {
      '@type': action.actionType,
      name: action.actionName,
      target: action.target
    };
  }

  return undefined;
}

function setGeoCircle(geoCircle) {
  if (geoCircle) {
    return {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: geoCircle.geoMidpoint.latitude,
        longitude: geoCircle.geoMidpoint.longitude
      },
      geoRadius: geoCircle.geoRadius
    };
  }

  return undefined;
}

function setOffer(offer) {
  function setPriceSpecification(priceSpecification) {
    if (priceSpecification) {
      return {
        '@type': priceSpecification.type,
        priceCurrency: priceSpecification.priceCurrency,
        price: priceSpecification.price
      };
    }

    return undefined;
  }

  function setItemOffered(itemOffered) {
    if (itemOffered) {
      return _extends({}, itemOffered, {
        '@type': 'Service'
      });
    }

    return undefined;
  }

  if (offer) {
    return _extends({}, offer, {
      '@type': 'Offer',
      priceSpecification: setPriceSpecification(offer.priceSpecification),
      itemOffered: setItemOffered(offer.itemOffered)
    });
  }

  return undefined;
}

function setOpeningHours(openingHours) {
  if (openingHours) {
    return _extends({}, openingHours, {
      '@type': 'OpeningHoursSpecification'
    });
  }

  return undefined;
}

function LocalBusinessJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'LocalBusiness' : _ref$type,
      keyOverride = _ref.keyOverride,
      address = _ref.address,
      geo = _ref.geo,
      rating = _ref.rating,
      review = _ref.review,
      action = _ref.action,
      areaServed = _ref.areaServed,
      makesOffer = _ref.makesOffer,
      openingHours = _ref.openingHours,
      images = _ref.images,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "address", "geo", "rating", "review", "action", "areaServed", "makesOffer", "openingHours", "images"]);

  var data = _extends({}, rest, {
    image: images,
    address: setAddress(address),
    geo: setGeo(geo),
    aggregateRating: setAggregateRating(rating),
    review: setReviews(review),
    potentialAction: setAction(action),
    areaServed: areaServed && areaServed.map(setGeoCircle),
    makesOffer: makesOffer == null ? void 0 : makesOffer.map(setOffer),
    openingHoursSpecification: Array.isArray(openingHours) ? openingHours.map(setOpeningHours) : setOpeningHours(openingHours)
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "LocalBusiness"
  }));
}

function QAPageJsonLd(_ref) {
  var _mainEntity$author, _mainEntity$acceptedA, _mainEntity$acceptedA2;

  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'QAPage' : _ref$type,
      keyOverride = _ref.keyOverride,
      mainEntity = _ref.mainEntity,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "mainEntity"]);

  var data = _extends({}, rest, {
    mainEntity: _extends({}, mainEntity, {
      '@type': 'Question',
      author: setAuthor((_mainEntity$author = mainEntity.author) == null ? void 0 : _mainEntity$author.name)
    }, mainEntity.acceptedAnswer && {
      acceptedAnswer: _extends({}, mainEntity.acceptedAnswer, {
        '@type': 'Answer',
        author: setAuthor((_mainEntity$acceptedA = mainEntity.acceptedAnswer) == null ? void 0 : (_mainEntity$acceptedA2 = _mainEntity$acceptedA.author) == null ? void 0 : _mainEntity$acceptedA2.name)
      })
    }, mainEntity.suggestedAnswer && {
      suggestedAnswer: mainEntity.suggestedAnswer.map(function (_ref2) {
        var _rest$author;

        var upvoteCount = _ref2.upvoteCount,
            rest = _objectWithoutPropertiesLoose(_ref2, ["upvoteCount"]);

        return _extends({}, rest, {
          '@type': 'Answer',
          upvoteCount: upvoteCount || 0,
          author: setAuthor((_rest$author = rest.author) == null ? void 0 : _rest$author.name)
        });
      })
    })
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "QAPage"
  }));
}

function setItemListElements(items) {
  if (items && items.length) {
    return items.map(function (item) {
      return {
        '@type': 'ListItem',
        position: item.position,
        item: {
          '@id': item.item,
          name: item.name
        }
      };
    });
  }

  return undefined;
}

function ProfilePageJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'ProfilePage' : _ref$type,
      keyOverride = _ref.keyOverride,
      breadcrumb = _ref.breadcrumb,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "breadcrumb"]);

  var data = _extends({}, rest, {
    breadcrumb: Array.isArray(breadcrumb) ? {
      '@type': 'BreadcrumbList',
      itemListElement: setItemListElements(breadcrumb)
    } : breadcrumb
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "ProfilePage"
  }));
}

function SiteLinksSearchBoxJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'WebSite' : _ref$type,
      keyOverride = _ref.keyOverride,
      potentialActions = _ref.potentialActions,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "potentialActions"]);

  function setPotentialAction(action) {
    if (action) {
      var target = action.target,
          queryInput = action.queryInput;
      return {
        '@type': 'SearchAction',
        target: target + "={" + queryInput + "}",
        'query-input': "required name=" + queryInput
      };
    }

    return undefined;
  }

  var data = _extends({}, rest, {
    potentialAction: potentialActions.map(setPotentialAction)
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "jsonld-siteLinksSearchBox"
  }));
}

function RecipeJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Recipe' : _ref$type,
      keyOverride = _ref.keyOverride,
      authorName = _ref.authorName,
      images = _ref.images,
      yields = _ref.yields,
      category = _ref.category,
      cuisine = _ref.cuisine,
      calories = _ref.calories,
      aggregateRating = _ref.aggregateRating,
      video = _ref.video,
      ingredients = _ref.ingredients,
      instructions = _ref.instructions,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "authorName", "images", "yields", "category", "cuisine", "calories", "aggregateRating", "video", "ingredients", "instructions"]);

  var data = _extends({}, rest, {
    author: setAuthor(authorName),
    image: images,
    recipeYield: yields,
    recipeCategory: category,
    recipeCuisine: cuisine,
    nutrition: setNutrition(calories),
    aggregateRating: setAggregateRating(aggregateRating),
    video: setVideo(video),
    recipeIngredient: ingredients,
    recipeInstructions: instructions.map(setInstruction)
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "recipe"
  }));
}

function setLocation(location) {
  if (location) {
    return _extends({}, location, {
      '@type': 'Place',
      address: setAddress(location.address)
    });
  }

  return undefined;
}

function setPerformer(performer) {
  if (performer) {
    return _extends({}, performer, {
      '@type': 'PerformingGroup'
    });
  }

  return undefined;
}

function setOffers(offers) {
  function mapOffer(_ref) {
    var seller = _ref.seller,
        rest = _objectWithoutPropertiesLoose(_ref, ["seller"]);

    return _extends({}, rest, {
      '@type': 'Offer'
    }, seller && {
      seller: {
        '@type': 'Organization',
        name: seller.name
      }
    });
  }

  if (Array.isArray(offers)) {
    return offers.map(mapOffer);
  } else if (offers) {
    return mapOffer(offers);
  }

  return undefined;
}

function setAggregateOffer(aggregateOffer) {
  if (aggregateOffer) {
    return {
      '@type': 'AggregateOffer',
      priceCurrency: aggregateOffer.priceCurrency,
      highPrice: aggregateOffer.highPrice,
      lowPrice: aggregateOffer.lowPrice,
      offerCount: aggregateOffer.offerCount,
      offers: setOffers(aggregateOffer.offers)
    };
  }

  return undefined;
}

function EventJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Event' : _ref$type,
      keyOverride = _ref.keyOverride,
      location = _ref.location,
      images = _ref.images,
      offers = _ref.offers,
      aggregateOffer = _ref.aggregateOffer,
      performers = _ref.performers,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "location", "images", "offers", "aggregateOffer", "performers"]);

  var data = _extends({}, rest, {
    location: setLocation(location),
    image: images,
    offers: offers ? setOffers(offers) : setAggregateOffer(aggregateOffer),
    performer: Array.isArray(performers) ? performers.map(setPerformer) : setPerformer(performers)
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "Event"
  }));
}

function setContactPoint(contactPoint) {
  if (contactPoint) {
    return _extends({}, contactPoint, {
      '@type': 'ContactPoint'
    });
  }

  return undefined;
}

function CorporateContactJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Organization' : _ref$type,
      keyOverride = _ref.keyOverride,
      contactPoint = _ref.contactPoint,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "contactPoint"]);

  var data = _extends({}, rest, {
    contactPoint: contactPoint.map(setContactPoint)
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "CorporateContact"
  }));
}

function setCreativeWork(creativeWork) {
  if (creativeWork) {
    return _extends({}, creativeWork, {
      '@type': 'CreativeWork'
    });
  }

  return undefined;
}

function CollectionPageJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'CollectionPage' : _ref$type,
      keyOverride = _ref.keyOverride,
      hasPart = _ref.hasPart,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "hasPart"]);

  var data = _extends({}, rest, {
    hasPart: hasPart.map(setCreativeWork)
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "CollectionPage"
  }));
}

function setManufacturer(manufacturer) {
  if (manufacturer && (manufacturer.manufacturerName || manufacturer.manufacturerLogo)) {
    return {
      '@type': 'Organization',
      name: manufacturer.manufacturerName,
      logo: setImage(manufacturer.manufacturerLogo)
    };
  }

  return undefined;
}

function setBrand(brand) {
  if (brand) {
    return {
      '@type': 'Brand',
      name: brand
    };
  }

  return undefined;
}

function ProductJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Product' : _ref$type,
      keyOverride = _ref.keyOverride,
      images = _ref.images,
      brand = _ref.brand,
      reviews = _ref.reviews,
      aggregateRating = _ref.aggregateRating,
      manufacturerLogo = _ref.manufacturerLogo,
      manufacturerName = _ref.manufacturerName,
      offers = _ref.offers,
      aggregateOffer = _ref.aggregateOffer,
      productName = _ref.productName,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "images", "brand", "reviews", "aggregateRating", "manufacturerLogo", "manufacturerName", "offers", "aggregateOffer", "productName"]);

  var data = _extends({}, rest, {
    image: images,
    brand: setBrand(brand),
    review: setReviews(reviews),
    aggregateRating: setAggregateRating(aggregateRating),
    manufacturer: setManufacturer({
      manufacturerLogo: manufacturerLogo,
      manufacturerName: manufacturerName
    }),
    offers: offers ? setOffers(offers) : setAggregateOffer(aggregateOffer),
    name: productName
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "Product"
  }));
}

function SoftwareAppJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'SoftwareApplication' : _ref$type,
      keyOverride = _ref.keyOverride,
      priceCurrency = _ref.priceCurrency,
      price = _ref.price,
      aggregateRating = _ref.aggregateRating,
      review = _ref.review,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "priceCurrency", "price", "aggregateRating", "review"]);

  var data = _extends({}, rest, {
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: priceCurrency
    },
    aggregateRating: setAggregateRating(aggregateRating),
    review: setReviews(review)
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "SoftwareApp"
  }));
}

function VideoJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Video' : _ref$type,
      keyOverride = _ref.keyOverride,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride"]);

  var data = setVideo(rest, true);
  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "Video"
  }));
}

function setProducer(producer) {
  if (producer) {
    return {
      '@type': 'Organization',
      sameAs: producer.url,
      name: producer.name
    };
  }

  return undefined;
}

function setProvider(provider) {
  if (provider) {
    return {
      '@type': provider.type || 'Organization',
      name: provider.name,
      sameAs: provider.url
    };
  }

  return undefined;
}

function VideoGameJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'VideoGame' : _ref$type,
      keyOverride = _ref.keyOverride,
      aggregateRating = _ref.aggregateRating,
      trailer = _ref.trailer,
      reviews = _ref.reviews,
      image = _ref.image,
      authorName = _ref.authorName,
      provider = _ref.provider,
      producerName = _ref.producerName,
      producerUrl = _ref.producerUrl,
      offers = _ref.offers,
      operatingSystemName = _ref.operatingSystemName,
      platformName = _ref.platformName,
      translatorName = _ref.translatorName,
      languageName = _ref.languageName,
      genreName = _ref.genreName,
      publisherName = _ref.publisherName,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "aggregateRating", "trailer", "reviews", "image", "authorName", "provider", "producerName", "producerUrl", "offers", "operatingSystemName", "platformName", "translatorName", "languageName", "genreName", "publisherName"]);

  var data = _extends({}, rest, {
    aggregateRating: setAggregateRating(aggregateRating),
    trailer: setVideo(trailer),
    review: setReviews(reviews),
    image: setImage(image),
    author: setAuthor(authorName),
    provider: setProvider(provider),
    producer: setProducer({
      name: producerName,
      url: producerUrl
    }),
    offers: setOffers(offers),
    operatingSystem: operatingSystemName,
    gamePlatform: platformName,
    translator: translatorName,
    inLanguage: languageName,
    genre: genreName,
    publisher: publisherName
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "VideoGame"
  }));
}

function setContactPoints(contactPoint) {
  if (contactPoint && contactPoint.length) {
    return contactPoint.map(function (contactPoint) {
      return _extends({
        '@type': 'ContactPoint'
      }, contactPoint);
    });
  }

  return undefined;
}

function OrganizationJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Organization' : _ref$type,
      keyOverride = _ref.keyOverride,
      address = _ref.address,
      contactPoints = _ref.contactPoints,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "address", "contactPoints"]);

  var data = _extends({}, rest, {
    address: setAddress(address),
    contactPoints: setContactPoints(contactPoints)
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "organization"
  }));
}

function setQuestions(questions) {
  if (questions && questions.length) {
    return questions.map(function (question) {
      return {
        '@type': 'Question',
        name: question.questionName,
        acceptedAnswer: {
          '@type': 'Answer',
          text: question.acceptedAnswerText
        }
      };
    });
  }

  return undefined;
}

function FAQPageJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'FAQPage' : _ref$type,
      keyOverride = _ref.keyOverride,
      mainEntity = _ref.mainEntity,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "mainEntity"]);

  var data = _extends({}, rest, {
    mainEntity: setQuestions(mainEntity)
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "faq-page"
  }));
}

function LogoJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Organization' : _ref$type,
      keyOverride = _ref.keyOverride,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride"]);

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, rest, {
    scriptKey: "Logo"
  }));
}

function DatasetJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Dataset' : _ref$type,
      keyOverride = _ref.keyOverride,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride"]);

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, rest, {
    scriptKey: "dataset"
  }));
}

function CourseJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Course' : _ref$type,
      keyOverride = _ref.keyOverride,
      courseName = _ref.courseName,
      provider = _ref.provider,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride", "courseName", "provider"]);

  var data = _extends({
    name: courseName
  }, rest, {
    provider: setProvider(provider)
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "course"
  }));
}

function BreadCrumbJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'BreadcrumbList' : _ref$type,
      keyOverride = _ref.keyOverride,
      itemListElements = _ref.itemListElements;
  var data = {
    itemListElement: setItemListElements(itemListElements)
  };
  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "breadcrumb"
  }));
}

function BrandJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Brand' : _ref$type,
      id = _ref.id,
      keyOverride = _ref.keyOverride,
      aggregateRating = _ref.aggregateRating,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "id", "keyOverride", "aggregateRating"]);

  var data = _extends({
    aggregateRating: setAggregateRating(aggregateRating),
    '@id': id
  }, rest);

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "brand"
  }));
}

function ArticleJsonLd(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Article' : _ref$type,
      keyOverride = _ref.keyOverride,
      url = _ref.url,
      title = _ref.title,
      images = _ref.images,
      datePublished = _ref.datePublished,
      dateModified = _ref.dateModified,
      authorName = _ref.authorName,
      _ref$publisherName = _ref.publisherName,
      publisherName = _ref$publisherName === void 0 ? undefined : _ref$publisherName,
      _ref$publisherLogo = _ref.publisherLogo,
      publisherLogo = _ref$publisherLogo === void 0 ? undefined : _ref$publisherLogo,
      description = _ref.description;
  var data = {
    datePublished: datePublished,
    description: description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    headline: title,
    image: images,
    dateModified: dateModified || datePublished,
    author: setAuthor(authorName),
    publisher: setPublisher(publisherName, publisherLogo)
  };
  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, data, {
    scriptKey: "article"
  }));
}

function setReviewedBy(reviewedBy) {
  if (reviewedBy) {
    return _extends({
      '@type': (reviewedBy == null ? void 0 : reviewedBy.type) || 'Organization'
    }, reviewedBy);
  }

  return undefined;
}

function WebPageJsonLd(_ref) {
  var keyOverride = _ref.keyOverride,
      reviewedBy = _ref.reviewedBy,
      rest = _objectWithoutPropertiesLoose(_ref, ["keyOverride", "reviewedBy"]);

  var data = _extends({}, rest, {
    reviewedBy: setReviewedBy(reviewedBy)
  });

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    keyOverride: keyOverride
  }, data, {
    type: "WebPage",
    scriptKey: "WebPage"
  }));
}

function SocialProfileJsonLd(_ref) {
  var type = _ref.type,
      keyOverride = _ref.keyOverride,
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "keyOverride"]);

  return /*#__PURE__*/React.createElement(JsonLd, _extends({
    type: type,
    keyOverride: keyOverride
  }, rest, {
    scriptKey: "social"
  }));
}




/***/ })

}]);