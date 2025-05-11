// Script pour mettre à jour le rôle d'un utilisateur en admin
const fetch = require("node-fetch");

async function updateUserRole() {
  try {
    console.log("🔵 Mise à jour du rôle en cours...");
    const response = await fetch("http://localhost:3000/api/auth/update-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "melissahad2003@gmail.com",
        newRole: "admin",
      }),
    });

    const data = await response.json();
    console.log("📦 Réponse:", data);

    if (response.ok) {
      console.log("✅ Rôle mis à jour avec succès");
    } else {
      console.error("❌ Erreur:", data.message);
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

updateUserRole();
 