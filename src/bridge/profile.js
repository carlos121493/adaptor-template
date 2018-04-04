export default {
  name: 'getDingUserInfo',
  call: ({ context }) => async ({ success, fail }) => {
    try {
      const res = await context(['server', 'run'], 'dingTalk:profile');
      if (!res) {
        fail({ message: '获取用户信息失败' });
      } else {
        success(res);
      }
    } catch (e) {
      fail(e);
    }
  },
};
