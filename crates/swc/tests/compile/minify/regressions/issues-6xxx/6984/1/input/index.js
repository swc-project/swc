
import React from 'react'
import { withRouter } from 'react-router-dom'

export default
@withRouter
class App extends React.Component {
    render() {
        console.log(this.props)
        return <div>134</div>
    }
}