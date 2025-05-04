import { MessageType, Status } from "../entities/chat.entity";

export class CreateChatDto {
    
      createdAt?: Date;
    
      id: string;
    
      metadata?: Record<string, any>;
    
      remoteId?: string;
    
      roomId?: string;
    
      showStatus?: boolean;
    
      status?: Status;
    
      type: MessageType;
    
      updatedAt?: Date;
    
      // Conditional fields
      text?: string; // Only for MessageType.TEXT
    
      uri?: string; // Only for MessageType.AUDIO or IMAGE
}
