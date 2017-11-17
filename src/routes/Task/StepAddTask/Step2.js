import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Button,
  InputNumber,
  DatePicker,
  TimePicker
} from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import { message } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const InputGroup = Input.Group;

const { TextArea } = Input;

export default class Step2 extends PureComponent {
  componentWillMount() {

    // 获取手机空闲数
    this.props.dispatch({
      type: 'task/getFreeMobileNum'
    })
  }

  onBlurMobileNum = (e) => {
    // 判断手机数量是否足够
    const { free_mobile_num } = this.props.task.form

    const input_mobile_num = e.target.value

    if (input_mobile_num > free_mobile_num) {
      message.error('不能超过空闲手机数，最大可填' + free_mobile_num);
      return false
    }
  }

  render() {
    const { formItemLayout, form, dispatch, task: { form: { free_mobile_num, task_id } } } = this.props
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {

        // 构造日期
        values.start_time = values.start_time_date.format('YYYY-MM-DD') + ' ' + values.start_time_time.format('HH:mm:00')
        delete values.start_time_date
        delete values.start_time_time

        // 附带任务id:task_id
        values.task_id = task_id

        if (!err) {
          dispatch({
            type: 'task/saveTaskKeyword',
            payload: values,
          }).then((res) => {
            message.success('添加成功', 2, () => {
              dispatch(routerRedux.push('/task/list'))
            })
          })
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
            <InputGroup compact>
              {getFieldDecorator('start_time_date', {
                initialValue: moment(),
                rules: [{ required: true, message: '请填写信息' }],
              })(
                <DatePicker />
                )}
              {getFieldDecorator('start_time_time', {
                initialValue: moment(),
                rules: [{ required: true, message: '请填写信息' }],
              })(
                <TimePicker format='HH:mm' />
                )}
            </InputGroup>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="投入手机数"
            help={"总手机数:" + free_mobile_num}
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
              <InputNumber placeholder="必填" min={0} />
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
              <InputNumber placeholder="必填" min={0} />
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
              提交
          </Button>
          </FormItem>
        </Form>
      </div>
    );
  };
}