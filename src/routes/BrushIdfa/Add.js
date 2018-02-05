import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
  TimePicker, Row, Col
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import { requestAuthApi } from '../../utils/request';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const InputGroup = Input.Group;

@connect(state => ({
  brush_idfa: state.brush_idfa,
  submitting: state.form.regularFormSubmitting,
}))
@Form.create()
export default class BasicForms extends PureComponent {
  // 提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      // 构造日期
      values.active_start_time = values.a_start_time_date.format('YYYY-MM-DD') + ' ' + values.a_start_time_time.format('HH:mm:00')
      delete values.a_start_time_date
      delete values.a_start_time_time
      values.active_end_time = values.a_end_time_date.format('YYYY-MM-DD') + ' ' + values.a_end_time_time.format('HH:mm:00')
      delete values.a_end_time_date
      delete values.a_end_time_time

      values.ciliu_start_time = values.c_start_time_date.format('YYYY-MM-DD') + ' ' + values.c_start_time_time.format('HH:mm:00')
      delete values.c_start_time_date
      delete values.c_start_time_time
      values.ciliu_end_time = values.c_end_time_date.format('YYYY-MM-DD') + ' ' + values.c_end_time_time.format('HH:mm:00')
      delete values.c_end_time_date
      delete values.c_end_time_time

