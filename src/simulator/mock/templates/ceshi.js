import styles from './ceshi.less';

export default {
  name: 'ceshi',
  template: ({ React, store, antd }, closeWebview) => (params) => {
    const { Button, Icon } = antd;
    const { success, opts } = params;
    return <Modal
      wrapClassName={styles.container}
      onOk={() => {
        success();
        closeWebview();
      }}
      title="自定义组件"
    >
      <div>传入的参数为</div>
      <div>
        { opts }
      </div>
    </Modal>
  },
}