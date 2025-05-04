import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScanResult, ScanResultSchema } from './scan-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScanResult.name, schema: ScanResultSchema }
    ])
  ],
  exports: [MongooseModule]
})
export class ScanResultModule {}