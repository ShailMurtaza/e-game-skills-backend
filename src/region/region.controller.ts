import { Controller, Get } from '@nestjs/common';
import { RegionService } from './region.service';

@Controller('region')
export class RegionController {
    constructor(private readonly regionService: RegionService) {}

    @Get()
    findAll() {
        return this.regionService.findAll();
    }
}
