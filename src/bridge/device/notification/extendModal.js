export default {
  name: 'device.notification.extendModal',
  call: ({ callTemplate }) => ({
    args: { cells, buttonLabels }, onSuccess: success, onFail: fail,
  }) => {
    callTemplate('device.notification.extendModal')({
      cells,
      buttonLabels,
      success,
      fail,
    });
  },
};
