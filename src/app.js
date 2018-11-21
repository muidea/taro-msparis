import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import Home from './pages/home'
import dva from './utils/dva'
import models from './models'

import './styles/base.scss'


const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();

class App extends Component {

  config = {
    pages: [
      'pages/home/index',
      'pages/user/index',
      'pages/order/index',
      'pages/login/index',
      'pages/addressList/index',
      'pages/addressUpdate/index'
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'magicDRP',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      list: [{
        pagePath: "pages/home/index",
        text: "产品列表",
        iconPath: "./images/tab/home.png",
        selectedIconPath: "./images/tab/home-active.png"
      }, {
        pagePath: "pages/order/index",
        text: "当月订单",
        iconPath: "./images/tab/cart.png",
        selectedIconPath: "./images/tab/cart-active.png"
      },{
        pagePath: "pages/user/index",
        text: "个人中心",
        iconPath: "./images/tab/user.png",
        selectedIconPath: "./images/tab/user-active.png"
      }],
      color: '#333',
      selectedColor: '#333',
      backgroundColor: '#fff',
      borderStyle: '#ccc'
    }
  }

  componentDidMount() {

  }

  render() {
    return (<Provider store={store}>
      <Home />
    </Provider>);
  }
}

Taro.render(<App />, document.getElementById('app'))
