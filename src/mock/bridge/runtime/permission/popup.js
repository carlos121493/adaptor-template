export default (callTemplate, openAppInfo) => new Promise((resolve, reject) => {
  callTemplate('runtime.permission.requestAuthCode')({
    openAppInfo,
    success: resolve,
    fail: reject,
  });
});
