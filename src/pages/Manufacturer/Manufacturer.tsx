import React, { useState, useContext, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

import { Button, Popconfirm, Table, ConfigProvider } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";

import { AuthContext } from "../../context/AuthContext";
import ManufacturerEditForm from "./ManufacturerEditForm";
import ManufacturerAddForm from "./ManufacturerAddForm";

interface ManufactureData {
  id: string;
  name: string;
  info: string;
  key?: string;
}
const darkTheme = {
  token: {
    colorBgContainer: "#202a3f",
    colorText: "#ffffff",
    colorBorder: "#434343",
    colorBgElevated: "#2a2a2a",
  },
};
const Manufacturer: React.FC = () => {
  const { theme } = useTheme();

  const { token } = useContext(AuthContext);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [manufactureData, setManufactureData] = useState<ManufactureData[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchedData, setSearchedData] = useState<ManufactureData[]>([]);
  const [editable, setEditable] = useState<boolean>(false);
  const [selectedManufacture, setSelectedManufacture] =
    useState<ManufactureData>({} as ManufactureData);

  useEffect(() => {
    if (searchInput === "") {
      setSearchedData([]);
    }
  }, [searchInput]);

  const getAllManufacturer = async () => {
    try {
      const response = await fetch(
        `http://localhost:5243/api/Manufacture/GetAllManufacture/all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to get data from the backend");
      }
      const data = await response.json();

      const dataWithKeys = data.map((item: ManufactureData) => {
        return { ...item, key: item.id };
      });
      setManufactureData(dataWithKeys);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAllManufacturer();
  }, [token]);

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const onFinish = async (values: any) => {
    try {
      const response = await fetch(
        "http://localhost:5243/api/Manufacture/AddManfacture",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save data to the backend");
      }
      setShowForm(false);
      getAllManufacturer();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleDelete = async (id: string) => {
    const selectedItem = manufactureData.find((item) => {
      return item.id === id;
    });
    if (!selectedItem) {
      console.error("Item not found");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5243/api/Location/DeleteLocation/delete/${selectedManufacture.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to get data from the backend");
      }

      setManufactureData((prevData) =>
        prevData.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const showEditForm = (record: ManufactureData) => {
    setEditable(true);
    setSelectedManufacture(record);
  };

  const handleSubmitEdit = async (values: any) => {
    try {
      const response = await fetch(
        `http://localhost:5243/api/Manufacture/UpdateManfacture/update/${selectedManufacture.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save data to the backend");
      }

      setEditable(false);
      getAllManufacturer();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Info",
      dataIndex: "info",
      key: "info",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: ManufactureData) =>
        manufactureData.length >= 1 ? (
          <div className="flex gap-3">
            <EditTwoTone onClick={() => showEditForm(record)}>edit</EditTwoTone>

            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key!)}
            >
              <DeleteTwoTone twoToneColor="#eb2f96">Delete</DeleteTwoTone>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];
  return (
    <div className="flex flex-col gap-5 items-center p-5 dark:bg-gray-800 bg-white rounded-md">
      <ConfigProvider theme={theme === "dark" ? darkTheme : ""}>
        {!showForm && !editable && (
          <>
            <Button
              type="default"
              onClick={handleShowForm}
              className="self-end px-3 py-2 font-medium  rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 w-28"
            >
              Create new
            </Button>
            <Table
              style={{
                marginBottom: "10px",
                boxShadow: "rgba(0, 0, 0, 0.1) -4px 10px 14px 4px",
              }}
              pagination={{ pageSize: 8 }}
              virtual={true}
              sticky
              rowClassName={(_, index) => {
                return index % 2 === 0 ? "" : "bg-[#f9fafb] dark:bg-gray-700";
              }}
              columns={columns}
              dataSource={
                searchedData.length > 0 ? searchedData : manufactureData
              }
            />
          </>
        )}
        {showForm && (
          <div className="flex flex-col  items-center">
            <ManufacturerAddForm
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              onClick={() => setShowForm(false)}
            />
          </div>
        )}

        {editable && (
          <div className="flex flex-col  items-center">
            <ManufacturerEditForm
              onFinish={handleSubmitEdit}
              onFinishFailed={onFinishFailed}
              onClick={() => setEditable(false)}
            />
          </div>
        )}
      </ConfigProvider>
    </div>
  );
};

export default Manufacturer;
