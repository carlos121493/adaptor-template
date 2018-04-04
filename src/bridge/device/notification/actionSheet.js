export default {
  name: 'device.notification.actionSheet',
  call: ({ my }) => ({
    args: { title, cancelButton: cancelButtonText, otherButtons: items },
    onSuccess: success, onFail: fail,
  }) => {
    my.showActionSheet({
      title,
      items,
      cancelButtonText,
      success({ index }) {
        success({
          buttonIndex: index,
        });
      },
      fail,
    });
  },
};
