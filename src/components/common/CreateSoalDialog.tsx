"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, Plus } from "lucide-react";

interface CreateSoalDialogProps {
  onSoalCreated: () => Promise<void>;
}

export const CreateSoalDialog: React.FC<CreateSoalDialogProps> = ({
  onSoalCreated,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    soal: "",
    url: "",
    flag: "",
  });
  const [createStatus, setCreateStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateStatus({ loading: true, success: false, error: "" });

    try {
      const response = await fetch("/api/soals/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create soal");

      setCreateStatus({ loading: false, success: true, error: "" });
      await onSoalCreated();

      setFormData({ soal: "", url: "", flag: "" });
      setTimeout(() => {
        setIsOpen(false);
        setCreateStatus((prev) => ({ ...prev, success: false }));
      }, 1500);
    } catch (error: any) {
      setCreateStatus({
        loading: false,
        success: false,
        error: error.message,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-medium">
          <Plus className="h-4 w-4" />
          Create New Soal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Soal
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="soal" className="font-medium">
              Question
            </Label>
            <Textarea
              id="soal"
              name="soal"
              value={formData.soal}
              onChange={handleChange}
              placeholder="Enter the question..."
              required
              className="min-h-32 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url" className="font-medium">
              URL
            </Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="Enter the URL..."
              required
              className="focus-visible:ring-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="flag" className="font-medium">
              Flag
            </Label>
            <Input
              id="flag"
              name="flag"
              type="text"
              value={formData.flag}
              onChange={handleChange}
              placeholder="Enter the flag..."
              required
              className="focus-visible:ring-2"
            />
          </div>
          {createStatus.error && (
            <Alert variant="destructive" className="rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{createStatus.error}</AlertDescription>
            </Alert>
          )}
          {createStatus.success && (
            <Alert className="bg-green-50 text-green-600 border-green-200 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Soal created successfully!</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full font-medium h-11"
            disabled={createStatus.loading}
          >
            {createStatus.loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Soal"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
