import React from 'react';
import { Table, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { ICustomer } from '../../../../interfaces';

interface CustomerAlertsTableProps {
    customers?: ICustomer[];
    loading?: boolean;
}

export const CustomerAlertsTable: React.FC<CustomerAlertsTableProps> = ({
    customers,
    loading
}) => {
    const columns = [
        {
            title: 'Customer',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: ICustomer) => (
                <Link to={`/alerts/${record.id}/active`}>{name}</Link>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'success' : 'default'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
    ];

    return (
        <Table
            dataSource={customers}
            columns={columns}
            loading={loading}
            rowKey="id"
        />
    );
}; 