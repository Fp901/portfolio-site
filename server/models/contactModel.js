export async function saveContact(name, email, phone, message) {
  console.log("💾 Saving contact (mock mode):");
  console.log({ name, email, phone, message });

  // Simulate async database write
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("✅ Contact saved (mock mode).");
}
