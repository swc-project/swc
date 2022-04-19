import { jsx as a, Fragment as b } from "react/jsx-runtime";
import c from "react";
import { useRouter as d } from "next/router";
import { useProject as e } from "@swr/use-project";
import f from "@swr/use-team";
export default function g() {
    var g, h, i, j, k, c = e(d().query.project).data;
    return f().teamSlug, useProjectBranches(null == c ? void 0 : c.id).data, a(b, {});
};
