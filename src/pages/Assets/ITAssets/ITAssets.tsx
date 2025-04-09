import { useState, useContext, useEffect } from "react";
import { Table, Popconfirm, Button, ConfigProvider, message } from "antd";
import { DeleteTwoTone, EditOutlined, EditTwoTone } from "@ant-design/icons";
import { useTheme } from "../../../context/ThemeContext";
import { AuthContext } from "../../../context/AuthContext";
import ItForm from "./ITForm";
import Badge from "../../../components/ui/badge/Badge";
import { motion, AnimatePresence, color } from "framer-motion";
import EditITForm from "./EditITForm";

const darkTheme = {
  token: {
    colorBgContainer: "transparent",
    colorText: "#ffffff",
    colorBorder: "#434343",
    colorBgElevated: "#2a2a2a",
  },
  components: {
    Table: {
      headerBg: "rgb(52 64 84 / 95%)",
    },
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
  const [messageApi, contextHolder] = message.useMessage();

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [allCategory, setAllCategory] = useState<Category[]>([]);
  const [allManufacturers, setAllManufacturers] = useState<Manufacturer[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [allData, setAllData] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset[]>();

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
    getUsers();
    getLocations();
    getAllCategory();
    getSuppliers();
    getAllManufacturers();
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

  const handleEditAsset = async (values: any) => {
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
    formData.append("Name", formattedValues.Name);
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
      const res = await fetch(
        `http://localhost:5243/api/Asset/UpdateAsset?serialNumber=${selectedAsset.serialNumber}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!res.ok) {
        const error = await res.json();
        messageApi.open({
          type: "error",
          content: error.error,

          style: {
            marginTop: "10vh",
          },
        });
        throw new Error("Failed to add asset");
      }
      messageApi.open({
        type: "success",
        content: "Updated successfully",

        style: {
          marginTop: "10vh",
        },
      });

      setShowEditForm(false);
      getAllAssets();
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddAsset = async (values: any) => {
    messageApi.destroy();
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
    formData.append("Name", formattedValues.Name);
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
        const error = await res.json();
        messageApi.open({
          type: "error",
          content: error.error,

          style: {
            marginTop: "10vh",
          },
        });
        throw new Error("Failed to add asset");
      }
      messageApi.open({
        type: "success",
        content: "added successfully",

        style: {
          marginTop: "10vh",
        },
      });

      setShowForm(false);
      getAllAssets();
    } catch (error) {
      console.error(error);
    }
  };

  const onFinishFailed = (values: any) => {
    console.log(values);
  };

  const handleDelete = async (key: string) => {
    messageApi.destroy();

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
      message.success({
        style: { marginTop: "10vh" },
        content: "Deleted successfully",
      });
      getAllAssets();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <motion.div className="flex flex-col gap-1 items-center p-5 dark:bg-gray-800 bg-white rounded-md">
      {contextHolder}
      {showForm && (
        <ConfigProvider theme={theme === "dark" ? darkTheme : {}}>
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
        </ConfigProvider>
      )}
      {!showForm && !showEditForm && (
        <>
          <Button
            className="self-end px-3 py-2 font-medium  rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 w-28"
            onClick={() => setShowForm(true)}
          >
            create new
          </Button>
          <h1 className="text-4xl font-semibold text-gray-800 dark:text-white/90">
            IT Assets
          </h1>
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
            <Table
              style={{
                marginBottom: "10px",
                boxShadow: "rgba(0, 0, 0, 0.1) -4px 10px 14px 4px",
              }}
              pagination={{ pageSize: 8 }}
              sticky
              showHeader
              rowClassName={(_, index) => {
                return index % 2 === 0 ? "" : "bg-[#f9fafb] dark:bg-gray-700";
              }}
              columns={[
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                  sorter: (a: Asset, b: Asset) => a.name.localeCompare(b.name),
                },
                {
                  title: "Category",
                  dataIndex: "categoryName",
                  key: "categoryName",
                  sorter: (a: Asset, b: Asset) =>
                    (a.categoryName || "").localeCompare(b.categoryName || ""),
                  filters: allCategory.map((cat) => {
                    return { text: cat.name, value: cat.name };
                  }),
                  filterMode: "tree",
                  filterSearch: true,
                  onFilter: (value, record) =>
                    record.categoryName.startsWith(value as string),
                },
                {
                  title: "Model Number",
                  width: 150,
                  dataIndex: "modelNumber",
                  key: "modelNumber",
                },
                {
                  title: "Serial Number",
                  width: 150,
                  dataIndex: "serialNumber",
                  key: "serialNumber",
                },
                {
                  title: "Purchase Date",
                  dataIndex: "purchaseDate",
                  width: 140,
                  key: "purchaseDate",
                  sorter: (a: Asset, b: Asset) =>
                    a.purchaseDate.localeCompare(b.purchaseDate),
                },
                {
                  title: "Purchase Price",
                  dataIndex: "purchasePrice",
                  key: "purchasePrice",
                },
                {
                  title: "Warranty",
                  align: "center",
                  dataIndex: "warrantyExpiryDate",
                  key: "warrantyExpiryDate",
                  sorter: (a: Asset, b: Asset) =>
                    a.warrantyExpiryDate.localeCompare(b.warrantyExpiryDate),
                },
                {
                  title: "Assigned to",
                  width: 150,
                  dataIndex: "assignedUserName",
                  key: "assignedUserName",
                  sorter: (a: Asset, b: Asset) =>
                    a.assignedUserName.localeCompare(b.assignedUserName),

                  filters: allUsers.map((user) => {
                    return { text: user.firstName, value: user.firstName };
                  }),
                  filterMode: "tree",
                  filterSearch: true,
                  onFilter: (value, record) =>
                    record.assignedUserName.startsWith(value as string),
                },
                {
                  title: "Location",
                  dataIndex: "locationName",
                  key: "locationName",
                  sorter: (a: Asset, b: Asset) =>
                    a.locationName.localeCompare(b.locationName),
                  filters: allLocations.map((location) => {
                    return { text: location.name, value: location.name };
                  }),
                  filterMode: "tree",
                  filterSearch: true,
                  onFilter: (value, record) =>
                    record.locationName.startsWith(value as string),
                },

                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  align: "center",
                  render: (_, record: Asset) => {
                    return (
                      <Badge
                        color={
                          record?.status.toLocaleLowerCase() === "active"
                            ? "success"
                            : record?.status.toLowerCase() === "inrepair"
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
                  align: "center",

                  dataIndex: "operation",
                  render: (_, record: Asset) =>
                    allData.length >= 1 ? (
                      <div className="flex gap-6 justify-center">
                        <EditTwoTone
                          onClick={() => {
                            setSelectedAsset(record);
                            setShowEditForm(true);
                          }}
                        />

                        <Popconfirm
                          title="Sure to delete?"
                          onConfirm={() => handleDelete(record.serialNumber)}
                        >
                          <DeleteTwoTone twoToneColor="#eb2f96" />
                        </Popconfirm>
                      </div>
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
      {/**edit form */}
      {showEditForm && (
        <ConfigProvider theme={theme === "dark" ? darkTheme : ""}>
          <EditITForm
            onFinish={handleEditAsset}
            onFinishFailed={onFinishFailed}
            onClick={() => setShowEditForm(false)}
            allLocations={allLocations}
            allCategory={allCategory}
            suppliers={suppliers}
            allManufacturers={allManufacturers}
            allUsers={allUsers}
            initialValues={selectedAsset}
          />
        </ConfigProvider>
      )}
    </motion.div>
  );
};

export default ItAssets;
