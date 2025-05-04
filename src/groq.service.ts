import { Injectable } from '@nestjs/common';
import Groq from "groq-sdk";

@Injectable()
export class GroqService {
    private readonly groq: Groq;

    constructor() {
      this.groq = new Groq({
        apiKey: "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",
      });
    }
  
    getClient(): Groq {
      return this.groq;
    }

}