import { Button, Form, Input, Select, DatePicker, InputNumber } from "antd";

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
    <div className="flex flex-col items-center  w-full  bg-white rounded-2xl border border-gray-200 px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-[#101828] sm:px-6 sm:pt-6 ">
      <Button
        type="default"
        onClick={onClick}
        className="self-end ant-btn css-dev-only-do-not-override-240cud ant-btn-default ant-btn-color-default ant-btn-variant-outlined px-3 py-2 font-medium  rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 "
      >
        X
      </Button>
      <Form
        className="grid grid-cols-2 gap-8 "
        name="basic"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Asset Name"
          name="Name"
          rules={[{ required: true, message: "Please input Asset name" }]}
        >
          <Input className=" border-[#d9d9d9] rounded-lg h-8 dark:bg-transparent dark:border-[#434343]" />
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
          <Input className=" border-[#d9d9d9] rounded-lg h-8 dark:bg-transparent dark:border-[#434343]" />
        </Form.Item>
        <Form.Item
          label="Serial Number"
          name="SerialNumber"
          rules={[{ required: true, message: "Please input Serial Number" }]}
        >
          <Input className=" border-[#d9d9d9] rounded-lg h-8 dark:bg-transparent dark:border-[#434343]" />
        </Form.Item>
        <Form.Item
          label="Purchase Date"
          name="PurchaseDate"
          rules={[{ required: true, message: "Please input Purchase Date" }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item label="Description" name="dicription">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Depreciation Date"
          name="DepreciationDate"
          rules={[
            { required: true, message: "Please input Depreciation Date" },
          ]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          label="Purchase Price"
          name="PurchasePrice"
          rules={[{ required: true, message: "Please input Purchase Price" }]}
        >
          <Input className=" border-[#d9d9d9] rounded-lg h-8 dark:bg-transparent dark:border-[#434343]" />
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
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          label="Location"
          name="LocationId"
          rules={[{ required: true, message: "Please input location" }]}
        >
          <Select
            placeholder="Select Location"
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
            placeholder="Select Manufacturer"
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
            placeholder="Select User"
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
            placeholder="Select Supplier"
            options={suppliers.map((obj) => ({
              label: obj.email,
              value: obj.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Status"
          name="Status"
          rules={[{ required: true, message: "Please input Status" }]}
        >
          <Select
            placeholder="Select Status"
            options={[
              { value: "Active", label: "Active" },
              { value: "InRepair", label: "InRepair" },
              { value: "Retired", label: "Retired" },
            ]}
          />
        </Form.Item>
        <Form.Item
          label={null}
          wrapperCol={{ span: 24 }}
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ItForm;
