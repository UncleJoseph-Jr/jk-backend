import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfileService } from './profile.service';

@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
