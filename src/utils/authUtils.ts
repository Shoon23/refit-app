import { Preferences } from "@capacitor/preferences";

export async function isAuthenticated() {
  return Preferences.get({ key: "userData" })
    .then(({ value }) => {
      if (!value) {
        return false;
      } else {
        return true;
      }
    })
    .catch((error) => {
      console.error("Error checking user authentication:", error);
      return false;
    });
}
