"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _define_property = require("@swc/helpers/lib/_define_property.js").default;
class Item extends Component {
    constructor(props){
        super(props);
        _define_property(this, "input", this.props.item);
    }
}
