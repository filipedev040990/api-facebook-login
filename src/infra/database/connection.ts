import { ConnectionOptions } from 'typeorm'

export const connection: ConnectionOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'api-facebook',
  entities: ['dist/infra/database/entities/index.js']
}
