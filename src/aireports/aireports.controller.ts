import {
    Controller,
    UseGuards,
    Query,
    DefaultValuePipe,
    Body,
    Post,
    Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { AireportsService } from './aireports.service';

@Roles(Role.admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('aireports')
export class AireportsController {
    constructor(private readonly aiReportsService: AireportsService) {}
    @Post()
    async getReports(
        @Query('page', new DefaultValuePipe(1)) page: number,
        @Body() filter: Record<string, any>,
    ) {
        return await this.aiReportsService.getReports(page, filter);
    }

    @Patch()
    async updateReport(
        @Body() data: { report_id: number; is_reviewed: boolean },
    ) {
        return await this.aiReportsService.update(
            data.report_id,
            data.is_reviewed,
        );
    }
}
