import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { Logindto } from './login.dto';
import { registerdto } from './register.dto';

export class UpdateAuthDto extends PartialType(registerdto) {}
