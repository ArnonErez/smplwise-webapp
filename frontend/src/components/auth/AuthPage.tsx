// import React from "react";
// import { useLogin } from "@refinedev/core";
// import { Button, Card, Form, Input, Typography, theme, notification, Flex } from "antd";
// import { Logo } from '../Logo';

// const { Title, Text } = Typography;

// export const AuthPage: React.FC = () => {
//   const { mutate: login, isLoading } = useLogin();
//   const { token } = theme.useToken();
//   const [api, contextHolder] = notification.useNotification();

//   const onFinish = async (values: { username: string; password: string }) => {
//     try {
//       console.log('Attempting to login', values)
//       await login(values);
//     } catch (error: any) {
//       api.error({
//         message: "Login Failed",
//         description: error.message,
//       });
//     }
//   };

//   return (
//     <Flex
//       vertical
//       align="center"
//       justify="center"
//       style={{
//         height: "100vh",
//         backgroundColor: token.colorBgBase,
//       }}
//     >
//       {contextHolder}
//       <div style={{ maxWidth: "400px", width: "100%", padding: "16px"}}>
//         <Card style={{ backgroundColor: token.colorBgSpotlight }}>
//           <Flex
//             vertical
//             align="center"
//             justify="center"
//             style={{
//               marginBottom: "40px",
//               gap: "1px"
//             }}
//           >
           
//             {/* <Logo type="partner" style={{width: 'auto', height: 60}} /> */}
//             {/* <Text style={{ fontSize: "16px", fontWeight: "bold" }}>Powered By</Text> */}
//             <Logo color={token.colorPrimary} style={{width: 'auto', height: 80}} />
//             <Text style={{ fontSize: "24px", fontWeight: "bold" }}>NOC</Text>
//           </Flex>
//           <Form<{ username: string; password: string }>
//             layout="vertical"
//             onFinish={onFinish}
//             requiredMark={false}
//           >
//             <Form.Item
//               name="username"
//               label="Username"
//               rules={[
//                 { required: true, message: "Username is required" },
//               ]}
//             >
//               <Input size="large" placeholder="Enter your username" />
//             </Form.Item>
//             <Form.Item
//               name="password"
//               label="Password"
//               rules={[{ required: true, message: "Password is required" }]}
//             >
//               <Input.Password size="large" placeholder="●●●●●●●●" />
//             </Form.Item>
//             <Form.Item>
//               <Button 
//                 type="primary" 
//                 htmlType="submit" 
//                 block 
//                 loading={isLoading}
//                 style={{ 
//                   backgroundColor: token.colorPrimary,
//                   color: '#ffffff',
//                 }}
//               >
//                 Sign in
//               </Button>
//             </Form.Item>
//             <Typography.Link 
//               style={{ color: token.colorText }} 
//               href="#"
//             >
//               Forgot password?
//             </Typography.Link>
//           </Form>
//         </Card>
//       </div>
//     </Flex>
//   );
// }; 