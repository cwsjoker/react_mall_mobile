import React, { Component } from 'react';
import { Link }  from 'react-router-dom';
// import { List, InputItem, WhiteSpace } from 'antd-mobile';
// import { createForm } from 'rc-form';

import './login.scss';
import logo from '../../assets/images/logo.png';

class Login extends Component {
    render() {
        // const { getFieldProps } = this.props.form;
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
                        <input type="number" placeholder="请输入手机号码" />
                    </div>
                    <div className="input-item">
                        <input type="password" placeholder="密码" />
                    </div>
                </div>
                <div className="login-submit">登录</div>
                <div className="login-footer">
                    您还不是bttmall用户?
                    <Link to={'/register'}>立即注册</Link>
                </div>
            </div>
        )
    }
}

// export default createForm()(Login);
export default Login;