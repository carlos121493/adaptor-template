export default {
  name: 'pushWindow',
  call: ({ simulate }) => (params) => {
    simulate.navigator.push(params);
  },
};
