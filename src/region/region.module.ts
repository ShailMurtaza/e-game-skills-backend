import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [RegionController],
    providers: [RegionService],
})
export class RegionModule {}
