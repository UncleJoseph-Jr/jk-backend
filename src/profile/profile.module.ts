import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfileService } from './profile.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
