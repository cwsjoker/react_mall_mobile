import React, { Component } from 'react';
import Header from '../../components/header/Header'
import Tab from '../../components/tab/Tab'
import $home_api from '../../fetch/api/home.js'

const Home = class Home extends Component {

    componentDidMount() {
        // 每日精选
        $home_api.getDailyList().then(async res => {
            if (res) {
                console.log(res);
                // const data = await changeUsdt(res.data.data);
                // this.setState({
                //     daily_list: data,
                //     daily_spinning: false
                // })
            }
        })
    }

    render() {
        return (
            <div>
               <Header />
               <Tab />
            </div>
        )
    }
}

export default Home;