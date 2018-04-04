export default {
  name: 'biz.util.datepicker',
  call: ({ my }) => ({
    args: { format, value: currentDate }, onSuccess: success, onFail: fail,
  }) => {
    my.datePicker({
      format,
      currentDate,
      success({ date }) {
        success({
          value: date,
        });
      },
      fail,
    });
  },
};
