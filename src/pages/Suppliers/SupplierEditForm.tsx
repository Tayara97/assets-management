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
  return (
    <>
      <Button type="default" onClick={onClick}>
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
          <Input />
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
          <Input />
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
          <Input />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input />
        </Form.Item>

        <Form.Item label="Note" name="note">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>      </Form>
    </>
  );
};
export default SupplierEditForm;
