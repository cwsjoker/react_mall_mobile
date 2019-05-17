import React, { Component } from 'react'
import { Link }  from 'react-router-dom';
import $home_api from '../../fetch/api/home.js'
import './menu.scss'

const Menu = class Menu extends Component {
    constructor() {
        super()
        this.state = {
            showBtn: false,
            menuList: []
        }
    }
    componentDidMount() {
        $home_api.getStoreMenu().then(res => {
            if (res) {
                this.setState({
                    menuList: res.data.data
                })
            }
        })
    }
    render() {
        return (
            <div className="menu-component">
                <div className="menu-main">
                    <div className="menu-btn" onClick={() => this.setState({showBtn: true})}></div>
                </div>
                {
                    this.state.showBtn ? (
                        <div>
                            <div className="menu-cover" onClick={() => this.setState({showBtn: false})}>1</div>
                            <div className="menu-sider">
                                <ul>
                                    {
                                        this.state.menuList.map(item => {
                                            return (
                                                <li key={item.producerId}>
                                                    <Link to={'/storeIndex?id=' + item.producerId}>
                                                        <div>
                                                            <img src={item.logo} alt="" />
                                                            <div className="menu-name">{item.NAME}</div>
                                                            <div style={{color: item.percent * 100 >= 80 ? '#d9534f' : '#5cb85c'}}>{(item.percent * 100).toFixed(2)}%</div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        )
    }
}

export default Menu