export default {
  name: 'biz.util.ut',
  call: () => ({
    args, onSuccess: success,
  }) => {
    console.log('biz.util.ut params:', args);
    success();
  },
};
