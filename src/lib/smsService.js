import axios from "axios";

export const sendSMS = async (to, message) => {
  try {
    const response = await axios.post(
      "https://api.ng.termii.com/api/sms/send",
      {
        to: to, // Recipient phone number
        from: process.env.TERMII_SENDER_ID, // Sender ID, registered with Termii
        sms: message, // The message to send
        type: "plain", // Message type (plain or unicode)
        channel: "generic", // Channel to send via (generic or dnd)
        api_key: process.env.TERMII_API_KEY, // Your Termii API key
      }
    );

    // Check if the message was successfully sent
    if (response.data.code === "ok") {
      console.log("SMS sent successfully");
    } else {
      console.error("Failed to send SMS:", response.data);
      throw new Error("SMS sending failed");
    }
  } catch (error) {
    console.error("Failed to send SMS:", error);
    throw new Error("SMS sending failed");
  }
};
