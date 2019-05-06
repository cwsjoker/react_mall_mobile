import React, { Component } from 'react';

import './register.scss';

class Register extends Component {
    render() {
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
                        <input type="number" placeholder="请输入手机号码" />
                    </div>
                    <div className="input-item">
                        <input type="number" placeholder="请输入登录密码" />
                    </div>
                    <div className="input-tip">至少6位字符，非纯数字</div>
                    <div className="input-item">
                        <input type="number" placeholder="请输入交易密码" />
                    </div>
                    <div className="input-tip">用于提现，请牢记。不可与登录密码相同</div>
                </div>
            </div>
        )
    }
}

export default Register;