import React from 'react';

export enum RoleKeys {
  UserId = 'UserId',
  RoleId = 'Role'
}

interface AssignRoleField {
  label: string;
  placeholder: string;
  type: React.HTMLInputTypeAttribute;
  key: RoleKeys;
  message: string;
}

export const AssignRoleFields: AssignRoleField[] = [
  {
    key: RoleKeys.UserId,
    label: 'UserId',
    placeholder: 'UserId you need to assign role to',
    type: 'text',
    message: 'Please provide a valid userId'
  },
  {
    key: RoleKeys.RoleId,
    label: 'Role',
    placeholder: 'Role',
    type: 'text',
    message: 'Please provide a valid role'
  }
];
