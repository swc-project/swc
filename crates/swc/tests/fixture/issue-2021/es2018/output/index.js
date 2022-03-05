import * as swcHelpers from "@swc/helpers";
class Item extends Component {
    constructor(props){
        super(props);
        swcHelpers.defineProperty(this, "input", this.props.item);
    }
}
