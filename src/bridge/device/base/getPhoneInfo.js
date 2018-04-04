export default {
  name: 'device.base.getPhoneInfo',
  call: ({ my }) => ({ onSuccess: success, onFail: fail }) => {
    my.getNetworkType({
      success: (networkTypeResult) => {
        my.getSystemInfo({
          success: (result) => {
            success({
              ...result,
              netInfo: networkTypeResult.networkType,
              operatorType: 'CMCC',
            });
          },
          fail,
        });
      },
      fail,
    });
  },
};
