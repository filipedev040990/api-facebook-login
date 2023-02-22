export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '655158559745594',
    clientSecret: process.env.FB_CLIENT_SECRET ?? 'bf17a3107d34311dec65f50b80532234'
  },
  crypto: {
    secretKey: process.env.CRYPTO_SECRET_KEY ?? 'c448f3579836b14afdf3fe413a46c546'
  },
  server: {
    port: process.env.PORT ?? 3000
  }
}
