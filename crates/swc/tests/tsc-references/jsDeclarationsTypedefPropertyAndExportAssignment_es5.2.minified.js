import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var taskGroups = {
    parseHTML: {
        id: "parseHTML",
        label: "Parse HTML & CSS"
    },
    styleLayout: {
        id: "styleLayout",
        label: "Style & Layout"
    }
}, taskNameToGroup = {};
module.exports = {
    taskGroups: taskGroups,
    taskNameToGroup: taskNameToGroup
};
var ref = require("./module.js"), taskGroups = ref.taskGroups, taskNameToGroup = ref.taskNameToGroup, MainThreadTasks = function(x, y) {
    "use strict";
    _class_call_check(this, MainThreadTasks);
};
module.exports = MainThreadTasks;
