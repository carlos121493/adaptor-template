export default {
  name: 'switchTab',
  call: ({ simulate }) => (params) => {
    simulate.tabbar.switchTab(params);
  },
};
