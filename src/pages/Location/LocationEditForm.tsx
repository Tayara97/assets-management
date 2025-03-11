import { Button, Form, Input } from "antd";
import type { FormProps } from "antd";

interface LocationEditFormProps {
  onFinish: (values: { name: string; address: string }) => void;
  onFinishFailed: FormProps["onFinishFailed"];
  onClick: () => void;
  initialValues?: { name: string; address: string };
}

const LocationEditForm = ({
  onFinish,
  onFinishFailed,
  onClick,
  initialValues,
}: LocationEditFormProps) => {
  const inputStyle = {
    borderRadius: "8px",
    height: "30px",
    border: "1px solid #d9d9d9",
  };
  return (
    <div className="flex flex-col items-center w-[800px] gap-8 bg-white rounded-md">
      <Button type="default" onClick={onClick} className="self-end ">
        X
      </Button>

      <Form
        name="editForm"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={initialValues}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input name" }]}
        >
          <Input style={inputStyle} />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input address" }]}
        >
          <Input style={inputStyle} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LocationEditForm;
