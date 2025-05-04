import { MessageType, Status } from "../entities/chat.entity";
export declare class CreateChatDto {
    createdAt?: Date;
    id: string;
    metadata?: Record<string, any>;
    remoteId?: string;
    roomId?: string;
    showStatus?: boolean;
    status?: Status;
    type: MessageType;
    updatedAt?: Date;
    text?: string;
    uri?: string;
}
