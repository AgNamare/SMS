"use client";

import { useState, useEffect } from "react";
import { PermissionClientService } from "@/src/app/lib/client-services/permission-client-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Loader2, X, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import toast from "react-hot-toast";

interface PermissionAssignmentPopupProps {
  role: any;
  modules: any[];
  onClose: () => void;
  onSuccess: () => void;
}

interface Permission {
  id: number;
  name: string;
  description: string;
  module: string;
}

export function PermissionAssignmentPopup({
  role,
  modules,
  onClose,
  onSuccess,
}: PermissionAssignmentPopupProps) {
  const [selectedModule, setSelectedModule] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [moduleLoading, setModuleLoading] = useState(false);
  const [currentRolePermissions, setCurrentRolePermissions] = useState<
    number[]
  >([]);

  const permissionClientService = new PermissionClientService();

  // Load current role permissions on open
  useEffect(() => {
    if (role?.id) {
      loadCurrentRolePermissions();
    }
  }, [role?.id]);

  // Load permissions whenever module changes
  useEffect(() => {
    if (selectedModule) {
      loadModulePermissions();
    } else {
      setPermissions([]);
      setSelectedPermissions([]);
    }
  }, [selectedModule]);

  const loadCurrentRolePermissions = async () => {
    try {
      const response = await permissionClientService.getRoleWithPermissions(
        role.id
      );

      if (response.success && response.data) {
        const ids =
          response.data.permissions?.map((p: Permission) => p.id) || [];
        setCurrentRolePermissions(ids);
      } else {
        setCurrentRolePermissions([]);
      }
    } catch (error) {
      setCurrentRolePermissions([]);
    }
  };

  const loadModulePermissions = async () => {
    setModuleLoading(true);
    setSelectedPermissions([]);
    try {
      const response = await permissionClientService.getPermissionsByModule(
        selectedModule,
        1,
        100
      );

      if (response.success) {
        const perms = response.data?.data || [];
        setPermissions(perms);

        const alreadyAssigned = perms
          .filter((p: Permission) => currentRolePermissions.includes(p.id))
          .map((p: Permission) => p.id);

        setSelectedPermissions(alreadyAssigned);
      } else {
        setPermissions([]);
      }
    } catch (error) {
      setPermissions([]);
    } finally {
      setModuleLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPermissions(permissions.map((p) => p.id));
  };

  const handleSelectNone = () => {
    setSelectedPermissions([]);
  };

  const handleAssignIndividual = async () => {
    if (selectedPermissions.length === 0) {
      alert("Select at least one permission");
      return;
    }
    setLoading(true);
    try {
      const assignPromise = permissionClientService.assignPermissionsToRole(
        role.id,
        selectedPermissions
      );

      const response = await toast.promise(assignPromise, {
        loading: "Assigning permissions...",
        success: "Permissions assigned successfully!",
        error: (err) =>
          err?.message || "Failed to assign permissions. Please try again.",
      });

      if (response.success) {
        await reloadAfterChange();
      }
    } catch (err) {
      alert("Error assigning permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignModule = async () => {
    if (!selectedModule) return alert("Select a module first");
    setLoading(true);
    try {
      const response =
        await permissionClientService.assignModulePermissionsToRole(
          role.id,
          selectedModule
        );

      if (response.success) {
        await reloadAfterChange();
      } else {
        alert(`Failed to assign module permissions: ${response.message}`);
      }
    } catch (err) {
      alert("Error assigning module permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePermissions = async () => {
    if (selectedPermissions.length === 0)
      return alert("Select permissions to remove");
    setLoading(true);
    try {
      const response = await permissionClientService.removePermissionsFromRole(
        role.id,
        selectedPermissions
      );

      if (response.success) {
        await reloadAfterChange();
      } else {
        alert(`Failed to remove: ${response.message}`);
      }
    } catch (err) {
      alert("Error removing permissions");
    } finally {
      setLoading(false);
    }
  };

  const reloadAfterChange = async () => {
    await new Promise((r) => setTimeout(r, 300));
    await loadCurrentRolePermissions();
    await loadModulePermissions();
    onSuccess();
  };

  const getPermissionAction = (name: string) => {
    const parts = name.split(":");
    return parts.length > 1 ? parts[1] : name;
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-4xl max-h-[90vh] flex flex-col'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <div className='space-y-1'>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Manage Permissions — {role.name}
            </CardTitle>
            <CardDescription>
              Assign or remove permissions for this role
            </CardDescription>
          </div>
          <Button variant='ghost' size='icon' onClick={onClose}>
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>

        <CardContent className='flex-1 overflow-hidden flex flex-col gap-6'>
          {/* Module Selector */}
          <div className='space-y-3'>
            <Label htmlFor='module-select'>Select Module</Label>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger id='module-select'>
                <SelectValue placeholder='Choose a module...' />
              </SelectTrigger>
              <SelectContent>
                {modules.map((mod) => (
                  <SelectItem key={mod.module} value={mod.module}>
                    {mod.module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {selectedModule && (
            <div className='flex-1 flex flex-col min-h-0'>
              <div className='flex items-center justify-between mb-4'>
                <div className='space-y-1'>
                  <h3 className='font-semibold'>
                    Permissions for {selectedModule}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {permissions.length} total • {selectedPermissions.length}{" "}
                    selected
                  </p>
                </div>
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={handleSelectAll}
                    disabled={moduleLoading}>
                    Select All
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={handleSelectNone}
                    disabled={moduleLoading}>
                    Select None
                  </Button>
                  <Button
                    size='sm'
                    className='bg-blue-600 hover:bg-blue-700 text-white'
                    onClick={handleAssignModule}
                    disabled={loading || moduleLoading}>
                    {loading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      "Assign Entire Module"
                    )}
                  </Button>
                </div>
              </div>

              {moduleLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <Loader2 className='h-6 w-6 animate-spin mr-2' />
                  Loading permissions...
                </div>
              ) : (
                <ScrollArea className='flex-1 border rounded-md'>
                  <div className='p-4 space-y-3'>
                    {permissions.length === 0 ? (
                      <div className='text-center py-8 text-muted-foreground'>
                        No permissions for this module
                      </div>
                    ) : (
                      permissions.map((p) => (
                        <div
                          key={p.id}
                          className='flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors'>
                          <Checkbox
                            checked={selectedPermissions.includes(p.id)}
                            onCheckedChange={() => handlePermissionToggle(p.id)}
                            className='h-5 w-5'
                          />
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2'>
                              <span className='font-medium text-sm'>
                                {getPermissionAction(p.name)}
                              </span>
                              {currentRolePermissions.includes(p.id) && (
                                <Badge variant='secondary' className='text-xs'>
                                  Already assigned
                                </Badge>
                              )}
                            </div>
                            {p.description && (
                              <p className='text-sm text-muted-foreground mt-1'>
                                {p.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}

          <div className='flex justify-between items-center pt-4 border-t'>
            <div className='text-sm text-muted-foreground'>
              {selectedPermissions.length > 0 && (
                <span>{selectedPermissions.length} selected</span>
              )}
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={handleRemovePermissions}
                disabled={
                  loading || selectedPermissions.length === 0 || moduleLoading
                }
                className='text-red-600 hover:text-red-700 hover:bg-red-50'>
                {loading ? (
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                ) : (
                  "Remove Selected"
                )}
              </Button>
              <Button variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleAssignIndividual}
                disabled={
                  loading || selectedPermissions.length === 0 || moduleLoading
                }>
                {loading ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    Assigning...
                  </>
                ) : (
                  `Assign Selected (${selectedPermissions.length})`
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
