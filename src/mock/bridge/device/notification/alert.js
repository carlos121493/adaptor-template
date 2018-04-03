export default {
  name: 'device.notification.alert',
  call: ({ my }) => ({
    args: { title, message: content, buttonName: confirmText }, onSuccess: success, onFail: fail,
  }) => {
    my.alert({
      title,
      content,
      confirmText,
      showCancel: false,
      success,
      fail,
    });
  },
};
