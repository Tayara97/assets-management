import React from "react";
import { Button, Form, Input, Select } from "antd";

interface UserFormProps {
  onFinish: (values: any) => void;
  onFinishFailed: (errorInfo: any) => void;
  onClick: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  onFinish,
  onFinishFailed,
  onClick,
}) => {
  const inputStyle = {
    borderRadius: "8px",
    height: "30px",
    border: "1px solid #d9d9d9",
  };
  return (
    <div className="flex flex-col items-center w-[800px] gap-8 bg-white rounded-2xl border border-gray-200 px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 ">
      <Button type="default" onClick={onClick} className="self-end">
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
              message: "Please input user First Name",
            },
          ]}
        >
          <Input className=" border-[#d9d9d9] rounded-lg h-8 dark:bg-[#202a3f] dark:border-[#434343]" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="LastName"
          rules={[
            {
              required: true,
              message: "Please input user Last Name",
            },
          ]}
        >
          <Input className=" border-[#d9d9d9] rounded-lg h-8 dark:bg-[#202a3f] dark:border-[#434343]" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="Email"
          rules={[
            {
              type: "email",
              required: true,
              message: "Please input valid email ",
            },
          ]}
        >
          <Input className=" border-[#d9d9d9] rounded-lg h-8 dark:bg-[#202a3f] dark:border-[#434343]" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="Password"
          rules={[
            {
              required: true,
              message: "Please input user password ",
            },
            { min: 8, message: "Password must be at least 8 characters long." },
          ]}
        >
          <Input className=" border-[#d9d9d9] rounded-lg h-8 dark:bg-[#202a3f] dark:border-[#434343]" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="Role"
          rules={[
            {
              required: true,
              message: "Please input user role ",
            },
          ]}
        >
          <Select
            style={{ width: 120 }}
            options={[
              {
                value: "user",
                label: "user",
              },
              {
                value: "manager",
                label: "manager",
              },
              {
                value: "auditor",
                label: "auditor",
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
    </div>
  );
};

export default UserForm;
