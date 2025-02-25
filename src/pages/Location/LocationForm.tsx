import { Button, Form, Input } from "antd";
import type { FormProps } from 'antd';

interface LocationFormProps {
  onFinish: (values: { barcode: string; name: string; address: string }) => void;
  onFinishFailed: FormProps['onFinishFailed'];
  onClick: () => void;
}

const LocationForm = ({ onFinish, onFinishFailed, onClick }: LocationFormProps) => {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Button type="default" onClick={onClick} style={{ marginBottom: 24 }}>
        Close
      </Button>

      <Form
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Barcode"
          name="barcode"
          rules={[{ required: true, message: 'Please input Barcode' }]}
        >
          <Input />
        </Form.Item>

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
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LocationForm;