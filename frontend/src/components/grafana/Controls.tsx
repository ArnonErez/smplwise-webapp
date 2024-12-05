import React, { useState } from 'react';
import { Card, DatePicker, Space, Checkbox, Dropdown, Button, Typography } from 'antd';
import { CalendarOutlined, DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { DatePickerProps } from 'antd';

const { RangePicker } = DatePicker;

interface Panel {
    id: number;
    title: string;
}

interface GrafanaControlsProps {
    // dashboardTitle: string;
    onTimeRangeChange: (from: string, to: string) => void;
    // onPanelVisibilityChange: (panels: Panel[]) => void;
    // availablePanels?: Panel[];
}

export const GrafanaControls: React.FC<GrafanaControlsProps> = ({
    // dashboardTitle,
    onTimeRangeChange,
    // onPanelVisibilityChange,
    // availablePanels = []
}) => {
    // const [selectedPanels, setSelectedPanels] = useState<Panel[]>(availablePanels);
    const [selectedRange, setSelectedRange] = useState<string>('Last 6 hours');

    const quickTimeRanges = [
        { label: 'Last hour', value: 'now-1h' },
        { label: 'Last 3 hours', value: 'now-3h' },
        { label: 'Last 6 hours', value: 'now-6h' },
        { label: 'Last 12 hours', value: 'now-12h' },
        { label: 'Last 24 hours', value: 'now-24h' },
        { label: 'Last 7 days', value: 'now-7d' },
    ];

    const [showDatePicker, setShowDatePicker] = useState(false);

    const renderExtraFooter = () => (
        <Space direction="vertical" style={{ padding: '8px' }}>
            {quickTimeRanges.map(range => (
                <Button
                    key={range.value}
                    type="text"
                    block
                    onClick={() => {
                        onTimeRangeChange(range.value, 'now');
                        setSelectedRange(range.label);
                    }}
                >
                    {range.label}
                </Button>
            ))}
        </Space>
    );

    return (
        <Card size="small" bordered={false} style={{maxHeight: '6vh'}}>
            <Space>
                {/* <Typography.Text>{dashboardTitle}</Typography.Text> */}
                <Button 
                    icon={<CalendarOutlined />}
                    // hidden={dashboardTitle.toLowerCase().startsWith("active")}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                />
                {showDatePicker && (
                    <DatePicker.RangePicker
                        style={{ width: 'auto' }}
                        showTime
                        onChange={(dates) => {
                            if (dates) {
                                onTimeRangeChange(
                                    dates[0]?.unix().toString() || 'now-6h',
                                    dates[1]?.unix().toString() || 'now'
                                );
                                setSelectedRange('Custom Range');
                            }
                        }}
                        popupClassName="custom-range-picker"
                        renderExtraFooter={renderExtraFooter}
                        suffixIcon={<CalendarOutlined />}
                        placeholder={['Start date', 'End date']}
                        bordered={false}
                            allowClear={false}
                    />
                )}

                {/* <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'all',
                                label: (
                                    <Checkbox
                                        checked={selectedPanels.length === availablePanels.length}
                                        onChange={e => {
                                            const newSelection = e.target.checked ? availablePanels : [];
                                            setSelectedPanels(newSelection);
                                            onPanelVisibilityChange(newSelection);
                                        }}
                                    >
                                        Select All
                                    </Checkbox>
                                )
                            },
                            { type: 'divider' },
                            ...availablePanels.map(panel => ({
                                key: panel.id.toString(),
                                label: (
                                    <Checkbox
                                        checked={selectedPanels.some(p => p.id === panel.id)}
                                        onChange={e => {
                                            const newSelection = e.target.checked 
                                                ? [...selectedPanels, panel]
                                                : selectedPanels.filter(p => p.id !== panel.id);
                                            setSelectedPanels(newSelection);
                                            onPanelVisibilityChange(newSelection);
                                        }}
                                    >
                                        {panel.title}   
                                    </Checkbox>
                                )
                            }))
                        ]
                    }}
                >
                    <Button>
                        Panels <DownOutlined />
                    </Button>
                </Dropdown> */}
            </Space>
        </Card>
    );
}; 