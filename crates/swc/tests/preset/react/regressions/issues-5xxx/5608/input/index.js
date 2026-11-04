import { jsx as c } from "react/jsx-runtime";
import i from "react-markdown";

const o = r => c(i, { children: r }),
    s = ({ text: r, renderText: t = o, ...p }) => c("div", { children: t(r) });

export { s as RichText, o as defaultRenderFn };