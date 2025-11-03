import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RegionService {
    constructor(private readonly databaseService: DatabaseService) {}
    findAll() {
        return this.databaseService.region.findMany();
    }
}
