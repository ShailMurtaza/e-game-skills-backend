import {
    Body,
    Controller,
    DefaultValuePipe,
    NotFoundException,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreateReportDto } from './dto/user-reports.dto';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'generated/prisma/enums';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Post()
    async submitReport(@Req() req: any, @Body() report: CreateReportDto) {
        const result = await this.reportsService.newReport({
            reporter: { connect: { id: req.user.userId } },
            target: { connect: { id: report.user_id } },
            reason: report.reason,
            description: report.description,
        });
        if (result) return { message: 'Report Submited!' };
        throw new NotFoundException('Something went wrong');
    }

    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @Post('getReports')
    async getReports(
        @Body() filter: Record<string, any>,
        @Req() req: any,
        @Query('page', new DefaultValuePipe(1)) page: number,
    ) {
        return this.reportsService.getReports(page, filter);
    }
}
