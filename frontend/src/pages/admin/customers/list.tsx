import React, { useState, useEffect } from 'react';
import { List, Table, Button, Space, Card, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CreateCustomer } from './components/CreateCustomer';
import { IGrafanaOrg } from '../../../interfaces';
import { GrafanaService } from '../../../services/GrafanaService';
import { grafanaConfig } from '../../../config';

export const CustomersList: React.FC = () => {
    const navigate = useNavigate();
    const [organizations, setOrganizations] = useState<IGrafanaOrg[]>([]);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();
    const grafanaService = new GrafanaService(grafanaConfig);

    const fetchOrganizations = async () => {
        try {
            const orgs = await grafanaService.getOrganizations();
            setOrganizations(orgs);
        } catch (error) {
            api.error({
                message: 'Error',
                description: 'Failed to fetch organizations',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: IGrafanaOrg) => (
                <Space>
                    <Button 
                        type="primary"
                        onClick={() => navigate(`/admin/customers/${record.id}`)}
                    >
                        Manage
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card>
            {contextHolder}
            <List
                header={
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <CreateCustomer onSuccess={fetchOrganizations} />
                    </div>
                }
            >
                <Table
                    dataSource={organizations}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                />
            </List>
        </Card>
    );
}; 