(/* @__PURE__ */ new Set(x)).forEach(cb);

(/* #__PURE__ */ new Set(x)).forEach(cb);

(/* @__PURE__ */ foo()).bar();

(/* @__NO_SIDE_EFFECTS__ */ new Set(x)).forEach(cb);

(/* @__PURE__ */ createHandler())();

(/* @__PURE__ */ new Handler())();

(/* @__NO_SIDE_EFFECTS__ */ createHandler())();

(/* @__PURE__ */ new Handler)();

(/* @__PURE__ */ new Handler)?.();

(/* @__PURE__ */ new Set).forEach(cb);

(/* @__PURE__ */ new Handler())?.();

new (/* @__PURE__ */ new Handler)(x);

/* @__PURE__ */ (/* @__PURE__ */ new Handler).m();
