import { Button, message, Popconfirm, Table, Input } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import LocationForm from "../Location/LocationForm";
import { AuthContext } from "../../context/AuthContext";
import LocationEditForm from "../Location/LocationEditForm";
import type { TableColumnsType } from "antd";

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
  const { token } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [editable, setEditable] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );

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
        message.error("barcode already exist");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to save data to the backend");
      }

      setShowForm(false);
      getAllLocations();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
          <EditOutlined onClick={() => showEditForm(record)}>Edit</EditOutlined>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined>Delete</DeleteOutlined>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      {!showForm && !editable && (
        <motion.div>
          <Input
            placeholder="Search by barcode"
            allowClear
            style={{ width: 200 }}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
          <Button
            className="my-4 float-right"
            type="default"
            onClick={handleShowForm}
          >
            +
          </Button>
          <Table
            columns={columns}
            dataSource={filterdData}
            rowKey="key"
            pagination={{ pageSize: 10 }}
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
      {showForm && (
        <LocationForm
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onClick={() => setShowForm(false)}
        />
      )}
      {editable && selectedLocation && (
        <LocationEditForm
          onFinish={handleSubmitEdit}
          onFinishFailed={onFinishFailed}
          onClick={() => setEditable(false)}
          initialValues={selectedLocation}
        />
      )}
    </div>
  );
};

export default Location;
