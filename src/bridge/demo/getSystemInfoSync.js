export default {
  name: 'getSystemInfoSync',
  call: ({ my }) => ({
     success, fail,
  }) => {
    return my.getSystemInfoSync();
  },
};
