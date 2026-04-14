/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    N8N_USER_WEBHOOK_URL: process.env.N8N_USER_WEBHOOK_URL,
    N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
  },
}

module.exports = nextConfig
