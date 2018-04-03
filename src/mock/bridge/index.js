
import { init as initRPC } from '@ali/dingtalk-idl-ts/lib/rpc-request';
import getAuthCode from './open/getAuthCode';
import rsa from './rsa';
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

  const [alert, confirm, showToast, showLoading, hideLoading, showActionSheet, getSystemInfoSync, rsa, httpRequest] = abridge
  return [
    alert,
    confirm,
    showToast,
    showLoading,
    hideLoading,
    showActionSheet,
    getSystemInfoSync,
    getAuthCode,
    rsa,
    dtBridge,
    profile,
    httpRequest,
    ...navigator,
  ];
}
