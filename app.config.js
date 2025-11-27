import 'dotenv/config';

export default {
  expo: {
    name: "frontend-delivery",
    slug: "frontend-delivery",
    version: "1.0.0",
    android: {
      package: "com.solutionserj.foodstoresdc", // ← AGREGA ESTO
    },
    extra: {
      API_URL: process.env.API_URL,
      eas: {
        projectId: "4d7c7d91-fd54-4df4-ae4b-87f2e705a458",
      },
    },
  },
};
