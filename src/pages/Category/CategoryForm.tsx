import React from "react";
import { Button, Form, Input } from "antd";

interface CategoriesFormProps {
  onClick: () => void;
  onFinish: (values: any) => void;
  onFinishFailed?: (errorInfo: any) => void;
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({
  onClick,
  onFinish,
  onFinishFailed,
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
          width: 600,
          border: "1px solid #094d7d",
          padding: "30px",
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

        <Form.Item label="description" name="description">
          <Input />
        </Form.Item>
        <Form.Item
          label="serial Code"
          name="serialCode"
          rules={[
            {
              required: true,
              message: "Please input serial Code",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="parent Category Id" name="parentCategoryId">
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

export default CategoriesForm;
