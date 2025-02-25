import { Form, Button, Select } from "antd";

const TransferLocationAndUser: React.FC = () => {
  return (
    <>
      <h3 className="text-4xl mb-3">Transfer Both</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
      >
        <Form.Item name="transfer_from" label="Transfer From">
          <Select disabled allowClear>
            <Select.Option value="office">Office</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="transfer_to"
          label="Transfer To"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select a option and change input text above" allowClear>
            <Select.Option value="meeting_room">Meeting Room</Select.Option>
            <Select.Option value="reception">Reception</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="transfer_from" label="Transfer From">
          <Select disabled allowClear>
            <Select.Option value="user_name">abdelrahman</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="transfer_to"
          label="Transfer To"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select a option and change input text above" allowClear>
            <Select.Option value="user_name">Ahmed</Select.Option>
            <Select.Option value="user_name">Mohamed</Select.Option>
          </Select>
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

export default TransferLocationAndUser;