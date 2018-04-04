export default {
  name: 'biz.util.chosen',
  call: ({ callTemplate }) => ({
    args: { source, selectedKey }, onSuccess: success, onFail: fail,
  }) => {
    callTemplate('biz.util.chosen')({
      source,
      selectedKey,
      success,
      fail,
    });
  },
};
