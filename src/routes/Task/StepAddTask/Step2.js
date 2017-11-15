import React from 'react';
import { Form, Input, Button, Select, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const { Option } = Select;

export default ({ formItemLayout, form, dispatch }) => {
  const { getFieldDecorator, validateFields } = form;
  const onValidateForm = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/saveStepFormData',
          payload: values,
        });
        dispatch(routerRedux.push('/form/step-form/confirm'));
      }
    });
  };
  return (
    <div>
      <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
        <Form.Item
          {...formItemLayout}
          label="appid"
        >
          {getFieldDecorator('appid', {
            initialValue: '',
            rules: [{ required: true, message: '请填写信息' }],
          })(
            <Input placeholder="必填" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="app名称"
        >
          {getFieldDecorator('app_name', {
            initialValue: '',
            rules: [{ required: true, message: '请填写信息' }],
          })(
            <Input placeholder="必填" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="app下载地址"
        >
          {getFieldDecorator('appuri', {
            initialValue: '',
            rules: [{ required: true, message: '请填写信息' }],
          })(
            <Input placeholder="请填写信息" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="bundle_id"
        >
          {getFieldDecorator('bundle_id', {
            initialValue: '',
            rules: [{ required: true, message: '请填写信息' }],
          })(
            <Input placeholder="请填写信息" />
          )}
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm}>
            下一步
          </Button>
        </Form.Item>
      </Form>
      <Divider style={{ margin: '40px 0 24px' }} />
      <div className={styles.desc}>
        <h3>说明</h3>
        <p>输入appid后，如果已经添加过appid则会自动填充app信息，否则请填写app信息</p>
      </div>
    </div>
  );
};
