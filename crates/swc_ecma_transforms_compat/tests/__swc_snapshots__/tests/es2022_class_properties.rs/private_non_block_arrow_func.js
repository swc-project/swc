export default ((param)=>{
    var _props = new WeakMap(), App;
    return App = class App {
        getParam() {
            return param;
        }
    }, _props.set(App, {
        writable: true,
        value: {
            prop1: 'prop1',
            prop2: 'prop2'
        }
    }), App;
});
