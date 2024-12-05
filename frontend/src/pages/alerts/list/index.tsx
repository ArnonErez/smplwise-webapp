import React from 'react';
import { useList, useGetIdentity} from '@refinedev/core';
import { List } from '@refinedev/antd';
import { CustomerAlertsTable } from './components/CustomerAlertsTable';
import { ICustomer, IUser } from '../../../interfaces';
import { RESOURCES } from '../../../constants';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '../../../hooks/useAccess';
import { log } from 'console';

export const AlertsList: React.FC = () => {
    const { isAdmin } = useAccess();
    const navigate = useNavigate();

    // Fetch all customers the user has access to
    const { data, isLoading } = useList<ICustomer>({
        resource: RESOURCES.CUSTOMERS,
        filters: [
            {
                field: 'grafana_enabled',
                operator: 'eq',
                value: true,
            },
        ],
    });

    // If user only has access to one customer, redirect to that customer's view
    React.useEffect(() => {
        if (!isAdmin && data?.data?.length === 1) {
            navigate(`/alerts/${data.data[0].$id}/active`);
        }
    }, [data, isAdmin]);

    // If user only has access to one customer, don't show the list
    if (!isAdmin && data?.data?.length === 1) {
        return null;
    }

    console.log("data", data);
    return (
        <List title="Alerts by Customer" breadcrumb={false}>
            <CustomerAlertsTable 
                customers={data?.data} 
                loading={isLoading} 
            />
        </List>
    );
}; 