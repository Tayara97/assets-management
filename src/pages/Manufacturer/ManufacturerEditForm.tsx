import React from "react";
import { Button, Form, Input } from "antd";

interface ManufactureEditFormProps {
  onFinish: (values: any) => void;
  onFinishFailed: (errorInfo: any) => void;
  onClick: () => void;
}

const ManufacturerEditForm: React.FC<ManufactureEditFormProps> = ({
  onFinish,
  onFinishFailed,
  onClick,
}) => {
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
          maxWidth: 600,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input name",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="info"
          name="info"
          rules={[
            {
              required: true,
              message: "Please input info",
            },
          ]}
        >
          <Input />
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

export default ManufacturerEditForm;
