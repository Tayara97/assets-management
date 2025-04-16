import { Button, DatePicker, Form, Input, Select } from "antd";

const MaintenanceEditForm = ({
  onClick,
  onFinish,
  usersData,
  suppliersData,
}) => {
  const usersOption = usersData.map((user) => ({
    value: user.userId,
    label: `${user.firstName} ${user.lastName}`,
  }));
  const suppliersoption = suppliersData.map((supplier) => ({
    value: supplier.id,
    label: `${supplier.companyName} `,
  }));

  return (
    <div className="flex flex-col items-center w-[800px] gap-8 bg-white rounded-2xl border border-gray-200 px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 ">
      <Button type="default" onClick={onClick} className="self-end">
        X
      </Button>
      <Form
        name="basic"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        onFinish={onFinish}
        autoComplete="off"
        style={{ width: "400px" }}
      >
        <Form.Item
          label="Maintenance Date"
          name="maintenanceDate"
          rules={[
            {
              required: true,
              message: "Please input Maintenance Date",
            },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (value.toDate() > today) {
                  return Promise.reject(" Date cannot be in the future");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please input Description",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Maintenance Assigned To"
          name="toWhomOfUserId"
          rules={[
            { required: true, message: "Please enter Maintenance Assigned To" },
          ]}
        >
          <Select options={usersOption} />
        </Form.Item>
        <Form.Item
          label="Supplier Name"
          name="toWhomOfSupplierId"
          rules={[
            { required: true, message: "Please enter Maintenance Assigned To" },
          ]}
        >
          <Select options={suppliersoption} />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MaintenanceEditForm;
