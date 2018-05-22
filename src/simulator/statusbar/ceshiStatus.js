/* eslint-disable import/no-extraneous-dependencies */
import classnames from 'classnames';
import styles from './ceshiStatus.less';
import panel from './mockPannel';

export default {
  name: 'ceshiStatus',
  title: 'ceshi',
  icon: 'info-circle-o',
  defaultOrder: 0,
  template: ({ React, antd, store }, closeMock) => {
    const { Form, Button, Icon, Input } = antd;

    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          status: 'normal',
        };
      }
      submit() {
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
          if (err) return;
          console.log(values);
        });
      }
      statusCls(s) {
        return classnames({ [styles.btnActive]: (this.state.status === s) });
      } 
      render() {
        const { getFieldDecorator: makeField } = this.props.form;
        const layout = { required: true, labelCol: { span: 5 }, wrapperCol: { span: 18 } };

        return (
          <Form>
            <Form.Item label="请随便写写" {...layout}>
              {makeField('corpId', {
                rules: [],
              })(
                <Input />
              )}
            </Form.Item>

            <div className={styles.footer}>
              <Button.Group className={styles.btnGroup}>
                <Button type="default" size="large" onClick={closeMock} ghost>关闭</Button>
                <Button
                  type="primary"
                  size="large"
                  disabled={this.state.status !== 'normal'}
                  onClick={this.submit}
                  className={styles.btnSave}
                >
                  <div className={this.statusCls('success')}>
                    <Icon type="check-circle" />
                    <span>保存成功</span>
                  </div>
                  <div className={this.statusCls('fail')}>
                    <Icon type="check-circle" />
                    <span>保存失败</span>
                  </div>
                  <div className={this.statusCls('normal')}>
                    <span>确定</span>
                  </div>
                </Button>
              </Button.Group>
            </div>
          </Form>
        );
      }
    }

    const AppForm = Form.create()(App);
    return panel('测试')(<AppForm />);
  },
};
