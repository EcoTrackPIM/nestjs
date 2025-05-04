import { Injectable } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';

@Injectable()
export class VisionService {
  private client: ImageAnnotatorClient;

  constructor() {
    this.client = new ImageAnnotatorClient({
        keyFilename: 'src/vision-key.json',
    });
  }

  async detectText(imageBuffer: Buffer): Promise<string[]> {
    try {
      // Use the buffer for text detection
      const [result] = await this.client.textDetection({
        image: { content: imageBuffer },
      });
      const detections = result.textAnnotations || [];
      return detections.map((text) => text.description);
    } catch (error) {
      console.error('Error in Vision API:', error);
      return [];
    }
  }
}
