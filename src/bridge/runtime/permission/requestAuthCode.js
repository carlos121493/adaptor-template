/* eslint-disable camelcase */
import {
  OAPII_authorize4MicroappWithMiniApp,
  OpenAppAuthI_getOpenAppUserAuthInfo4MiniApp,
  OpenAppAuthI_userAuthOpenApp4MiniApp,
} from '@ali/dingtalk-idl-ts/dist/oapi';
import popup from './popup';

export default {
  name: 'runtime.permission.requestAuthCode',
  call: ({ store, callTemplate }) => async ({
    args: { corpId }, onSuccess: success, onFail: fail,
  }) => {
    try {
      const appid = await store.get('appid');
      console.log(corpId, appid);
      if (corpId) {
        const res = await OAPII_authorize4MicroappWithMiniApp(corpId, appid);
        success({
          code: res.body,
        });
      } else {
        const {
          body: { autoAuth, authCode, hasAuthed, openAppInfo },
        } = await OpenAppAuthI_getOpenAppUserAuthInfo4MiniApp(appid);
        if (autoAuth || hasAuthed) {
          success({
            code: authCode,
          });
        } else {
          console.log('@@popup parmas', openAppInfo);
          const result = await popup(callTemplate, openAppInfo);
          console.log('@@popup result:', result);
          if (result) {
            const { body } = await OpenAppAuthI_userAuthOpenApp4MiniApp(appid);
            success({
              code: body,
            });
          }
        }
      }
    } catch (e) {
      fail(e);
    }
  },
};
