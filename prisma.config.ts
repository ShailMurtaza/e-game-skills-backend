import { defineConfig, env } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    engine: 'classic',
    datasource: {
        url: 'mysql://mysql:shail012@localhost:3306/e_game_skills',
    },
});
