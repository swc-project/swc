const taskGroups = {
    parseHTML: {
        id: 'parseHTML',
        label: 'Parse HTML & CSS'
    },
    styleLayout: {
        id: 'styleLayout',
        label: 'Style & Layout'
    }
}, taskNameToGroup = {};
module.exports = {
    taskGroups,
    taskNameToGroup
};
const { taskGroups , taskNameToGroup  } = require('./module.js');
module.exports = class {
    constructor(x, y){}
};
