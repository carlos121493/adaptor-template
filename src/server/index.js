import {
  createConnection,
  CygnusAuth,
  ServerProtocol,
  AuthType,
} from 'cygnus-pluginserver';
import { EventEmitter } from 'events';
import protocol from './protocol';
import { userInfo } from 'os';

// 初始化与IDE创建连接并建立Auth对象
async function afterReady() {
  new Auth(); 
}
// 创建连接
const context = createConnection();
context.onReady(afterReady);

class Auth extends CygnusAuth {
  constructor() {
    super(AuthType.ws);
    this.registerEvent();
  }
  // 监听事件
  registerEvent() {
    // IDE发送相关， 监听登录相关部分
    context.on(ServerProtocol.checkLogin, () => this.checkLogin());
    context.on(ServerProtocol.qrCode, () => this.getQRCode());
    context.on(ServerProtocol.profile, () => this.getProfile());
    context.on('logout', () => this.logout());

    // 自定义信息, 与mock通信
    context.on(protocol.ceshi, (res) => {
      context.send({
        method: 'ceshi',
        payload: `fromServer: ${res}`,
      });
    });
  }
  // 检测是否登录
  // 每次在切换adapter时执行
  checkLogin() {
    context.send({
      method: ServerProtocol.checkLogin,
      payload: !this.isLogin,
    });
  }

  // 登录信息
  // 检测登录失败时，获取qrcode及扫码状态
  async getQRCode() {
    // 通知登录是否成功
    context.send({
      method: ServerProtocol.qrCode,
      payload: { 
        loginUrl: 'https://gw.alipayobjects.com/zos/rmsportal/lmatwBFRmVKNhycwTCXW.png', 
        qrCode: 123,  // qrCodeId 暂时没用
      },
    });
    
    // 发送qrcode, ch
    setTimeout(() => {
      this.isLogin = true;
      context.send({
        method: ServerProtocol.authStatus,
        payload: true,
      });
    }, 5000);
  }

  // 获取个人信息
  // 扫码成功后显示个人信息
  async getProfile() {
    context.send({
      method: ServerProtocol.profile,
      payload: { avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BTBIhSdCWgIBSjRDOMqv.png' },
    });
  }

  logout() {
    this.isLogin = false;
    context.send({
      method: 'logout',
      payload: '',
    });
  }
};
