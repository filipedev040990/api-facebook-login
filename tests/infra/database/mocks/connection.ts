import { IMemoryDb, newDb } from 'pg-mem'

export const makeFakeDbConnection = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/database/entities/index.ts']
  })
  await connection.synchronize()
  return db
}
