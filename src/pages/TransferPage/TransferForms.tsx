import { Button } from "antd";
import { useState, useContext } from "react";
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

  const handleLocation = async (values: any) => {
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

    getAllAssets();
    setShowAllForms(false);
  };

  const handleUserTransfer = async (values: any) => {
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

    getAllAssets();
    setShowAllForms(false);
    console.log(formToSend);
  };

  return (
    <>
      <Button onClick={() => setShowAllForms(false)}>Back</Button>
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
            onFinish={handleLocation}
          />
        )}
        {showForm === "user" && (
          <TransferUsersForm
            selectedAsset={selectedAsset}
            onFinish={handleUserTransfer}
          />
        )}
        {showForm === "both" && <TransferLocationAndUser />}
      </div>
    </>
  );
};

export default TransferForms;
