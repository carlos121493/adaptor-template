export default {
  name: 'biz.util.open',
  call: ({ my }) => ({
    args: { name, params }, onSuccess: success, onFail: fail,
  }) => {
    if (name === 'profile') {
      my.alert({
        title: '个人资料页',
        content: JSON.stringify(params),
        showCancel: false,
        success() {
          success();
        },
        fail,
      });
      return;
    }
    my.alert({
      title: `参数传递错误或暂不支持打开此种页面:${name}`,
      content: JSON.stringify(params),
      showCancel: false,
      success() {
        success();
      },
      fail,
    });
  },
};
