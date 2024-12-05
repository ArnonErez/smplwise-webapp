import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import { ICustomer, IGrafanaOrg } from '../../../../interfaces';
import { GrafanaDashboard } from '../../../../components/grafana/Dashboard';
import { GrafanaService } from '../../../../services/GrafanaService';
import { grafanaConfig } from '../../../../config';

interface Panel {
    id: number;
    title: string;
    type: string;
}

interface DashboardsViewProps {
    customer: IGrafanaOrg;
    dashboardUid: string;
    title: string;
}

export const DashboardsView: React.FC<DashboardsViewProps> = ({
    customer,
    dashboardUid,
    title
}) => {
    const [loading, setLoading] = useState(true);
    const [panels, setPanels] = useState<Panel[]>([]);
    const grafanaService = new GrafanaService(grafanaConfig);

    console.log("customer", customer, "dashboardUid", dashboardUid);

    useEffect(() => {
        const fetchPanels = async () => {
            if (customer.id && dashboardUid) {
                try {
                    const details = await grafanaService.getDashboard(
                        customer.id,
                        dashboardUid
                    );
                    console.log("details", details.dashboard);
                    setPanels(details.dashboard.panels);
                } catch (error) {
                    console.error('Error fetching panels:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPanels();
    }, [customer.id, dashboardUid]);

    // if (!customer.enabled) {
    //     return <Card>Grafana is not enabled for this customer.</Card>;
    // }

    if (loading) {
        return <Card><Spin /></Card>;
    }

    return (
        <GrafanaDashboard 
            orgId={customer.id || NaN}
            dashboardUid={dashboardUid}
            title={`${title}`}
            availablePanels={panels.map(p => ({ id: p.id, title: p.title }))}
        />
    );
}; 