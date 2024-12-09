import React, { useState, useEffect } from 'react';
import { useList } from '@refinedev/core';
import { List } from '@refinedev/antd';
import { Tree, Card, Spin } from 'antd';
import { FolderOutlined, DashboardOutlined } from '@ant-design/icons';
import { ICustomer, IGrafanaDashboard } from '../../../interfaces';
import { RESOURCES } from '../../../constants';
import { GrafanaService } from '../../../services/GrafanaService';
import type { DataNode } from 'antd/es/tree';
import { useNavigate, useParams } from 'react-router-dom';
import { grafanaConfig } from '../../../config';

interface Folder {
    uid: string;
    title: string;
    children?: Folder[];
}

interface Dashboard {
    uid: string;
    title: string;
    folderUid: string;
}

export const DashboardsList: React.FC = () => {
    const { customerId } = useParams();
    const [loading, setLoading] = useState(true);
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const grafanaService = new GrafanaService(grafanaConfig);
    const navigate = useNavigate();

    const { data: customerData, isLoading: isCustomerLoading } = useList<ICustomer>({
        resource: RESOURCES.CUSTOMERS,
        filters: [
            {
                field: '$id',
                operator: 'eq',
                value: customerId,
            },
        ],
    });

    const buildTreeData = (folder: Folder | null | undefined, dashboardsByFolder: Record<string, IGrafanaDashboard[]>): DataNode | null => {
        if (!folder || 
            folder.uid === "sharedwithme" || 
            folder.title.toLowerCase().includes('alert')) {
            return null;
        }

        const dashboards = dashboardsByFolder[folder.uid] || [];
        
        const children: DataNode[] = [];

        if (folder.children && Array.isArray(folder.children)) {
            const childFolders = folder.children
                .map(childFolder => buildTreeData(childFolder, dashboardsByFolder))
                .filter((node): node is DataNode => node !== null);
            children.push(...childFolders);
        }

        const dashboardNodes = dashboards.map(dashboard => ({
            key: dashboard.uid,
            title: dashboard.title,
            icon: <DashboardOutlined />,
            isLeaf: true,
        }));
        children.push(...dashboardNodes);

        if (children.length === 0) return null;

        return {
            key: folder.uid,
            title: folder.title,
            icon: <FolderOutlined />,
            children,
        };
    };

    useEffect(() => {
        const fetchFoldersAndDashboards = async () => {
            if (customerData?.data?.[0]?.grafana_orgId) {
                try {
                    const customer = customerData.data[0];
                    const [folders, dashboards] = await Promise.all([
                        grafanaService.getFolderHierarchy(customer.grafana_orgId || NaN),
                        grafanaService.getDashboards(customer.grafana_orgId || NaN)
                    ]);

                    const dashboardsByFolder = (dashboards || []).reduce((acc: Record<string, IGrafanaDashboard[]>, dashboard: IGrafanaDashboard) => {
                        if (!dashboard) return acc;
                        const folderUid = dashboard.folderUid || 'general';
                        if (!acc[folderUid]) {
                            acc[folderUid] = [];
                        }
                        acc[folderUid].push(dashboard);
                        return acc;
                    }, {});

                    const transformedTreeData = (folders || [])
                        .map(folder => buildTreeData(folder, dashboardsByFolder))
                        .filter((node): node is DataNode => node !== null);

                    setTreeData(transformedTreeData);
                } catch (error) {
                    console.error('Error fetching folders and dashboards:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchFoldersAndDashboards();
    }, [customerData]);

    if (isCustomerLoading || loading) {
        return <Card><Spin /></Card>;
    }

    const navigateToDashboard = (dashboardUid: string) => {
        navigate(`/dashboards/${customerId}/${dashboardUid}`);
    };

    console.log("treeData", treeData);

    return (
        <List title="Dashboards" breadcrumb={false}>
            <Tree
                treeData={treeData}
                showIcon
                defaultExpandAll
                showLine={{ showLeafIcon: false }}
                onSelect={(selectedKeys, info) => navigateToDashboard(selectedKeys[0] as string)}
            />
        </List>
    );
}; 