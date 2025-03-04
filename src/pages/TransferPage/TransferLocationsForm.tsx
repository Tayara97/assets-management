import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Form, Button, Select } from "antd";
import { Asset } from "./TransferAssets";

interface Location {
  id: string;
  name: string;
  barcode: string;
}

interface TransferLocationFormProps {
  onFinish: (values: any) => void;
  selectedAsset: Asset;
}

const TransferLocationForm: React.FC<TransferLocationFormProps> = ({
  onFinish,
  selectedAsset,
}) => {
  const { token } = useContext(AuthContext);
  const [locationData, setLocationData] = useState<Location[]>([]);

  const getAllLocations = async () => {
    try {
      const response = await fetch(
        `http://localhost:5243/api/Location/GetAllLocations/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to get data from the backend");
      }
      const data: Location[] = await response.json();
      const dataWithKeys = data.map((item) => ({ ...item, key: item.id }));
      setLocationData(dataWithKeys);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAllLocations();
  }, []);

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
