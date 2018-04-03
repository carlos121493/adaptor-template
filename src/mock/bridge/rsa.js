import NodeRSA from 'node-rsa';

export default {
  name: 'rsa',
  call: ({ callNative }) => ({ action, text, key, success, fail }) => {
    callNative({ action, text, key }, (res) => {
      if (res.status === 'success') {
        success({ text: res.res });
      } else {
        fail({ errorMessage: res.res, error: 11 });
      }
    });
  },
  native: ({ base }) => ({ action, text, key }, cb) => {
    base({ action, text, key }, cb);
  },
};
