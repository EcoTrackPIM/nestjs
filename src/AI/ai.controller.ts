import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { GroqService } from 'src/groq.service';
import { InjectModel } from '@nestjs/mongoose';
import { RoadTrip } from './entities/road.entity';
import { Model } from 'mongoose';
import { Protect } from 'src/auth/auth.guard';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly groqservice: GroqService,
    @InjectModel(RoadTrip.name) private roadTripModel: Model<RoadTrip>,
  ) {}



  @Post('feedback')
  async getFeedback(@Body() body: {  conversation: string } ) {

    const {conversation} = body
    console.log(conversation)
    const response = await this.groqservice.getClient().chat.completions.create({
      model: 'qwen-qwq-32b',
      messages: [
        { role: 'system', content: `you should generate a feddback summary for ecotrack conversation for the user and give quick feed back about the user, this is the conversation: ${conversation} ` },
      ]
    })
    console.log(response.choices[0].message.content)
    return response.choices[0].message.content
  }




  @UseGuards(Protect)
  @Post('roadtrip')
  async create(@Body() tripData: any, @Req() req) {
    // Save the trip data
    const createdTrip = new this.roadTripModel({
      ...tripData,
      status: 'completed',
      date: new Date(),
      userId: req.userId
    });
    await createdTrip.save();
  
    // Prepare AI analysis prompt
    const analysisPrompt = `
      Analyze this eco-friendly trip data and provide a short, friendly feedback (1-2 sentences max):
      - Distance traveled: ${tripData.distance} meters
      - CO2 emissions: ${tripData.co2Emissions} kg
      - Vehicle type: ${tripData.vehicleType}
      
      Consider these points:
      1. For distances under 1000m, suggest walking/cycling
      2. For medium distances (1-5km), comment on efficiency
      3. For long distances, suggest alternatives if emissions are high
      4. Compare emissions to average for the vehicle type
      5. Keep it positive and motivational
      
      Example responses:
      "Great short trip! Next time consider walking for such short distances."
      "Good efficiency for a diesel vehicle on this medium-length trip!"
      "Your electric vehicle made this trip with zero emissions - fantastic!"
    `;
  
    // Get AI analysis
    const response = await this.groqservice.getClient().chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        { 
          role: 'system', 
          content: 'You are an eco-friendly transportation assistant. Provide very short, helpful feedback about trip data.' 
        },
        { 
          role: 'user', 
          content: analysisPrompt 
        }
      ],
      //max_tokens: 100, // Keep response short
      temperature: 0.7, // Balance creativity and accuracy
    });
  
    const aiFeedback = response.choices[0]?.message?.content || "Thanks for tracking your trip!";
  
    return {
      trip: createdTrip,
      analysis: aiFeedback
    };
  }

}
