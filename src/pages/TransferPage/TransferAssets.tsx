import { Button, Table, ConfigProvider } from "antd";
import { useState, useEffect, useContext } from "react";
import TransferForms from "./TransferForms";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
const darkTheme = {
  token: {
    colorBgContainer: "#202a3f",
    colorText: "#ffffff",
    colorBorder: "#434343",
    colorBgElevated: "#2a2a2a",
  },
};
export interface Asset {
  id: string;
  name: string;
  assignedUserName: string;
  locationName: string;
  serialNumber: string;
}

const TransferAssets: React.FC = () => {
  const { token } = useContext(AuthContext);
  const { theme } = useTheme();
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
  const columns = [
    { title: "Asset Name", dataIndex: "name", key: "name" },
    {
      title: "User",
      dataIndex: "assignedUserName",
      key: "assignedUserName",
      sorter: (a: Asset, b: Asset) =>
        a.assignedUserName.localeCompare(b.assignedUserName),
    },
    {
      title: "Location",
      dataIndex: "locationName",
      key: "locationName",
      sorter: (a: Asset, b: Asset) =>
        a.locationName.localeCompare(b.locationName),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, record: Asset) => (
        <Button onClick={() => handleClick(record)}>Transfer</Button>
      ),
    },
  ];
  return (
    <ConfigProvider theme={theme === "dark" ? darkTheme : ""}>
      <div className="flex flex-col gap-5 items-center p-5 dark:bg-gray-800 bg-white rounded-md">
        {!showShowAllForms && (
          <Table
            style={{
              marginBottom: "10px",
              boxShadow: "rgba(0, 0, 0, 0.1) -4px 10px 14px 4px",
            }}
            pagination={{ pageSize: 8 }}
            sticky
            scroll={{ x: "max-content" }}
            columns={columns}
            rowClassName={(_, index) => {
              return index % 2 === 0 ? "" : "bg-[#f9fafb] dark:bg-gray-700";
            }}
            dataSource={tableData}
            rowKey="key"
            components={{
              body: {
                row: ({ children, ...props }) => (
                  <AnimatePresence>
                    <motion.tr
                      {...props}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {children}
                    </motion.tr>
                  </AnimatePresence>
                ),
              },
            }}
          />
        )}
        {showShowAllForms && selectedAsset && (
          <TransferForms
            getAllAssets={getAllAssets}
            selectedAsset={selectedAsset}
            setShowAllForms={setShowAllForms}
          />
        )}
      </div>
    </ConfigProvider>
  );
};

export default TransferAssets;
