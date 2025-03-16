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
    <div className="flex flex-col items-center w-[800px] gap-8 bg-white rounded-2xl border border-gray-200 px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 ">
      <Button type="default" onClick={onClick} className="self-end ">
        X
      </Button>
      <Form
        name="basic"
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 18,
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
          <Input className=" border-[#d9d9d9] rounded-lg h-8 dark:bg-[#202a3f] dark:border-[#434343]" />
        </Form.Item>

        <Form.Item label="description" name="description">
          <Input className=" border-[#d9d9d9] rounded-lg h-8 dark:bg-[#202a3f] dark:border-[#434343]" />
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
          <Input className=" border-[#d9d9d9] rounded-lg h-8 dark:bg-[#202a3f] dark:border-[#434343]" />
        </Form.Item>
        <Form.Item label="parent Category Id" name="parentCategoryId">
          <Input className=" border-[#d9d9d9] rounded-lg h-8 dark:bg-[#202a3f] dark:border-[#434343]" />
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

export default CategoriesForm;
