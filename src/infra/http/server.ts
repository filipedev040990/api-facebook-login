import 'module-alias/register'
import { app } from './app'
import { env } from '@/infra/env'
import { createConnection } from 'typeorm'
import { connection } from '@/infra/database/connection'

createConnection(connection)
  .then(() => {
    const port = env.server.port
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
  })
  .catch(console.error)
