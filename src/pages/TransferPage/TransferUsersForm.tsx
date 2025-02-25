import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Form, Button, Select } from "antd";
import {Asset} from "./TransferAssets";

interface User {
  id: string;
  name: string;
  barcode: string;
}

interface TransferUsersFormProps {
  onFinish: (values: any) => void;
  selectedAsset: Asset;
}

const TransferUsersForm: React.FC<TransferUsersFormProps> = ({ onFinish, selectedAsset }) => {
  const { token } = useContext(AuthContext);
  const [usersData, setUsersData] = useState<User[]>([]);

  const getAllUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost:5243/api/Auth/AllUsers/AllUsers`,
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
      const data: User[] = await response.json();
      const dataWithKeys = data.map((item) => ({ ...item, key: item.id }));
      setUsersData(dataWithKeys);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const options = usersData.filter((item) => item.name !== selectedAsset.assignedUserName);
  const transferFromUser = usersData?.find((item) => item?.name === selectedAsset.assignedUserName);
console.log(selectedAsset)
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
        <Form.Item name="transfer_from" label="Transfer From">
          <Select
            options={[
              {
                label: transferFromUser?.name || "Loading ...",
                value: transferFromUser?.barcode,
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="transfer_to"
          label="Transfer To"
          rules={[{ required: true }]}
        >
          <Select allowClear>
            <Select.Option value="ahmed">Ahmed</Select.Option>
            <Select.Option value="mohamed">Mohamed</Select.Option>
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

export default TransferUsersForm;