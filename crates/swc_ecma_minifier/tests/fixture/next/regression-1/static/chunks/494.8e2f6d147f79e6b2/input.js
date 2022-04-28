"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[494],{

/***/ 1494:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "SkillsPanel": function() { return /* binding */ SkillsPanel; }
});

// EXTERNAL MODULE: ../../node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js + 1 modules
var emotion_styled_base_browser_esm = __webpack_require__(3992);
// EXTERNAL MODULE: ../../node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs + 3 modules
var AnimatePresence = __webpack_require__(4589);
// EXTERNAL MODULE: ../../node_modules/framer-motion/dist/es/components/LazyMotion/index.mjs
var LazyMotion = __webpack_require__(5463);
// EXTERNAL MODULE: ../../node_modules/framer-motion/dist/es/render/dom/features-animation.mjs + 48 modules
var features_animation = __webpack_require__(7051);
// EXTERNAL MODULE: ../../node_modules/framer-motion/dist/es/render/dom/motion-minimal.mjs + 27 modules
var motion_minimal = __webpack_require__(7461);
// EXTERNAL MODULE: ../../node_modules/next/image.js
var next_image = __webpack_require__(6577);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ../../node_modules/react/index.js
var react = __webpack_require__(2784);
// EXTERNAL MODULE: ./src/features/about/config/index.ts + 2 modules
var config = __webpack_require__(5559);
// EXTERNAL MODULE: ../../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js
var emotion_react_jsx_runtime_browser_esm = __webpack_require__(2903);
;// CONCATENATED MODULE: ./src/features/about/components/Skills/SkillLabel.tsx


function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }



const UnstyledSkillLabel = props => {
  const {
    skill,
    className
  } = props;
  const {
    name,
    years
  } = skill;
  return (0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)("div", {
    className: "".concat(className),
    children: [name, ' ', years && years >= 1 && (0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)("span", {
      className: "years",
      children: [" >", years, "y"]
    })]
  });
};

const SkillLabel = /*#__PURE__*/(0,emotion_styled_base_browser_esm/* default */.Z)(UnstyledSkillLabel,  true ? {
  target: "e1gn2ha70"
} : 0)( true ? {
  name: "ubdjuv",
  styles: "padding:5px;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;width:100%;font-size:0.9em;flex:1 1 100%;span.years{margin-left:5px;padding:0px 5px 0px 5px;background-color:#fefefe;box-shadow:0 1px 3px rgba(0, 0, 0, 0.05),0 1px 2px rgba(0, 0, 0, 0.12);}"
} : 0);
;// CONCATENATED MODULE: ./src/features/about/components/Skills/SkillsPanelAnims.ts

// For animation
const getListVariants = (type = 'none') => {
  switch (type) {
    case 'topdown':
      return {
        initial: {},
        enter: {
          transition: {
            staggerChildren: 0
          }
        }
      };

    case 'adrenaline':
      return {
        initial: {
          filter: 'grayscale(100%)'
        },
        enter: {
          transitionEnd: {
            opacity: 1,
            filter: 'none'
          },
          transition: {
            staggerChildren: 0.3,
            ease: 'easeOut'
          }
        },
        exit: {
          flexGrow: 0,
          transition: {
            duration: 0.2,
            ease: [0.48, 0.15, 0.25, 0.96]
          }
        }
      };

    case 'none':
    default:
      return {
        initial: {},
        enter: {},
        exit: {}
      };
  }
};
const getItemVariants = (type = 'none') => {
  const vw = window !== undefined ? Math.ceil(window.innerWidth / 1.9) : 800;
  const vh = window !== undefined ? Math.ceil(window.innerWidth / 1.9) : 800;
  const initialX = Math.random() > 0.5 ? vw : -vw;
  const initialY = Math.random() > 0.5 ? vh : -vh;

  switch (type) {
    case 'soft':
      return {
        initial: {
          opacity: 0.6,
          x: Math.ceil(Math.random() * 100) * (Math.random() > 0.5 ? -1 : 1),
          // y: Math.ceil(Math.random() * 2) * (Math.random() > 0.5 ? -1 : 1),
          scale: 0.1
        },
        enter: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: {
            // staggerChildren: 1,
            // beforeChildren: false,
            duration: 1.4
          }
        },
        exit: {
          opacity: 0,
          scale: 0,
          flexGrow: 0,
          transition: {
            duration: 0.3,
            ease: [0.48, 0.15, 0.25, 0.96]
          }
        }
      };

    case 'topdown':
      return {
        initial: {
          opacity: 0,
          scale: 0.1,
          x: initialX,
          y: -800
        },
        enter: {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          transition: {
            // staggerChildren: 0.12,
            beforeChildren: false
          }
        },
        exit: {
          opacity: 0,
          scale: 0,
          flexGrow: 0,
          transition: {
            duration: 0.3,
            ease: [0.48, 0.15, 0.25, 0.96]
          }
        }
      };

    case 'adrenaline':
      return {
        initial: {
          rotateX: 0,
          rotateZ: 240,
          opacity: 0,
          scale: 1000,
          x: 1400,
          y: -2000
        },
        enter: {
          opacity: 0.3,
          rotateX: 0,
          rotateZ: 0,
          scale: 1,
          x: 0,
          y: 0,
          transitionEnd: {
            opacity: 0.5
          },
          transition: {
            duration: 1,
            ease: [0.48, 0.15, 0.25, 0.96]
          }
        },
        exit: {
          opacity: 0,
          scale: 0,
          flexGrow: 0,
          transition: {
            duration: 0.3,
            ease: [0.48, 0.15, 0.25, 0.96]
          }
        }
      };

    case 'none':
    default:
      return {
        initial: {},
        enter: {},
        exit: {}
      };
  }
};
const getAnimationType = section => {
  for (const [animType, sections = []] of Object.entries(config/* sectionAnimations */.rf)) {
    if (sections.includes(section)) {
      return animType;
    }
  }

  return 'none';
};
;// CONCATENATED MODULE: ./src/features/about/components/Skills/SkillsPanel.tsx










