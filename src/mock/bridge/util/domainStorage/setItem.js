export default {
  name: 'util.domainStorage.setItem',
  call: ({ my }) => ({ args: { name: key, value: data }, onSuccess: success, onFail: fail }) => {
    my.setStorage({
      key,
      data,
      success,
      fail,
    });
  },
};
