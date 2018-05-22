export default {
  name: 'messanger',
  call: ({ store, messanger }) => async ({
    test, success, fail,
  }) => {
    try {
      const res = await messanger.run('ceshi', { test });
      console.log(res);

      success({
        res,
      });
    } catch (e) {
      fail(e);
    }
  },
};
