var _data_filter_map, _object, _data_filter;
const result = (_object = data) === null || _object === void 0 ? void 0 : (_data_filter_map = ((_data_filter = _object.filter) === null || _data_filter === void 0 ? void 0 : _data_filter.call(_object, (item)=>Math.random() > 0.5)).map) === null || _data_filter_map === void 0 ? void 0 : _data_filter_map.call(_object, (item)=>JSON.stringify(item));
