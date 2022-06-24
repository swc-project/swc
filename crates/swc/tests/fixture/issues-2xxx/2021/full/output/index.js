"use strict";
const _defineProperty = require("@swc/helpers/lib/_define_property.js").default;
class Item extends Component {
    constructor(props){
        super(props);
        _defineProperty(this, "input", this.props.item);
    }
}
