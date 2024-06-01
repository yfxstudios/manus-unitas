"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhoneNumber } from "@/lib/util/phoneNumber";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import EditOrganizationForm from "./_components/editOrganizationForm";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const Organization = ({ organization, handleSubmit }) => {
  const [phone, setPhone] = useState(organization.phone);

  const handlePhoneChange = e => setPhone(formatPhoneNumber(e.currentTarget.value));


  const { toast } = useToast()


  return (
    <div className="max-w-2xl">
      <div className="p-16 w-full flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">Organization</h1>
          <p className="text-lg">Organization settings</p>
        </div>

        <EditOrganizationForm organization={organization} handleSubmit={(data, id) => {
          handleSubmit(data, id).then(res => {
            if (res) {
              toast({
                title: res,
                variant: "success",
              })
            }
          })
        }} />

        <Toaster />

      </div>
    </div>
  );
};
export default Organization;
