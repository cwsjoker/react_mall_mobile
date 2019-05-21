import React, { Component } from 'react';
import $home_api from '../../fetch/api/home.js';
import changeUsdt from '../../utils/convertUsdt';
import Tab from '../../components/tab/Tab';
import './orderDetail.scss';

const OrderDetail = class OrderDetail extends Component {
    constructor() {
        super()
        this.state = {
            hot_list: []
        }
    }
    componentDidMount() {
        // 热门推荐
        // $home_api.getHotList().then(async res => {
        //     if (res) {
        //          console.log(res);
        //         const data = await changeUsdt(res.data.data);
        //         this.setState({
        //             hot_list: data
        //             // hot_list_spinning: false
        //         })
        //     }
        // })
    }
    render() {


        return (
            <div className="orderDetailPage">
                <div className="waitpay">
                        <div className="waitpay_1_1">
                            <div className="waitpay_1_1_1">等待支付</div>
                            <div className="waitpay_1_1_2">剩余时间：12:00:00</div>
                        </div>
                    <div className="waitpaylist">
                        <div className="waitpayaddress">
                            <strong><span>王女士</span>  <span>1389292223</span></strong>
                        </div>
                        <div className="waitaddress">
                          <ul>
                              <li><span>地址：</span><span>1389292223</span></li>
                              <li><span>线路、</span><span>1389292223</span></li>
                          </ul>
            
                        </div>
                    </div>
                </div>
                <div className="stroe">
                    <div className="stroe_one">
                        <div className="stroe_one_1"></div>
                        <div className="stroe_one_2"></div>
                    </div>
                    <div className="stroe_two">
                        <div className="stroe_two_1">
                            MMT 官方直营店 >
                        </div>
                      </div>
                      <div className="stroe_two_start">
                            <div className="stroe_two_0">
                                <div className="stroe_two_2">
                                        <div className="stroe_two_2_1"></div>
                                        <div className="stroe_two_2_2">
                                            <div className="stroe_two_2_2_1">戴尔DELL游匣G3烈焰版 17.3英寸游戏笔记本电脑</div>
                                            <div className="stroe_two_2_2_2">
                                                <ul>
                                                    <li>颜色：红色 </li>
                                                    <li>版本：256GB</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                </div>
                <div className="foottitle">
                    <div className="foottitle_1">
                         <div className="foottitle_1_1">
                            <div className="foottitle_1_1_1">
                                <div className="foottitle_1_1_1_1">
                                    <ul>
                                        <li>订单编号：1828128912902901 </li>
                                        <li><input type="button" value="复制"  className="input_name"></input></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="foottitle_2">下单时间：2019-04-08 11:40:10</div>
                        </div>
                    </div>
                    <div className="foottitle_3_222">
                        <div className="foottitle_3">
                        支付方式：货币支付
                        </div>
                    </div>
                    <div className="foottitle_4">
                        <div className="footer_start"></div>
                        <div className="footer_start_st">
                            <div className="footer_start_st_1"></div>
                            <div className="footer_start_st_2"> 
                                <div className="footer_start_st_3"> </div>
                                    <div className="state_footer">取消订单</div>
                                    <div className="state_footer_1">支付</div>    
                            </div>
                      </div>
                    </div>
                </div>
                
                <Tab />
            </div>
        )
    }
}

export default OrderDetail;