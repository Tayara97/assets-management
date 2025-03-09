import { Form, Button, Select } from "antd";
import { Asset } from "./TransferAssets";
interface TransferLocationAndUserFormProps {
  onFinish: (values: any) => void;
  selectedAsset: Asset;
}
const TransferLocationAndUser: React.FC<TransferLocationAndUserFormProps> = ({
  onFinish,
  selectedAsset,
  locationData,
  usersData,
}) => {
  const locationOptions = locationData.filter(
    (item) => item.barcode !== selectedAsset.locationBarcode
  );
  const transferFromLocation = locationData.find(
    (item) => item.name === selectedAsset.locationName
  );
  const userOptions = usersData.filter(
    (item) => item.userId !== selectedAsset.userId
  );
  const transferFromUser = usersData?.find(
    (item) => item?.userId === selectedAsset.userId
  );
  return (
    <>
      <h3 className="text-4xl mb-3">Transfer Both</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          name="fromLocationBarcode"
          label="Transfer From Location"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              {
                label: transferFromLocation?.name || "Loading ...",
                value: transferFromLocation?.barcode,
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="toLocationBarcode"
          label="Transfer To Location"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
            options={locationOptions.map((item) => ({
              label: item.name,
              value: item.barcode,
            }))}
          />
        </Form.Item>
        <Form.Item name="fromUserId" label="Transfer From User">
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
          label="Transfer To User"
          rules={[{ required: true }]}
        >
          <Select
            allowClear
            options={userOptions.map((user) => {
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

export default TransferLocationAndUser;
