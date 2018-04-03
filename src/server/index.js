import {
  createConnection,
  CygnusAuth,
  ServerProtocol,
  AuthType,
} from 'cygnus-pluginserver';
import { EventEmitter } from 'events';
import { mac } from 'address';
import {
  initLWPClient,
  lwpConnect,
  getLWPClient,
  getQRCode,
  getMyProfile,
  watchQRLoginResult,
  LWPClient,
  LWPAuthState,
} from '@ali/dingtalk-lwp-sdk';
class Emitter extends EventEmitter {}

global.window = global;
global.atob = b64Encoded => new Buffer(b64Encoded, 'base64').toString('binary');

const { mid2Url } = require('@ali/ding-mediaid');
const protocol = {
  dingProfile: 'dingTalk:profile',
  dingSendMsg: 'dingTalk:sendMsg',
}
const AppKey = 'e8cb8ae1302dfaff821eec1423bd0197'; // AppKey , 用来区分 app 类型，IDE 和 移动钉钉 是不一样的
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36 dtDevTool/1.0.0  DingWeb/3.5.28 LANG/en_US';

function asyncGetMac() {
  return new Promise((resolve, reject) => {
    mac((err, address) => {
      if (err) reject(err);
      resolve(address);
    });
  });
}

async function afterReady() {
  const deviceId = await asyncGetMac();
  const options = {
    appKey: AppKey,
    wsUrl: 'wss://webalfa-cm3.dingtalk.com/long',
    // wsUrl: 'ws://10.218.136.150:7001/long',
    ua: UA,
    deviceId,
    log: {
      info: (...args) => {
        console.log(...args);
      },
      error: (...args) => {
        console.error(...args);
      },
    },
  };
  const { ua, appKey, wsUrl } = options;
  console.log({ ua, appKey, wsUrl });
  initLWPClient('IDE', options);
  lwpConnect();
  onDingAuth();
}

const context = createConnection();
context.onReady(afterReady);

function onDingAuth() {
  // eslint-disable-next-line
  const dingAuth = new DingAuth();
}

class DingAuth extends CygnusAuth {
  constructor() {
    super(AuthType.ws);
    this.client = getLWPClient();
    this.event = new Emitter();
    if (this.client) {
      this.handleEvents();
    }
  }

  async getQRCode() {
    const qrCode = await getQRCode();

    if (!qrCode) {
      context.send({
        method: ServerProtocol.qrCode,
        payload: { qrCode: null, loginUrl: null },
      });
    }

    const loginUrl = `http://qr.dingtalk.com/action/login?code=${qrCode}`;
    const payload = { qrCode, loginUrl };

    /**
     * ide 核心获取到 qrcode 并成功登录之后会监听登录状态。
     */
    watchQRLoginResult((loginResult) => {
      if (loginResult.success) {
        this.ready = true;
        this.event.emit('ready');
        context.ready();
        context.send({
          method: ServerProtocol.authStatus,
          payload: loginResult,
        });
      }
    });

    context.send({
      method: ServerProtocol.qrCode,
      payload,
    });
  }

  async getProfile() {
    try {
      const { userProfileModel } = getMyProfile();
      const { avatarMediaId } = userProfileModel;
      const avatar = mid2Url(avatarMediaId);
      context.send({
        method: ServerProtocol.profile,
        payload: { avatar },
      });
    } catch (e) {
      context.send({
        method: ServerProtocol.profile,
        payload: {},
      });
    }
  }

  checkLogin() {
    context.send({
      method: ServerProtocol.checkLogin,
      payload: !this.isLogin,
    });
  }

  onReadyProtocol(proto, callback) {
    context.on(proto, async () => {
      if (!this.ready) {
        const doCallback = () => {
          callback();
        };
        this.event.once('ready', () => {
          this.event.removeListener('cancel', doCallback);
          callback();
        });
        this.event.on('cancel', doCallback);
      } else {
        callback();
      }
    });
  }

  handleEvents() {
    this.client.addListener(LWPClient.EventsName.AuthStateChange, async (state) => {
      switch (state) {
        case LWPAuthState.SUBSCRIBE_FAILED:
          // SUBSCRIBE_FAILED: 表示 REGED，但是 OAuth 失败了。当收到这个状态事件时，应该显示登录界面。在这个状态下，只有登录相关接口和推送可用。（此时的推送只能是基于设备的推送）
          this.isLogin = false;
          context.send({
            method: ServerProtocol.ready,
            payload: true,
          });
          break;
        case LWPAuthState.SUBSCRIBED:
          this.isLogin = true;
          break;
        default:
          break;
      }
    });

    // initRPC({
    //   sendMsg: (url, headers, body) =>
    //     this.client.send({
    //       method: ServerProtocol.loginedRequest,
    //       payload: { url, headers, body },
    //     }),
    // });

    // auth
    this.onReadyProtocol(ServerProtocol.profile, () => this.getProfile());
    context.on(ServerProtocol.checkLogin, () => this.checkLogin());
    context.on(ServerProtocol.qrCode, () => this.getQRCode());
    context.on('preload:cancel', () => this.event.emit('cancel'));

    // mock api
    context.onReadyProtocol(protocol.dingProfile, async () => {
      const { userProfileModel } = getMyProfile();
      return userProfileModel;
    });
    context.on(protocol.dingSendMsg, (params) => {
      this.client.sendMsg(params.url, params.headers, params.body).catch(e => e).then((res) => {
        context.send({
          method: protocol.dingSendMsg,
          payload: res,
        });
      });
    });
    context.on(protocol.dingProfile, (params) => {
      context.send({
        method: protocol.dingProfile,
        payload: getMyProfile(),
      });
    });
  }
}
