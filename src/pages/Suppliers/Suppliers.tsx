import { Button, Table, message, Popconfirm, ConfigProvider } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useContext, useState, useEffect } from "react";
import SupplierForm from "../Suppliers/SupplierForm";
import { AuthContext } from "../../context/AuthContext";
import SupplierEditForm from "../Suppliers/SupplierEditForm";
import { motion, AnimatePresence } from "framer-motion";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";
const darkTheme = {
  token: {
    colorBgContainer: "#202a3f",
    colorText: "#ffffff",
    colorBorder: "#434343",
    colorBgElevated: "#2a2a2a",
  },
};
interface Supplier {
  id: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  address: string;
  note?: string;
  key: string;
}

interface FormValues {
  companyName: string;
  email: string;
  phoneNumber: string;
  address: string;
  note?: string;
}

const Suppliers = () => {
  const [showForm, setShowForm] = useState(false);
  const [suppliersData, setSuppliersData] = useState<Supplier[]>([]);
  const { token } = useContext(AuthContext);
  const [editable, setEditable] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const { theme } = useTheme();

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const onSubmitForm = async (values: FormValues) => {
    const dataToSend = {
      companyName: values.companyName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      address: values.address,
      note: values.note || "",
    };

    try {
      const response = await fetch(
        "http://localhost:5243/api/Supplier/AddSupplier",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (response.status === 409) {
        message.error("Company already exist");
        return;
      }
      if (!response.ok) throw new Error("Failed to save data to the backend");

      setShowForm(false);
      getAllSuppliers();
    } catch (error) {
      console.error("Error submitting form:", error);
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
    getAllSuppliers();
  }, [token]);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleDelete = async (id: string) => {
    const selectedItem = suppliersData.find((item) => item.id === id);
    if (!selectedItem) return;

    try {
      const response = await fetch(
        `http://localhost:5243/api/Supplier/DeleteSupplier/${selectedItem.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete supplier");
      getAllSuppliers();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const showEditForm = (record: Supplier) => {
    setEditable(true);
    setSelectedSupplier(record);
  };

  const handleSubmitEdit = async (values: FormValues) => {
    if (!selectedSupplier) return;

    try {
      const response = await fetch(
        `http://localhost:5243/api/Supplier/UpdateSupplier/${selectedSupplier.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) throw new Error("Failed to save data to the backend");
      setEditable(false);
      getAllSuppliers();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const columns: ColumnsType<Supplier> = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      sorter: (a: Supplier, b: Supplier) =>
        a.companyName.localeCompare(b.companyName),
    },
    { title: "Email", dataIndex: "email", key: "email", width: 300 },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Address", dataIndex: "address", key: "address", width: 300 },
    { title: "Note", dataIndex: "note", key: "note" },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => (
        <div className="flex gap-5">
          <EditTwoTone onClick={() => showEditForm(record)}>Edit</EditTwoTone>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteTwoTone twoToneColor="#eb2f96">Delete</DeleteTwoTone>
          </Popconfirm>
        </div>
      ),
    },
  ];

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
      <div className="flex flex-col gap-5 items-center p-5 dark:bg-gray-800 bg-white rounded-md">
        {!showForm && !editable && (
          <>
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
              scroll={{ x: "max-content" }}
              rowClassName={(_, index) => {
                return index % 2 === 0 ? "" : "bg-[#f9fafb] dark:bg-gray-700";
              }}
              columns={columns}
              dataSource={suppliersData}
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
          </>
        )}
        <div className="flex flex-col  items-center">
          {showForm && (
            <SupplierForm
              onSubmitForm={onSubmitForm}
              onFinishFailed={onFinishFailed}
              onClick={() => setShowForm(false)}
            />
          )}
          {editable && (
            <SupplierEditForm
              {...{ onFinish: handleSubmitEdit, onFinishFailed }}
              onClick={() => setEditable(false)}
            />
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Suppliers;
