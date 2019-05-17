import React, { Component } from 'react';
import Cookie from 'js-cookie';
import { withRouter } from 'react-router';
import $ from  'jquery'
import QRCode from 'qrcodejs2'
import { Toast } from 'antd-mobile';
import html2canvas from 'html2canvas';

import './promote.scss';

class Promote extends Component {
    constructor() {
        super();
        this.state = {
            recommendCode: '',
            totalPromotionNum: 0,
            totalAward: 0,
            totalRealAward: 0,
            recommend_list: [
                // {
                //     create_time: '2019-05-14 11:39:20',
                //     promoter_name: '134****2222',
                //     award: '50',
                //     status: '0'
                // }, {
                //     create_time: '2019-05-14 11:39:20',
                //     promoter_name: '134****2222',
                //     award: '50',
                //     status: '1'
                // }
            ],
            show_modal: false
        }
    }
    componentDidMount() {
        // if (!(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))) {
        //     // window.location.href = 'https://bttmall.com/IGO';
        // }

        // 是否登录
        const username = Cookie.get('username');
        if (username) {
            // 获取推荐码  
            // $.get('https://bttmall.com/promoterCode?mobile=' + username, (res) => {
            // $.get('http://192.168.2.134/promoterCode?mobile=' + username, (res) => {
            // $.get(window.location.origin + '/promoterCode?mobile=' + username, (res) => {
            $.get(window.BTTMALL_API + '/promoterCode?mobile=' + username, (res) => {
                let code = '';
                if (res.success && res.data) {
                    code = res.data;
                }
                this.setState({
                    recommendCode: window.BTTMALL_API + '/mobile/#/register?code=' + code
                }, () => {
                    new QRCode(document.getElementById("qrcode"), {
                        text: this.state.recommendCode,
                        width: 100,
                        height: 100,
                    })
                })
            })
            // // 获取列表
            // $.get('https://bttmall.com/promoterList?mobile=' + username, (res) => {
            // $.get('http://192.168.2.134/promoterList?mobile=' + username, (res) => {
            // $.get(window.location.origin + '/promoterList?mobile=' + username, (res) => {
            $.get(window.BTTMALL_API + '/promoterList?mobile=' + username, (res) => {
                if (res.success) {
                    const { pagination, rows } = res.data;
                    this.setState({
                        totalPromotionNum: pagination.totalPromotionNum,
                        totalAward: pagination.totalAward,
                        totalRealAward: pagination.totalRealAward,
                        recommend_list: rows
                    })
                }
            })
        } else {
            this.props.history.push('/login');
        }
    }
    // 复制链接
    copyRecommend(e) {
        e.preventDefault();
        const recommendCode = document.getElementById("recommendCode");
        recommendCode.select();
        document.execCommand("Copy");
        Toast.success('复制成功', 1);
    }
    // 弹出二维码
    openModal(e) {
        e.preventDefault();
        this.setState({show_modal: true}, () => {
            new QRCode(document.getElementById("qrcode_modal"), {
                text: this.state.recommendCode,
                width: 80,
                height: 80,
            })

            // 转化为图片
            html2canvas(document.querySelector("#promote_bg")).then((canvas) => {
                let imgData = canvas.toDataURL()
                let img = document.createElement('img')
                img.src = imgData
                document.querySelector('#promote_bg_box').appendChild(img);
            });
        })
    }
    render() {
        const { recommendCode, recommend_list, show_modal, totalPromotionNum, totalAward, totalRealAward } = this.state;
        return (
            <div className="promotePage">
                {/* 遮罩层 */}
                {
                    show_modal ? (
                        <div className="promote-cover" onClick={() => this.setState({show_modal: false})}></div>
                    ) : null
                }
                {
                    show_modal ? (
                        <div className="promote-modal" id="promote_bg_box">
                            <div className="promote-modal-html" id="promote_bg">
                                <div className="promote-modal-main">
                                    {/* <h4>全球首个数字资产交易及跨境电商创新交易平</h4> */}
                                    <div className="promote-modal-bg1"></div>
                                    <div className="promote-modal-bg2"></div>
                                    <div className="qrcode-modal" id="qrcode_modal"></div>
                                    <p style={{'marginTop': 10}}>扫码成为种子用户</p>
                                    <p>享受平台至尊福利</p>
                                </div>
                            </div>
                            <div className="promote-modal-footer">[长按保存图片]</div>
                        </div>
                    ) : null
                }
                <div className="reback"><a href="https://bttmall.com/">{`<< 交易所`}</a></div>
                <div className="code-main">
                    <div className="code-box" id="qrcode"></div>
                </div>
                <p className="p1">转发二维码邀请好友</p>
                <div className="show-modal-btn" onClick={this.openModal.bind(this)}>点击分享</div>
                <div className="f-title"></div>
                <div className="warm-tip">
                    <h3>温馨提示</h3>
                    <p>1.好友需要注册成功并通过平台KYC认证；</p>
                    <p>2.A用户推荐B用户，B用户推荐C用户，如果C用户通过KYC认证，A用户可得10BT佣金，B用户可获得20BT佣金；</p>
                    <p>3.活动奖励总量为500万枚，送完即止；</p>
                    <p>4.活动的推荐关系永久有效，将适用于未来商城的购物挖矿分利活动；</p>
                    <p>5.如有任何恶意刷币行为，一经查实所得奖励将不予兑现，BTTMALL对邀请活动保留最终解释权。</p>
                    {/* <p>如有任何疑问，敬请咨询<a href="https://bttmall.com/">Bttmall.com</a> QQ官方8群（群号：558476400）。</p> */}
                </div>
                <div className="code-copy">
                    <h3>我的邀请方式</h3>
                    <div className="code-copy-inp">
                        <input className="code-txt" id="recommendCode" value={recommendCode} readOnly="readonly"></input>
                        <button onClick={this.copyRecommend.bind(this)}>复制链接</button>
                    </div>
                </div>
                <div className="p-info-main">
                    <div>
                        <span>邀请人数</span>
                        <span>{totalPromotionNum}</span>
                    </div>
                    <div>
                        <span>总佣金</span>
                        <span>{totalAward}</span>
                    </div>
                    <div>
                        <span>有效佣金</span>
                        <span>{totalRealAward}</span>
                    </div>
                </div>
                <div className="p-table-main">
                    <h3>邀请记录</h3>
                    <div className="table-title">
                        <span>时间</span>
                        <span>邀请人</span>
                        <span>奖励</span>
                        <span>KYC状态</span>
                    </div>
                    <div className="table-body">
                    {
                        recommend_list.length !== 0 ? (
                            recommend_list.map((item, index) => {
                                return (
                                    <div className="t-item" key={index}>
                                        <span>{item.createTime}</span>
                                        <span>{item.promoterName}</span>
                                        <span>+ {item.award}</span>
                                        {
                                            item.status == '0' ? (
                                                <span className="red">未审核</span>
                                            ) : item.status == '1' ? (
                                                <span>审核通过</span>
                                            ) : item.status == '2' ? (
                                                <span className="red">正在审核</span>
                                            ) : item.status == '3' ? (
                                                <span className="red">审核失败</span>
                                            ) : null
                                        }
                                    </div>
                                )
                            })
                        ) : (
                            <div className="nodata">暂无数据</div>
                        )
                    }
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Promote);