      if (!err) {
        this.props.dispatch({
          type: 'brush_idfa/save',
          payload: values,
        });
      }
    });
  }

  onBlurAppid = (e) => {
    const appid = e.target.value
    const { dispatch } = this.props

    // 请求服务器获取appid信息
    requestAuthApi('/backend/app/query_one', { query: { appid } })
      .then((data) => {
        const ios_app = data.ios_app
        if (ios_app) {
          this.props.form.setFieldsValue(ios_app)
        } else {
          console.log('no data')
        }

      })
  }

  render() {
    const { form, dispatch, brush_idfa } = this.props
    const { getFieldDecorator, validateFields, getFieldValue } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout title="新建空闲任务">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem
                  label="appid"
                >
                  {getFieldDecorator('appid', {
                    initialValue: '',
                    rules: [{ required: true, message: '请填写信息' }],
                  })(
                    <Input placeholder="必填" onBlur={this.onBlurAppid} />
                    )}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item
                  label="app名称"
                >
                  {getFieldDecorator('app_name', {
                    initialValue: '',
                    rules: [{ required: true, message: '请填写信息' }],
                  })(
                    <Input placeholder="必填" />
                    )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item
                  label="bundle_id"
                >
                  {getFieldDecorator('bundle_id', {
                    initialValue: '',
                    rules: [{ required: true, message: '请填写信息' }],
                  })(
                    <Input placeholder="必填" />
                    )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item
                  label="排重url"
                >
                  {getFieldDecorator('query', {
                    initialValue: '',
                    rules: [{ required: true, message: '请填写信息' }],
                  })(
                    <Input placeholder="必填" />
                    )}
                </Form.Item>

              </Col>
              <Col xl={12} lg={12} md={12} sm={24}>

                <Form.Item
                  label="回调/留存url"
                >
                  {getFieldDecorator('callback', {
                    initialValue: '',
                    rules: [{ required: true, message: '请填写信息' }],
                  })(
                    <Input placeholder="必填" />
                    )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem
                  label="任务类型"
                >
                  {getFieldDecorator('apiType', {
                    initialValue: '',
                  })(
                    <Radio.Group>
                      <Radio value="1">回调接口</Radio>
                      <Radio value="2">激活接口</Radio>
                    </Radio.Group>
                    )}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item
                  label="channel"
                >
                  {getFieldDecorator('channel', {
                    initialValue: '',
                    rules: [{ required: true, message: '请填写信息' }],
                  })(
                    <Input placeholder="必填" />
                    )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item
                  label="process"
                >
                  {getFieldDecorator('process', {
                    initialValue: '',
                    rules: [{ required: true, message: '请填写信息' }],
                  })(
                    <Input placeholder="必填" />
                    )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col lg={6} md={6} sm={24}>
                <Form.Item
                  label="callback_time"
                >
                  {getFieldDecorator('callback_time', {
                    initialValue: '',
                    rules: [{ required: true, message: '激活/回调量' }],
                  })(
                    <InputNumber placeholder="callback_time" min={1} max={100000} />
                    )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={24}>
                <Form.Item
                  label="open_time"
                >
                  {getFieldDecorator('open_time', {
                    initialValue: '',
                    rules: [{ required: true, message: '请填写信息' }],
                  })(
                    <InputNumber placeholder="open_time" min={1} max={100000} />
                    )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={24}>
                <Form.Item
                  label="needClean"
                >
                  {getFieldDecorator('needClean', {
                    initialValue: '',
                    rules: [{ required: true, message: '请填写信息' }],
                  })(
                    <InputNumber placeholder="请输入" min={0} max={1} />
                    )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={24}>
                <Form.Item
                  label="taskType"
                >
                  {getFieldDecorator('taskType', {
                    initialValue: '',
                    rules: [{ required: true, message: '请填写信息' }],
                  })(
                    <InputNumber placeholder="请输入" min={0} max={125} />
                    )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item
                  label="激活/回调量"
                >
                  {getFieldDecorator('order_num', {
                    initialValue: '',
                    rules: [{ required: true, message: '激活/回调量' }],
                  })(
                    <InputNumber placeholder="激活/回调量" min={1} max={100000} />
                    )}
                </Form.Item>

              </Col>
              <Col xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item
                  label="激活手机数量"
                >
                  {getFieldDecorator('active_mobile_num', {
                    initialValue: '',
                    rules: [{ required: true, message: '请填写信息' }],
                  })(
                    <Input placeholder="必填" />
                    )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <FormItem
                  label="激活开始时间"
                >
                  <InputGroup compact>
                    {getFieldDecorator('a_start_time_date', {
                      initialValue: moment(),
                      rules: [{ required: true, message: '请填写信息' }],
                    })(
                      <DatePicker />
                      )}
                    {getFieldDecorator('a_start_time_time', {
                      initialValue: moment(),
                      rules: [{ required: true, message: '请填写信息' }],
                    })(
                      <TimePicker format='HH:mm' />
                      )}
                  </InputGroup>
                </FormItem>
              </Col>
              <Col xl={{ span: 12 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <FormItem
                  label="激活结束时间"
                  help={"结束时间需大于开始时间"}
                >
                  <InputGroup compact>
                    {getFieldDecorator('a_end_time_date', {
                      initialValue: moment().add('1', 'days'),
                      rules: [{ required: true, message: '请填写信息' }],
                    })(
                      <DatePicker />
                      )}
                    {getFieldDecorator('a_end_time_time', {
                      initialValue: moment(),
                      rules: [{ required: true, message: '请填写信息' }],
                    })(
                      <TimePicker format='HH:00' />
                      )}
                  </InputGroup>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
                <FormItem
                  label="是否次留任务"
                >
                  {getFieldDecorator('is_ciliu', {
                    initialValue: '',
                  })(
                    <Radio.Group>
                      <Radio value="1">是</Radio>
                      <Radio value="0">否</Radio>
                    </Radio.Group>
                    )}
                </FormItem>
              </Col>
            </Row>

            <Row style={{
              //display: getFieldValue('is_ciliu') === '1' ? 'block' : 'none',
            }}>
              <Col lg={12} md={12} sm={24}>
                <FormItem
                  label="次留任务量"
                >
                  {getFieldDecorator('ciliu_return_num')(
                    <InputNumber
                      placeholder="次留量"
                      min={1}
                      max={100000}
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem
                  label="次留手机数量"
                >
                  {getFieldDecorator('ciliu_mobile_num')(
                    <InputNumber
                      placeholder="激活手机数量"
                      min={1}
                      max={100000}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <FormItem
                  label="留存开始时间"
                >
                  <InputGroup compact>
                    {getFieldDecorator('c_start_time_date', {
                      initialValue: moment(),
                      rules: [{ required: true, message: '请填写信息' }],
                    })(
                      <DatePicker />
                      )}
                    {getFieldDecorator('c_start_time_time', {
                      initialValue: moment(),
                      rules: [{ required: true, message: '请填写信息' }],
                    })(
                      <TimePicker format='HH:mm' />
                      )}
                  </InputGroup>
                </FormItem>
              </Col>
              <Col xl={{ span: 12 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <FormItem
                  label="留存结束时间"
                  help={"结束时间需大于开始时间"}
                >
                  <InputGroup compact>
                    {getFieldDecorator('c_end_time_date', {
                      initialValue: moment().add('1', 'days'),
                      rules: [{ required: true, message: '请填写信息' }],
                    })(
                      <DatePicker />
                      )}
                    {getFieldDecorator('c_end_time_time', {
                      initialValue: moment(),
                      rules: [{ required: true, message: '请填写信息' }],
                    })(
                      <TimePicker format='HH:00' />
                      )}
                  </InputGroup>
                </FormItem>
              </Col>
            </Row>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
