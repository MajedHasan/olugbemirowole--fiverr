import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, message, Modal, Upload } from "antd";
import React, { useState } from "react";

const BulkClaimRequestForm = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleBulkUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    fileList.forEach((file) => formData.append("file", file));
    try {
      const res = await fetch("/api/claim-request/bulk", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        message.success("Bulk upload successful!");
      } else {
        message.error("Bulk upload failed.");
      }
    } catch (error) {
      message.error("Bulk upload failed.");
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        title="Bulk Upload Claims"
        visible={visible}
        onCancel={onClose}
        footer={null}
      >
        <Form
          onFinish={handleBulkUpload} // The function to handle bulk upload
          layout="vertical"
        >
          <Form.Item>
            <Upload
              multiple
              fileList={fileList}
              beforeUpload={(file) => {
                setFileList([...fileList, file]);
                return false;
              }}
              onRemove={(file) => {
                setFileList(fileList.filter((item) => item.uid !== file.uid));
              }}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>

          {/* Add a submit button inside the form */}
          <Form.Item className="text-right">
            <Button
              type="primary"
              htmlType="submit"
              className="!bg-primary"
              disabled={loading ? true : false}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BulkClaimRequestForm;
