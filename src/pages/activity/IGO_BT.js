import React, { Component } from 'react';
import './igo_bt.scss';

class Igo_bt extends Component {
    componentDidMount() {
        if (!(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))) {
            window.location.href = 'https://bttmall.com/IGO';
        }
    }
    render() {
        return (
            <div className="btPage">
                <h2>IGO细则说明</h2>
                <p>1.每个抢购阶段用户单帐号抢购数量限制为50,000 BT 额度</p>
                <p>例如：当日15:00参与抢购50,000 BT,在当日21:00也可拥有50,000 BT额度 </p>
                <p>2.BT总量为10亿,本次抢购总量为1亿,即总量的10%</p>
                <p>3.抢购总共分为5天10轮，每轮抢购价格位初始价格上涨10%。</p>
                <p>例如：当日BT 15:00价格为0.1USDT</p>
                <p>在21:00价格则为0.1*1.1=0.11USDT</p>
                <p>次日15:00价格为0.1*1.2=0.12USDT</p>
                <p>次日21:00价格为0.1*1.3=0.13USDT</p>
                <div className="bg-main">
                    <p className="tip">详细阶段如下:</p>
                    <div className="table-box">
                        <div className="table-title">
                            <span>发售日期</span>
                            <span>时间</span>
                            <span>总量</span>
                            <span>价格</span>
                        </div>
                        <div className="table-tr">
                            <span>05月13日</span>
                            <span>15:00:00<br />21:00:00</span>
                            <span>10,000,000 <b>BT</b><br />10,000,000 <b>BT</b></span>
                            <span><em>0.10</em> USDT<br /><em>0.11</em> USDT</span>
                        </div>
                        <div className="table-tr">
                            <span>05月14日</span>
                            <span>15:00:00<br />21:00:00</span>
                            <span>10,000,000 <b>BT</b><br />10,000,000 <b>BT</b></span>
                            <span><em>0.12</em> USDT<br /><em>0.13</em> USDT</span>
                        </div>
                        <div className="table-tr">
                            <span>05月15日</span>
                            <span>15:00:00<br />21:00:00</span>
                            <span>10,000,000 <b>BT</b><br />10,000,000 <b>BT</b></span>
                            <span><em>0.14</em> USDT<br /><em>0.15</em> USDT</span>
                        </div>
                        <div className="table-tr">
                            <span>05月16日</span>
                            <span>15:00:00<br />21:00:00</span>
                            <span>10,000,000 <b>BT</b><br />10,000,000 <b>BT</b></span>
                            <span><em>0.16</em> USDT<br /><em>0.17</em> USDT</span>
                        </div>
                        <div className="table-tr">
                            <span>05月17日</span>
                            <span>15:00:00<br />21:00:00</span>
                            <span>10,000,000 <b>BT</b><br />10,000,000 <b>BT</b></span>
                            <span><em>0.18</em> USDT<br /><em>0.19</em> USDT</span>
                        </div>
                        <div className="table-tr">
                            <span>05月18日</span>
                            <span style={{'lineHeight': '34px'}}>15:00:00</span>
                            <span style={{'lineHeight': '34px'}}>开放交易</span>
                            <span style={{'lineHeight': '34px'}}><em>0.2</em> USDT</span>
                        </div>
                    </div>
                    <div className="table-footer">
                        <div className="table-footer-box">
                            <p>*BT抢购的发售初始价格为0.1USDT，抢购仅限使用USDT进行</p>
                            <p>*用户可以充值BTC,ETH,USDT;BTC和ETH可以在平台兑换为USDT</p>
                            <p>*本次发售无任何锁仓以及限制。用户在每个阶段参与抢购同时也可卖出</p>
                            <p>*BT可参与商城产品通证的发售以及参与购物即挖矿等商城活动</p>
                        </div>
                    </div>
                </div>
                <div className="active-footer">
                    <p>Bttmall Token(BT)抢购地址（仅支持Web访问，请使用PC浏览器参与）：</p>
                    <a href="https://bttmall.com/">https://bttmall.com/</a>
                </div>
            </div>
        )
    }
}

export default Igo_bt;