export default {
  name: 'normal',
  call: ({ callNative }) => ({ test, success, fail, callNative }) => {
    callNative({ opts: test }, () => {
      success({ success: true });
    });
  },
  native: ({ callTemplate }) => ({ opts }, cb) => {
    callTemplate('ceshi')({ opts, success: cb });
  },
};
