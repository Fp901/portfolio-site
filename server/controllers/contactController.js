import { saveContact } from "../models/contactModel.js";

export async function submitContactForm(req, res) {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Please fill in all required fields." });
    }

    await saveContact(name, email, phone, message);
    res.status(200).json({ success: "Message submitted successfully!" });
  } catch (error) {
    console.error("❌ Error submitting form:", error);
    res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
}
