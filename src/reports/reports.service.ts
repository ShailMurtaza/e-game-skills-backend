import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    UserReportsCreateInput,
    UserReportsWhereInput,
} from 'src/generated/prisma/models';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ReportsService {
    private readonly reports_per_page: number = 2;
    constructor(private readonly databaseService: DatabaseService) {}
    async newReport(report: UserReportsCreateInput) {
        return await this.databaseService.userReports.create({
            data: report,
        });
    }

    async getReports(page: number, filter: Record<string, any>) {
        const reportsWhereFilter: UserReportsWhereInput = {};
        if (filter.hasOwnProperty('is_reviewed'))
            reportsWhereFilter['is_reviewed'] = filter.is_reviewed;
        const total_reports = await this.databaseService.userReports.count({
            where: reportsWhereFilter,
        });
        if (!total_reports) throw new NotFoundException('No Reports Found');
        const max_pages = Math.ceil(total_reports / this.reports_per_page);
        if (page > max_pages)
            throw new NotFoundException('Invalid Page Number');
        const reports = await this.databaseService.userReports.findMany({
            where: reportsWhereFilter,
            take: this.reports_per_page,
            skip: (page - 1) * this.reports_per_page,
            orderBy: {
                timestamp: 'asc',
            },
        });
        return {
            max_pages: max_pages,
            reports: reports,
        };
    }

    async updateReport(report_id: number, is_reviewed: boolean) {
        const result = await this.databaseService.userReports.update({
            where: {
                id: report_id,
            },
            data: {
                is_reviewed: is_reviewed,
            },
        });
        if (result) return { message: 'Updated!' };
        else throw new BadRequestException('Something went wrong');
    }
}
