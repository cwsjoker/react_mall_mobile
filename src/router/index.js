import * as React from 'react';
import { Route, Switch }  from 'react-router-dom';

import Home from '../pages/home/Home' // 首页
import ShopCart  from '../pages/shopCart/ShopCart' // 购物车页面
import GoodsDetail  from '../pages/goodsDetail/GoodsDetail' // 商品详情
import StoreIndex from '../pages/storeIndex/StoreIndex' // 店铺

export default () => {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/storeIndex" component={StoreIndex} />
            <Route path="/shopCart" component={ShopCart} />
            <Route path="/goodsDetail" component={GoodsDetail} />
        </Switch>
    )
}