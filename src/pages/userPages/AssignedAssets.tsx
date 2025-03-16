import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Table } from "antd";
const AssignedAssets = () => {
  const [assignedAssets, setAssignedAssets] = useState([]);
  const { token } = useContext(AuthContext);

  const getAssignedAssets = async () => {
    try {
      const response = await fetch(
        "http://localhost:5243/api/Asset/GetAssetForCurrentUser",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      console.log(data);
      const dataWithKeys = data.map((item, i) => ({ ...item, key: i }));
      setAssignedAssets(dataWithKeys);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAssignedAssets();
  }, []);
  return (
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

          // here is that finding the name started with `value`
          onFilter: (value, record) => record.name.indexOf(value) === 0,
          sorter: (a, b) => a.name.length - b.name.length,
          sortDirections: ["descend"],
        },
        {
          title: "category",
          dataIndex: "categoryName",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.categoryName.localeCompare(b.category),
        },
        {
          title: "model_number",
          dataIndex: "modelNumber",
        },
        {
          title: "serial Number",
          dataIndex: "serialNumber",
        },
        {
          title: "Purchase Date",
          dataIndex: "purchaseDate",
        },

        {
          title: "Purchase Price",
          dataIndex: "purchasePrice",
        },

        {
          title: "Warranty",
          dataIndex: "warrantyExpiryDate",
        },

        {
          title: "Assigned to",
          dataIndex: "assignedUserName",
          filters: [
            {
              text: "user",
              value: "user",
            },
          ],
          onFilter: (value, record) => record.address.indexOf(value) === 0,
        },
        {
          title: "Location",
          dataIndex: "locationName",
        },
        {
          title: "supplier Names",
          dataIndex: "supplierNames",
        },
        {
          title: "Status",
          dataIndex: "status",
        },
      ]}
      dataSource={assignedAssets}
      // onChange={onChange}
      showSorterTooltip={{
        target: "sorter-icon",
      }}
    />
  );
};

export default AssignedAssets;
