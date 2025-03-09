import { Form, Button, Select } from "antd";
import { Asset } from "./TransferAssets";

// interface User {
//   id: string;
//   name: string;
//   barcode: string;
// }

interface TransferUsersFormProps {
  onFinish: (values: any) => void;
  selectedAsset: Asset;
}

const TransferUsersForm: React.FC<TransferUsersFormProps> = ({
  onFinish,
  selectedAsset,
  usersData,
}) => {
  const options = usersData.filter(
    (item) => item.userId !== selectedAsset.userId
  );
  const transferFromUser = usersData?.find(
    (item) => item?.userId === selectedAsset.userId
  );

  return (
    <>
      <h3 className="text-4xl mb-8">Transfer Users</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item name="fromUserId" label="Transfer From">
          <Select
            options={[
              {
                label: transferFromUser?.firstName || "Loading ...",
                value: transferFromUser?.userId,
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="toUserId"
          label="Transfer To"
          rules={[{ required: true }]}
        >
          <Select
            allowClear
            options={options.map((user) => {
              return {
                label: user.firstName,
                value: user.userId,
              };
            })}
          />
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

export default TransferUsersForm;
