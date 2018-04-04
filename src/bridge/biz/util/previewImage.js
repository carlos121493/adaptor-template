export default {
  name: 'biz.util.previewImage',
  call: ({ my }) => ({
    args: { current, urls }, onSuccess: success, onFail: fail,
  }) => {
    const index = urls.indexOf(current);
    my.previewImage({
      current: (index === -1) ? 0 : index,
      urls,
      success,
      fail,
    });
  },
};
