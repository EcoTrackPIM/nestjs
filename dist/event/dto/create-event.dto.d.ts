export declare class CreateEventDto {
    name: string;
    description: string;
    image?: string;
    latitude: number;
    longitude: number;
    startTime: Date;
    endTime: Date;
    maxParticipants?: number;
    participants?: string[];
    registrationDeadline?: Date;
    isFeatured?: boolean;
    pointsAwarded?: number;
    certificateAvailable?: boolean;
    badges?: string[];
    chatRoomId?: string;
    organizerContact?: string;
    customFields?: Record<string, any>;
}
