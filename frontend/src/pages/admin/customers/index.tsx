import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CustomersList } from './list';
import { CustomerManagement } from './management';

export const CustomersPage: React.FC = () => {
    return (
        <Routes>
            <Route index element={<CustomersList />} />
            <Route path=":id/*" element={<CustomerManagement />} />
        </Routes>
    );
}; 