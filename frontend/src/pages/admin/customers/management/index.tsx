import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tabs, Spin, notification, Space, Button, Typography, Flex } from 'antd';
import { GrafanaService } from '../../../../services/GrafanaService';
import { grafanaConfig } from '../../../../config';
import { IGrafanaOrg } from '../../../../interfaces';
import { CustomerDetails } from './tabs/details';
import { CustomerUsers } from './tabs/users';
// import { CustomerConfig } from './tabs/config';

export const CustomerManagement: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState<IGrafanaOrg>();
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();
    const grafanaService = new GrafanaService(grafanaConfig);

    useEffect(() => {
        const fetchOrganization = async () => {
            if (!id) return;
            
            try {
                const org = await grafanaService.getOrganization(Number(id));
                setOrganization(org);
            } catch (error) {
                api.error({
                    message: 'Error',
                    description: 'Failed to fetch organization details',
                });
                navigate('/admin/customers');
            } finally {
                setLoading(false);
            }
        };

        fetchOrganization();
    }, [id]);

    if (loading) {
        return <Card><Spin /></Card>;
    }

    if (!organization) {
        return <div>Organization not found</div>;
    }

    return (
        <div style={{ width: '100%' }}>
            <Flex justify="start" align="center" gap={16} style={{ width: '100%' }}>
                <Button onClick={() => navigate('/admin/customers')}>Back</Button>
                <Typography.Title level={3}>Managing organization: {organization.name}</Typography.Title>
            </Flex>
            <Card>
                {contextHolder}
                <Tabs
                defaultActiveKey="details"
                items={[
                    {
                        key: 'details',
                        label: 'Details',
                        children: <CustomerDetails customer={organization} />,
                    },
                    {
                        key: 'users',
                        label: 'Users',
                        children: <CustomerUsers customer={organization} />,
                    },
                    // {
                    //     key: 'config',
                    //     label: 'Configuration',
                    //     children: <CustomerConfig customer={organization} />,
                    // },
                ]}
            />
            </Card>
        </div>
    );
}; 