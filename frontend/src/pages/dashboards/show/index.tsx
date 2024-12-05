import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Space, Card, Spin, theme, Flex } from 'antd';
import { ExpandOutlined, CompressOutlined } from '@ant-design/icons';
// import { useAccess } from '../../../hooks/useAccess';
import { GrafanaService } from '../../../services/GrafanaService';
import { DashboardsView } from './components/DashboardsView';
import { IGrafanaOrg, IGrafanaDashboard } from '../../../interfaces';
import { NavigationBar } from './components/NavigationBar';
import { grafanaConfig } from '../../../config';
import { useAuth } from 'react-oidc-context';

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

export const DashboardShow: React.FC = () => {
    const { customerId } = useParams();
    // const { isAdmin } = useAccess();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [organization, setOrganization] = useState<IGrafanaOrg>();
    const [dashboards, setDashboards] = useState<IGrafanaDashboard[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [activeFolder, setActiveFolder] = useState<string>();
    const [activeDashboard, setActiveDashboard] = useState<string>();
    const [isContentFullscreen, setIsContentFullscreen] = useState(false);
    const [dashboardsByFolder, setDashboardsByFolder] = useState<Record<string, IGrafanaDashboard[]>>({});
    const { token } = theme.useToken();
    
    const grafanaService = new GrafanaService(grafanaConfig);

    useEffect(() => {
        const fetchOrganization = async () => {
            if (!customerId) return;
            
            try {
                const org = await grafanaService.getOrganization(Number(customerId));
                setOrganization(org);
            } catch (error) {
                console.error('Error fetching organization:', error);
            }
        };

        fetchOrganization();
    }, [customerId]);

    useEffect(() => {
        const fetchFoldersAndDashboards = async () => {
            if (!organization?.id) return;

            try {
                console.log("Fetching folders and dashboards for organization", organization.id);
                const [foldersData, dashboardsData] = await Promise.all([
                    grafanaService.getFolderHierarchy(organization.id),
                    grafanaService.getDashboards(organization.id)
                ]);

                setDashboards(dashboardsData);

                const transformFolderHierarchy = (folder: any): Folder => ({
                    uid: folder.uid,
                    title: folder.title,
                    children: folder.children?.map(transformFolderHierarchy)
                });

                const transformedFolders = foldersData.map(transformFolderHierarchy);
                setFolders(transformedFolders);
                
                const dashboardsByFolder = dashboardsData.reduce((acc: Record<string, IGrafanaDashboard[]>, dashboard: IGrafanaDashboard) => {
                    const folderUid = dashboard.folderUid || 'general';
                    if (!acc[folderUid]) acc[folderUid] = [];
                    acc[folderUid].push(dashboard);
                    return acc;
                }, {});

                setDashboardsByFolder(dashboardsByFolder);
            } catch (error) {
                console.error('Error fetching folders and dashboards:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFoldersAndDashboards();
    }, [organization?.id]);

    const toggleContentFullscreen = () => {
        const contentElement = document.getElementById('dashboard-content');
        if (!document.fullscreenElement && contentElement) {
            contentElement.requestFullscreen();
            setIsContentFullscreen(true);
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
            setIsContentFullscreen(false);
        }
    };

    if (loading) {
        return <Card><Spin /></Card>;
    }

    if (!organization) {
        return <div>Organization not found</div>;
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Flex 
                style={{ 
                    // padding: '8px', 
                    maxHeight: '5vh', 
                    fontWeight: 600,
                }}
            >
                <NavigationBar
                    folders={folders}
                    dashboardsByFolder={dashboardsByFolder}
                    activeFolder={activeFolder}
                    activeDashboard={activeDashboard}
                    onFolderSelect={(folder) => {
                        setActiveFolder(folder.uid);
                    }}
                    onDashboardSelect={(dashboard) => {
                        setActiveDashboard(dashboard.uid);
                    }}
                />
            </Flex>
            
            {activeDashboard && (
                <div id="dashboard-content" style={{ flex: 1, position: 'relative' }}>
                    <Button 
                        icon={isContentFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
                        onClick={toggleContentFullscreen}
                        style={{ position: 'absolute', right: 16, top: 16, zIndex: 1000 }}
                    />
                    <DashboardsView 
                        customer={organization}
                        dashboardUid={activeDashboard}
                        title={dashboards.find(d => d.uid === activeDashboard)?.title || ''}
                    />
                </div>
            )}
        </div>
    );
}; 