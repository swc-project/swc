"use strict";
var _definePropertyMjs = require("@swc/helpers/lib/_define_property.js").default;
class Item extends Component {
    constructor(props){
        super(props);
        _definePropertyMjs(this, "input", this.props.item);
    }
}
