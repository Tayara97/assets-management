import { Table, Popconfirm, Button, ConfigProvider, message } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import UserForm from "./UserForm";
import { AuthContext } from "../../context/AuthContext";
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
const darkTheme = {
  token: {
    colorBgContainer: "#202a3f",
    colorText: "#ffffff",
    colorBorder: "#434343",
    colorBgElevated: "#2a2a2a",
  },
};
const Users = () => {
  const { token } = useContext(AuthContext);
  const { theme } = useTheme();
  const [usersData, setUsersData] = useState<User[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
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
    messageApi.destroy();
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

      if (response.ok) {
        messageApi.open({
          type: "success",
          content: "added successfully",
          style: {
            marginTop: "10vh",
          },
        });
        setShowForm(false);
        getAllUsers();
      } else {
        const error = await response.json();
        messageApi.open({
          type: "error",
          content: error.details,

          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });
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
            {/* <Input
            placeholder="input search text"
            allowClear
            style={{ width: 200 }}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          /> */}
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
                  title: "First Name",
                  dataIndex: "firstName",
                  sorter: (a: User, b: User) =>
                    a.firstName.localeCompare(b.firstName),
                  filters: Array.from(
                    new Set(usersData.map((user) => user.firstName))
                  ).map((firstName) => ({
                    text: firstName,
                    value: firstName,
                  })),

                  filterMode: "tree",
                  filterSearch: true,
                  onFilter: (value, record) =>
                    record.firstName.startsWith(value as string),
                },
                {
                  title: "Last Name",
                  dataIndex: "lastName",
                  sorter: (a: User, b: User) =>
                    a.lastName.localeCompare(b.lastName),
                  filters: Array.from(
                    new Set(usersData.map((user) => user.lastName))
                  ).map((lastName) => ({
                    text: lastName,
                    value: lastName,
                  })),

                  filterMode: "tree",
                  filterSearch: true,
                  onFilter: (value, record) =>
                    record.lastName.startsWith(value as string),
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
                      <DeleteTwoTone twoToneColor="#eb2f96" />
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
          <div className="flex flex-col items-center">
            <UserForm
              onFinish={handleFormSubmit}
              onFinishFailed={onFinishFailed}
              onClick={() => setShowForm(false)}
            />
          </div>
        )}
      </motion.div>
    </ConfigProvider>
  );
};

export default Users;
