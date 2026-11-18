import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { useRouter } from "next/router";
import { useProject } from "@swr/use-project";
import useTeam from "@swr/use-team";
export default function MyComp() {
    var _useRouter_query = useRouter().query, projectName = _useRouter_query.project;
    var _useProject = useProject(projectName), projectInfo = _useProject.data;
    var teamSlug = useTeam().teamSlug;
    var projectId = projectInfo === null || projectInfo === void 0 ? void 0 : projectInfo.id;
    var _useProjectBranches = useProjectBranches(projectId), branches = _useProjectBranches.data;
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
