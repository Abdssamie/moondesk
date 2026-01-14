import packageJson from "../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Moondesk",
  version: packageJson.version,
  copyright: `© ${currentYear}, Moondesk.`,
  meta: {
    title: "Moondesk - Industrial IoT Dashboard",
    description:
      "Moondesk is a modern Industrial IoT dashboard for monitoring and managing industrial assets. Track solar panels, PLCs, sensors, and more in real-time.",
  },
};