const isSectionsActive = activeSections => sections => {
  if (activeSections === null || activeSections.length === 0) {
    return false;
  }

  return sections.some(s => activeSections.includes(s));
};

const HackyAnimatePresence = AnimatePresence/* AnimatePresence */.M;

const UnstyledSkillsPanel = props => {
  const {
    className,
    skills,
    defaultSection
  } = props;
  const {
    0: activeSections,
    1: setActiveSections
  } = (0,react.useState)([defaultSection]);
  const sectionActive = isSectionsActive(activeSections);
  return (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(LazyMotion/* LazyMotion */.X, {
    strict: true,
    features: features_animation/* domAnimation */.H,
    children: (0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)("div", {
      className: className,
      children: [(0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {
        className: "section",
        children: config/* skillSections.map */.pA.map(section => {
          const cls = sectionActive([section]) ? 'tab__active' : '';
          return (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {
            role: 'tab',
            className: "tab ".concat(cls),
            onClick: _e => {
              if (sectionActive([section])) {
                setActiveSections([defaultSection]);
              } else {
                setActiveSections([section]);
              }
            },
            children: section
          }, section);
        })
      }), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {
        className: "card-container",
        children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(HackyAnimatePresence, {
          initial: true,
          children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(motion_minimal.m.div, {
            className: "animation-container",
            variants: getListVariants(getAnimationType(activeSections[0])),
            initial: "initial",
            animate: "enter",
            exit: "exit",
            children: skills.map((skill, _idx) => {
              const {
                name,
                logo,
                homepage
              } = skill;

              if (activeSections.length > 0 && !sectionActive(skill.sections)) {
                return false;
              }

              return (0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)(motion_minimal.m.article, {
                className: "card",
                variants: getItemVariants('soft'),
                children: [(0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("div", {
                  className: 'card-picture',
                  children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("a", {
                    href: homepage,
                    target: "_blank",
                    rel: "noreferrer",
                    children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)((image_default()), {
                      src: logo,
                      width: 60,
                      height: 60
                    })
                  })
                }), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(motion_minimal.m.div, {
                  className: "card-footer",
                  variants: getItemVariants(getAnimationType(activeSections[0])),
                  children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(SkillLabel, {
                    skill: skill
                  })
                }, "".concat(name))]
              }, "".concat(name));
            })
          }, "".concat(activeSections.join(',')))
        })
      })]
    })
  });
};

const SkillsPanel = /*#__PURE__*/(0,emotion_styled_base_browser_esm/* default */.Z)(UnstyledSkillsPanel,  true ? {
  target: "euzgq0b0"
} : 0)("display:flex;flex-direction:column;margin-bottom:15px;div.section{align-self:flex-start;display:flex;flex-wrap:wrap;margin-bottom:0;div.tab{color:", props => props.theme.colors.primary, ";font-weight:300;padding:5px 10px 10px 10px;border-bottom:1px solid #eee;margin:5px;&:hover{cursor:pointer;}&.tab__active{background-color:white;border-bottom:2px solid darkgray;}}}div.card-container{flex:1 1 auto;display:flex;flex-direction:column;width:100%;background-color:rgba(255, 255, 255, 1);padding-top:20px;.animation-container{display:flex;flex-wrap:wrap;justify-content:center;align-items:stretch;padding:15px 0 15px 0;article.card{flex:1 1 auto;width:33.33%;display:flex;flex-direction:column;align-items:center;@media all and (max-width: 900px){article.card{}width:50%;}.card-picture{position:relative;text-align:center;max-width:70px;height:50px;a,a:visited{color:black;text-decoration:none;}a:hover{}img{width:100%;height:100%;object-fit:scale-down;transition:filter 0.5s ease-in-out;&:hover{filter:grayscale(30%);}}}.card-footer{display:flex;width:100%;padding:5px 5px 20px 5px;}}}}" + ( true ? "" : 0));

/***/ })

}]);