export interface IScanResult {
    originalText: string;
    matchedBrands: string[];
    percentages: Record<string, number>;
    allText?: string;
    resultsFilePath?: string;
    imagePath?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
