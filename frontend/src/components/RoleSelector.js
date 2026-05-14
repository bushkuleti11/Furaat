import React from 'react';

function RoleSelector({ role, setRole }) {
  const roles = ['cashier', 'supervisor', 'admin'];

  return (
    <div className="role-selector">
      {roles.map((r) => (
        <button
          key={r}
          className={role === r ? 'active' : ''}
          onClick={() => setRole(r)}
        >
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default RoleSelector;
