export default {
  name: 'util.domainStorage.getItem',
  call: ({ my }) => ({ args: { name: key }, onSuccess: success, onFail: fail }) => {
    my.getStorage({
      key,
      success: (result) => {
        success(result.data);
      },
      fail,
    });
  },
};
