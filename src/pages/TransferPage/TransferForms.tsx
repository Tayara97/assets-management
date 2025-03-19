import { Alert, Button, message } from "antd";
import { useState, useContext, useEffect } from "react";
import TransferUsersForm from "./TransferUsersForm";
import TransferLocationAndUser from "./TransferLocationAndUser";
import TransferLocationsForm from "../TransferPage/TransferLocationsForm";
import { AuthContext } from "../../context/AuthContext";
import { Asset } from "./TransferAssets";
interface TransferFormsProps {
  selectedAsset: Asset;
  setShowAllForms: (show: boolean) => void;
  getAllAssets: () => void;
}

const TransferForms: React.FC<TransferFormsProps> = ({
  selectedAsset,
  setShowAllForms,
  getAllAssets,
}) => {
  const { token } = useContext(AuthContext);
  const [showForm, setShowForm] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<Location[]>([]);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  //get location and handle transfer
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
      const data: Location[] = await response.json();
      const dataWithKeys = data.map((item) => ({ ...item, key: item.id }));
      setLocationData(dataWithKeys);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLocation = async (values: any) => {
    messageApi.destroy();
    const formToSend = {
      ...values,
      assetSerialNumber: selectedAsset.serialNumber,
    };
    const res = await fetch(
      "http://localhost:5243/api/AssetTransfer/TransferLocationToLocation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formToSend),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to get data from the backend");
    }

    messageApi.open({
      type: "success",

      content: "Transferd Successfully",
      style: {
        marginTop: "10vh",
      },
    });
    setTimeout(() => {
      setShowAllForms(false);
    }, 1000);
    getAllAssets();
  };
  const handleUserTransfer = async (values: any) => {
    messageApi.destroy();
    const formToSend = {
      ...values,
      assetSerialNumber: selectedAsset.serialNumber,
    };
    const res = await fetch(
      "http://localhost:5243/api/AssetTransfer/TransferUserToUser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formToSend),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to get data from the backend");
    }

    messageApi.open({
      type: "success",
      content: "Waiting to approve",
      style: {
        marginTop: "10vh",
      },
    });
    setTimeout(() => {
      setShowAllForms(false);
    }, 1000);
    getAllAssets();
  };
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

      const dataWithKeys = data.map((item) => ({ ...item, key: item.id }));
      setUsersData(dataWithKeys);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleLocationAndUser = async (values: any) => {
    messageApi.destroy();
    const formToSend = {
      ...values,
      assetSerialNumber: selectedAsset.serialNumber,
    };
    const res = await fetch(
      "http://localhost:5243/api/AssetTransfer/TransferUserAndLocation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formToSend),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to get data from the backend");
    }
    messageApi.open({
      type: "success",
      content: "Waiting to approve",
      style: {
        marginTop: "10vh",
      },
    });
    getAllAssets();
    setTimeout(() => {
      setShowAllForms(false);
    }, 1000);
  };

  useEffect(() => {
    getAllLocations();
    getAllUsers();
  }, []);
  return (
    <>
      {contextHolder}
      <Button
        className="self-start px-3 py-2 font-medium  rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 w-28"
        onClick={() => setShowAllForms(false)}
      >
        Back
      </Button>
      <div className="flex justify-center gap-8 mt-16">
        <Button onClick={() => setShowForm("user")}>Transfer User</Button>
        <Button onClick={() => setShowForm("location")}>
          Transfer Location
        </Button>
        <Button onClick={() => setShowForm("both")}>Transfer Both</Button>
      </div>
      <div className="form w-96 m-auto mt-10 text-center">
        {showForm === "location" && (
          <TransferLocationsForm
            selectedAsset={selectedAsset}
            locationData={locationData}
            onFinish={handleLocation}
          />
        )}
        {showForm === "user" && (
          <TransferUsersForm
            selectedAsset={selectedAsset}
            onFinish={handleUserTransfer}
            usersData={usersData}
          />
        )}
        {showForm === "both" && (
          <TransferLocationAndUser
            selectedAsset={selectedAsset}
            onFinish={handleLocationAndUser}
            locationData={locationData}
            usersData={usersData}
          />
        )}
      </div>
    </>
  );
};

export default TransferForms;
