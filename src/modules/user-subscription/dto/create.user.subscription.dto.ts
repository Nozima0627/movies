import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UserSubscriptionDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  user_id: number;

  @ApiProperty()
  @IsNumber()
  plan_id: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  auto_renew: boolean;
}
