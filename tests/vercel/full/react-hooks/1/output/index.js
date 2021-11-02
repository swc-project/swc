import { jsx as a, Fragment as b } from "react/jsx-runtime";
import c from "react";
import { useRouter as d } from "next/router";
import { useProject as e } from "@swr/use-project";
import f from "@swr/use-team";
export default function c() {
    var g = e(d().query.project).data;
    return f().teamSlug, useProjectBranches(null == g ? void 0 : g.id).data, a(b, {
    });
};
