import { Table, Popconfirm, Button, ConfigProvider, message } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../context/AuthContext";
import MaintenanceRequestForm from "./MaintenanceRequestForm";
import { Form } from "react-router";
const darkTheme = {
  token: {
    colorBgContainer: "#202a3f",
    colorText: "#ffffff",
    colorBorder: "#434343",
    colorBgElevated: "#2a2a2a",
  },
};
const MaintenanceRequest = () => {
  const { token } = useContext(AuthContext);
  const { theme } = useTheme();
  const [messageApi, contextHolder] = message.useMessage();
  const [showForm, setShowForm] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);
  const [maintenanceData, setmaintenanceData] = useState([]);

  const getMaintenanceRequest = async () => {
    try {
      const res = await fetch(
        "http://localhost:5243/api/AssetMaintenance/GetAllMaintenanceRecords/GetAllMaintenanceRecords",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to get data from the backend");
      }
      const data = await res.json();
      const dataWithKey = data.map((obj) => {
        return { ...obj, key: obj.id };
      });
      setmaintenanceData(dataWithKey);
    } catch (error) {
      console.log(error);
    }
  };
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

      const data = await response.json();

      const usersWithKeys = data.map((item) => ({
        ...item,
        key: item.userId,
      }));

      setUsersData(usersWithKeys);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const getAllSuppliers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5243/api/Supplier/GetAllSuppliers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to get data from the backend");

      const data = await response.json();
      const suppliersWithKeys = data.map((item) => ({ ...item, key: item.id }));
      setSuppliersData(suppliersWithKeys);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getAllUsers();
    getAllSuppliers();
    getMaintenanceRequest();
  }, []);
  const onFinish = async (values) => {
    messageApi.destroy();
    const formattedValues = {
      ...values,
      maintenanceDate: values.maintenanceDate?.format("YYYY-MM-DD"),
    };
    console.log(formattedValues);
    const formData = new FormData();
    formData.append("assetSerialNumber", formattedValues.assetSerialNumber);
    formData.append("maintenanceDate", formattedValues.maintenanceDate);
    formData.append("description", formattedValues.description);
    formData.append("toWhomOfUserId", formattedValues.toWhomOfUserId);
    formData.append("toWhomOfSupplierId", formattedValues.toWhomOfSupplierId);
    try {
      const response = await fetch(
        "http://localhost:5243/api/AssetMaintenance/AddMaintenanceRecord/AddMaintenanceRecord",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        messageApi.open({
          type: "error",
          content: error.error,

          style: {
            marginTop: "10vh",
          },
        });
      }

      messageApi.open({
        type: "success",
        content: "Maintenance request created successfully",

        style: {
          marginTop: "10vh",
        },
      });
      // setShowForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ConfigProvider
      theme={
        theme === "dark"
          ? darkTheme
          : {
              components: {
                Table: {
                  headerBg: "#edebeb",
                },
              },
            }
      }
    >
      <motion.div className="flex flex-col gap-5 items-center p-5 dark:bg-gray-800 bg-white rounded-md">
        {contextHolder}
        {!showForm && (
          <>
            <Button
              className="self-end px-3 py-2 font-medium  rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 w-28"
              onClick={() => setShowForm(true)}
            >
              Create new
            </Button>
            <Table
              style={{
                marginBottom: "10px",
                boxShadow: "rgba(0, 0, 0, 0.1) -4px 10px 14px 4px",
              }}
              pagination={{ pageSize: 8 }}
              sticky
              scroll={{ x: "max-content" }}
              rowClassName={(_, index) => {
                return index % 2 === 0 ? "" : "bg-[#f9fafb] dark:bg-gray-700";
              }}
              columns={[
                {
                  title: "Asset Name",
                  dataIndex: "assetName",
                  sorter: (a, b) => a.assetName.localeCompare(b.assetName),
                  // filters: Array.from(
                  //   new Set(usersData.map((user) => user.firstName))
                  // ).map((firstName) => ({
                  //   text: firstName,
                  //   value: firstName,
                  // })),

                  filterMode: "tree",
                  filterSearch: true,
                  onFilter: (value, record) =>
                    record.firstName.startsWith(value as string),
                },
                {
                  title: "Description",
                  dataIndex: "description",
                },
                {
                  title: "Maintenance Date",
                  dataIndex: "maintenanceDate",
                },
                {
                  title: "Supplier name",
                  dataIndex: "toWhomOfSupplierName",
                },
                {
                  title: "User name",
                  dataIndex: "toWhomOfUserName",
                },
                // {
                //   title: "Operation",
                //   dataIndex: "operation",
                //   render: (_: any, record: User) => (
                //     <Popconfirm
                //       title="Sure to delete?"
                //       onConfirm={() => {
                //         // Implement delete logic here
                //         console.log("Deleting user:", record.userId);
                //       }}
                //     >
                //       <DeleteTwoTone twoToneColor="#eb2f96" />
                //     </Popconfirm>
                //   ),
                // },
              ]}
              dataSource={maintenanceData}
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
          </>
        )}
        {showForm && (
          <div className="flex flex-col items-center">
            <MaintenanceRequestForm
              onFinish={onFinish}
              usersData={usersData}
              suppliersData={suppliersData}
              // onFinishFailed={onFinishFailed}
              onClick={() => setShowForm(false)}
            />
          </div>
        )}
      </motion.div>
    </ConfigProvider>
  );
};

export default MaintenanceRequest;
