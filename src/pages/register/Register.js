import React, { Component } from 'react';
import { Link }  from 'react-router-dom';
import { withRouter } from 'react-router';
import { Toast } from 'antd-mobile';
import mMd5 from '../../utils/module_md5.js';
import $ from  'jquery'

import './register.scss';

class Register extends Component {
    constructor() {
        super()
        this.state = {
            userName: '',
            password: '',
            mobileCode: '',
            tradePwd: '',
            isCode: false,
            isMobileCode: false,
            validate: '',
            captchaIns: null,
            isShowPws: false,
            isShowTradePwd: false
        }
    }
    componentDidMount() {
        if (!(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))) {
            window.location.href = 'https://bttmall.com/register';
        }
        const that = this;
        window.initNECaptcha({
            // config对象，参数配置
            captchaId: '87cc815627084c41bb8cb582e9378997',
            element: '#captcha',
            mode: 'float',
            width: '100%',
            onVerify: function (err, data) {
                if(err!=null){
                    // 验证失败
                    that.setState({
                        isCode: false
                    })
                }else{
                    // 验证成功
                    that.setState({
                        isCode: true,
                        validate: data.validate
                    })
                }
            }
        }, function  onload (instance) {
            that.setState({
                captchaIns: instance
            })
            // 初始化成功后得到验证实例instance，可以调用实例的方法
        }, function  onerror (err) {
            // 初始化失败后触发该函数，err对象描述当前错误信息
        })
    }
    // 获取手机验证码
    getCode(e) {
        e.preventDefault();
        const { userName, isCode, validate } = this.state;
        if (isCode) {
            if (userName.trim() === '') {
                Toast.fail('手机号码不能为空', 1.5);
            } else {
                if(!(/^1\d{10}$/.test(userName))){ 
                    Toast.fail('请输入正确的手机号', 1.5);
                    return;
                } else {
                    $.get('https://bttmall.com/sendCode?mobile=' + userName + '&validate=' + validate + '&areaCode=86', (res) => {
                        if (res.success) {
                            Toast.success('短信验证码已发送', 1.5);
                        } else {
                            Toast.fail(res.msg, 1.5);
                            this.setState({
                                isCode: false,
                                validate: '',
                            }, () => {
                                this.state.captchaIns.refresh();
                            })
                        }
                    })
                }
            }
        } else {
            Toast.fail('请验证图形验证码', 1.5);
        }
    }
    // 注册
    register(e) {
        e.preventDefault();
        const { isCode, userName, password, tradePwd, mobileCode, validate } = this.state;
        if (isCode) {
            if (userName.trim() === '') {
                Toast.fail('手机号不能为空', 1.5);
                return;
            }
            if(!(/^1\d{10}$/.test(userName))) {
                Toast.fail('请输入正确的手机号', 1.5);
                return;
            }
            if (password.trim() === '') {
                Toast.fail('密码不能为空', 1.5);
                return;
            }
            if (!(/\d[a-zA-Z]|[a-zA-Z]\d/.test(password.trim()))) {
                Toast.fail('密码为6-20位的字母与数字组成', 1.5);
                return;
            }
            if (tradePwd.trim() === '') {
                Toast.fail('交易密码不能为空', 1.5);
                return;
            }
            if (!(/^\d{6}$/.test(tradePwd.trim()))) {
                Toast.fail('交易密码必须6位纯数字', 1.5);
                return;
            }
            if (mobileCode.trim() === '') {
                Toast.fail('验证码不能为空', 1.5);
                return;
            }
            Toast.loading('正在登录', 0);
            $.post('https://bttmall.com/reg', {
                areaCode: 86,
                userName: Number(userName),
                password: mMd5.hbmd5(password),
                tradePwd: mMd5.hbmd5(tradePwd),
                NECaptchaValidate: validate,
                mobileCode: Number(mobileCode)
            }, (res) => {
                if (res.success) {
                    Toast.hide();
                    Toast.success('注册成功', 1.5, () => {
                        this.props.history.push('/login');
                    });
                } else {
                    Toast.hide();
                    Toast.fail(res.msg, 1.5);
                    this.setState({
                        isCode: false,
                        validate: '',
                    }, () => {
                        this.state.captchaIns.refresh();
                    })
                }
            })
        } else {
            Toast.fail('请验证图形验证码', 1.5);
        }
    }
    onChangeUserName(e) {
        e.preventDefault();
        if ((/[0-9]$/.test(e.target.value)) || e.target.value === '') {
            this.setState({
                userName: e.target.value
            })
        } else {
            Toast.fail('只能输入数字', 0.7)
        }
    }
    onChangePassword(e) {
        e.preventDefault();
        this.setState({
            password: e.target.value
        })
    }
    onChangeTradePwd(e) {
        e.preventDefault();
        if ((/[0-9]$/.test(e.target.value)) || e.target.value === '') {
            this.setState({
                tradePwd: e.target.value
            })
        } else {
            Toast.fail('只能输入数字', 0.7)
        }
    }
    onChangeMobileCode(e) {
        e.preventDefault();
        if ((/[0-9]$/.test(e.target.value)) || e.target.value === '') {
            this.setState({
                mobileCode: e.target.value
            })
        } else {
            Toast.fail('只能输入数字', 0.7)
        }
    }
    changeShowPwd(e) {
        e.preventDefault();
        this.setState({
            isShowPws: !this.state.isShowPws
        })
    }
    changeShowTradePwd(e) {
        e.preventDefault();
        this.setState({
            isShowTradePwd: !this.state.isShowTradePwd
        })
    }
    render() {
        const { userName, password, mobileCode, tradePwd, isShowPws, isShowTradePwd } = this.state;
        return (
            <div className="registerPage">
                <div className="register-logo">
                    <div className="logo">
                        {/* <img src={logo} /> */}
                    </div>
                    <h2>注册</h2>
                </div>
                <div className="register-form">
                    <div className="input-item">
                        <input type="text" placeholder="请输入手机号码" value={userName} onChange={this.onChangeUserName.bind(this)} />
                    </div>
                    <div className="input-item">
                        <input type={isShowPws ? 'text' : 'password'} placeholder="请输入登录密码" autoComplete="off" value={password} onChange={this.onChangePassword.bind(this)} />
                        <i className={isShowPws ? 'on bt-showpwd' : 'off bt-showpwd'} onClick={this.changeShowPwd.bind(this)}></i>
                    </div>
                    <div className="input-tip">至少6位字符，非纯数字</div>
                    <div className="input-item">
                        <input type={isShowTradePwd ? 'text' : 'password'} placeholder="请输入交易密码" autoComplete="off" value={tradePwd} onChange={this.onChangeTradePwd.bind(this)} />
                        <i className={isShowTradePwd ? 'on bt-showpwd' : 'off bt-showpwd'} onClick={this.changeShowTradePwd.bind(this)}></i>
                    </div>
                    <div className="input-tip">用于交易提现，请牢记。不可与登录密码相同</div>
                    <div id="captcha"></div>
                    <div className="input-item input-item-t">
                        <input style={{'paddingRight': '120px'}} type="text" placeholder="短信验证码" value={mobileCode} onChange={this.onChangeMobileCode.bind(this)} />
                        <div className="input-code-btn" onClick={this.getCode.bind(this)}>获取短信验证码</div>
                    </div>
                </div>
                <div className="register-submit" onClick={this.register.bind(this)}>注册</div>
                <div className="login-footer">
                    您已经是bttmall用户?
                    <Link to={'/login'}>立即登录</Link>
                </div>
                <div className="register-footer">
                    <p>1、Bttmall Token(BT)将于5月13日火热发售 </p>
                    <p>2、全新购物即挖矿模式即将陆续开启</p>
                    <p>3、推荐使用PC浏览器访问Bttmall.com</p>
                </div>
            </div>
        )
    }
}

export default withRouter(Register);