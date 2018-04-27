export default {
  name: 'useMy',
  call: ({ my }) => ({
    test, success, fail,
  }) => {
    my.alert({
      title: '利用小程序api',
      content: test,
      showCancel: false,
      success() {
        success();
      },
      fail,
    });
  },
};
