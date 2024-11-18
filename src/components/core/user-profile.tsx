"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, User, X, Check, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { capitalizeFirstLetter } from "@/helpers/text-uppercase";

interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

interface UserData {
  id: string;
  name: string;
  role: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const result: APIResponse<UserData> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || result.message || `Error: ${response.status}`
        );
      }

      setUser(result.data);
      setEditForm({
        name: result.data.name,
        email: result.data.email,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/users/${userId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      const result: APIResponse<UserData> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update user");
      }

      setUser(result.data);
      setIsEditing(false);
      toast({
        title: "Success",
        description: result.message || "Profile updated successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-gray-50 p-4">
        <Card className="w-full max-w-md bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-col items-center">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-6 w-16 mt-2" />
              </div>
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex items-center justify-center min-h-[300px] bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                <AvatarImage
                  src="/api/placeholder/450/450"
                  alt={`${user.name}'s avatar`}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Badge className="mt-2 capitalize" variant="secondary">
                {user.role?.toUpperCase()}
              </Badge>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-bold text-primary-foreground">
                  {user.name?.toLocaleUpperCase()}
                </h2>
                <div className="mt-2 flex flex-col space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      {capitalizeFirstLetter(user.role)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-center md:justify-start">
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Badge
                      variant="outline"
                      className="hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      Edit Profile
                    </Badge>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="Enter your email"
                          type="email"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          disabled={isSubmitting}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleEditSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4 mr-2" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
