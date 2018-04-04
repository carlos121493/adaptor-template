export default {
  name: 'device.notification.confirm',
  call: ({ my }) => ({
    args: { title, message: content, buttonLabels },
    onSuccess: success, onFail: fail,
  }) => {
    my.confirm({
      title,
      content,
      cancelText: buttonLabels.cancelText,
      confirmText: buttonLabels.confirmText,
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
