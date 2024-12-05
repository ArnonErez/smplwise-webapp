import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Card, Select } from 'antd';
import { IGrafanaOrg, IGrafanaOrgUser, IGrafanaUser, IGrafanaUserCreate } from '../../../../../interfaces';
import { GrafanaService } from '../../../../../services/GrafanaService';
import { grafanaConfig } from '../../../../../config';

interface CustomerUsersProps {
    customer: IGrafanaOrg;
}


export const CustomerUsers: React.FC<CustomerUsersProps> = ({ customer }) => {
    const [users, setUsers] = useState<IGrafanaOrgUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const grafanaService = new GrafanaService(grafanaConfig);

    const fetchUsers = async () => {
        if (!customer.id) return;
        
        try {
            const orgUsers = await grafanaService.getOrganizationUsers(customer.id);
            setUsers(orgUsers);
        } catch (error) {
            api.error({
                message: 'Error',
                description: 'Failed to fetch users.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [customer.id]);

    const handleAddUser = async (values: any) => {
        const userData: IGrafanaUserCreate = {
            name: values.name,
            login: values.name,
            email: values.email,
            password: values.password,
            role: values.role,
        };
        try {
            await grafanaService.addUserToOrganization(
                customer.id,
                userData
            );

            api.success({
                message: 'Success',
                description: 'User added successfully.',
            });

            setIsModalVisible(false);
            form.resetFields();
            fetchUsers();
        } catch (error) {
            api.error({
                message: 'Error',
                description: 'Failed to add user.',
            });
        }
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'login',
            key: 'login',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
    ];

    return (
        <Card>
            {contextHolder}
            <Table
                columns={columns}
                dataSource={users}
                loading={loading}
                rowKey="userId"
            />
            <Button onClick={() => setIsModalVisible(true)}>Add User</Button>
            <Modal
                title="Add User"
                visible={isModalVisible}
                onOk={() => handleAddUser(form.getFieldsValue())}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Select.Option value="viewer">Viewer</Select.Option>
                            <Select.Option value="editor">Editor</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}; 