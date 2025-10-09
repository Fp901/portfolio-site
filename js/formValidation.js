document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstNameField = document.getElementById("firstName");
    const lastNameField = document.getElementById("lastName");
    const emailField = document.getElementById("email");
    const phoneField = document.getElementById("phone");
    const messageField = document.getElementById("message");

    const isFirstNameValid = validateName(firstNameField, "First name");
    const isLastNameValid = validateName(lastNameField, "Last name");
    const isEmailValid = validateEmail(emailField);
    const isPhoneValid = validatePhone(phoneField);
    const isMessageValid = validateMessage(messageField);

    if (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isMessageValid
    ) {
      status.textContent = "⏳ Sending message...";
      status.style.color = "#555";

      const formData = {
        firstName: firstNameField.value.trim(),
        lastName: lastNameField.value.trim(),
        email: emailField.value.trim(),
        phone: phoneField.value.trim(),
        message: messageField.value.trim(),
      };

      try {
        const response = await fetch("http://localhost:3000/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          status.textContent = "✅ Message sent successfully!";
          status.style.color = "#28a745";
          form.classList.add("success");
          setTimeout(() => form.classList.remove("success"), 600);

          form.reset();
          form.querySelectorAll(".helper-text").forEach((h) => {
            h.textContent = "";
            h.classList.remove("visible", "valid");
          });
          form.querySelectorAll("input, textarea").forEach((f) => {
            f.classList.remove("valid", "invalid");
          });
        } else {
          status.textContent =
            "❌ " + (result.message || "Failed to send message.");
          status.style.color = "#c0392b";
        }
      } catch (error) {
        console.error("❌ Error sending message:", error);
        status.textContent = "⚠️ Failed to send message. Please try again.";
        status.style.color = "#c0392b";
      }
    } else {
      status.textContent = "⚠️ Please fix the highlighted fields.";
      status.style.color = "#c0392b";
      status.style.fontWeight = "500";
    }
  });

  // Live validators
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      switch (field.id) {
        case "firstName":
          validateName(field, "First name");
          break;
        case "lastName":
          validateName(field, "Last name");
          break;
        case "email":
          validateEmail(field);
          break;
        case "phone":
          validatePhone(field);
          break;
        case "message":
          validateMessage(field);
          break;
      }
    });
  });

  // Validators
  function validateName(input, label) {
    const helper = input.nextElementSibling;
    const regex = /^[A-Za-z\s'-]{2,}$/;
    if (!input.value.trim())
      return showError(input, helper, `${label} is required.`);
    if (!regex.test(input.value.trim()))
      return showError(
        input,
        helper,
        `${label} should only contain letters and spaces.`
      );
    return showSuccess(input, helper, "✅");
  }

  function validateEmail(input) {
    const helper = input.nextElementSibling;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.value.trim())
      return showError(input, helper, "Email is required.");
    if (!regex.test(input.value.trim()))
      return showError(input, helper, "Please enter a valid email address.");
    return showSuccess(input, helper, "✅");
  }

  function validatePhone(input) {
    const helper = input.nextElementSibling;
    if (!input.value.trim()) {
      helper.textContent = "";
      helper.classList.remove("visible");
      input.classList.remove("invalid", "valid");
      return true;
    }
    const regex = /^\+?\d{7,15}$/;
    if (!regex.test(input.value.trim()))
      return showError(input, helper, "Phone must be 7–15 digits.");
    return showSuccess(input, helper, "✅");
  }

  function validateMessage(input) {
    const helper = input.nextElementSibling;
    if (!input.value.trim())
      return showError(input, helper, "Message cannot be empty.");
    if (input.value.trim().length < 10)
      return showError(
        input,
        helper,
        "Message must be at least 10 characters long."
      );
    return showSuccess(input, helper, "✅");
  }

  // Helpers
  function showError(input, helper, message) {
    input.classList.add("invalid");
    input.classList.remove("valid");
    helper.textContent = message;
    helper.classList.add("visible");
    helper.classList.remove("valid");
    return false;
  }

  function showSuccess(input, helper, message) {
    input.classList.add("valid");
    input.classList.remove("invalid");
    helper.textContent = message;
    helper.classList.add("visible", "valid");
    return true;
  }
});
