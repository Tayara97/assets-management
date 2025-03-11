import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button, Popconfirm, Table } from "antd";

const AssetsTransferRequest = () => {
  const [assignedAssets, setAssignedAssets] = useState([]);
  const { token } = useContext(AuthContext);

  const getAssignedAssets = async () => {
    try {
      const response = await fetch(
        "http://localhost:5243/api/AssetTransfer/GetAssetForCurrentUser/GetAssetForCurrentUser",
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

      const dataWithKeys = data.map((item, i) => ({ ...item, key: i }));
      setAssignedAssets(dataWithKeys);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAssignedAssets();
  }, []);
  const handleApproveRequest = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5243/api/AssetTransfer/ApproveTransfer/${id}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      getAssignedAssets();
    } catch (error) {
      console.log(error);
    }
  };
  const handleRejectRequest = async (id) => {
    console.log(id);
    try {
      const response = await fetch(
        `http://localhost:5243/api/AssetTransfer/RejectTransfer/${id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        console.log(response);
        throw new Error("Something went wrong");
      }

      getAssignedAssets();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Table
      className="table"
      columns={[
        {
          title: "Asset Name",
          dataIndex: "assetName",
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
          title: "From User",
          dataIndex: "fromUserName",
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
          dataIndex: "toLocationName",
        },

        {
          title: "Status",
          dataIndex: "status",
        },
        {
          title: "Actions",
          dataIndex: "actions",
          render: (_, record) => {
            return assignedAssets.length >= 1 ? (
              <>
                <Popconfirm
                  title="Are you sure to approve this request?"
                  onConfirm={() => handleApproveRequest(record.id)}
                >
                  <Button>Approve</Button>
                </Popconfirm>
                <Popconfirm
                  title="Are you sure to approve this request?"
                  onConfirm={() => handleRejectRequest(record.id)}
                >
                  <Button>Reject</Button>
                </Popconfirm>
              </>
            ) : null;
          },
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

export default AssetsTransferRequest;
