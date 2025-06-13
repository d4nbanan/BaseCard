import { IsString } from 'class-validator';
import { IsStartsWith0x } from '../../common/validators/is-starts-with-0x';

export class VerifyDtoReqDto {
  @IsString()
  message: string;

  @IsStartsWith0x()
  signature: `0x${string}`;
}
