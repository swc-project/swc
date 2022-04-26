export function test(list){var cur=list.findIndex(function(p){return 1==p});~cur||(cur=list.findIndex(function(p){return 0!==p}));for(var _i=0;_i<list.length;_i++)cur+=list[_i].value;return cur}
