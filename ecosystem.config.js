module.exports = {
  apps: [
    {
      name: 'Playground',
      script: './dist/main.js',
      instances: 'max',
      exec_mode: 'cluster', // 멀티 코어 사용 설정
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
