import { OpenAppAuthI_userAuthOpenApp4MiniApp } from '@ali/dingtalk-idl-ts/dist/oapi';

async function authConfirm({ appid }) {
  console.log(appid);
  const res = await OpenAppAuthI_userAuthOpenApp4MiniApp(appid);
  console.log(res);
  return res.body;
}

const BASE_AUTH_SCOPE = 'base_auth';

export default {
  name: 'getAuthCode',
  call: ({ callTemplate, store, context }) => async (params) => {
    const appid = await store.get('appid');
    const { success, fail } = params;

    if (!appid) {
      // 此处需要调出appid弹窗
      return params.success({ authCode: '200, 注意：这不是一个真实的 authCode，请填写 appId 之后再次执行' });
    }

    const userAuthorization = await store.get('userAuthorization') || {};
    const path = await context('projectPath');
    const savedScope = userAuthorization[path] || [];
    let showModal = false;
    if (!savedScope.includes(BASE_AUTH_SCOPE)) {
      showModal = true;
    }

    if (showModal) {
      callTemplate('showModal')({
        title: '授权',
        content: '当前应用申请获得以下权限： 获得你的公开信息（昵称、头像等）',
        confirmText: '允许',
        cancelText: '拒绝',
        showCancel: true,
        success: async () => {
          try {
            const authCode = await authConfirm({ appid });
            success({ authCode });
            savedScope.push(BASE_AUTH_SCOPE);
            userAuthorization[path] = savedScope;
            store.set('userAuthorization', userAuthorization);
          } catch (e) {
            fail({ err: e.toString() });
          }
        },
        fail: () => { fail({ err: '[only in ide]: 用户取消授权!' }); },
      });
    } else {
      try {
        const authCode = await authConfirm({ appid });
        success({ authCode });
      } catch (e) {
        fail({ err: e.toString() });
      }
    }
  },
};
