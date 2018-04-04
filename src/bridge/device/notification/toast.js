export default {
  name: 'device.notification.toast',
  call: ({ callTemplate }) => ({
    args: { text, icon, duration, delay }, onSuccess: success, onFail: fail,
  }) => {
    let type;
    if (icon === 'success') {
      type = 'success';
    } else if (icon === 'error') {
      type = 'fail';
    }

    callTemplate('showToast')({
      content: text,
      type,
      duration: duration * 1000,
      delay: delay,
      mask: true,
      success,
      fail,
    });
  },
};
