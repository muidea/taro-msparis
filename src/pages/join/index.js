import Taro, { Component } from '@tarojs/taro';
import { View, Input, Picker, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';

let setIntervalTime = null;

@connect(({join}) => ({
  ...join,
}))
export default class Join extends Component {
  config = {
    navigationBarTitleText: '登录',
  };

  constructor(props) {
    super(props);
    this.state = {
      sending: 0,
      selector: [['美国','新泽西','测试'], ['中国','浙江','杭州'], ['中国','浙江','宁波'], ['巴西'], ['日本']],
      selectorChecked: '美国',
    };
  }

  getMobile = (event) => {
    const value = event.target.value;
    this.props.dispatch({
      type: 'join/save',
      payload: { mobile: value },
    });
  }

  getCode = (event) => {
    const value = event.target.value;
    this.props.dispatch({
      type: 'join/save',
      payload: { code: value },
    });
  }


  join = () => {
    if (this.props.mobile == '' || this.props.mobile.length != 11 || this.props.code == '' || this.props.code.length != 4) {
      this.showToast('请输入有效的手机号或输入有效验证码！');
      return false;
    }
    this.props.dispatch({
      type: 'join/join',
      payload: {
        code: this.props.code,
        mobile: this.props.mobile,
      },
    });
  }

  sendSms = () => {
    if (this.props.mobile == '' || this.props.mobile.length != 11) {
      this.showToast('请输入有效的手机号！');
      return false;
    }

    this.props.dispatch({
      type: 'join/sendSms',
      payload: {
        mobile: this.props.mobile,
      },
    }).then(() => {
      this.setIntervalTime();
      if (this.props.erroMessage && this.props.erroMessage != '') {
        clearInterval(setIntervalTime);
        this.showToast(this.props.erroMessage);
      }
    });
  }

  setIntervalTime = () => {
    clearInterval(setIntervalTime);
    let numConst = 30;
    setIntervalTime = setInterval(() => {
      numConst--;
      this.props.dispatch({
        type: 'join/save',
        payload: { sending: 1, smsTime: numConst },
      });

      if (numConst == 0 || (this.props.erroMessage && this.props.erroMessage != '')) {
        clearInterval(setIntervalTime);
        this.props.dispatch({
          type: 'join/save',
          payload: { sending: 2, erroMessage: '', smsTime: 30 },
        });
      }
    }, 1000);
  }

  // tips
  showToast(text) {
    Taro.showToast({
      title: text,
      icon: 'none',
    });
  }

  getVoiceCode = () => {
    // 语音验证码
    if (this.props.mobile == '' || this.props.mobile.length != 11) {
      this.showToast('请输入有效的手机号！');
      return false;
    }

    this.props.dispatch({
      type: 'join/sendSmsVoice',
      payload: {
        mobile: this.props.mobile,
      },
    }).then(() => {
      this.setIntervalTime();
      if (this.props.erroMessage && this.props.erroMessage != '') {
        clearInterval(setIntervalTime);
        this.showToast(this.props.erroMessage);
      } else {
        this.showToast("电话拨打中...请留意相关电话");
      }
    });
  }

  render() {
    const { sending, smsTime } = this.props;
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      this.setState({
        sending,
      })
    }
    return (
      <View className='join-page' id='join-page'>
        <View className='title'>您好，请登录</View>
        <View className='title-des'>新用户注册即享18天会员98元</View>
        <View className='bgtopWrap'>
          <View className='loginWrap'>
            <View className='inpuWrapMpblie'>
              <Input type='number' name='mobile' maxLength='11' placeholder='请输入真实姓名' value={this.props.mobile} onInput={this.getMobile} />
            </View>
            <View className='inpuWrapMpblie'>
              <Input type='number' name='mobile' maxLength='11' placeholder='请输入手机号' value={this.props.mobile} onInput={this.getMobile} />
            </View>
            <View className='inpuWrapNumber'>
              <Input type='number' name='code' maxLength='4' placeholder='请输入验证码' value={this.props.code} onInput={this.getCode} />
              {this.state.sending == 2 && <View className='numberWrap' onClick={this.sendSms}>重新获取</View>}
              {this.state.sending == 1 && <View className='numberWrap'>{`${smsTime}秒后重发`}</View>}
              {this.state.sending == 0 && <View className='numberWrap' onClick={this.sendSms}>获取验证码</View>}
            </View>
            <View className='inpuWrapMpblie'>
              <Input type='number' name='mobile' maxLength='11' placeholder='请输入推荐人手机' value={this.props.mobile} onInput={this.getMobile} />
            </View>
            <View className='inpuWrapMpblie'>
              <Picker mode='selector' range={this.state.selector}>
                <View className='picker'>
                  当前选择：{this.state.selectorChecked}
                </View>
              </Picker>
            </View>            
            <Button className='button' onClick={this.join}>登录</Button>
          </View>
        </View>
      </View>
    );
  }
}
