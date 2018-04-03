export default {
  name: 'biz.util.openLink',
  call: ({ callNative, simulate }) => async ({
    args: { url }, onSuccess: success,
  }) => {
    const { device } = await simulate.container.device();
    callNative({ ua: device.ua, url: url }, () => {
      success();
    });
  },
  native: ({ callTemplate }) => ({ url, ua }, cb) => {
    if (url) {
      cb();
      callTemplate('webview')({ url, ua });
    }
  },
};
