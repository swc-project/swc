"use strict";
var _definePropertyMjs = require("@swc/helpers/lib/_define_property.js");
class Item extends Component {
    constructor(props){
        super(props);
        (0, _definePropertyMjs.default)(this, "input", this.props.item);
    }
}
