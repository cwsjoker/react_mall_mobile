import React, { Component } from 'react'
import { Link }  from 'react-router-dom'
import Header from '../../components/header/Header'
import Menu from '../../components/menu/Menu'
import $home_api from '../../fetch/api/home'
import $user_api from '../../fetch/api/user'
import { getQueryString } from '../../utils/operLocation.js'
import changeUsdt from '../../utils/convertUsdt'
import Cookie from 'js-cookie';
import './storeIndex.scss'

const StoreIndex = class StoreIndex extends Component {
    constructor() {
        super();
        this.state = {
            storeIndex: '',
            produceList: [],
            storeInfo: {},
            symbol: '',
            available: 0,
            storeNimingInfo: {},
            flag: '',
            sort: 'asc'
        }
    }
    componentDidMount() {
        const id = getQueryString(this.props.location.search).id;
        if (id) {
            this.setState({
                storeIndex: id
            }, () => {
                this.getList();
            })
        }
    }
    changeOrderType(value) {
        const { flag, sort } = this.state;
        if (flag === value) {
            if (value !== '') {
                const sort_key = sort === 'asc' ? 'desc' : 'asc';
                this.setState({
                    sort: sort_key
                }, () => {
                    // this.getList();
                })
            }
        } else {
            this.setState({
                flag: value,
                sort: 'asc'
            }, () => {
                // this.getList();
            })
        }
    }
    async getList() {
        const { storeIndex } = this.state;
        let [res_produce, res_store, res_niming] = await Promise.all([
            $home_api.getProduceList({producerId: storeIndex}),
            $home_api.getStoreInfo({'producerId': storeIndex}),
            $home_api.getStoreNimingInfo({'producerId': storeIndex})
        ])

        // 获取商品列表
        if (res_produce) {
            const data = await changeUsdt(res_produce.data.data)
            console.log(data);
            this.setState({
                produceList: data
            })
        }

        // 获取店铺的信息
        if (res_store) {
            const { data } = res_store.data;
            this.setState({
                storeInfo: data,
                symbol: data.symbol,
            })
            // // 获取当前剩额
            if (Cookie.get('token')) {
                let res_blance = await $user_api.getUserFinance({coinSymbol: data.symbol})
                if (res_blance &&　res_blance.data.data) {
                    this.setState({
                        available: res_blance.data.data.available,
                    })
                }
            }
        }

        // 挖矿
        if (res_niming) {
            this.setState({
                storeNimingInfo: res_niming.data.data[0]
            })
        }
    }
    render() {
        const {
            produceList,
            storeInfo: { logoUrl, name},
            available,
            symbol,
            storeNimingInfo: {turnover, dailyMined, remaining, yesterdayBurnt},
            flag
        } = this.state;
        return (
            <div className="storeIndexPage">
               <Header />
               <Menu />
               <div className="store-title-box">
                    <div className="store-title-info">
                        <div>
                            <img src={window.BACK_URL + logoUrl} />
                        </div>
                        <div>
                            <div className="info-name">
                                {name}
                                <span>官方直营</span>
                            </div>
                            {
                                available ? (
                                    <div className="info-blance">我的余额：<span>{available + symbol}</span></div>
                                ) : null
                            }
                        </div>
                    </div>
                    <div className="store-title-data">
                        <div>
                            <span>流通总量:</span>
                            <span style={{'color': '#589065'}}>{(turnover || 0) + ' ' + symbol}</span>
                        </div>
                        <div>
                            <span>今日已产出:</span>
                            <span style={{'color': '#AE4E54'}}>{(dailyMined || 0) + ' ' + symbol}</span>
                        </div>
                        <div>
                            <span>明日待产出:</span>
                            <span style={{'color': '#AE4E54'}}>{(remaining || 0) + ' ' + symbol}</span>
                        </div>
                        <div>
                            <span>昨日已销毁:</span>
                            <span style={{'color': '#9B9B9B'}}>{(yesterdayBurnt || 0) + ' ' + symbol}</span>
                        </div>
                    </div>
               </div>
               <div className="store-main-box">
                    <div className="store-search">
                        <input placeholder="搜索" />
                    </div>
                    <div className="store-tab">
                            <div className={flag === '' ? 'on' : ''} onClick={this.changeOrderType.bind(this, '')}>综合</div>
                            <div className={flag === 'sales' ? 'on' : ''} onClick={this.changeOrderType.bind(this, 'sales')}>销量</div>
                            <div className={flag === 'price' ? 'on' : ''} onClick={this.changeOrderType.bind(this, 'price')}>价格</div>
                    </div>
                    <div className="store-list">
                        {
                            produceList.map(item =>{
                                return (
                                    <div className="store-list-item" key={item.id}>
                                        <Link to={`/goodsDetail?goodsId=${item.id}`}>
                                            <div className="item-img">
                                                <img  src={window.BACK_URL + item.imageUrl} alt="" />
                                            </div>
                                            <div className="item-info">
                                                <div>
                                                    <span>官方直营</span>
                                                    {item.name}
                                                </div>
                                                <div>{item.inventoryIntroduce}</div>
                                                <div>
                                                    {item.price + ' ' + item.symbol}
                                                    {
                                                        Number(item.change_price_usdt) ? <span>≈{item.change_price_usdt}USDT</span> : null
                                                    }
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })
                        }
                    </div>
               </div>
            </div>
        )
    }
}

export default StoreIndex;