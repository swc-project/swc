let React = require('react');
class FetchUser extends React.Component {
    render() {
        return this.state ? this.props.children(this.state.result) : null;
    }
}
export { };
