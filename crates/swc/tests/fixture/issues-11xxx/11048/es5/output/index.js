import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _to_array } from "@swc/helpers/_/_to_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function fetchResource() {
    return _async_to_generator(function() {
        var data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    data = [
                        "John",
                        ,
                        25,
                        "Developer",
                        "California"
                    ];
                    return [
                        4,
                        new Promise(function(resolve) {
                            return setTimeout(resolve, 500);
                        })
                    ];
                case 1:
                    _state.sent();
                    return [
                        2,
                        data
                    ];
            }
        });
    })();
}
function func1() {
    return new Promise(function(resolve, reject) {
        return _async_to_generator(function() {
            var resource, _resource, firstName, tmp, middleName, age, rest, result;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            fetchResource()
                        ];
                    case 1:
                        resource = _state.sent();
                        _resource = _to_array(resource), firstName = _resource[0], tmp = _resource[1], middleName = tmp === void 0 ? "N/A" : tmp, age = _resource[2], rest = _resource.slice(3);
                        result = (function() {
                            if (firstName) {
                                return {
                                    firstName: firstName,
                                    middleName: middleName,
                                    age: age,
                                    occupation: rest[0],
                                    location: rest[1]
                                };
                            } else {
                                return {
                                    error: "Failed to fetch resource"
                                };
                            }
                        })();
                        resolve(result);
                        return [
                            2
                        ];
                }
            });
        })();
    });
}
function main() {
    return _async_to_generator(function() {
        var res;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        func1()
                    ];
                case 1:
                    res = _state.sent();
                    console.log(res);
                    return [
                        2
                    ];
            }
        });
    })();
}
main();
