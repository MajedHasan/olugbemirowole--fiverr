"use client";

import { useState } from "react";
import { Button, Modal, message } from "antd";
import { uploadFileToFirebase } from "@/lib/firebase"; // Adjusted import statement
import { Input } from "@/components/ui/input";

const TreatmentRequestForm = ({ visible, onClose }) => {
  const [formData, setFormData] = useState({
    enrollee: "",
    policyNo: "",
    healthPlan: "",
    diagnosis: [],
    treatmentCost: "",
    receipt: null,
    treatments: [],
    hospital: "Sample Hospital", // Sample value, modify as necessary
    hospitalEmail: "hospital@example.com", // Sample value, modify as necessary
    hospitalPhone: "123-456-7890", // Sample value, modify as necessary
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === "diagnosis" || name === "treatments") {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => option.value
      );
      setFormData({ ...formData, [name]: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let receiptUrl = "";

    // Upload file to Firebase and get the URL
    if (formData.receipt) {
      try {
        receiptUrl = await uploadFileToFirebase(formData.receipt);
      } catch (uploadError) {
        message.error("Error uploading receipt. Please try again."); // Show error message
        return;
      }
    }

    try {
      const response = await fetch("/api/treatment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, receipt: receiptUrl }),
      });

      if (response.ok) {
        message.success("Treatment request submitted successfully!"); // Show success message
        onClose(); // Close the modal
      } else {
        throw new Error("Error submitting treatment request");
      }
    } catch (error) {
      message.error("Error submitting treatment request. Please try again."); // Show error message
    }
  };

  return (
    <Modal
      title="Request Treatment"
      visible={visible}
      onCancel={onClose}
      footer={null}
      className="rounded-lg"
      width={800} // Set a wider width for the modal
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Enrollee Field */}
          <div className="field">
            <label className="block mb-1 font-medium" htmlFor="enrollee">
              Enrollee <span className="text-red-500">*</span>
            </label>
            <Input
              id="enrollee"
              name="enrollee"
              required
              value={formData.enrollee}
              onChange={handleChange}
            />
          </div>

          {/* Policy Number Field */}
          <div className="field">
            <label className="block mb-1 font-medium" htmlFor="policyNo">
              Policy No. <span className="text-red-500">*</span>
            </label>
            <Input
              id="policyNo"
              name="policyNo"
              required
              value={formData.policyNo}
              onChange={handleChange}
            />
          </div>

          {/* Health Plan Field */}
          <div className="field">
            <label className="block mb-1 font-medium" htmlFor="healthPlan">
              Health Plan <span className="text-red-500">*</span>
            </label>
            <Input
              id="healthPlan"
              name="healthPlan"
              required
              value={formData.healthPlan}
              onChange={handleChange}
            />
          </div>

          {/* Diagnosis Field */}
          <div className="field md:col-span-3">
            <label className="block mb-1 font-medium" htmlFor="diagnosis">
              Diagnosis <span className="text-red-500">*</span>
            </label>
            <select
              id="diagnosis"
              name="diagnosis"
              required
              multiple
              value={formData.diagnosis}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
            >
              <option value="ENT,Dermatologist,Orthopedics">
                ENT, Dermatologist, Orthopedics
              </option>
              <option value="Pediatrics,InternalMedicine,GeneralSurgeon,O&G">
                Pediatrics, Internal Medicine, General Surgeon, O&G
              </option>
              <option value="Xraybothfoot">X-ray both foot</option>
              <option value="Xraybothhand">X-ray both hand</option>
              <option value="YELLOWFEVER">Yellow Fever Vaccination</option>
              <option value="MRI-Brain">MRI Brain</option>
              <option value="CT-Scan-Abdomen">CT Scan Abdomen</option>
              <option value="Blood-Tests">Blood Tests</option>
              <option value="Physical-Therapy">Physical Therapy</option>
            </select>
          </div>

          {/* Treatments Field */}
          <div className="field md:col-span-3">
            <label className="block mb-1 font-medium" htmlFor="treatments">
              Treatment <span className="text-red-500">*</span>
            </label>
            <select
              id="treatments"
              name="treatments"
              required
              multiple
              value={formData.treatments}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
            >
              <option value="1stSpecialistConsultation-ENT,Dermatologist,Orthopedics">
                1st Specialist Consultation - ENT, Dermatologist, Orthopedics
              </option>
              <option value="1stSpecialistConsultation-Pediatrics,InternalMedicine,GeneralSurgeon,O&G">
                1st Specialist Consultation - Pediatrics, Internal Medicine,
                General Surgeon, O&G
              </option>
              <option value="Xraybothfoot">X-ray both foot</option>
              <option value="Xraybothhand">X-ray both hand</option>
              <option value="YELLOWFEVER">Yellow Fever Vaccination</option>
              <option value="MRI-Brain">MRI Brain</option>
              <option value="CT-Scan-Abdomen">CT Scan Abdomen</option>
              <option value="Blood-Tests">Blood Tests</option>
              <option value="Physical-Therapy">Physical Therapy</option>
            </select>
          </div>

          {/* Treatment Cost Field */}
          <div className="field">
            <label className="block mb-1 font-medium" htmlFor="treatmentCost">
              Treatment Cost <span className="text-red-500">*</span>
            </label>
            <Input
              id="treatmentCost"
              name="treatmentCost"
              type="number"
              required
              value={formData.treatmentCost}
              onChange={handleChange}
            />
          </div>

          {/* Upload Receipt Field */}
          <div className="field md:col-span-3">
            <label className="block mb-1 font-medium" htmlFor="receipt">
              Upload Receipt
            </label>
            <input
              id="receipt"
              name="receipt"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>

        {/* Non-editable Hospital Info Section */}
        <div className="border-t mt-6 pt-4">
          <h3 className="font-semibold mb-2">Hospital Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Hospital Field */}
            <div className="field">
              <label className="block mb-1 font-medium" htmlFor="hospital">
                Hospital
              </label>
              <Input
                id="hospital"
                name="hospital"
                value={formData.hospital}
                disabled
              />
            </div>

            {/* Hospital Email Field */}
            <div className="field">
              <label className="block mb-1 font-medium" htmlFor="hospitalEmail">
                Hospital Email
              </label>
              <Input
                id="hospitalEmail"
                name="hospitalEmail"
                type="email"
                value={formData.hospitalEmail}
                disabled
              />
            </div>

            {/* Hospital Phone Field */}
            <div className="field">
              <label className="block mb-1 font-medium" htmlFor="hospitalPhone">
                Hospital Phone
              </label>
              <Input
                id="hospitalPhone"
                name="hospitalPhone"
                value={formData.hospitalPhone}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TreatmentRequestForm;
