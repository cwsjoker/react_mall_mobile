import React, { Component } from 'react';
import Carousels from '../../components/carousel/Carousel';
import './shopcart.scss';

const ShopCart = class ShopCart extends Component {
    render() {
        return (
            <div  className="shopcartlist">
                  <Carousels />
                  <div className="shoplist">
                    <div className="shoplist_1">
                        <div className="shoplist_1_1"></div>
                        <div className="shoplist_1_2"></div>
                    </div>
                    <div className="shoplist_2">华为 HUAWEI P20 Pro 全面屏徕卡三摄游戏手机全网通移动联通电信4G手机 双卡双待</div>
                    <div className="shoplist_3">
                        <div className="shoplist_1_3"></div>
                        <div className="shoplist_1_4"></div>
                    </div>
                  
                  </div>
            </div>
        )
    }
}

export default ShopCart;