import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link }  from 'react-router-dom';
import { Toast } from 'antd-mobile';
import mMd5 from '../../utils/module_md5.js';
import Cookie from 'js-cookie';

// import axios from '../../fetch/axios1.js';
import $ from  'jquery'

import './login.scss';
// import logo from '../../assets/images/logo.png';

class Login extends Component {
    constructor() {
        super()
        this.state = {
            isCode: false,
            userName: '',
            password: '',
            validate: '',
            captchaIns: null
        }
    }
    componentDidMount() {
        // console.log(document.cookie);
        // console.log(Cookie.get());
        // console.log(Cookie.get('front'));
        if (!(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))) {
            window.location.href = 'https://bttmall.com/login';
        }
        setTimeout(() => {
            // console.log(Cookie.get('front'));
            Cookie.remove('front');
        }, 1000)
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
    login() {
        if (this.state.isCode) {
            const { userName, password, validate } = this.state;
            if (userName.trim() === '' || password.trim() === '') {
                Toast.fail('用户名或密码不能为空', 1.5);
            } else {
                if(!(/^1\d{10}$/.test(userName))){ 
                    Toast.fail('请输入正确的手机号', 1.5);
                } else {
                    Toast.loading('正在登录', 0);
                    $.post('https://bttmall.com/loginCheck', {
                    // $.post('http://192.168.2.134:80/loginCheck', {
                        userName: Number(userName),
                        password: mMd5.hbmd5(password),
                        validate: validate,
                        rememberMe: false
                    }, (res) => {
                        if (res.success) {
                            Toast.hide();
                            Toast.success('登录成功', 1.5, () => {
                                this.props.history.push('/IGO');
                            });
                        } else {
                            Toast.hide();
                            Toast.fail(res.msg, 1.5);
                            this.setState({
                                isCode: false,
                                validate: ''
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
    render() {
        const { userName, password } = this.state;

        return (
            <div className="loginPage">
                <div className="login-logo">
                    <div className="logo">
                        {/* <img src={logo} /> */}
                    </div>
                    <h2>登录</h2>
                </div>
                <div className="login-form">
                    <div className="input-item">
                        <input type="text" placeholder="请输入手机号码" value={userName} onChange={this.onChangeUserName.bind(this)} />
                    </div>
                    <div className="input-item">
                        <input type="password" placeholder="密码" value={password} onChange={this.onChangePassword.bind(this)} />
                    </div>
                </div>
                <div id="captcha"></div>
                <div className="login-submit" onClick={this.login.bind(this)}>登录</div>
                <div className="login-footer">
                    您还不是bttmall用户?
                    <Link to={'/register'}>立即注册</Link>
                </div>
            </div>
        )
    }
}

export default withRouter(Login);