import React, { Component } from 'react';
import Routers from '../../router/index';

const Layout = class Layout extends Component {
    componentDidMount() {
        console.log('layout');
    }
    render() {
        return (
            <div className="App">
                <Routers />
            </div>
        )
    }
}

export default Layout;