import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "ionic-app-base",
  webDir: "dist",
  server: {
    androidScheme: "https",
    cleartext: false, // Enable HTTP requests during development
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
