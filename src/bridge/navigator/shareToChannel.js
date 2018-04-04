export default {
  name: 'shareToChannel',
  call: ({ callNative }) => ({ param }) => {
    callNative(param);
  },
  native: ({ callTemplate }) => (params) => {
    callTemplate('share')(params);
  },
};
