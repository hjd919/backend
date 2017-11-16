import React, { PureComponent } from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const FormItem = Form.Item;

const { TextArea } = Input;

export default class Step2 extends PureComponent {
  componentWillMount() {
    console.log('111')
    console.log(this.props)
    // 获取手机空闲数
    this.props.dispatch({
      type:'task/getFreeMobileNum'
    })
  }

  onBlurMobileNum = () => {
    console.log('onBlurMobileNum')
    // 判断手机数量是否足够
  }

  render() {
    const { formItemLayout, form, dispatch } = this.props
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'task/save',
            payload: values,
          });
        }
      });
    };

    return (
      <div>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <FormItem
            {...formItemLayout}
            label="关键词"
          >
            {getFieldDecorator('keyword', {
              initialValue: '',
              rules: [{ required: true, message: '请填写信息' }],
            })(
              <Input placeholder="必填" onBlur={this.onBlurAppid} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="打量数"
          >
            {getFieldDecorator('success_num', {
              initialValue: '',
              rules: [{ required: true, message: '请填写信息' }],
            })(
              <InputNumber placeholder="必填" min={0} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="开始时间"
          >
            {getFieldDecorator('start_time', {
              initialValue: '',
              rules: [{ required: true, message: '请填写信息' }],
            })(
              <Input placeholder="必填" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机数"
          >
            {getFieldDecorator('mobile_num', {
              initialValue: '',
              rules: [{ required: true, message: '请填写信息' }],
            })(
              <InputNumber placeholder="必填" min={0} onBlur={this.onBlurMobileNum} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="打量前排名"
          >
            {getFieldDecorator('before_rank', {
              initialValue: '',
              rules: [{ required: true, message: '请填写信息' }],
            })(
              <Input placeholder="必填" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="热度"
          >
            {getFieldDecorator('hot', {
              initialValue: '',
              rules: [{ required: true, message: '请填写信息' }],
            })(
              <Input placeholder="必填" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注"
          >
            {getFieldDecorator('remark', {
              initialValue: '',
              rules: [],
            })(
              <TextArea style={{ minHeight: 32 }} placeholder="选填" rows={4} />
              )}
          </FormItem>
          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
          </Button>
          </FormItem>
        </Form>
      </div>
    );
  };
}