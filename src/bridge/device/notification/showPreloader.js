export default {
  name: 'device.notification.showPreloader',
  call: ({ callTemplate }) => ({
    args: { text, showIcon = true }, onSuccess: success, onFail: fail,
  }) => {
    callTemplate('showToast')({
      type: showIcon ? 'loading' : undefined,
      content: text,
      duration: 9999999,
      mask: true,
      success,
      fail,
    });
  },
};
