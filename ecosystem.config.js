module.exports = {
  apps: [
    {
      name: 'app', // The name of the application
      script: './dist/main.js', // Path to the main file to run
      instances: 0, // Number of instances; adjust as needed
      exec_mode: 'cluster', // Use "cluster" for load balancing
      watch: true,
      env: {
        NODE_ENV: 'development', // Environment-specific settings
        PORT: 3000, // Define the port your app should run on
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000, // Ensure PORT is correctly mapped for production
      },
    },
  ],
};
