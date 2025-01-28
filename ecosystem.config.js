module.exports = {
    apps: [
      {
        name: 'Dashboard-Hyundai-App-by-Dhanesh',
        script: 'npm',
        args: 'start',
        env: {
          NODE_ENV: 'production',
          HOST: '0.0.0.0',
          PORT: 3000,
        },
      },
    ],
  };
  