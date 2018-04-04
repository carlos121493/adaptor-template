export default {
  name: 'getStartupParams',
  call: ({ store }) => async ({ success }) => {
    const query = await store.get('launchQuery');
    success({ query });
  },
};
