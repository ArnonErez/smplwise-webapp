import React from 'react';
import { Select, Space } from 'antd';
import { useList } from '@refinedev/core';
import { RESOURCES } from '../constants';
import { ICustomer } from '../interfaces';

interface CustomerSelectorProps {
    selectedCustomerId?: string;
    onCustomerSelect: (customerId: string) => void;
}

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({
    selectedCustomerId,
    onCustomerSelect,
}) => {
    const { data: customerData, isLoading } = useList<ICustomer>({
        resource: RESOURCES.CUSTOMERS,
        filters: [
            {
                field: 'grafana_enabled',
                operator: 'eq',
                value: true,
            },
        ],
    });

    return (
        <Space direction="horizontal" align="center">
            <span>Customer:</span>
            <Select
                style={{ width: 200 }}
                loading={isLoading}
                value={selectedCustomerId}
                onChange={onCustomerSelect}
                placeholder="Select a customer"
            >
                {customerData?.data?.map((customer) => (
                    <Select.Option key={customer.$id} value={customer.$id}>
                        {customer.name}
                    </Select.Option>
                ))}
            </Select>
        </Space>
    );
}; 