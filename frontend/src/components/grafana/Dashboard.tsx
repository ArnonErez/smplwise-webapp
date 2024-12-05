import React, { useState, useContext, useMemo } from 'react';
import { Card, Flex, Space, Typography } from 'antd';
import { GrafanaControls } from './Controls';
import { ColorModeContext } from '../../contexts/color-mode';
import { grafanaConfig } from '../../config';

interface Panel {
    id: number;
    title: string;
}

interface GrafanaDashboardProps {
    orgId: number;
    dashboardUid: string;
    title: string;
    serviceToken?: string;
    availablePanels?: Panel[];
}

export const GrafanaDashboard: React.FC<GrafanaDashboardProps> = ({
    orgId,
    dashboardUid,
    title,
    serviceToken,
    availablePanels
}) => {
    const [timeRange, setTimeRange] = useState({ from: 'now-6h', to: 'now' });
    const [refreshRate, setRefreshRate] = useState('5s');
    const [visiblePanels, setVisiblePanels] = useState<Panel[]>(availablePanels || []);
    const { mode } = useContext(ColorModeContext);

    console.log("visiblePanels", visiblePanels);

    const buildUrl = () => {
        const baseUrl = `${grafanaConfig.baseUrl}/d/${dashboardUid}`;
        const params = new URLSearchParams({
            orgId: orgId.toString(),
            refresh: refreshRate,
            from: timeRange.from,
            to: timeRange.to,
            theme: mode,
            kiosk: '1',
        });

        return `${baseUrl}?${params.toString()}`;
    }

    const buildPanelUrl = (panelId: number) => {
        return `${buildUrl()}&viewPanel=${panelId}`;
    }

    const panels = visiblePanels.map((panel) => {
        return (
            <Card key={panel.id}>
                <iframe
                    src={buildPanelUrl(panel.id)}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                />
            </Card>
        )
    })

    return (
        <Space direction="vertical" style={{ width: '100%', height: '100%' }}>
            <Flex justify="flex-start" style={{ verticalAlign: 'middle', maxHeight: '42px' }}>
                <Typography.Title level={5} style={{ margin: 'auto 0' }}>{title}</Typography.Title>
                <GrafanaControls
                    // dashboardTitle={title}
                onTimeRangeChange={(from, to) => setTimeRange({ from, to })}
                // onPanelVisibilityChange={setVisiblePanels}
                // availablePanels={availablePanels}
            />
            </Flex>
            <div style={{height: '89vh'}}>
                <iframe
                    key={dashboardUid}
                    src={buildUrl()}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                />
            </div>
            {/* {panels} */}
        </Space>
    );
}; 