export default ((param)=>{
    var App = /*#__PURE__*/ function() {
        "use strict";
        function App() {
            _class_call_check(this, App);
        }
        _create_class(App, [
            {
                key: "getParam",
                value: function getParam() {
                    return param;
                }
            }
        ]);
        return App;
    }();
    _define_property(App, "props", {
        prop1: 'prop1',
        prop2: 'prop2'
    });
    return App;
});
