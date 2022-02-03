"use strict";
jest.mock('../LanguageStore', ()=>{
    const language = "en";
    const stringsMock = {
        setLanguage: jest.fn()
    };
    const mockSetLanguage = jest.fn();
    return ()=>({
            language,
            strings: stringsMock,
            setLanguage: mockSetLanguage
        })
    ;
});
var _reactNative = require("react-native");
var _react = _interopRequireDefault(require("react"));
var _enzyme = require("enzyme");
var _connectJs = _interopRequireDefault(require("../connect.js"));
var _languageProvider = _interopRequireDefault(require("../LanguageProvider"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
it('renders correctly', ()=>{
    const TestComponent = (0, _connectJs).default(Test);
    const strings = {
        test: 'Test'
    };
    const wrapper = (0, _enzyme).shallow(/*#__PURE__*/ _react.default.createElement(_languageProvider.default, {
        strings: strings,
        language: "en"
    }, /*#__PURE__*/ _react.default.createElement(Test, null)));
    expect(wrapper.get(0)).toMatchSnapshot();
});
class Test extends _react.default.Component {
    render() {
        return(/*#__PURE__*/ _react.default.createElement(_reactNative.View, null));
    }
    constructor(props){
        super(props);
    }
}
