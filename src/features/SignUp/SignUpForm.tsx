import React, { useState } from "react";
import { PageHeader, Form, Input, Button, Radio, message } from "antd";
import { Services } from "../../app/api/agent";

export const SignUpForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const options = [
    { label: "Regular User", value: false },
    { label: "Admin User", value: true },
  ];

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await Services.UserService.createUser({
        email: values.email,
        password: values.password,
        isAdmin: values.role,
      });
      setLoading(false);
      message.success("User Successfully created!");
      form.resetFields();
    } catch (error) {
      setLoading(false);

      if (error.response === undefined) {
        message.error("Server not running. Please try again later");
      } else if (error.response.status === 400) {
        message.error("User already exist");
      } else {
        message.error("Server Error. Please try again later");
      }
    }
  };

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Create New User"
        subTitle="Accessible only to Admin Users"
      />
      <Form
        form={form}
        style={{ width: 400, margin: "20px auto" }}
        layout="vertical"
        initialValues={{ role: false }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: "Please input your email address!" },
          ]}
        >
          <Input type="email" placeholder="example@xyz.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          hasFeedback
        >
          <Input.Password type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please re-type your password again!" },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "The two passwords that you entered do not match!"
                );
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password type="password" placeholder="Confirm Password" />
        </Form.Item>

        <Form.Item label="User Role" name="role">
          <Radio.Group options={options} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Create User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
