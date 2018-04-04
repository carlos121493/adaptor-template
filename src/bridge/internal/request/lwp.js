import { sendMsg } from '@ali/dingtalk-idl-ts/lib/rpc-request';

export default {
  name: 'internal.request.lwp',
  call: () => async ({
    args: { uri = '', headers = {}, body = [] }, onSuccess: success, onFail: fail,
  }) => {
    try {
      const { code: statusCode, body: responseBody } = await sendMsg(uri, headers, body);
      if (statusCode === 200) {
        success({
          statusCode,
          statusText: JSON.stringify(responseBody),
          responseText: JSON.stringify(responseBody),
        });
      } else {
        fail({
          statusCode,
          statusText: JSON.stringify(responseBody),
          responseText: JSON.stringify(responseBody),
        });
      }
    } catch (e) {
      fail(e);
    }
  },
};
