import React, { Component } from 'react';
import { SwipeAction } from 'antd-mobile';
import $home_api from '../../fetch/api/home';

import './shopcart.scss';
import default_img from '../../assets/images/logo.png'
import store_icon_default from '../../assets/images/store_icon_default.png'

const ShopCart = class ShopCart extends Component {
    constructor() {
        super();
        this.state = {
            shop_list: []
        }
    }
    componentDidMount() {
        const list_str = localStorage.getItem('shopCartList');
        if ( list_str ) {
            // this.updateGoodsPrice();
            const store_list = [];
            JSON.parse(list_str).forEach(v => {
                v['is_choose'] = false;
                const find_index = store_list.findIndex(k => {
                    return v.storeName === k.storeName;
                })
                if (find_index === -1) {
                    store_list.push({
                        is_choose: false,
                        storeName: v.storeName,
                        storeLogo: v.storeLogo || '',
                        producerId: v.producerId,
                        goods_account: 0,
                        goods_price: 0,
                        symbol: v.symbol,
                        list: [v]
                    })
                } else {
                    store_list[find_index]['list'].push(v);
                }
            })
            this.setState({
                shop_list: store_list
            })
        }
    }
    // 更新购物车的商品价格
    updateGoodsPrice() {
        const list_str = localStorage.getItem('shopCartList');
        if (list_str) {
            const list = JSON.parse(list_str);
            const promises = list.map(v => {
                return this.getForByGoodsPrice(v.goodsId, v.propertyGroupGoods);
            })
            Promise.all(promises).then(price_list => {
                const list = JSON.parse(localStorage.getItem('shopCartList'));
                price_list.forEach(v => {
                    list.forEach(k => {
                        if (v.goodsId === k.goodsId && v.propertyGroup && k.propertyGroupGoods) {
                            k['goodsPrice'] = v.price
                        }
                    })
                })
                const store_list = [];
                list.forEach(v => {
                    v['is_choose'] = false;
                    const find_index = store_list.findIndex(k => {
                        return v.storeName === k.storeName;
                    })
                    if (find_index === -1) {
                        store_list.push({
                            is_choose: false,
                            storeName: v.storeName,
                            producerId: v.producerId,
                            goods_account: 0,
                            goods_price: 0,
                            symbol: v.symbol,
                            list: [v]
                        })
                    } else {
                        store_list[find_index]['list'].push(v);
                    }
                })
                this.setState({
                    shop_list: store_list
                })
                localStorage.setItem('shopCartList', JSON.stringify(list));
            }).catch(error => {
                console.log(error);
                const list = JSON.parse(localStorage.getItem('shopCartList'));
                const store_list = [];
                list.forEach(v => {
                    v['is_choose'] = false;
                    const find_index = store_list.findIndex(k => {
                        return v.storeName === k.storeName;
                    })
                    if (find_index === -1) {
                        store_list.push({
                            is_choose: false,
                            storeName: v.storeName,
                            producerId: v.producerId,
                            goods_account: 0,
                            goods_price: 0,
                            symbol: v.symbol,
                            list: [v]
                        })
                    } else {
                        store_list[find_index]['list'].push(v);
                    }
                })
                this.setState({
                    shop_list: store_list
                })
            })
        }
    }
    // 根据型号查询商品的价格信息
    async getForByGoodsPrice(goodsId, propertyGroup) {
        let query = {}
        if (propertyGroup) {
            query = {
                'goodsId': goodsId,
                'propertyGroup': propertyGroup
            }
        } else {
            query = {
                'goodsId': goodsId,
            }
        }
        const priceInfo_res = await $home_api.getByGoodsQueryPrice(query)
        if (priceInfo_res) {
            // priceInfo_res.data.data.price = priceInfo_res.data.data.price;
            return priceInfo_res.data.data;
        }
    }
    //删除商品
    deleteBtn(obj){
        console.log(obj);
        // const _this = this;
        // confirm({
        //     title: '确定删除该商品吗？',
        //     onOk() {
                let list = this.state.shop_list;
                list.forEach((v, index) => {
                    if (v.storeName === obj.storeName) {
                        let num = 0;
                        v.list.forEach((k, n) => {
                            if (k.goodsId === obj.goodsId) {
                                num = n;
                            }
                        })
                        v.list.splice(num, 1);
                    }
                    // 选中所有的商品删除
                    if (v.list.length === 0) {
                        list.splice(index, 1);
                    }
                })
                this.setState({
                    shop_list: list
                }, () => {
                    this.reset_price();
                    this.reset_local_cart(obj.goodsId, obj.propertyGroupGoods);
                })      
        //     }
        // })
    }
    // 商品删除处理本地存储
    reset_local_cart(goods_id, propertyGroupGoods) {
        let local_list = JSON.parse(localStorage.shopCartList);
        let list = local_list.filter((v, index) => {
            return v.goodsId !== goods_id || v.propertyGroupGoods !== propertyGroupGoods;
        })
        localStorage.shopCartList = JSON.stringify(list);
        // 更改购物车数量
        // let { dispatch } = this.props;
        // if (list) {
        //     dispatch(setShopCartNum(list.length));
        // }
    }
    // 重新结算订单价格
    reset_price() {
        // 计算价格
        let list = this.state.shop_list;
        list.forEach(v => {
            // 计算单个订单商品总件数
            v.goods_account = v.list.reduce((total, k) => {
                if (k.is_choose) {
                    return total + parseInt(k.goodsNum);
                } else {
                    return total + 0;
                }
            }, 0);

            // 计算单个订单商品总价格
            v.goods_price = v.list.reduce((total, k) => {
                if (k.is_choose) {
                    return total + (parseInt(k.goodsNum) * parseInt(k.goodsPrice));
                } else {
                    return total + 0;
                }
            }, 0);
        })
        this.setState({
            shop_list: list
        })
    }
    render() {
        console.log(this.state.shop_list)
        return (
            <div  className="shopcartlist">
                {
                    this.state.shop_list.length !== 0 ? (
                        this.state.shop_list.map(item => {
                            return (
                                <div className="store-box" key={item.producerId}>
                                    <div className="store-header">
                                        <div></div>
                                        <div>
                                            <img src={item.storeLogo ? window.window.BACK_URL + item.storeLogo : store_icon_default} />
                                            <span>{item.storeName + ' >'}</span>
                                        </div>
                                    </div>
                                    <div className="store-body">
                                        {
                                            item.list.map(v => {
                                                return (
                                                    <SwipeAction
                                                        key={v.propertyGroupGoods}
                                                        style={{ marginBottom: '10px' }}
                                                        autoClose
                                                        right={[
                                                            {
                                                            text: '删除',
                                                            onPress: () => this.deleteBtn(v),
                                                            style: { backgroundColor: '#F4333C', color: 'white' },
                                                            },
                                                        ]}
                                                        onOpen={() => console.log('global open')}
                                                        onClose={() => console.log('global close')}
                                                    >
                                                        <div className="goods-box">
                                                            <div>1</div>
                                                            <div>
                                                                <div className="img-box">
                                                                    <img src={window.window.BACK_URL + v.goodsImgUrl} alt="" />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div>{v.goodsIntroduce}</div>
                                                                <div>
                                                                    <div>{v.goodsPrice + v.symbol}</div>
                                                                    <div><span>1</span></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SwipeAction>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="store-footer">
                                        
                                    </div>
                                </div>
                            )
                        })
                    ) : <div>去购物</div>
                }
            </div>
        )
    }
}

export default ShopCart;