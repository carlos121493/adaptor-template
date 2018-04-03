/* eslint-disable import/no-extraneous-dependencies */
import classnames from 'classnames';
import queryString from 'query-string';
import styles from './corpSelector.less';
import panel from '../mockPannel';

export default {
  name: 'Dingtalk-CorpSelector',
  title: '切换企业',
  icon: 'info-circle-o',
  defaultOrder: 0,
  support: ['dingtalk'],
  template: ({ React, antd, store }, closeMock) => {
    const { Form, Button, Icon, Select } = antd;
    const Option = Select.Option;

    class App extends React.Component {
      constructor(props) {
        super(props);

        const corpList = store.get('corpList');
        const corpId = store.get('corpId');
        this.state = {
          status: 'normal',
          corpId,
          corpList,
        };
      }
      submit = () => {
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
          if (err) return;
          const corpId = values.corpId;
          store.set('corpId', corpId);
          const launchQuery = store.get('launchQuery');
          store.set('launchQuery', `${launchQuery ? `${launchQuery}&` : ''}corpId=${values.corpId}`);

          const launchQueryObj = queryString.parse(store.get('launchQuery'));
          launchQueryObj.corpId = corpId;
          store.set('launchQuery', queryString.stringify(launchQueryObj));

          this.setState({ status: 'success' });
          setTimeout(() => this.setState({ status: 'normal' }), 700);
        });
      }
      statusCls = s => classnames({ [styles.btnActive]: (this.state.status === s) })
      render() {
        const { getFieldDecorator: makeField } = this.props.form;
        const layout = { required: true, labelCol: { span: 5 }, wrapperCol: { span: 18 } };

        return (
          <Form>
            <Form.Item label="请选择企业" {...layout}>
              {makeField('corpId', {
                initialValue: this.state.corpId,
                rules: [],
              })(
                <Select>
                  {
                    this.state.corpList && this.state.corpList.map(item => (
                      <Option
                        key={item.orgDetail.corpId}
                        value={item.orgDetail.corpId}
                      >
                        {item.orgDetail.orgName}
                      </Option>
                    ))
                  }
                </Select>,
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
    return panel('切换钉钉企业')(<AppForm />);
  },
};
