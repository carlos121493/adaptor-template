export default {
  name: 'popTo',
  call: ({ simulate }) => (params) => {
    simulate.navigator.pop(params);
  },
};
