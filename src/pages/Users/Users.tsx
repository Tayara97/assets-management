import { Table, Popconfirm, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import UserForm from "./UserForm";
// import { AuthContext } from "../components/AuthContext"; // Remove .jsx extension
import { AuthContext } from "../../context/AuthContext";
// Define types for your user data
interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  key?: string;
}

interface UserFormValues {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Role: string;
}

const Users = () => {
  const { token } = useContext(AuthContext); // AuthContext must be typed
  const [usersData, setUsersData] = useState<User[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");

  // Fetch all users
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

      const data: User[] = await response.json();

      // Add `key` for Ant Design Table
      const usersWithKeys = data.map((item) => ({
        ...item,
        key: item.userId,
      }));

      setUsersData(usersWithKeys);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Filter data based on search input
  const filteredData = searchInput
    ? usersData.filter((item) =>
        item.firstName.toLowerCase().includes(searchInput.toLowerCase())
      )
    : usersData;

  // Handle form submission
  const handleFormSubmit = async (values: UserFormValues) => {
    console.log(values);
    const formData = new FormData();
    formData.append("FirstName", values.FirstName);
    formData.append("LastName", values.LastName);
    formData.append("Email", values.Email);
    formData.append("Password", values.Password);
    formData.append("Role", values.Role);

    try {
      const response = await fetch(
        "http://localhost:5243/api/Auth/AddUser/AddUser",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "User added successfully");
        setShowForm(false);
        getAllUsers();
      } else {
        alert(result.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the user");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <motion.div>
      {!showForm && (
        <>
          {/* <Input
            placeholder="input search text"
            allowClear
            style={{ width: 200 }}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          /> */}
          <Button
            className="float-right mb-4"
            onClick={() => setShowForm(true)}
          >
            +
          </Button>
          <Table
            columns={[
              {
                title: "First Name",
                dataIndex: "firstName",
                sorter: (a: User, b: User) =>
                  a.firstName.localeCompare(b.firstName),
              },
              {
                title: "Last Name",
                dataIndex: "lastName",
                sorter: (a: User, b: User) =>
                  a.lastName.localeCompare(b.lastName),
                filters: [],
              },
              {
                title: "Email",
                dataIndex: "email",
              },
              {
                title: "Password",
                dataIndex: "password",
              },
              {
                title: "Role",
                dataIndex: "role",
              },
              {
                title: "Operation",
                dataIndex: "operation",
                render: (_: any, record: User) => (
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => {
                      // Implement delete logic here
                      console.log("Deleting user:", record.userId);
                    }}
                  >
                    <Button>Delete</Button>
                  </Popconfirm>
                ),
              },
            ]}
            dataSource={filteredData}
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
        <UserForm
          onFinish={handleFormSubmit}
          onFinishFailed={onFinishFailed}
          onClick={() => setShowForm(false)}
        />
      )}
    </motion.div>
  );
};

export default Users;
