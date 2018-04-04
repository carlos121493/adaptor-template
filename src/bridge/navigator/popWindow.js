export default {
  name: 'popWindow',
  call: ({ simulate }) => (params) => {
    simulate.navigator.pop(params);
  },
};
