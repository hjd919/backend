import {
    Button,
    Card,
    Col,
    DatePicker,
    Dropdown,
    Form,
    Icon,
    Input,
    InputNumber,
    Menu,
    Modal,
    Row,
    Select,
    message,
} from 'antd';
const FormItem = Form.Item;
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import querystring from 'querystring';
import { domain } from '../../config'

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';

import styles from './AppList.less';
const { RangePicker } = DatePicker; // 日期

@connect(state => ({
    app: state.app,
}))
@Form.create()
export default class DailyStat extends PureComponent {
    state = {
        addInputValue: '',
        modalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
    };

    componentDidMount() {
        const { dispatch, location } = this.props;

        // 清除查询参数
        dispatch({
            type: 'app/clearQueryParams',
            payload: {},
        });

        // 从url获取查询参数
        let query_params = {};
        if (location.search) {
            query_params = querystring.parse(location.search.replace('?', ''))
        }

        dispatch({
            type: 'app/fetchDailyStat',
            payload: query_params,
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
            type: 'app/fetchDailyStat',
            payload: params,
        });
    }

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        dispatch({
            type: 'task/fetch',
            payload: {},
        });
    }

    toggleForm = () => {
        this.setState({
            expandForm: !this.state.expandForm,
        });
    }

    handleMenuClick = (e) => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;

        if (!selectedRows) return;

        switch (e.key) {
            case 'remove':
                dispatch({
                    type: 'task/remove',
                    payload: {
                        no: selectedRows.map(row => row.no).join(','),
                    },
                    callback: () => {
                        this.setState({
                            selectedRows: [],
                        });
                    },
                });
                break;
            default:
                break;
        }
    }

    handleSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
    }

    handleSearch = (e) => {
        e.preventDefault();

        const { dispatch, form } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;
            let values = {}
            if (fieldsValue.range_date) {
                values['start_date'] = fieldsValue.range_date[0].format('YYYY-MM-DD')
                values['end_date'] = fieldsValue.range_date[1].format('YYYY-MM-DD')
            }
            delete fieldsValue.range_date

            fieldsValue = Object.assign({}, fieldsValue, values)

            this.setState({
                formValues: fieldsValue,
            });

            dispatch({
                type: 'app/fetchDailyStat',
                payload: values,
            });
        });
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    }

    handleAddInput = (e) => {
        this.setState({
            addInputValue: e.target.value,
        });
    }

    handleAdd = () => {
        console.log('handleAdd')
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values)
            return false;
            if (!err) {
                this.props.dispatch({
                    type: 'task/add',
                    payload: values,
                });
            }
        });
        return false

        this.props.dispatch({
            type: 'task/add',
            payload: {
                description: this.state.addInputValue,
            },
        });

        message.success('添加成功');
        this.setState({
            modalVisible: false,
        });
    }

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="appid">
                            {getFieldDecorator('appid')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="日期">
                            {getFieldDecorator('range_date')(
                                <RangePicker />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                展开 <Icon type="down" />
                            </a>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderAdvancedForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="规则编号">
                            {getFieldDecorator('no')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">关闭</Option>
                                    <Option value="1">运行中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="调用次数">
                            {getFieldDecorator('number')(
                                <InputNumber style={{ width: '100%' }} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="更新日期">
                            {getFieldDecorator('date')(
                                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status3')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">关闭</Option>
                                    <Option value="1">运行中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status4')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">关闭</Option>
                                    <Option value="1">运行中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <span style={{ float: 'right', marginBottom: 24 }}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                        <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                            收起 <Icon type="up" />
                        </a>
                    </span>
                </div>
            </Form>
        );
    }

    renderForm() {
        return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }

    // 刷新列表
    reloadList = () => {
        this.props.dispatch({
            type: 'app/fetchDailyStat',
            payload: {},
        });
    }

    exportApp = (e) => {
        const export_url = domain + '/backend/app/exportDaily?token=' + localStorage.token + '&' + querystring.stringify(this.state.formValues)
        location.href = export_url
    }

    render() {
        const { app: { loading: loading, daily_stat }, form: { getFieldDecorator, getFieldValue } } = this.props;
        const { selectedRows, modalVisible, addInputValue } = this.state;
        const menu = (
            <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                <Menu.Item key="remove">删除</Menu.Item>
                <Menu.Item key="approval">批量审批</Menu.Item>
            </Menu>
        );

        // 配置栏目
        const columns = [
            {
                fixed: 'left',
                width: 160,
                title: '日期',
                dataIndex: 'date',
            },
            {
                title: 'appid',
                width: 100,
                dataIndex: 'appid',
            },
            {
                title: 'app名',
                width: 100,
                dataIndex: 'app_name',
            },
            {
                title: '总量',
                width: 100,
                dataIndex: 'total_num',
            },
            {
                title: '成功量',
                width: 80,
                dataIndex: 'success_num',
            },
            {
                title: '失败量',
                width: 80,
                dataIndex: 'fail_num',
            },
            {
                title: '被封账号数',
                width: 80,
                dataIndex: 'invalid_email_num',
            },
            {
                title: '打码数',
                dataIndex: 'dama',
            },
            // {
            //   fixed: 'right',
            //   width: 100,
            //   title: '操作',
            //   render: (text, record) => (
            //     <p>
            //       <Link to="/app/list">修改</Link>
            //     </p>
            //   ),
            // },
        ];

        // 设置form_style
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

        return (
            <PageHeaderLayout title="统计列表">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>

                        <div className={styles.tableListOperator}>
                            <Button
                                type="primary"
                                onClick={this.reloadList}
                                disabled={selectedRows.length}
                                loading={loading}
                            >
                                <Icon type="reload" /> 刷新
                            </Button>
                            <Button icon="export" type="primary" onClick={this.exportApp}>导出机刷统计</Button>
                            {/*
                                selectedRows.length > 0 && (
                                    <span>
                                        <Button>批量操作</Button>
                                        <Dropdown overlay={menu}>
                                            <Button>
                                                更多操作 <Icon type="down" />
                                            </Button>
                                        </Dropdown>
                                    </span>
                                )
                            */}
                        </div>
                        <StandardTable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={daily_stat}
                            columns={columns}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}