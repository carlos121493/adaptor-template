export default {
  name: 'device.geolocation.get',
  call: ({ my }) => ({ onSuccess: success, onFail: fail }) => {
    my.getLocation({
      type: 1,
      success: success,
      fail,
    });
  },
};
