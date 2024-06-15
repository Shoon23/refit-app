import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.refit.app",
  appName: "ReFit",
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
