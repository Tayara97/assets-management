import { Button, Form, Input } from "antd";
import type { FormProps } from "antd";

interface SupplierEditFormProps {
  onFinish: FormProps<FormValues>["onFinish"];
  onFinishFailed: FormProps<FormValues>["onFinishFailed"];
  onClick: () => void;
}

const SupplierEditForm = ({
  onFinish,
  onFinishFailed,
  onClick,
}: SupplierEditFormProps) => {
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
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Company Name"
          name="companyName"
          rules={[
            {
              required: true,
              message: "Please input Company name",
            },
          ]}
        >
          <Input style={inputStyle} />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input Company email",
            },
          ]}
        >
          <Input style={inputStyle} />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: "Please input Company phone",
            },
          ]}
        >
          <Input style={inputStyle} />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input style={inputStyle} />
        </Form.Item>
        <Form.Item label="Note" name="note">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>{" "}
      </Form>
    </div>
  );
};
export default SupplierEditForm;
