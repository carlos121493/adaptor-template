export default {
  name: 'normal',
  call: () => ({
    test, success, fail,
  }) => {
    success({ // 异步方法处理
      res: 'success',
      params: test,
    });
    return 'finished'; // 同步方法处理
  },
};
