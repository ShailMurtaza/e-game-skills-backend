import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
    private otps = new Map<string, { code: number; expiresAt: number }>();
    constructor() {
        setInterval(() => {
            const now = Date.now();
            for (const [email, record] of this.otps.entries()) {
                if (now > record.expiresAt) this.otps.delete(email);
            }
        }, 60 * 1000); // Check for expired OTPs every minute
    }

    generate(email: string): number {
        const code = crypto.randomInt(100000, 999999); // 6-digit OTP
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
        this.otps.set(email, { code, expiresAt });
        return code; // send via email or SMS
    }

    verify(email: string, inputCode: number): boolean {
        const record = this.otps.get(email);
        if (!record) return false;
        const expired = Date.now() > record.expiresAt;
        const valid = record.code === inputCode;
        if (expired || !valid) return false;
        this.otps.delete(email); // one-time use
        return true;
    }
}
