import 'module-alias/register'
import { app } from './app'
import { env } from '@/infra/env'

const port = env.server.port
app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
