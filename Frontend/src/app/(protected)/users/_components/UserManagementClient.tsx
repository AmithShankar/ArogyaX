"use client";

import {
    Plus,
    ShieldPlus,
    ShieldX
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
    ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getSortedRowModel,
    SortingState, useReactTable
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { ApiRequestError, createUserApi, deactivateUserApi, updateUserApi } from "@/services/apiClient";
import { ALL_ROLES, ROLE_LABELS, User, UserManagementClientProps, UserRole } from "@/types";
import { toast } from "sonner";
import { UserDeactivateDialog } from "./dialogs/UserDeactivateDialog";
import { UserFormDialog } from "./dialogs/UserFormDialog";
import { getUserColumns } from "./table/UserColumns";
import { UserDataTable } from "./table/UserDataTable";


export function UserManagementClient({
  initialUsers,
}: UserManagementClientProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(initialUsers);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [role, setRole] = useState<UserRole>("nurse");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$";
    const array = new Uint32Array(12);
    if (typeof window !== "undefined") {
      window.crypto.getRandomValues(array);
    }
    const password = Array.from(array, (val) => chars[val % chars.length]).join("");
    setGeneratedPassword(password);
    return password;
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setJobTitle("");
    setRole("nurse");
    setGeneratedPassword("");
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleEdit = (u: User) => {
    setSelectedUser(u);
    setName(u.name);
    setPhone(u.phone);
    setJobTitle(u.jobTitle || "");
    setRole(u.role);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDeactivate = async () => {
    if (!userToDeactivate) return;
    setIsSubmitting(true);
    try {
      await deactivateUserApi(userToDeactivate.id);
      setUsers((prev) => prev.map(usr => usr.id === userToDeactivate.id ? { ...usr, status: 'inactive' } : usr));
      toast.success("User deactivated");
      setShowDeactivateConfirm(false);
      setUserToDeactivate(null);
    } catch (error) {
      toast.error("Unable to deactivate user", {
        description: error instanceof ApiRequestError ? error.message : "Request failed"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivate = async (u: User) => {
    setIsSubmitting(true);
    try {
      const updated = await updateUserApi(u.id, { status: 'active' });
      setUsers((prev) => prev.map(usr => usr.id === u.id ? updated : usr));
      toast.success("User reactivated successfully");
    } catch (error) {
      toast.error("Unable to reactivate user", {
        description: error instanceof ApiRequestError ? error.message : "Request failed"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && selectedUser) {
        const updated = await updateUserApi(selectedUser.id, {
          name,
          phone,
          role,
          jobTitle,
        });
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? updated : u)));
        toast.success("User updated");
      } else {
        const newUser = await createUserApi({
          phone,
          name,
          role,
          jobTitle,
          password: generatedPassword,
        });

        setUsers((prev) => [newUser, ...prev]);
        toast.success("User created", {
          description: `Temporary password: ${generatedPassword}`,
        });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(isEditing ? "Unable to update user" : "Unable to create user", {
        description:
          error instanceof ApiRequestError
            ? error.message
            : "Please verify the backend payload and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(() => getUserColumns({
    onEdit: handleEdit,
    onDeactivate: (u: User) => {
      setUserToDeactivate(u);
      setShowDeactivateConfirm(true);
    },
    onReactivate: handleReactivate,
    currentUser: user,
    isSubmitting
  }), [user, isSubmitting]);

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="page-shell animate-fade-in">
      <section className="page-hero">
        <div className="space-y-4">
          <Badge variant="outline" className="w-fit">
            Workforce access
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            User Management
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Manage staff credentials, access roles, and permissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-2">
            <ShieldPlus className="h-3.5 w-3.5" />
            {users.length} team members
          </Badge>
          {user?.permissions?.canManageUsers && (
            <Button onClick={() => {
              setDialogOpen(true);
              generatePassword();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              New user
            </Button>
          )}
        </div>
      </section>

      <section className="desktop-data-table mt-4 hidden md:block">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Plus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 text-muted-foreground" />
              <Input
                placeholder="Search staff by name or phone..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-10 rounded-xl border-border/70 bg-background/50 pl-9 pr-4 transition-all focus:bg-background focus:ring-4 focus:ring-primary/5"
              />
            </div>
            
            <Select
              value={(table.getColumn("role")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) => 
                table.getColumn("role")?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="h-10 w-[160px] rounded-xl border-border/70 bg-background/50">
                <SelectValue placeholder="Role: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {ALL_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) => 
                table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="h-10 w-[140px] rounded-xl border-border/70 bg-background/50">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {(globalFilter || columnFilters.length > 0) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setGlobalFilter("");
                  setColumnFilters([]);
                }}
                className="h-10 gap-2 px-3 text-muted-foreground hover:text-foreground"
              >
                <ShieldX className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          
          <Badge variant="secondary" className="gap-2 h-9 px-3">
            <ShieldPlus className="h-3.5 w-3.5" />
            {table.getFilteredRowModel().rows.length} results
          </Badge>
        </div>
      </section>

      <UserDataTable 
        table={table}
        users={users}
        currentUser={user}
        onEdit={handleEdit}
        onDeactivate={(u: User) => {
          setUserToDeactivate(u);
          setShowDeactivateConfirm(true);
        }}
        onReactivate={handleReactivate}
        isSubmitting={isSubmitting}
        canManageUsers={!!user?.permissions?.canManageUsers}
        canDeleteData={!!user?.permissions?.canDeleteData}
      />

      <UserFormDialog 
        open={dialogOpen}
        onOpenChange={(open: boolean) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}
        isEditing={isEditing}
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
        role={role}
        setRole={setRole}
        jobTitle={jobTitle}
        setJobTitle={setJobTitle}
        generatedPassword={generatedPassword}
        isSubmitting={isSubmitting}
        onSubmit={handleFormSubmit}
        allRoles={ALL_ROLES}
      />

      <UserDeactivateDialog 
        open={showDeactivateConfirm}
        onOpenChange={setShowDeactivateConfirm}
        user={userToDeactivate}
        onConfirm={handleDeactivate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
