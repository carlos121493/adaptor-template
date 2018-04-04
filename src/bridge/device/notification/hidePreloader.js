export default {
  name: 'device.notification.hidePreloader',
  call: ({ callTemplate }) => () => {
    callTemplate('hideToast')();
  },
};
