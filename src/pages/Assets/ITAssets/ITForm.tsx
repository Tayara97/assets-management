import { Button, Form, Input, Select, DatePicker, InputNumber } from "antd";
import moment from "moment";

interface ItFormProps {
  onFinish: (values: any) => void;
  onFinishFailed: (values: any) => void;
  onClick: () => void;
  allLocations: Location[];
  allCategory: Category[];
  suppliers: Supplier[];
  allManufacturers: Manufacturer[];
  allUsers: User[];
}

const ItForm: React.FC<ItFormProps> = ({
  onFinish,
  onFinishFailed,
  onClick,
  allLocations,
  allCategory,
  suppliers,
  allManufacturers,
  allUsers,
}) => {
  return (
    <>
      <Button type="default" onClick={onClick}>
        X
      </Button>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Asset Name"
          name="Name"
          rules={[{ required: true, message: "Please input Asset name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Category"
          name="CategoryId"
          rules={[{ required: true, message: "Please input category" }]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            placeholder="Select Category"
            style={{ width: 120 }}
            options={allCategory.map((cat) => ({
              label: cat.name,
              value: cat.serialCode,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Model Number"
          name="ModelNumber"
          rules={[{ required: true, message: "Please input Model Number" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Serial Number"
          name="SerialNumber"
          rules={[{ required: true, message: "Please input Serial Number" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Purchase Date"
          name="PurchaseDate"
          rules={[{ required: true, message: "Please input Purchase Date" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="Depreciation Date"
          name="DepreciationDate"
          rules={[
            { required: true, message: "Please input Depreciation Date" },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="Purchase Price"
          name="PurchasePrice"
          rules={[{ required: true, message: "Please input Purchase Price" }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Warranty"
          name="WarrantyExpiryDate"
          dependencies={["PurchaseDate"]}
          rules={[
            { required: true, message: "Please input Warranty Date" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const purchaseDate = getFieldValue("PurchaseDate");
                if (!purchaseDate || !value || value.isAfter(purchaseDate)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Warranty must be after Purchase Date")
                );
              },
            }),
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item label="Description" name="dicription">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Location"
          name="LocationId"
          rules={[{ required: true, message: "Please input location" }]}
        >
          <Select
            style={{ width: 120 }}
            options={allLocations.map((obj) => ({
              label: obj.name,
              value: obj.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Manufacturer"
          name="ManufacturerId"
          rules={[{ required: true, message: "Please input Manufacturer" }]}
        >
          <Select
            style={{ width: 120 }}
            options={allManufacturers.map((obj) => ({
              label: obj.name,
              value: obj.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Assigned User"
          name="AssignedUserId"
          rules={[{ required: true, message: "Please input user" }]}
        >
          <Select
            style={{ width: 120 }}
            options={allUsers.map((obj) => ({
              label: obj.firstName,
              value: obj.userId,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Supplier Names"
          name="SupplierIds"
          rules={[{ required: true, message: "Please input supplier" }]}
        >
          <Select
            style={{ width: 120 }}
            options={suppliers.map((obj) => ({
              label: obj.email,
              value: obj.id,
            }))}
          />
        </Form.Item>
        <Form.Item label="Status" name="Status">
          <Select
            style={{ width: 120 }}
            options={[{ value: "Active", label: "Active" }]}
          />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ItForm;
