import React, {Component} from 'react';
import { Input, Form, Uploader, Select, Validation, Alert, Button } from '@components';
import className from 'classnames';
const { FormLine, FormItem } = Form;
const { Option } = Select;

const initialData = {
    id: 0,
    name: '',
    path: '',
    images: [],
    type: '',
    description: ''
};

class Index extends Component {
    constructor(props) {
        super(props);
        this.handleSave = this.handleSave.bind(this);
        this.state = {
            ...initialData,
            prevProps: {},
            formRef: React.createRef(),
            alertInfo: '',
            alertType: '',
            showAlert: false,
            submitting: false
        };
    }

    static getDerivedStateFromProps (props, state) {
        // todo，思考initialData 的更好写法
        const tag = props.tag;
        if (state.prevProps.id !== tag.id) {
            // 重置 Form 表单的验证状态
            state.formRef.current && state.formRef.current.reset();
            return {
                ...(tag.name ? tag  : initialData),
                images: tag && tag.poster ? [tag.poster] : [],
                prevProps: tag,
                showAlert: false
            };
        }
        return null;
    }

    saveCallback (result) {
        this.setState({
            showAlert: true,
            alertType: result.meta.code === 0 ? 'primary' : 'danger',
            alertInfo: result.meta.code === 0 ? '项目信息编辑成功' : result.meta.msg,
            id: result.response.id,
            submitting: false
        });
    }

    handleSave () {
        const { state, props} = this;
        this.setState({
            submitting: true
        });

        const postData = {
            id: state.id,
            name: state.name,
            path: state.path,
            description: state.description
        };
        setTimeout(() => {
            if (state.id) {
                props.onEdit(state.id, postData, this.saveCallback.bind(this))
            } else {
                props.onCreate(postData, this.saveCallback.bind(this))
            }
        }, 500);
    }

    handleInputChange (key, value) {
        this.setState({
            [key]: value
        });
    }

    render() {
        const state = this.state;

        return (
            <React.Fragment>
                { state.showAlert ? (<Alert type={state.alertType} onClose={() => { this.setState({ showAlert: false }) }}>{ state.alertInfo }</Alert>) : null }
                <Form submitting={state.submitting} ref={ state.formRef } onSave={this.handleSave}>
                    <FormLine>
                        <FormItem label='名称'>
                            <Input size="large"
                                   value={state.name}
                                   onChange={this.handleInputChange.bind(this, 'name')}
                                   validations={[Validation.required.bind(this, '请输入名称')]}
                                   placeholder="请输入名称" />
                        </FormItem>
                    </FormLine>
                    <FormLine>
                        <FormItem label='路径'>
                            <Input size="large"
                                   value={state.path}
                                   onChange={this.handleInputChange.bind(this, 'path')}
                                   validations={[Validation.required.bind(this, '请输入路径')]}
                                   placeholder="请输入路径" />
                        </FormItem>
                    </FormLine>
                    <FormLine>
                        <FormItem label='描述'>
                            <Input.TextArea size="large"
                                            value={state.description}
                                            validations={[Validation.required.bind(this, '请输入描述')]}
                                            onChange={this.handleInputChange.bind(this, 'description')}
                                            placeholder="请输入描述" />
                        </FormItem>
                    </FormLine>
                </Form>
            </React.Fragment>
        );
    }
}

export default Index;
