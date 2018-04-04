export default {
  name: 'biz.util.multiSelect',
  call: ({ callTemplate }) => ({
    args: { options, selectOption }, onSuccess: success, onFail: fail,
  }) => {
    callTemplate('biz.util.multiSelect')({
      options,
      selectOption,
      success,
      fail,
    });
  },
};
