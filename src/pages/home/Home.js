import React, { Component } from 'react'
import { withRouter } from 'react-router'
import Header from '../../components/header/Header'
import Tab from '../../components/tab/Tab'
import Menu from '../../components/menu/Menu'
import $home_api from '../../fetch/api/home.js'
import changeUsdt from '../../utils/convertUsdt'

import './home.scss';

const Home = class Home extends Component {
    constructor() {
        super()
        this.state = {
            daily_list: [],
            hot_list: []
        }
    }
    componentDidMount() {
        this.props.history.push('/register');
        // // 每日精选
        // $home_api.getDailyList().then(async res => {
        //     if (res) {
        //         console.log(res);
        //         // const data = await changeUsdt(res.data.data);
        //         const data = res.data.data.slice(0, 4);
        //         this.setState({
        //             daily_list: data
        //             // daily_spinning: false
        //         })
        //     }
        // })

        // // 热门推荐
        // $home_api.getHotList().then(async res => {
        //     if (res) {
        //         const data = await changeUsdt(res.data.data);
        //         this.setState({
        //             hot_list: data
        //             // hot_list_spinning: false
        //         })
        //     }
        // })
    }

    render() {
        const { daily_list, hot_list } = this.state;
        return (
            <div className="homePage">
               <Header />
               <Menu />
                <div className="homePage-main">
                    {/* 每日精选 */}
                    <div className="daily-main">
                        <h2>每日精选</h2>
                        <ul>
                            {
                                daily_list.map(item => {
                                    return (
                                        <li key={item.id}>
                                            <div>
                                                <img src={window.BACK_URL + item.imageUrl} alt="" />
                                            </div>
                                            <div>
                                                <p>{item.goodsName}</p>
                                                <p>{item.price + item.symbol}</p>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    {/* 热门推荐 */}
                    <div className="hot-main">
                        <h2>热门推荐</h2>
                        <ul>
                            {
                                hot_list.map(item => {
                                    return (
                                        <li key={item.id}>
                                            <div>
                                                <img src={window.BACK_URL + item.imageUrl} alt="" />
                                            </div>
                                            <div>
                                                <p>{item.goodsName}</p>
                                                <p>{item.inventoryIntroduce}</p>
                                                <p>
                                                    {item.price} {item.symbol}
                                                    {
                                                        Number(item.change_price_usdt) !== 0 ? <span>≈{item.change_price_usdt}USDT</span> : null
                                                    }
                                                </p>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
               <Tab />
            </div>
        )
    }
}

export default withRouter(Home);