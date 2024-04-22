//// [controlFlowBindingElement.ts]
{
    var data = {
        param: 'value'
    };
    var _data_param = data.param, param = _data_param === void 0 ? function() {
        throw new Error('param is not defined');
    }() : _data_param;
    console.log(param); // should not trigger 'Unreachable code detected.'    
}{
    var data1 = {
        param: 'value'
    };
    var foo = "";
    var _data_param1 = data1.param, param1 = _data_param1 === void 0 ? function() {
        throw new Error('param is not defined');
    }() : _data_param1;
    foo; // should be string  
}{
    var data2 = {
        param: 'value'
    };
    var foo1 = "";
    var _data_param2 = data2.param, param2 = _data_param2 === void 0 ? function() {
        foo1 = undefined;
    }() : _data_param2;
    foo1; // should be string | undefined
}{
    var data3 = {
        param: 'value'
    };
    var foo2 = "";
    var _data_param3 = data3.param, param3 = _data_param3 === void 0 ? function() {
        return "" + 1;
    }() : _data_param3;
    foo2; // should be string
}{
    var foo3;
    var window = {};
    window.window = window;
    var _window_ = window[function() {
        foo3 = "";
        return 'window';
    }()], bar = _window_[function() {
        return 'window';
    }()];
    foo3; // should be string
}{
    var foo4;
    var window1 = {};
    window1.window = window1;
    var _window_1 = window1[function() {
        return 'window';
    }()], bar1 = _window_1[function() {
        foo4 = "";
        return 'window';
    }()];
    foo4; // should be string
}{
    var foo5;
    var window2 = {};
    window2.window = window2;
    var _window_2 = window2[function() {
        return 'window';
    }()], tmp = _window_2[function() {
        return 'window';
    }()], bar2 = tmp === void 0 ? function() {
        foo5 = "";
        return window2;
    }() : tmp;
    foo5; // should be string | undefined
}
