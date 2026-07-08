var composeIndicator = function composeIndicator(keynode, logList) {
    var _loop = function(i) {
        var _loop = function(j) {
            var _ref = key_list[j] || {}, abbr = _ref.abbr, show_type = _ref.show_type, id = _ref.id, key_id = _ref.key_id;
            var _ref1 = logList.find(function(i) {
                if (id && i.id) {
                    return i.id === id;
                } else if (key_id && i.key_id) {
                    return i.key_id === key_id;
                }
            }) || {}, pv = _ref1.pv, uv = _ref1.uv;
            pvArr.push({
                pv: pv,
                uv: uv,
                abbr: abbr,
                show_type: show_type
            });
        };
        var _ref = keynode[i] || {}, key_list = _ref.key_list, relation = _ref.relation, name = _ref.name, show_type = _ref.show_type;
        if (!key_list || key_list.length < 1) return "continue";
        var pvArr = [];
        for(var j in key_list)_loop(j);
        var dataList = [];
        for(var l in pvArr){
            var _ref1 = pvArr[l] || {}, pv = _ref1.pv, abbr = _ref1.abbr, show_type1 = _ref1.show_type, uv = _ref1.uv;
            if (Array.isArray(pv)) {
                for(var k in pv){
                    if (!dataList[k]) {
                        if (relation.indexOf(abbr) > -1) {
                            var copyRelation = relation;
                            var data = show_type1 === 1 ? pv[k] : uv[k];
                            var regx = new RegExp("".concat(abbr), "g");
                            copyRelation = copyRelation.replace(regx, data);
                            dataList.push(copyRelation);
                        }
                    } else {
                        if (dataList[k].indexOf(abbr) > -1) {
                            var copyRelation1 = dataList[k];
                            var data1 = show_type1 === 1 ? pv[k] : uv[k];
                            var regx1 = new RegExp("".concat(abbr), "g");
                            copyRelation1 = copyRelation1.replace(regx1, data1);
                            dataList[k] = copyRelation1;
                        }
                    }
                }
            }
        }
        keynode[i].pv = dataList.map(function(i) {
            var calculate = eval(i);
            var val = show_type === 1 ? calculate === Infinity ? 0 : Math.round(calculate) : calculate === Infinity ? 0 : Number((calculate * 100).toFixed(2));
            return isNaN(val) ? 0 : val;
        });
        keynode[i].clicktag = name;
    };
    if (!keynode || keynode.length < 1) return [];
    for(var i in keynode)_loop(i);
    return keynode;
};
