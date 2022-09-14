import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { useRouter } from "next/router";
import { useProject } from "@swr/use-project";
import useTeam from "@swr/use-team";
export default function MyComp() {
    var _query = useRouter().query, projectName = _query.project;
    var ref = useProject(projectName), projectInfo = ref.data;
    var teamSlug = useTeam().teamSlug;
    var projectId = projectInfo === null || projectInfo === void 0 ? void 0 : projectInfo.id;
    var ref1 = useProjectBranches(projectId), branches = ref1.data;
    return /*#__PURE__*/ _jsx(_Fragment, {});
}
for(var i = 0; i < points.length; i++){
    var point = points[i];
    for(var key_ in keys){
        for(var i1 = 0; i1 < keys[key].length; i1++){
            console.log(i1);
        }
        console.log(i);
    }
}
