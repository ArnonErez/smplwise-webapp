import React from 'react';
import { CanAccess } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";
import { IUser } from "../interfaces";

export const AccessControl: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { data: user } = useGetIdentity<IUser>();

  return (
    <CanAccess
      resource="admin"
      action="list"
      params={{ user }}
      fallback={<div>You don't have permission to access this page.</div>}
    >
      {children}
    </CanAccess>
  );
};
