import { Button, Form, Input } from "antd";
import type { FormProps } from 'antd';

interface LocationEditFormProps {
  onFinish: (values: { name: string; address: string }) => void;
  onFinishFailed: FormProps['onFinishFailed'];
  onClick: () => void;
  initialValues?: { name: string; address: string };
}

const LocationEditForm = ({ 
  onFinish, 
  onFinishFailed, 
  onClick,
  initialValues 
}: LocationEditFormProps) => {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Button type="default" onClick={onClick} style={{ marginBottom: 24 }}>
        Close
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
          rules={[{ required: true, message: 'Please input name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please input address' }]}
        >
          <Input />
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