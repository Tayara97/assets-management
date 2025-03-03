import { useState, useContext, useEffect } from "react";
import { Table, Popconfirm, Button, ConfigProvider } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTheme } from "../../../context/ThemeContext";
import { AuthContext } from "../../../context/AuthContext";
import ItForm from "./ITForm";
import Badge from "../../../components/ui/badge/Badge";
import { motion, AnimatePresence } from "framer-motion";

const darkTheme = {
  token: {
    colorBgContainer: "#202a3f",
    colorText: "#ffffff",
    colorBorder: "#434343",
    colorBgElevated: "#2a2a2a",
  },
};
interface Asset {
  key: string;
  name: string;
  categoryName: string;
  modelNumber: string;
  serialNumber: string;
  purchaseDate: string;
  PurchasePrice: number;
  warrantyExpiryDate: string;
  assignedUserName: string;
  locationName: string;
  supplierNames: string;
  status: string;
}

interface Location {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  serialCode: string;
}

interface Manufacturer {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  email: string;
}

interface User {
  userId: string;
  firstName: string;
}
interface ColumnsFilterItem {
  text: string;
  value: string;
}
const ItAssets: React.FC = () => {
  const { theme } = useTheme();
  const { token } = useContext(AuthContext);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [allCategory, setAllCategory] = useState<Category[]>([]);
  const [allManufacturers, setAllManufacturers] = useState<Manufacturer[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [allData, setAllData] = useState<Asset[]>([]);

  const getUsers = async () => {
    try {
      const res = await fetch(
        "http://localhost:5243/api/Auth/AllUsers/AllUsers",
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
      const users: User[] = await res.json();
      setAllUsers(users);
    } catch (error) {
      console.log(error);
    }
  };

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
      const dataWithKey = data.map((obj) => ({ ...obj, key: obj.id }));
      setAllData(dataWithKey);
    } catch (error) {
      console.log(error);
    }
  };

  const getLocations = async () => {
    try {
      const res = await fetch(
        "http://localhost:5243/api/Location/GetAllLocations/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to get data from the backend");
      }
      const data: Location[] = await res.json();
      setAllLocations(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategory = async () => {
    try {
      const res = await fetch(
        "http://localhost:5243/api/Category/GetAllCategories/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to get data from the backend");
      }
      const data: Category[] = await res.json();
      const dataWithKey = data.map((obj) => ({ ...obj, key: obj.id }));
      setAllCategory(dataWithKey);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllAssets();
  }, []);
  const getAllManufacturers = async () => {
    try {
      const res = await fetch(
        "http://localhost:5243/api/Manufacture/GetAllManufacture/all",
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
      const data: Manufacturer[] = await res.json();
      const dataWithKey = data.map((obj) => ({ ...obj, key: obj.id }));
      setAllManufacturers(dataWithKey);
    } catch (error) {
      console.log(error);
    }
  };

  const getSuppliers = async () => {
    try {
      const res = await fetch(
        "http://localhost:5243/api/Supplier/GetAllSuppliers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to get data from the backend");
      }
      const data: Supplier[] = await res.json();
      setSuppliers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetchInForm = async () => {
    setShowForm(true);
    getUsers();
    getLocations();
    getAllCategory();
    getSuppliers();
    getAllManufacturers();
  };

  const handleAddAsset = async (values: any) => {
    const formattedValues = {
      ...values,
      PurchaseDate: values.PurchaseDate?.format("YYYY-MM-DD"),
      WarrantyExpiryDate: values.WarrantyExpiryDate?.format("YYYY-MM-DD"),
      DepreciationDate: values.DepreciationDate?.format("YYYY-MM-DD"),

      SupplierIds: Array.isArray(values.SupplierIds)
        ? values.SupplierIds
        : [values.SupplierIds],
      LocationId: Number(values.LocationId),
      PurchasePrice: Number(values.PurchasePrice),
    };

    const formData = new FormData();
    formData.append("Name", "test");
    formData.append("ModelNumber", formattedValues.ModelNumber);
    formData.append("SerialNumber", formattedValues.SerialNumber);
    formData.append("dicription", formattedValues.discription);
    formData.append("PurchaseDate", formattedValues.PurchaseDate);
    formData.append("PurchasePrice", formattedValues.PurchasePrice);
    formData.append("WarrantyExpiryDate", formattedValues.WarrantyExpiryDate);
    formData.append("DepreciationDate", formattedValues.DepreciationDate);
    formData.append("Status", formattedValues.Status);
    formData.append("LocationId", formattedValues.LocationId);
    formData.append("AssignedUserId", formattedValues.AssignedUserId);
    formData.append("CategoryId", formattedValues.CategoryId);
    formData.append("ManufacturerId", formattedValues.ManufacturerId);
    formData.append("SupplierIds", formattedValues.SupplierIds);
    try {
      const res = await fetch("http://localhost:5243/api/Asset/AddAsset", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to add asset");
      }
      setShowForm(false);
      getAllAssets();
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (values: any) => {
    console.log(values);
  };

  const handleDelete = async (key: string) => {
    try {
      const res = await fetch(
        `http://localhost:5243/api/Asset/DeleteAsset/${key}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete item");
      }

      getAllAssets();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div className="assets_container flex flex-col gap-5 items-center py-0 px-30">
      {showForm && (
        <ItForm
          onFinish={handleAddAsset}
          onFinishFailed={onFinishFailed}
          onClick={() => setShowForm(false)}
          allLocations={allLocations}
          allCategory={allCategory}
          suppliers={suppliers}
          allManufacturers={allManufacturers}
          allUsers={allUsers}
        />
      )}
      {!showForm && (
        <>
          <Button
            style={{ alignSelf: "end" }}
            className="px-3 py-2 font-medium  rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 w-28"
            onClick={handleFetchInForm}
          >
            create new
          </Button>
          <h1 className="text-4xl font-semibold text-gray-800 dark:text-white/90">
            IT Assets
          </h1>
          <ConfigProvider theme={theme === "dark" ? darkTheme : ""}>
            <Table
              className="table"
              columns={[
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                  sorter: (a: Asset, b: Asset) => a.name.localeCompare(b.name),
                  filters: [],
                },
                {
                  title: "Category",
                  dataIndex: "categoryName",
                  key: "categoryName",
                  sorter: (a: Asset, b: Asset) =>
                    a.categoryName.localeCompare(b.categoryName),
                  filters: allData.map((item) => {
                    return {
                      text: item.categoryName,
                      value: item.categoryName,
                    };
                  }),
                },
                {
                  title: "Model Number",
                  dataIndex: "modelNumber",
                  key: "modelNumber",
                  sorter: (a: Asset, b: Asset) =>
                    a.modelNumber.localeCompare(b.modelNumber),
                  filters: [],
                },
                {
                  title: "Serial Number",
                  dataIndex: "serialNumber",
                  key: "serialNumber",
                  sorter: (a: Asset, b: Asset) =>
                    a.serialNumber.localeCompare(b.serialNumber),
                },
                {
                  title: "Purchase Date",
                  dataIndex: "purchaseDate",
                  key: "purchaseDate",
                },
                {
                  title: "Purchase Price",
                  dataIndex: "purchasePrice",
                  key: "purchasePrice",
                },
                {
                  title: "Warranty",
                  dataIndex: "warrantyExpiryDate",
                  key: "warrantyExpiryDate",
                },
                {
                  title: "Assigned to",
                  dataIndex: "assignedUserName",
                  key: "assignedUserName",
                  sorter: (a: Asset, b: Asset) =>
                    a.assignedUserName.localeCompare(b.assignedUserName),
                  // filters: [
                  //   ...new Set(
                  //     allData.map((item) => {
                  //       return item.assignedUserName;
                  //     })
                  //   ),
                  // ].map((user) => ({
                  //   text: user,
                  //   value: user,
                  // })),
                  // onFilter: (value, record) => console.log(record, value),
                  // // record.name.indexOf(value as string) === 0,
                },
                {
                  title: "Location",
                  dataIndex: "locationName",
                  key: "locationName",
                },

                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  render: (_, record: Asset) => {
                    return (
                      <Badge
                        color={
                          record?.status === "Active"
                            ? "success"
                            : record?.status === "Pending"
                            ? "warning"
                            : "error"
                        }
                      >
                        {record?.status}
                      </Badge>
                    );
                  },
                },
                {
                  title: "Operation",
                  dataIndex: "operation",
                  render: (_, record: Asset) =>
                    allData.length >= 1 ? (
                      <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleDelete(record.serialNumber)}
                      >
                        <DeleteOutlined>Delete</DeleteOutlined>
                      </Popconfirm>
                    ) : null,
                },
              ]}
              dataSource={allData}
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
          </ConfigProvider>
        </>
      )}
    </motion.div>
  );
};

export default ItAssets;
