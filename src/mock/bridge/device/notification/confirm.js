export default {
  name: 'device.notification.confirm',
  call: ({ my }) => ({
    args: { title, message: content, buttonLabels: [cancelText, confirmText] },
    onSuccess: success, onFail: fail,
  }) => {
    my.confirm({
      title,
      content,
      cancelText,
      confirmText,
      showCancel: true,
      success({ confirm }) {
        success({
          buttonIndex: confirm ? 1 : 0,
        });
      },
      fail,
    });
  },
};
