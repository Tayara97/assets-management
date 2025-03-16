import React, { useState, useContext, useEffect } from "react";
import CategoriesForm from "../../pages/Category/CategoryForm";
import { Button, message, Table, Popconfirm, ConfigProvider } from "antd";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface CategoryData {
  id: string;
  name: string;
  serialCode: string;
  description: string;
  parentCategoryId?: string | null;
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
const Category: React.FC = () => {
  const { theme } = useTheme();

  const { token } = useContext(AuthContext);
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false);
  const [tableData, setTableData] = useState<CategoryData[]>([]);

  const handleAddCategory = async (values: any) => {
    if (values.parentCategoryId === undefined) {
      values.parentCategoryId = null;
    }
    if (values.description === undefined) {
      values.description = "no description";
    }

    try {
      const response = await fetch(
        "http://localhost:5243/api/Category/AddCategory/add",
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
        message.error("category already exist");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to save data to the backend");
      }

      setShowCategoryForm(false);
      getAllCategory();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const onFinishFailed = (values: any) => {
    console.log(values);
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
      const data = await res.json();
      const dataWithKey = data.map((obj: CategoryData) => {
        return { ...obj, key: obj.id };
      });

      setTableData(dataWithKey);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleDelete = async (id: string) => {
    const selectedItem = tableData.find((item) => {
      return item.id === id;
    });
    if (!selectedItem) {
      console.error("Item not found");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5243/api/Category/DeleteCategory/delete/${selectedItem.id}`,
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

      getAllCategory();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <ConfigProvider theme={theme === "dark" ? darkTheme : ""}>
        {!showCategoryForm && (
          <Button
            className="float-right my-4"
            onClick={() => setShowCategoryForm(true)}
          >
            Create new
          </Button>
        )}
        {showCategoryForm && (
          <div className="flex flex-col  items-center">
            <CategoriesForm
              onClick={() => setShowCategoryForm(false)}
              onFinish={handleAddCategory}
              onFinishFailed={onFinishFailed}
            />
          </div>
        )}
        {!showCategoryForm && (
          <Table
            columns={[
              {
                title: "Name",
                dataIndex: "name",
                showSorterTooltip: {
                  target: "full-header",
                },
                filters: [
                  {
                    text: "Joe",
                    value: "Joe",
                  },
                  {
                    text: "Jim",
                    value: "Jim",
                  },
                ],
                onFilter: (value: string, record: CategoryData) =>
                  record.name.indexOf(value) === 0,
                sorter: (a: CategoryData, b: CategoryData) =>
                  a.name.length - b.name.length,
                sortDirections: ["descend"],
              },
              {
                title: "serial code",
                dataIndex: "serialCode",
              },
              {
                title: "description",
                dataIndex: "description",
              },
              {
                title: "operation",
                dataIndex: "operation",
                render: (_: any, record: CategoryData) =>
                  tableData.length >= 1 ? (
                    <Popconfirm
                      title="Sure to delete?"
                      onConfirm={() => handleDelete(record.key!)}
                    >
                      <DeleteOutlined>Delete</DeleteOutlined>
                    </Popconfirm>
                  ) : null,
              },
            ]}
            dataSource={tableData}
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
            showSorterTooltip={{
              target: "sorter-icon",
            }}
          />
        )}
      </ConfigProvider>
    </>
  );
};

export default Category;
