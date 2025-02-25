import { Button, Table, message, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useContext, useState, useEffect } from "react";
import SupplierForm from "../Suppliers/SupplierForm";
import { AuthContext } from "../../context/AuthContext";
import SupplierEditForm from "../Suppliers/SupplierEditForm";

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
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

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
      const response = await fetch("http://localhost:5243/api/Supplier/AddSupplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

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
      const response = await fetch("http://localhost:5243/api/Supplier/GetAllSuppliers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to get data from the backend");
      
      const data = await response.json() as Array<Omit<Supplier, 'key'>>;
      const suppliersWithKeys = data.map(item => ({ ...item, key: item.id }));
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
    const selectedItem = suppliersData.find(item => item.id === id);
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
    { title: "Company Name", dataIndex: "companyName", key: "companyName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Note", dataIndex: "note", key: "note" },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => (
        <>
          <Button onClick={() => showEditForm(record)}>Edit</Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      {!showForm && !editable && (
        <>
          <Button className="my-4 float-right" type="default" onClick={handleShowForm}>
           +
          </Button>
          <Table columns={columns} dataSource={suppliersData} />
        </>
      )}
      {showForm && <SupplierForm onSubmitForm={onSubmitForm}  onFinishFailed={ onFinishFailed} onClick={() => setShowForm(false)} />}
      {editable && <SupplierEditForm {...{ onFinish: handleSubmitEdit, onFinishFailed }} onClick={() => setEditable(false)} />}
    </div>
  );
};

export default Suppliers;