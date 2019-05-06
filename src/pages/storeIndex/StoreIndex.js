import React, { Component } from 'react'
import Header from '../../components/header/Header'
import Menu from '../../components/menu/Menu'
import $home_api from '../../fetch/api/home'
import { getQueryString } from '../../utils/operLocation.js'
import changeUsdt from '../../utils/convertUsdt'
import './storeIndex.scss';

const StoreIndex = class StoreIndex extends Component {
    constructor() {
        super();
        this.state = {
            storeIndex: '',
            produceList: [],
            storeInfo: {},
            symbol: ''
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
            // let res_blance = await $user_api.getUserFinance({coinSymbol: data.symbol})
            // if (res_blance &&　res_blance.data.data) {
            //     this.setState({
            //         available: res_blance.data.data.available,
            //     })
            // }
            // this.setState({
            //     spinning_info: false
            // })
        }
    }
    render() {
        const { produceList, storeInfo } = this.state;
        return (
            <div className="storeIndexPage">
               <Header />
               <Menu />
               <div className="store-title-box">
                    <div className="store-title-info">
                        <div>
                            <img src={window.BACK_URL + storeInfo.logoUrl} />
                        </div>
                        <div>2</div>
                    </div>
                    <div className="store-totle-data"></div>
               </div>
               <div className="store-main-box">
                    <div className="store-tab">

                    </div>
                    <div className="store-list">
                        {
                            produceList.map(item =>{
                                return (
                                    <div className="store-list-item" key={item.id}>
                                        <div className="item-img">
                                            <img  src={window.BACK_URL + item.imageUrl} alt="" />
                                        </div>
                                        <div className="item-info">
                                            <div>{item.name}</div>
                                            <div>{item.inventoryIntroduce}</div>
                                            <div>{item.price + ' ' + item.symbol}</div>
                                        </div>
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