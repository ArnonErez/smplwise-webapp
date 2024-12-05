import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Spin } from 'antd';
import { useGetIdentity, useList } from "@refinedev/core";
import { AlertsView } from './components/AlertsView';
import { IGrafanaUser, IGrafanaOrg } from '../../../interfaces';
import { RESOURCES } from '../../../constants';

export const AlertsShow: React.FC = () => {
    const { customerId } = useParams();
    const { data: user } = useGetIdentity<IGrafanaUser>();

    // For regular users, we get their customer data based on permissions
    // For admin/noc users, we filter by team_id matching the customerId
    const { data: customerData, isLoading } = useList<IGrafanaOrg>({
        resource: RESOURCES.CUSTOMERS,
        filters: [
            {
                field: 'id',
                operator: 'eq',
                value: customerId,
            }
        ],
        queryOptions: {
            enabled: !!customerId,
        },
    });

    if (isLoading) {
        return <Spin />;
    }

    const customer = customerData?.data?.[0];

    if (!customer) {
        return <div>Customer not found</div>;
    }

    return (
        <Tabs
            size="small"
            items={[
                {
                    key: 'active',
                    label: 'Active Alerts',
                    children: (
                        <AlertsView 
                            customer={customer}
                            type="active"
                        />
                    ),
                },
                {
                    key: 'history',
                    label: 'Alert History',
                    children: (
                        <AlertsView 
                            customer={customer}
                            type="history"
                        />
                    ),
                },
            ]}
        />
    );
}; 