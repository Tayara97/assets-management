import { Button, Table } from "antd";
import { useState, useEffect,useContext } from "react";
import TransferForms from "./TransferForms";
import { AuthContext } from "../../context/AuthContext";

export interface Asset {
  id: string;
  name: string;
  assignedUserName: string;
  locationName: string;
  serialNumber: string;
}

const TransferAssets: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [showShowAllForms, setShowAllForms] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const getAllAssets = async () => {
    try {
      const res = await fetch("http://localhost:5243/api/Asset/GetAllAssets", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to get data from the backend");
      }
      const data: Asset[] = await res.json();
      const uniqueData = data.map((item) => ({ ...item, key: item.id }));
      setTableData(uniqueData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAssets();
  }, []);

  const handleClick = (id: Asset) => {
    setSelectedAsset(id);
    setShowAllForms(true);
  };

  return (
    <>
      {!showShowAllForms && (
        <Table
          columns={[
            { title: "Asset Name", dataIndex: "name", key: "name" },
            { title: "User", dataIndex: "assignedUserName", key: "assignedUserName" },
            { title: "Location", dataIndex: "locationName", key: "locationName" },
            {
              title: "Action",
              dataIndex: "",
              key: "x",
              render: (_, record: Asset) => (
                <Button onClick={() => handleClick(record)}>Transfer</Button>
              ),
            },
          ]}
          dataSource={tableData}
        />
      )}
      {showShowAllForms && selectedAsset && (
        <TransferForms
          getAllAssets={getAllAssets}
          selectedAsset={selectedAsset}
          setShowAllForms={setShowAllForms}
        />
      )}
    </>
  );
};

export default TransferAssets;