import React, { useState } from 'react';
import { Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';
import { IGrafanaDashboard } from '../../../../interfaces';

interface Folder {
    uid: string;
    title: string;
    children?: Folder[];
}

interface NavigationBarProps {
    folders: Folder[];
    dashboardsByFolder: Record<string, IGrafanaDashboard[]>;
    activeFolder?: string;
    activeDashboard?: string;
    onFolderSelect: (folder: Folder) => void;
    onDashboardSelect: (dashboard: IGrafanaDashboard) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
    folders,
    dashboardsByFolder,
    activeFolder,
    activeDashboard,
    onFolderSelect,
    onDashboardSelect
}) => {
    const { token } = theme.useToken();
    const [openKeys, setOpenKeys] = useState<string[]>([]);

    const renderMenuItems = (folder: Folder): ItemType => {
        if (folder.uid === "sharedwithme") return null;
        const dashboards = dashboardsByFolder[folder.uid] || [];
        
        const children = [
            ...(folder.children?.map(renderMenuItems).filter(Boolean) || []),
            ...dashboards.map(dashboard => ({
                key: dashboard.uid,
                label: dashboard.title,
                onClick: () => {
                    onFolderSelect(folder);
                    onDashboardSelect(dashboard);
                }
            }))
        ];

        if (children.length === 0) return null;

        return {
            key: folder.uid,
            label: folder.title,
            children,
            onClick: () => {
                onFolderSelect(folder);
            }
        };
    };

    const menuItems = folders
        .filter(folder => !folder.title.toLowerCase().includes('alert'))
        .map(renderMenuItems)
        .filter(Boolean);

    const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
        setOpenKeys(keys);
    };

    return (
        <Menu
            mode="horizontal"
            theme="dark"
            selectedKeys={activeDashboard ? [activeDashboard] : []}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            items={menuItems}
            style={{ 
                background: 'transparent',
                borderBottom: 'none',
                flex: 1,
                marginLeft: window.innerWidth < 768 ? 12 : 0,
                maxHeight: '5vh',
                // height: 'fit-content',
            }}
        />
    );
}; 