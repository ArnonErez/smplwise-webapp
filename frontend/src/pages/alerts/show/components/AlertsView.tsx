import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import { useOne } from '@refinedev/core';
import { RESOURCES } from '../../../../constants';
import { ICustomer, IGrafanaOrg } from '../../../../interfaces';
import { GrafanaDashboard } from '../../../../components/grafana/Dashboard';
import { GrafanaService } from '../../../../services/GrafanaService';
import { grafanaConfig } from '../../../../config';

interface AlertsViewProps {
    customer: IGrafanaOrg;
    type: 'active' | 'history';
}

export const AlertsView: React.FC<AlertsViewProps> = ({
    customer,
    type
}) => {
    const [dashboardUid, setDashboardUid] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const grafanaService = new GrafanaService(grafanaConfig);

    useEffect(() => {
        const fetchDashboard = async () => {
            if (customer?.id) {
                try {
                    const dashboards = await grafanaService.getDashboards(
                        customer.id,
                        type === 'active' ? 'all active alerts' : 'alert history',
                        1
                    );
                    console.log("customer", customer);
                    console.log("dashboards", dashboards);
                    
                    if (dashboards && dashboards.length > 0) {
                        setDashboardUid(dashboards[0].uid);
                    }
                } catch (error) {
                    console.error('Error fetching dashboard:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchDashboard();
    }, [customer?.id, type]);

    if (loading) {
        return <Card><Spin /></Card>;
    }

    if (!dashboardUid) {
        return <Card>No {type} dashboard found.</Card>;
    }

    return (
        <GrafanaDashboard 
            orgId={customer.id || NaN}
            dashboardUid={dashboardUid}
            title={`${type === 'active' ? 'Active Alerts' : 'Alert History'}`}
        />
    );
}; 