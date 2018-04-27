export default {
  name: 'server',
  call: ({ store, server }) => async ({
    test, success, fail,
  }) => {
    try {
      debugger;
      const res = await server.run('ceshi', { test });
      console.log(res);

      success({
        res,
      });
    } catch (e) {
      fail(e);
    }
  },
};
