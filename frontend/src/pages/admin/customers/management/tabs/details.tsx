import React from 'react';
import { Form, Input, Select, Button, Card, notification } from 'antd';
import { useUpdate } from '@refinedev/core';
import { IGrafanaOrg } from '../../../../../interfaces';
import { CUSTOMER_TYPES, CUSTOMER_STATUSES, RESOURCES } from '../../../../../constants';

interface CustomerDetailsProps {
    customer: IGrafanaOrg;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer }) => {
    const [form] = Form.useForm();
    const { mutate: update } = useUpdate();
    const [api, contextHolder] = notification.useNotification();

    const handleSubmit = async (values: any) => {
        try {
            await update({
                resource: RESOURCES.CUSTOMERS,
                id: customer.id,
                values: {
                    ...values,
                },
            });

            api.success({
                message: 'Success',
                description: 'Customer details updated successfully.',
            });
        } catch (error) {
            api.error({
                message: 'Error',
                description: 'Failed to update customer details.',
            });
        }
    };

    return (
        <Card>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                initialValues={customer}
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="name"
                    label="Customer Name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Type"
                    rules={[{ required: true }]}
                >
                    <Select options={Object.entries(CUSTOMER_TYPES).map(([key, value]) => ({
                        label: value,
                        value: value,
                    }))} />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true }]}
                >
                    <Select options={Object.entries(CUSTOMER_STATUSES).map(([key, value]) => ({
                        label: value,
                        value: value,
                    }))} />
                </Form.Item>

                <Form.Item
                    name="contact_email"
                    label="Contact Email"
                    rules={[{ required: true, type: 'email' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="phone" label="Phone">
                    <Input />
                </Form.Item>

                <Form.Item name="address" label="Address">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item name="website" label="Website">
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Details
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}; 