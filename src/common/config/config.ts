import { envs } from './envs';

export const config = {
  port: envs.port,
  database: {
    ...envs.database,
    type: 'mysql',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: true,
  },
  jwt: {
    ...envs.jwt
  }
};
