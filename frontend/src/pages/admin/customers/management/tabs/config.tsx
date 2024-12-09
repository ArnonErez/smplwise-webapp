// import React from 'react';
// import { Card, Form, Switch, Button, notification } from 'antd';
// import { useUpdate } from '@refinedev/core';
// import { IGrafanaOrg } from '../../../../../interfaces';
// import { RESOURCES } from '../../../../../constants';
// import { GrafanaService } from '../../../../../services/GrafanaService';
// import { grafanaConfig } from '../../../../../config';

// interface CustomerConfigProps {
//     customer: IGrafanaOrg;
// }

// export const CustomerConfig: React.FC<CustomerConfigProps> = ({ customer }) => {
//     const [form] = Form.useForm();
//     const { mutate: update } = useUpdate();
//     const [api, contextHolder] = notification.useNotification();
//     const grafanaService = new GrafanaService(grafanaConfig);

//     const handleSubmit = async (values: any) => {
//         try {
//             if (values.grafana_enabled && !customer.grafana_enabled) {
//                 // Enable Grafana
//                 const grafanaOrg = await grafanaService.createOrganization(customer.name);
                
//                 await update({
//                     resource: RESOURCES.CUSTOMERS,
//                     id: customer.$id,
//                     values: {
//                         ...values,
//                         grafana_orgId: grafanaOrg.orgId,
//                         grafana_orgName: grafanaOrg.name,
//                     },
//                 });
//             } else if (!values.grafana_enabled && customer.grafana_enabled) {
//                 // Disable Grafana
//                 if (customer.grafana_orgId) {
//                     await grafanaService.deleteOrganization(customer.grafana_orgId);
//                 }
                
//                 await update({
//                     resource: RESOURCES.CUSTOMERS,
//                     id: customer.$id,
//                     values: {
//                         ...values,
//                         grafana_orgId: null,
//                         grafana_orgName: null,
//                     },
//                 });
//             }

//             api.success({
//                 message: 'Success',
//                 description: 'Configuration updated successfully.',
//             });
//         } catch (error) {
//             api.error({
//                 message: 'Error',
//                 description: 'Failed to update configuration.',
//             });
//         }
//     };

//     return (
//         <Card>
//             {contextHolder}
//             <Form
//                 form={form}
//                 layout="vertical"
//                 initialValues={customer}
//                 onFinish={handleSubmit}
//             >
//                 <Form.Item
//                     name="grafana_enabled"
//                     label="Enable Grafana"
//                     valuePropName="checked"
//                 >
//                     <Switch />
//                 </Form.Item>

//                 <Form.Item>
//                     <Button type="primary" htmlType="submit">
//                         Save Configuration
//                     </Button>
//                 </Form.Item>
//             </Form>
//         </Card>
//     );
// }; 