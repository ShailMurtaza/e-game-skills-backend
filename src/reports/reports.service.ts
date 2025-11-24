import { Injectable } from '@nestjs/common';
import { UserReportsCreateInput } from 'generated/prisma/models';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ReportsService {
    constructor(private readonly databaseService: DatabaseService) {}
    async newReport(report: UserReportsCreateInput) {
        return await this.databaseService.userReports.create({
            data: report,
        });
    }
}
