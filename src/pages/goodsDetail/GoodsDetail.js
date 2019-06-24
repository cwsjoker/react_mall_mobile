import React, { Component } from 'react';
import { Link }  from 'react-router-dom';
import { Carousel, Icon, Toast } from 'antd-mobile';
import $home_api from '../../fetch/api/home.js';
// import changeUsdt from '../../utils/convertUsdt';
import { operateScript, unescapeHTML } from '../../utils/operation.js';
import { getQueryString } from '../../utils/operLocation.js'
// import Tab from '../../components/tab/Tab';
import './goodsdetail.scss';
import default_img from '../../assets/images/logo.png'

const GoodsDetail = class GoodsDetail extends Component {
    constructor() {
        super()
        this.state = {
            goods: {},
            goodsInventory: [],
            keyList: [],
            producerId: '',
            goodsParam: [],
            choose: [],
            goodsInfo_price: {},
            goods_info_img: [],
            change_price_usdt: 0,
            show_modal_buy: false, // 购买，加入购物车
            buy_type: '', // 购买类型
            storeInfo: {},
            // nimingInfo: {}
            shopCart_len: 0
        }
    }
    async  componentDidMount() {
        this.onShopCartNum();
        const { goodsId } = getQueryString(this.props.location.search);
        console.log(goodsId);
        if (goodsId) {
            const goodsDetail_res = await $home_api.getGoodsDetail({'goodsId': goodsId});
            if (goodsDetail_res) {
                const { goods, goodsInventory, keyList } = goodsDetail_res.data.data;
                const { producerId } = goods;
                this.setState({
                    goods: goods,
                    goodsInventory: goodsInventory || [],
                    keyList: keyList || [],
                    goodsParam: JSON.parse(goods.goodsParam),
                });

                // 初始化默认选择第一个配置,
                if (keyList && keyList.length !== 0) {
                    const choose_list = keyList.map(item => {
                        return goodsInventory[item][0]['id'];
                    })
                    this.setState({
                        choose: choose_list,
                    }, () => {
                        this.getForByGoodsPrice(goodsId);
                    })
                } else {
                    this.getForByGoodsPrice(goodsId);
                }

                // 商铺详情    挖矿详情
                const [storeInfo_res] = await Promise.all([
                    $home_api.getStoreInfo({'producerId': producerId}),
                    // $home_api.getDayNiming({'producerId': producerId})
                ]);

                if (storeInfo_res) {
                    // 初始化面包屑数据
                    this.setState({
                        storeInfo: storeInfo_res.data.data,
                    })
                }
                
                // if (niming_res) {
                //     this.setState({
                //         nimingInfo: niming_res.data.data[0]
                //     })
                // }
            }
        }
    }
    // 计算购物车数量
    onShopCartNum() {
        const list = JSON.parse(localStorage.getItem('shopCartList'));
        if (list) {
            this.setState({shopCart_len: list.length})
        }
    }
    // 根据型号查询商品的价格信息
    async getForByGoodsPrice(goodsId) {
        const propertyGroup = this.state.choose.join(',');
        let query = {}
        if (propertyGroup !== '') {
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
            this.setState({
                goodsInfo_price: priceInfo_res.data.data,
                goods_info_img: [priceInfo_res.data.data.smallImageUrl]
            })
            const { price, symbol } = priceInfo_res.data.data;
            this.trnasformUSDT(price, symbol);
        }
    }
    // 切换颜色版本号
    choose_color_model(v) {
        // 选择已经选择的id直接返回
        if (this.state.choose.includes(v.id)) {
            return;
        }
        // // 先获取选择配置位于哪个组别
        let list = [];
        this.state.keyList.forEach(item => {
            this.state.goodsInventory[item].forEach(item1 => {
                if (item1.id === v.id) {
                    list = this.state.goodsInventory[item];
                }
            })
        })
        // // 将该组别的在已选择的全部移除， 并把当前选择加入新配置数组中,更新state后重新请求价格
        let choose_list = this.state.choose;
        list.forEach(item => {
            if (choose_list.includes(item.id)) {
                choose_list.forEach((item1, i) => {
                    if (item1 === item.id) {
                        choose_list.splice(i, 1);
                    }
                })
            }
        })
        choose_list.push(v.id);
        this.setState({
            choose: choose_list
        }, () => {
            const { goodsId } = getQueryString(this.props.location.search);
            this.getForByGoodsPrice(goodsId);
        })
    }
    // 获取币种转未usdt的换算值
    async trnasformUSDT(price, symbol) {
        const usdt_res = await $home_api.getUSDT({coinAmount: price, originalType: symbol});
        if (usdt_res) {
            this.setState({
                change_price_usdt: usdt_res.data.data.targetCoinAmount
            })
        }
    }
    // 加入购物车或者立即购买
    joinShopCart() {
        console.log(this.state.buy_type);
        const buyNowGoodsInforObj = {
            'goodsId': this.state.goods.id, //商品ID
            'producerId': this.state.goods.producerId, //商户ID
            'storeName': this.state.storeInfo.name, //商户名称
            'storeLogo': this.state.storeInfo.logoUrl, //商户logo
            'goodsIntroduce': this.state.goodsInfo_price.introduce, //商品简介
            'goodsNum': this.state.buy_number, //商品数量
            'goodsPrice': this.state.goodsInfo_price.price, //商品价格
            'inventoryid': this.state.goodsInfo_price.id,//库存主键
            'goodsImgUrl': this.state.goodsInfo_price.smallImageUrl, //商品图片
            'propertyGroupGoods': this.state.choose.join(','), //库存类型
            'inventoryGoods': this.state.goodsInfo_price.stock, //库存
            'payWay': '代币支付', //支付方式
            // 'vrepeat': goodsId+inventoryid,//校验重复
            'symbol': this.state.goodsInfo_price.symbol
        };
        if (this.state.buy_type === 'buy') {
            // 立即购买
            const choose_list = [];
            choose_list.push(buyNowGoodsInforObj)
            localStorage.orderList = JSON.stringify(choose_list);
            // this.props.history.push('/confirmOrder');
        } else {
            // 加入购物车
            let list = JSON.parse(localStorage.getItem('shopCartList')) || [];
            // 1.商品id不同  2.id相同类型不同  3.id相同类型相同数量叠加
            let is_goods = false;
            list.forEach(v => {
                if (v.goodsId === buyNowGoodsInforObj.goodsId && v.propertyGroupGoods.split(',').sort().join(',') === buyNowGoodsInforObj.propertyGroupGoods.split(',').sort().join(',')) {
                    // v.goodsNum += buyNowGoodsInforObj.goodsNum;
                    is_goods = true;
                }
            })
            if (!is_goods) {
                list.push(buyNowGoodsInforObj);
            }
            localStorage.setItem('shopCartList', JSON.stringify(list));
            this.onShopCartNum();
            Toast.success('商品已加入购物车');
        }
    }
    render() {
        const { goods_info_img, goods, goodsInfo_price, change_price_usdt, goodsParam, keyList, goodsInventory, choose, show_modal_buy, shopCart_len } = this.state;
        return (
            <div className="goodDetailPage">
                <Carousel
                    autoplay={false}
                    infinite
                    height={450}
                >
                    {
                        goods_info_img.length !== 0 ? (
                            goods_info_img.map(val => (
                                <img
                                    key={val}
                                    src={window.BACK_URL + val}
                                    alt=""
                                    style={{ width: '100%', verticalAlign: 'top' }}
                                />
                            ))
                        ) : (
                            <img
                                key="1"
                                src={default_img}
                                alt=""
                                style={{ width: '100%', verticalAlign: 'top' }}
                            />
                        )
                    }
                </Carousel>
                <div className="goods-info">
                    <div>
                        <span>直营</span>
                        <span>{goods.name}</span>
                        <Link to={'/storeIndex?id=3'}>进店</Link>
                    </div>
                    <div>{goodsInfo_price.introduce}</div>
                    <div>
                        <span>{`${goodsInfo_price.price}${goodsInfo_price.symbol}`}</span>
                        <span>≈{change_price_usdt}USDT</span>
                        <span>销量: {goodsInfo_price.sales}</span>
                    </div>
                </div>
                <div className="goods-detail-box">
                    <div className="goods-param-list">
                        {
                            goodsParam.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <span>{item.key}：</span>{item.value}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="goods-param-detai">
                        <span dangerouslySetInnerHTML={{ __html: unescapeHTML(goods.detail)}}></span>
                    </div>
                </div>
                {/* 购买 加入购物车 */}
                <div className="goods-detail-footer">
                    {/* <Link></Link> */}
                    <Link to={'/shopCart'}>
                        <em>{shopCart_len}</em>
                        购物车
                    </Link>
                    <div onClick={() => this.setState({show_modal_buy: true, buy_type: 'join'})}>加入购物车</div>
                    <div onClick={() => this.setState({show_modal_buy: true, buy_type: 'buy'})}>立即购买</div>
                </div>
                {/* 购买 */}
                {
                    show_modal_buy ? (
                        <div className="goods-buy-box">
                            <div className="goods-buy-main">
                                <div>
                                    <Icon type={`cross`} onClick={() => this.setState({show_modal_buy: false})} />
                                </div>
                                <div className="goods-buy-main-info">
                                    <div>
                                        <img src={window.BACK_URL + goodsInfo_price.smallImageUrl} alt="" />
                                    </div>
                                    <div>
                                        <p>{goodsInfo_price.price + goodsInfo_price.symbol}<span>≈{change_price_usdt}USDT</span></p>
                                        {/* <p>商品编号: 154545</p> */}
                                    </div>
                                </div>
                                <div className="goods-buy-main-type">
                                    {
                                        keyList.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <p>{item}</p>
                                                    <div>
                                                        {
                                                            goodsInventory[item].map((v, i) => {
                                                                return (
                                                                    <span 
                                                                        key={i}
                                                                        className={choose.includes(v.id) ? 'on' : ''}
                                                                        onClick={this.choose_color_model.bind(this, v)}
                                                                    >{v.name}</span>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    <div>
                                        <p>购买方式</p>
                                        <div><span className="on">货币支付</span></div>
                                    </div>
                                </div>
                                <button onClick={this.joinShopCart.bind(this)}>确定</button>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        )
    }
}

export default GoodsDetail;