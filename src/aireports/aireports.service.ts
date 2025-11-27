import { InferenceClient } from '@huggingface/inference';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AireportsService {
    private readonly client: InferenceClient;
    private readonly model: string;
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
}
