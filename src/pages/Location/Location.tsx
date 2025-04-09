import {
  Button,
  message,
  Popconfirm,
  Table,
  Input,
  ConfigProvider,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import LocationForm from "../Location/LocationForm";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LocationEditForm from "../Location/LocationEditForm";
import type { TableColumnsType } from "antd";
const darkTheme = {
  token: {
    colorBgContainer: "#202a3f",
    colorText: "#ffffff",
    colorBorder: "#434343",
    colorBgElevated: "#2a2a2a",
  },
};
interface LocationData {
  key: number;
  id: number;
  barcode: string;
  name: string;
  address: string;
}

interface LocationFormValues {
  barcode: string;
  name: string;
  address: string;
}

interface LocationEditFormValues {
  name: string;
  address: string;
}

const Location = () => {
  const { theme } = useTheme();
  const { token } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [editable, setEditable] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [messageApi, contextHolder] = message.useMessage();

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
      const data: LocationData[] = await response.json();

      const dataWithKeys = data.map((item) => ({
        ...item,
        key: item.id,
      }));
      setLocationData(dataWithKeys);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAllLocations();
  }, []);

  const handleShowForm = () => {
    setShowForm(!showForm);
  };
  const onFinish = async (values: LocationFormValues) => {
    messageApi.destroy();
    try {
      const response = await fetch(
        "http://localhost:5243/api/Location/AddLocation/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );
      if (response.status === 409) {
        messageApi.open({
          type: "error",
          content: "Barcode is already exist",

          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });

        return;
      }
      if (!response.ok) {
        throw new Error("Failed to save data to the backend");
      }
      messageApi.open({
        type: "success",
        content: "added successfully",
        style: {
          marginTop: "10vh",
        },
      });
      getAllLocations();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setShowForm(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const handleDelete = async (id: number) => {
    const selectedItem = locationData.find((item) => item.id === id);
    if (!selectedItem) {
      console.error("Item not found");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5243/api/Location/DeleteLocation/delete/${selectedItem.barcode}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      setLocationData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filterdData = searchInput
    ? locationData.filter((item) =>
        item.barcode.toLowerCase().includes(searchInput.toLowerCase())
      )
    : locationData;

  const showEditForm = (record: LocationData) => {
    setEditable(true);
    setSelectedLocation(record);
  };

  const handleSubmitEdit = async (values: LocationEditFormValues) => {
    messageApi.destroy();
    if (!selectedLocation) return;
    try {
      const response = await fetch(
        `http://localhost:5243/api/Location/UpdateLocation/update/${selectedLocation.barcode}`,
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
      messageApi.open({
        type: "success",
        content: "Updated successfully",
        style: {
          marginTop: "10vh",
        },
      });
      setEditable(false);
      getAllLocations();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const columns: TableColumnsType<LocationData> = [
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
      sorter: (a: LocationData, b: LocationData) =>
        a.barcode.localeCompare(b.barcode),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",

      sorter: (a: LocationData, b: LocationData) =>
        a.name.localeCompare(b.name),
      filters: locationData.map((location) => {
        return { text: location.name, value: location.name };
      }),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value as string),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => (
        <div className="operation-btns flex gap-3">
          <EditTwoTone onClick={() => showEditForm(record)}>Edit</EditTwoTone>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteTwoTone twoToneColor="#eb2f96" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <ConfigProvider
        theme={
          theme === "dark"
            ? darkTheme
            : {
                components: {
                  Table: {
                    headerBg: "#f9fafb",
                  },
                },
              }
        }
      >
        {!showForm && !editable && (
          <motion.div className="flex flex-col gap-5 items-center p-5 dark:bg-gray-800 bg-white rounded-md">
            <Input
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-8 pr-8 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
              placeholder="Search by barcode"
              allowClear
              style={{ width: 200 }}
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
            <Button
              className="self-end px-3 py-2 font-medium  rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 w-28"
              type="default"
              onClick={handleShowForm}
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
              rowClassName={(_, index) => {
                return index % 2 === 0 ? "" : "bg-[#f9fafb] dark:bg-gray-700";
              }}
              columns={columns}
              dataSource={filterdData}
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
          </motion.div>
        )}
      </ConfigProvider>
      {showForm && (
        <div className="flex flex-col  items-center">
          <ConfigProvider theme={theme === "dark" ? darkTheme : ""}>
            <LocationForm
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              onClick={() => setShowForm(false)}
            />
          </ConfigProvider>
        </div>
      )}
      {editable && selectedLocation && (
        <div className="flex flex-col  items-center">
          <ConfigProvider theme={theme === "dark" ? darkTheme : ""}>
            <LocationEditForm
              onFinish={handleSubmitEdit}
              onFinishFailed={onFinishFailed}
              onClick={() => setEditable(false)}
              initialValues={selectedLocation}
            />
          </ConfigProvider>
        </div>
      )}
    </>
  );
};

export default Location;
