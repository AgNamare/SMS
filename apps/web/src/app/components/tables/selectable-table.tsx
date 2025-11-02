"use client";

import { Label } from "@/src/app/components/ui/label";

export function SelectableTable({
  permissions,
  selectedPermissions,
  setSelectedPermissions,
}: {
  permissions: any[];
  selectedPermissions: number[];
  setSelectedPermissions: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  // Toggle a single permission
  const handleToggle = (id: number, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked ? [...prev, id] : prev.filter((p) => p !== id)
    );
  };

  // Toggle all
  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedPermissions(permissions.map((p) => p.id));
    } else {
      setSelectedPermissions([]);
    }
  };

  // Derived state for header checkbox
  const allSelected =
    permissions.length > 0 && selectedPermissions.length === permissions.length;
  const someSelected = selectedPermissions.length > 0 && !allSelected;

  return (
    <div className='border rounded-lg'>
      {/* Header */}
      <div className='p-4 border-b bg-muted/50 flex items-center gap-2'>
        <input
          type='checkbox'
          checked={allSelected}
          ref={(el) => {
            if (el) el.indeterminate = someSelected;
          }}
          onChange={(e) => handleToggleAll(e.target.checked)}
          className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
        />
        <Label>Select All Permissions</Label>
      </div>

      {/* Permission list */}
      <div className='max-h-96 overflow-auto divide-y'>
        {permissions.length === 0 ? (
          <div className='text-center text-sm text-muted-foreground p-6'>
            No permissions available
          </div>
        ) : (
          permissions.map((permission) => {
            const isChecked = selectedPermissions.includes(permission.id);
            return (
              <div
                key={permission.id}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                  isChecked ? "bg-blue-50" : ""
                }`}
                onClick={() => handleToggle(permission.id, !isChecked)}>
                <input
                  type='checkbox'
                  checked={isChecked}
                  onChange={(e) =>
                    handleToggle(permission.id, e.target.checked)
                  }
                  onClick={(e) => e.stopPropagation()}
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <div className='flex-1'>
                  <div className='font-medium'>{permission.name}</div>
                  <div className='text-sm text-muted-foreground'>
                    {permission.description}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
