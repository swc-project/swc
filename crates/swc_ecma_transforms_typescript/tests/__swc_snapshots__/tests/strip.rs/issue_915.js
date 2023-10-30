var _level = /*#__PURE__*/ new WeakMap(), _handlers = /*#__PURE__*/ new WeakMap(), _loggerName = /*#__PURE__*/ new WeakMap();
export class Logger {
    constructor(loggerName, levelName, options = {}){
        _class_private_field_init(this, _level, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _handlers, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _loggerName, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _loggerName, loggerName);
        _class_private_field_set(this, _level, getLevelByName(levelName));
        _class_private_field_set(this, _handlers, options.handlers || []);
    }
}
