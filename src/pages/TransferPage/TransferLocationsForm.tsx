import { Form, Button, Select } from "antd";
import { Asset } from "./TransferAssets";

interface TransferLocationFormProps {
  onFinish: (values: any) => void;
  selectedAsset: Asset;
}

const TransferLocationForm: React.FC<TransferLocationFormProps> = ({
  onFinish,
  selectedAsset,
  locationData,
}) => {
  const options = locationData.filter(
    (item) => item.barcode !== selectedAsset.locationBarcode
  );
  const transferFromLocation = locationData.find(
    (item) => item.name === selectedAsset.locationName
  );

  return (
    <>
      <h3 className="text-4xl mb-8">Transfer Location</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="fromLocationBarcode"
          label="Transfer From"
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
          label="Transfer To"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
            options={options.map((item) => ({
              label: item.name,
              value: item.barcode,
            }))}
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

export default TransferLocationForm;
