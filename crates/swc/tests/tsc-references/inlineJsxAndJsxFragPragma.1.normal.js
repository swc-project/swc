//// [renderer.d.ts]
export { };
//// [preacty.tsx]
/*#__PURE__*/ h(Fragment, null, /*#__PURE__*/ h("div", null));
/**
 * @jsx h
 * @jsxFrag Fragment
 */ export { };
//// [snabbdomy.tsx]
/*#__PURE__*/ jsx(React.Fragment, null, /*#__PURE__*/ jsx("span", null));
/* @jsx jsx */ /* @jsxfrag null */ export { };
//// [preacty-only-fragment.tsx]
/*#__PURE__*/ h(Fragment, null);
/**
 * @jsx h
 * @jsxFrag Fragment
 */ export { };
//// [snabbdomy-only-fragment.tsx]
/*#__PURE__*/ jsx(React.Fragment, null);
/* @jsx jsx */ /* @jsxfrag null */ export { };
//// [preacty-only-fragment-no-jsx.tsx]
/*#__PURE__*/ h(Fragment, null);
/**
 * @jsx h
 * @jsxFrag Fragment
 */ export { };
//// [snabbdomy-only-fragment-no-jsx.tsx]
/* @jsx jsx */ /* @jsxfrag null */ import "./renderer";
/*#__PURE__*/ jsx(React.Fragment, null);
//// [preacty-no-fragment.tsx]
/*#__PURE__*/ h("div", null);
/**
 * @jsx h
 * @jsxFrag Fragment
 */ export { };
//// [snabbdomy-no-fragment.tsx]
/*#__PURE__*/ jsx("div", null);
/* @jsx jsx */ /* @jsxfrag null */ export { };
//// [preacty-only-component.tsx]
function Component() {
    return null;
}
/*#__PURE__*/ h(Component, null);
/**
 * @jsx h
 */ export { };
