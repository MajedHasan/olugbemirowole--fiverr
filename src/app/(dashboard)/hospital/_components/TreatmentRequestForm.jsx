"use client";

import { useEffect, useState } from "react";
import { Button, Modal, message, Select } from "antd";
// import { uploadFileToFirebase } from "@/lib/firebase";
import { Input } from "@/components/ui/input";

const TreatmentRequestForm = ({ visible, onClose }) => {
  const [formData, setFormData] = useState({
    hospitalId: null,
    enrollee: "",
    policyNo: "",
    healthPlan: "",
    diagnosis: [],
    treatmentCost: "",
    receipt: null,
    treatments: [],
    hospitalName: "Sample Hospital", // Sample value, modify as necessary
    hospitalEmail: "hospital@example.com", // Sample value, modify as necessary
    hospitalNumber: "123-456-7890", // Sample value, modify as necessary
  });

  const [diagnosisOptions, setDiagnosisOptions] = useState([]);
  const [treatmentOptions, setTreatmentOptions] = useState([]);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(true);
  const [loadingTreatment, setLoadingTreatment] = useState(true);

  const [user, setUser] = useState(null);
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("dcPortal-user");
    if (storedUser) {
      const jsonUser = JSON.parse(storedUser);
      setUser(jsonUser);
    }
  }, []); // Runs only once after the component mounts

  // Fetch Hospital from the Hospital API using User Id
  useEffect(() => {
    const fetchHospital = async () => {
      if (!user) return; // Ensure user is available

      try {
        const response = await fetch(`/api/hospital/single?id=${user.id}`); // Adjust the endpoint
        const data = await response.json();
        setHospital(data); // Assuming data is an array of diagnosis options
        setFormData({
          ...formData,
          hospitalEmail: data.email,
          hospitalPhone: data.phoneNumber,
          hospitalName: data.hospitalName,
        });
      } catch (error) {
        message.error("Error fetching Hospital options");
      }
    };

    fetchHospital();
  }, [user]);

  // Fetch Diagnosis options from the Diagnosis API
  useEffect(() => {
    const fetchDiagnosisOptions = async () => {
      try {
        const response = await fetch("/api/diagnosis"); // Adjust the endpoint
        const data = await response.json();
        setDiagnosisOptions(data.diagnoses); // Assuming data is an array of diagnosis options
        setLoadingDiagnosis(false);
      } catch (error) {
        message.error("Error fetching diagnosis options");
        setLoadingDiagnosis(false);
      }
    };

    fetchDiagnosisOptions();
  }, []);

  // Fetch Treatment options from the Treatment API
  useEffect(() => {
    const fetchTreatmentOptions = async () => {
      try {
        const response = await fetch("/api/treatments"); // Adjust the endpoint
        const data = await response.json();
        setTreatmentOptions(data.treatments); // Assuming data is an array of treatment options
        setLoadingTreatment(false);
      } catch (error) {
        message.error("Error fetching treatment options");
        setLoadingTreatment(false);
      }
    };
    fetchTreatmentOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === "treatmentCost") {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let receiptUrl = "";

    // Upload file to Firebase and get the URL
    if (formData.receipt) {
      try {
        // receiptUrl = await uploadFileToFirebase(formData.receipt);
      } catch (uploadError) {
        message.error("Error uploading receipt. Please try again.");
        return;
      }
    }

    try {
      console.log(formData, receiptUrl);

      const response = await fetch("/api/treatment-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          receipt: receiptUrl,
          hospitalId: hospital?.id,
        }),
      });

      if (response.ok) {
        message.success("Treatment request submitted successfully!");
        onClose(); // Close the modal
      } else {
        throw new Error("Error submitting treatment request");
      }
    } catch (error) {
      message.error("Error submitting treatment request. Please try again.");
    }
  };

  return (
    <Modal
      title="Submit Claim"
      open={visible}
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
            <Select
              id="diagnosis"
              name="diagnosis"
              mode="multiple"
              value={formData.diagnosis}
              onChange={(value) => handleSelectChange("diagnosis", value)}
              loading={loadingDiagnosis}
              className="w-full"
            >
              {diagnosisOptions.map((diagnosis) => (
                <Select.Option key={diagnosis.id} value={diagnosis.id}>
                  {diagnosis.description}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Treatment Field */}
          <div className="field md:col-span-3">
            <label className="block mb-1 font-medium" htmlFor="treatments">
              Treatment <span className="text-red-500">*</span>
            </label>
            <Select
              id="treatments"
              name="treatments"
              mode="multiple"
              value={formData.treatments}
              onChange={(value) => handleSelectChange("treatments", value)}
              loading={loadingTreatment}
              className="w-full"
            >
              {treatmentOptions?.map((treatment) => (
                <Select.Option key={treatment.id} value={treatment.id}>
                  {treatment.serviceName}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Drugs Field */}
          <div className="field md:col-span-3">
            <label className="block mb-1 font-medium" htmlFor="treatments">
              Drugs <span className="text-red-500">*</span>
            </label>
            <Select
              id="treatments"
              name="treatments"
              mode="multiple"
              value={formData.treatments}
              onChange={(value) => handleSelectChange("treatments", value)}
              loading={loadingTreatment}
              className="w-full"
            >
              {treatmentOptions?.map((treatment) => (
                <Select.Option key={treatment.id} value={treatment.id}>
                  {treatment.serviceName}
                </Select.Option>
              ))}
            </Select>
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
              <label className="block mb-1 font-medium" htmlFor="hospitalName">
                Hospital
              </label>
              <Input
                id="hospitalName"
                name="hospitalName"
                value={formData.hospitalName}
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
                type="hospitalEmail"
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
        <div className="flex justify-end mt-4">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TreatmentRequestForm;
