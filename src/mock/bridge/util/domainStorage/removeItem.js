export default {
  name: 'util.domainStorage.removeItem',
  call: ({ my }) => ({ args: { name: key }, onSuccess: success, onFail: fail }) => {
    my.removeStorage({
      key,
      success,
      fail,
    });
  },
};
