import React, { Component } from 'react';
import { Link }  from 'react-router-dom';
import { Carousel, Icon } from 'antd-mobile';
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
        }
    }
    async  componentDidMount() {
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
            }
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
    joinShopCart(type) {
        
    }
    render() {
        const { goods_info_img, goods, goodsInfo_price, change_price_usdt, goodsParam, keyList, goodsInventory, choose, show_modal_buy } = this.state;
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
                    <div>1</div>
                    <div>2</div>
                    <div onClick={() => this.setState({show_modal_buy: true})}>加入购物车</div>
                    <div onClick={() => this.setState({show_modal_buy: true})}>立即购买</div>
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
                                <button>确定</button>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        )
    }
}

export default GoodsDetail;