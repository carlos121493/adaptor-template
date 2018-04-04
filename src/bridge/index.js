
import { init as initRPC } from '@ali/dingtalk-idl-ts/lib/rpc-request';
import getAuthCode from './open/getAuthCode';
import dtBridge from './dtBridge';
import navigator from './navigator';
import profile from './profile';

export default (framework, abridge) => {
  const sendMsg = (url, headers, body) => framework.server.run('dingTalk:sendMsg', {
    url,
    headers,
    body,
  }).then((res) => {
    if (res.code === 200) {
      return res;
    }
    return Promise.reject(res);
  });
  
  initRPC({
    sendMsg,
  });

  return [
    abridge.alert,
    abridge.confirm,
    abridge.showToast,
    abridge.showLoading,
    abridge.hideLoading,
    abridge.showActionSheet,
    abridge.getSystemInfoSync,
    abridge.rsa,
    abridge.httpRequest,
    getAuthCode,
    dtBridge,
    profile,
    ...navigator,
  ];
}
