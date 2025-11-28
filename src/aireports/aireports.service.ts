import { InferenceClient } from '@huggingface/inference';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AireportsService {
    private readonly client: InferenceClient;
    private readonly model: string;
    private readonly reports_per_page = 3;
    constructor(
        private readonly config: ConfigService,
        private readonly databaseService: DatabaseService,
    ) {
        const token = this.config.get<string>('hf.token');
        this.model = this.config.get<string>('hf.model')!;
        if (!token) {
            throw new Error('HUGGINGFACE_API_KEY is not set in environment');
        }
        this.client = new InferenceClient(token);
    }

    async classifyText(input: string): Promise<number> {
        try {
            const result = await this.client.textClassification({
                model: this.model,
                inputs: input,
                provider: 'hf-inference',
            });

            return result.find((r) => r.label === 'toxicity')?.score ?? 0;
        } catch (err) {
            throw new InternalServerErrorException(
                `HuggingFace inference failed: ${(err as Error).message}`,
            );
        }
    }

    async report(message_id: number, message: string) {
        const toxicity: number = await this.classifyText(message);
        if (toxicity > 0.7) {
            await this.databaseService.aIReports.create({
                data: {
                    toxicity: toxicity,
                    target_message_id: message_id,
                },
            });
        }
    }

    async getReports(page: number, filter: Record<string, any>) {
        const total_reports = await this.databaseService.aIReports.count({
            where: filter,
        });
        if (!total_reports) throw new NotFoundException('No Reports Found');
        const max_pages = Math.ceil(total_reports / this.reports_per_page);
        if (page < 1 || page > max_pages)
            throw new NotFoundException('Invalid Page');

        const reports = await this.databaseService.aIReports.findMany({
            where: filter,
            include: {
                message: {
                    include: {
                        sender: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                        receiver: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                    },
                },
            },
            take: this.reports_per_page,
            skip: (page - 1) * this.reports_per_page,
        });

        const formated_reports = reports.map((r) => ({
            id: r.id,
            timestamp: r.timestamp,
            is_reviewed: r.is_reviewed,
            toxicity: r.toxicity,
            message: r.message.content,
            msg_sender_user: r.message.sender,
            msg_receiver_user: r.message.receiver,
        }));

        return {
            max_pages: max_pages,
            reports: formated_reports,
        };
    }

    async update(report_id: number, is_reviewed: boolean) {
        const result = await this.databaseService.aIReports.update({
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
