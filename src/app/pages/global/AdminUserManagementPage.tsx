import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../../components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/alert-dialog";
import { type User as AuthUser } from "../questboard/api";

// Local types matching backend entities
export interface BackendUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  enabled: boolean;
}

export interface PaginatedUsersResponse {
  content: BackendUser[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

interface AdminUserManagementPageProps {
  currentUser: AuthUser | null;
  onBack: () => void;
}

export function AdminUserManagementPage({ onBack }: AdminUserManagementPageProps) {
  // Page states
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortBy] = useState("username");
  const [sortDir] = useState("asc");
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Modals & form states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRoles, setNewRoles] = useState<string[]>(["ROLE_USER"]);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [isEditRolesOpen, setIsEditRolesOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<BackendUser | null>(null);
  const [editedRoles, setEditedRoles] = useState<string[]>([]);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<BackendUser | null>(null);

  // 1. Fetch user list
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to load users");
      const data: PaginatedUsersResponse = await res.json();
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error("Failed to retrieve user directory.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, sortBy, sortDir]);

  // 2. Add new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          email: newEmail,
          password: newPassword,
          roles: newRoles,
        }),
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to create user");
      toast.success("User created successfully!");
      setIsAddOpen(false);
      resetAddForm();
      fetchUsers();
    } catch (err) {
      toast.error("Error creating user profile.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const resetAddForm = () => {
    setNewUsername("");
    setNewEmail("");
    setNewPassword("");
    setNewRoles(["ROLE_USER"]);
  };

  // 3. Edit user roles
  const handleUpdateRoles = async () => {
    if (!editingUser) return;
    setIsSubmitLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}/roles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedRoles),
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to update roles");
      toast.success("User roles updated!");
      setIsEditRolesOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user roles.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // 4. Delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to delete user");
      toast.success("User successfully deleted.");
      setIsDeleteOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user profile.");
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2b2b] text-[#f7f0df] overflow-y-auto">
      {/* Background Pattern */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.05] [background-image:radial-gradient(#f7f0df_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-12">
          <motion.button
            onClick={onBack}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#d9b45f] bg-[#2b2b2b] text-[#d9b45f] px-4 py-2 font-['Space_Grotesk'] text-sm shadow-[3px_3px_0_0_rgba(217,180,95,0.35)]"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back
          </motion.button>
          
          <div className="font-['Bebas_Neue'] text-3xl tracking-widest text-[#d9b45f]">
            COMMAND CENTER · USERS
          </div>
        </header>

        <main>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-[#2b2b2b] border-[3px] border-[#d9b45f] rounded-[2rem] shadow-[12px_12px_0_0_rgba(217,180,95,0.15)] overflow-hidden p-6 md:p-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="font-['Bebas_Neue'] text-4xl tracking-wide text-[#d9b45f]">USER MANAGEMENT</h1>
                <p className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#f7f0df]/60 mt-1">
                  Create, configure roles, and delete application accounts.
                </p>
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsAddOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border-[3px] border-[#d9b45f] bg-[#d9b45f] text-[#2b2b2b] px-5 py-2.5 font-['Space_Grotesk'] font-bold text-sm uppercase tracking-wider hover:bg-transparent hover:text-[#d9b45f] transition-colors shadow-[4px_4px_0_0_rgba(217,180,95,0.2)]"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} /> Add User
              </motion.button>
            </div>

            {/* Table Area */}
            <div className="border-[3px] border-[#d9b45f]/30 rounded-xl overflow-hidden bg-[#2b2b2b]">
              <Table>
                <TableHeader className="bg-[#d9b45f] text-[#2b2b2b] border-b-[3px] border-[#d9b45f]">
                  <TableRow className="hover:bg-[#d9b45f]">
                    <TableHead className="font-['Space_Grotesk'] font-bold text-[#2b2b2b]">Username</TableHead>
                    <TableHead className="font-['Space_Grotesk'] font-bold text-[#2b2b2b]">Email</TableHead>
                    <TableHead className="font-['Space_Grotesk'] font-bold text-[#2b2b2b]">Roles</TableHead>
                    <TableHead className="font-['Space_Grotesk'] font-bold text-[#2b2b2b] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell><Skeleton className="h-6 w-32 bg-[#f7f0df]/10" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-48 bg-[#f7f0df]/10" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 bg-[#f7f0df]/10" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto bg-[#f7f0df]/10" /></TableCell>
                      </TableRow>
                    ))
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 font-['Space_Grotesk'] text-[#f7f0df]/50">
                        No user profiles found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="border-b border-[#d9b45f]/20 hover:bg-[#d9b45f]/5">
                        <TableCell className="font-['Space_Grotesk'] font-bold">{user.username}</TableCell>
                        <TableCell className="font-['Space_Grotesk'] text-[#f7f0df]/80">{user.email}</TableCell>
                        <TableCell className="font-['Space_Grotesk']">
                          <div className="flex gap-1.5 flex-wrap">
                            {user.roles.map((role) => (
                              <span 
                                key={role}
                                className="text-[10px] font-bold uppercase tracking-wider border border-[#d9b45f] text-[#d9b45f] px-2 py-0.5 rounded-full"
                              >
                                {role.replace("ROLE_", "")}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#d9b45f] hover:bg-[#d9b45f]/10"
                              onClick={() => {
                                setEditingUser(user);
                                setEditedRoles(user.roles);
                                setIsEditRolesOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:bg-red-400/10"
                              onClick={() => {
                                setUserToDelete(user);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 0) setPage(page - 1);
                        }}
                        className={`${page === 0 ? "opacity-40 cursor-not-allowed" : "text-[#d9b45f] hover:bg-[#d9b45f]/10"}`}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <PaginationItem key={idx}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(idx);
                          }}
                          isActive={page === idx}
                          className={page === idx 
                            ? "border-2 border-[#d9b45f] bg-[#d9b45f] text-[#2b2b2b] font-bold" 
                            : "text-[#d9b45f] hover:bg-[#d9b45f]/10"
                          }
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < totalPages - 1) setPage(page + 1);
                        }}
                        className={`${page === totalPages - 1 ? "opacity-40 cursor-not-allowed" : "text-[#d9b45f] hover:bg-[#d9b45f]/10"}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-[#2b2b2b] border-[3px] border-[#d9b45f] text-[#f7f0df] rounded-[1.5rem]">
          <DialogHeader>
            <DialogTitle className="font-['Bebas_Neue'] text-3xl tracking-wide text-[#d9b45f]">
              Register New User
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider text-[#d9b45f]">Username</Label>
              <Input
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="bg-[#1f1f1f] border-2 border-[#d9b45f]/50 text-[#f7f0df] focus:border-[#d9b45f] rounded-xl outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider text-[#d9b45f]">Email</Label>
              <Input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-[#1f1f1f] border-2 border-[#d9b45f]/50 text-[#f7f0df] focus:border-[#d9b45f] rounded-xl outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider text-[#d9b45f]">Password</Label>
              <Input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[#1f1f1f] border-2 border-[#d9b45f]/50 text-[#f7f0df] focus:border-[#d9b45f] rounded-xl outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider text-[#d9b45f]">Roles</Label>
              <div className="flex gap-4">
                {["ROLE_USER", "ROLE_ADMIN", "ROLE_GUILD_MASTER"].map((role) => (
                  <label key={role} className="flex items-center gap-2 font-['Space_Grotesk'] text-xs text-[#f7f0df]/80 select-none">
                    <input
                      type="checkbox"
                      checked={newRoles.includes(role)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewRoles([...newRoles, role]);
                        } else {
                          setNewRoles(newRoles.filter((r) => r !== role));
                        }
                      }}
                      className="accent-[#d9b45f] h-4 w-4"
                    />
                    {role.replace("ROLE_", "")}
                  </label>
                ))}
              </div>
            </div>
            <DialogFooter className="mt-6 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="border-[#d9b45f] text-[#d9b45f] hover:bg-[#d9b45f]/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitLoading}
                className="bg-[#d9b45f] text-[#2b2b2b] hover:bg-[#d9b45f]/95 font-bold"
              >
                {isSubmitLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Save User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Roles Dialog */}
      <Dialog open={isEditRolesOpen} onOpenChange={setIsEditRolesOpen}>
        <DialogContent className="bg-[#2b2b2b] border-[3px] border-[#d9b45f] text-[#f7f0df] rounded-[1.5rem]">
          <DialogHeader>
            <DialogTitle className="font-['Bebas_Neue'] text-3xl tracking-wide text-[#d9b45f]">
              Edit User Roles
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="font-['Space_Grotesk'] text-sm">
              Modifying roles for account: <strong className="text-[#d9b45f]">{editingUser?.username}</strong>
            </p>
            <div className="space-y-3">
              {["ROLE_USER", "ROLE_ADMIN", "ROLE_GUILD_MASTER"].map((role) => (
                <label key={role} className="flex items-center gap-3 font-['Space_Grotesk'] text-sm text-[#f7f0df]/80 select-none">
                  <input
                    type="checkbox"
                    checked={editedRoles.includes(role)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEditedRoles([...editedRoles, role]);
                      } else {
                        setEditedRoles(editedRoles.filter((r) => r !== role));
                      }
                    }}
                    className="accent-[#d9b45f] h-4.5 w-4.5"
                  />
                  {role.replace("ROLE_", "")}
                </label>
              ))}
            </div>
            <DialogFooter className="mt-6 flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsEditRolesOpen(false)}
                className="border-[#d9b45f] text-[#d9b45f] hover:bg-[#d9b45f]/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateRoles}
                disabled={isSubmitLoading}
                className="bg-[#d9b45f] text-[#2b2b2b] hover:bg-[#d9b45f]/95 font-bold"
              >
                {isSubmitLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Update Roles"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-[#2b2b2b] border-[3px] border-red-500 text-[#f7f0df] rounded-[1.5rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-['Bebas_Neue'] text-3xl tracking-wide text-red-500">
              Confirm Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#f7f0df]/70 font-['Space_Grotesk'] text-sm">
              Are you absolutely sure you want to delete the user card for{" "}
              <strong className="text-[#d9b45f]">{userToDelete?.username}</strong>? This action will permanently remove
              them from all rosters and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex gap-2 justify-end">
            <AlertDialogCancel
              onClick={() => setIsDeleteOpen(false)}
              className="border-[#f7f0df]/30 text-[#f7f0df] hover:bg-[#f7f0df]/10"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 text-white hover:bg-red-700 font-bold border-none"
            >
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
