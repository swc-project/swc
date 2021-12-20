var taskGroups = {
    parseHTML: {
        id: "parseHTML",
        label: "Parse HTML & CSS"
    },
    styleLayout: {
        id: "styleLayout",
        label: "Style & Layout"
    }
}, taskNameToGroup = {
};
module.exports = {
    taskGroups: taskGroups,
    taskNameToGroup: taskNameToGroup
};
var ref = require("./module.js"), taskGroups = ref.taskGroups, taskNameToGroup = ref.taskNameToGroup, MainThreadTasks = function(x, y) {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, MainThreadTasks);
};
module.exports = MainThreadTasks;
