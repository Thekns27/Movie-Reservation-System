import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto } from '../application/dtos/register.dto';
import { LoginDto } from '../application/dtos/login.dto';
import { RegisterUseCase } from '../application/use-case/register.usecase';
import { LoginUseCase } from '../application/use-case/login.usecase';
import { MeUseCase } from '../application/use-case/me.usecse';
import { JwtAuthGuard } from 'src/module/auth/guards/jwt-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUC: RegisterUseCase,
    private readonly loginUC: LoginUseCase,
    private readonly meUC: MeUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.registerUC.execute(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.loginUC.execute(dto);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    const userId = req.user.id;
    return await this.meUC.execute(userId);
  }
}
