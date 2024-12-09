import React, { useState } from 'react';
import { Modal, Form, Input, Button, notification } from 'antd';
import { GrafanaService } from '../../../../services/GrafanaService';
import { grafanaConfig } from '../../../../config';
import { IGrafanaOrgCreate } from '../../../../interfaces';

interface CreateCustomerProps {
    onSuccess?: () => void;
}

export const CreateCustomer: React.FC<CreateCustomerProps> = ({ onSuccess }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const grafanaService = new GrafanaService(grafanaConfig);

    const handleSubmit = async (values: IGrafanaOrgCreate) => {
        try {
            await grafanaService.createOrganization(values);
            
            api.success({
                message: 'Success',
                description: 'Organization created successfully.',
            });

            setIsModalVisible(false);
            form.resetFields();
            onSuccess?.();
        } catch (error) {
            api.error({
                message: 'Error',
                description: 'Failed to create organization.',
            });
        }
    };

    return (
        <>
            {contextHolder}
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Create Organization
            </Button>

            <Modal
                title="Create Organization"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Organization Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}; 