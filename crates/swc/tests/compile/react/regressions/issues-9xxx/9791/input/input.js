const composeIndicator = (keynode, logList) => {
    if (!keynode || keynode.length < 1) return [];
    for (let i in keynode) {
        const { key_list, relation, name, show_type } = keynode[i] || {};
        if (!key_list || key_list.length < 1) continue;
        const pvArr = [];
        for (let j in key_list) {
            const { abbr, show_type, id, key_id } = key_list[j] || {};
            const { pv, uv } =
                logList.find((i) => {
                    if (id && i.id) {
                        return i.id === id;
                    } else if (key_id && i.key_id) {
                        return i.key_id === key_id;
                    }
                }) || {};
            pvArr.push({
                pv,
                uv,
                abbr,
                show_type,
            });
        }
        const dataList = [];
        for (let l in pvArr) {
            const { pv, abbr, show_type, uv } = pvArr[l] || {};
            if (Array.isArray(pv)) {
                for (let k in pv) {
                    if (!dataList[k]) {
                        if (relation.indexOf(abbr) > -1) {
                            let copyRelation = relation;
                            const data = show_type === 1 ? pv[k] : uv[k];
                            const regx = new RegExp(`${abbr}`, "g");
                            copyRelation = copyRelation.replace(regx, data);
                            dataList.push(copyRelation);
                        }
                    } else {
                        if (dataList[k].indexOf(abbr) > -1) {
                            let copyRelation = dataList[k];
                            const data = show_type === 1 ? pv[k] : uv[k];
                            const regx = new RegExp(`${abbr}`, "g");
                            copyRelation = copyRelation.replace(regx, data);
                            dataList[k] = copyRelation;
                        }
                    }
                }
            }
        }
        keynode[i].pv = dataList.map((i) => {
            const calculate = eval(i);
            const val =
                show_type === 1
                    ? calculate === Infinity
                        ? 0
                        : Math.round(calculate)
                    : calculate === Infinity
                      ? 0
                      : Number((calculate * 100).toFixed(2));
            return isNaN(val) ? 0 : val;
        });
        keynode[i].clicktag = name;
    }
    return keynode;
};
