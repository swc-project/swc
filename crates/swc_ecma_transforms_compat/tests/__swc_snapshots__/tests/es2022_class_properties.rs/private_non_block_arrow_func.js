export default ((param)=>{
    class App {
        getParam() {
            return param;
        }
    }
    var _props = {
        writable: true,
        value: {
            prop1: 'prop1',
            prop2: 'prop2'
        }
    };
    return App;
});
