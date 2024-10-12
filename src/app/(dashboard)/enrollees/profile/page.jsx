"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";

const DigitalIdentityForm = ({ userId }) => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [status, setStatus] = useState("Active");
  const [dependents, setDependents] = useState([]);
  const [enrolleeData, setEnrolleeData] = useState(null); // Default is null
  const [user, setUser] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // State to hold the profile picture

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("dcPortal-user"));
    if (user) {
      setUser(user);
    } else {
      console.error("No user data found in local storage");
    }
  }, []);

  // Fetch enrollee data on page load using userId
  async function fetchData() {
    try {
      const res = await fetch(`/api/enrollees/${user?.id}`);
      console.log("Fetching data for user ID:", user?.id);

      if (!res.ok) {
        throw new Error("Failed to fetch enrollee data");
      }

      const data = await res.json();
      if (data.message === "No enrollee data found") {
        setEnrolleeData(null); // No enrollee data found, show form to add data
      } else {
        setEnrolleeData(data);
        // Prefill form with enrollee data
        setValue("fullName", data.fullName);
        setValue("policyNo", data.policyNo);
        setValue("company", data.company);
        setValue("planType", data.planType);
        setValue("phoneNumber", data.phoneNumber);
        setValue("hospital", data.hospital);
        setValue("noOfDependents", data.noOfDependents);
        setStatus(data.status);
        setDependents(data.dependents.map((d) => d.name));
        setProfilePicture(data.profilePicture); // Assuming `data` has a field for the profile picture URL
      }
    } catch (error) {
      console.error("Error fetching enrollee data:", error);
    }
  }

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, setValue]);

  // Handle form submission (create/update enrollee)
  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    const updatedData = {
      ...formData,
      status: status,
      dependents: dependents,
    };

    // Send update request to API
    const response = await fetch(`/api/enrollees/${user?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      alert("Enrollee information updated successfully!");
      fetchData(); // Fetch data again to display the updated data
    } else {
      alert("Failed to update enrollee.");
    }
    setIsSubmitting(false);
  };

  // Handle the file upload for profile picture
  const handleFileChange = (event) => {
    if (event && event.target && event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePicture(reader.result); // Set the profile picture state to the base64 URL
        };
        reader.readAsDataURL(file);
      }
    } else {
      alert("No file selected or event is invalid");
    }
  };

  // Update the dependents array only when necessary
  const handleDependentChange = (index, value) => {
    const updatedDependents = [...dependents];
    updatedDependents[index] = value; // Update only the changed dependent
    setDependents(updatedDependents);
  };

  const addDependent = () => {
    // Add an empty string as a new dependent
    setDependents([...dependents, ""]);
  };

  const removeDependent = (index) => {
    // Remove the dependent at the given index
    setDependents(dependents.filter((_, i) => i !== index));
  };

  const EnrolleeDigitalIdentityForm = () => (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* General Information Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              {...register("fullName")}
              id="fullName"
              placeholder="Enter full name"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="policyNo">Policy No.</Label>
            <Input
              {...register("policyNo")}
              id="policyNo"
              placeholder="Policy Number"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              {...register("company")}
              id="company"
              placeholder="Company"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="planType">Plan Type</Label>
            <Input
              {...register("planType")}
              id="planType"
              placeholder="Plan Type"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              {...register("phoneNumber")}
              id="phoneNumber"
              placeholder="Phone Number"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={setStatus} value={status} disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hospital">Hospital</Label>
            <Input
              {...register("hospital")}
              id="hospital"
              placeholder="Hospital Name"
              disabled
            />
          </div>
        </div>

        {/* Dependents Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Dependents</h3>
          {dependents.map((dep, index) => {
            // Create a ref for each input field
            const inputRef = useRef(null);

            return (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  ref={inputRef} // Attach the ref to the input
                  defaultValue={dep} // Use defaultValue to ensure controlled input
                  placeholder={`Dependent ${index + 1}`}
                  onBlur={(e) => handleDependentChange(index, e.target.value)} // Use onBlur to update the state only after focus is lost
                />
                <Button
                  type="button"
                  onClick={() => removeDependent(index)}
                  variant="destructive"
                >
                  Remove
                </Button>
              </div>
            );
          })}
          <Button
            type="button"
            onClick={addDependent}
            className="bg-teal-600 hidden"
          >
            Add Dependent
          </Button>
        </div>

        {/* Submit Button */}
        <CardFooter>
          <Button
            type="submit"
            className="w-full hidden"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Information"}
          </Button>
        </CardFooter>
      </form>

      {/* Profile Picture Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Profile Picture</h3>
        <div className="flex flex-col items-center mb-4">
          {profilePicture ? (
            <div className="relative">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-gray-300 transition-transform duration-300 ease-in-out hover:scale-105"
              />
              <div className="absolute inset-0 bg-black opacity-25 rounded-full transition-opacity duration-300 ease-in-out hover:opacity-0"></div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-gray-300 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <Label htmlFor="profilePicture" className="block mb-2">
          Upload New Profile Picture
        </Label>
        <Input
          type="file"
          id="profilePicture"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        <Button className="w-full" onClick={handleFileChange}>
          Upload Picture
        </Button>
      </div>
    </CardContent>
  );

  if (!enrolleeData) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-100">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">
              No enrollee data found. Please add your information below:
            </h2>
          </CardHeader>
          <EnrolleeDigitalIdentityForm />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">
            Enrollee Digital Identity
          </h2>
        </CardHeader>
        <EnrolleeDigitalIdentityForm />
      </Card>
    </div>
  );
};

export default DigitalIdentityForm;
