import React from 'react';
import { Button, Form, Input, Select } from 'antd';

interface UserFormProps {
  onFinish: (values: any) => void;
  onFinishFailed: (errorInfo: any) => void;
  onClick: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onFinish, onFinishFailed, onClick }) => {
  return (
    <>
      <Button type="default" onClick={onClick}>
        X
      </Button>

      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 800,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="First Name"
          name="FirstName"
          rules={[
            {
              required: true,
              message: 'Please input user First Name',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="LastName"
          rules={[
            {
              required: true,
              message: 'Please input user Last Name',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="Email"
          rules={[
            {
              type: 'email',
              required: true,
              message: 'Please input valid email ',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="Password"
          rules={[
            {
              required: true,
              message: 'Please input user password ',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Role"
          name="Role"
          rules={[
            {
              required: true,
              message: 'Please input user role ',
            },
          ]}
        >
          <Select
            style={{ width: 120 }}
            options={[
              {
                value: 'user',
                label: 'user',
              },
              {
                value: 'manager',
                label: 'manager',
              },
              {
                value: 'auditor',
                label: 'auditor',
              },
            ]}
          />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UserForm;