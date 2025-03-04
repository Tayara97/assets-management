import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Form, Button, Select } from "antd";
import { Asset } from "./TransferAssets";

interface User {
  id: string;
  name: string;
  barcode: string;
}

interface TransferUsersFormProps {
  onFinish: (values: any) => void;
  selectedAsset: Asset;
}

const TransferUsersForm: React.FC<TransferUsersFormProps> = ({
  onFinish,
  selectedAsset,
}) => {
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
