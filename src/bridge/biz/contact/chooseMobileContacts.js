export default {
  name: 'biz.contact.chooseMobileContacts',
  call: ({ callTemplate }) => ({
    args: { multiple, maxUsers, limitTips, title }, onSuccess: success, onFail: fail,
  }) => {
    callTemplate('biz.contact.chooseMobileContacts')({
      multiple,
      maxUsers,
      limitTips,
      title,
      success,
      fail,
    });
  },
};
