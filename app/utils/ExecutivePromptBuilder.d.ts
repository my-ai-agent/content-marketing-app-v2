// Type declarations for ExecutivePromptBuilder.js
// File: /utils/ExecutivePromptBuilder.d.ts

export default class ExecutivePromptBuilder {
  promptData: any;
  
  constructor();
  
  // Core methods
  initializeFromStorage(): void;
  updatePersonaData(personaSelection: any, customPersonaText?: string): any;
  updatePhotoData(photoFile: any, cropData?: any, fileName?: string | null): any;
  updateStoryData(storyText: string): any;
  updateAudienceData(audienceSelection: string): any;
  updateInterestsData(interestsSelection: string): any;
  updatePlatformData(platforms: string[], formats: string[]): any;
  
  // Analysis methods
  analyzeStoryContent(storyText: string): any;
  extractLocations(text: string): string[];
  extractActivities(text: string): string[];
  extractEmotions(text: string): string[];
  extractCulturalElements(text: string): string[];
  identifyExperienceType(text: string): string;
  generateContentHooks(storyText: string): string[];
  extractSEOKeywords(text: string): string[];
  
  // Mapping methods
  getUserTypeDetails(personaType: string, customText?: string): any;
  parseAudienceDetails(audience: string): any;
  getInterestDetails(interest: string): any;
  getPlatformRequirements(platform: string): string;
  getPlatformBestPractices(platform: string): string;
  getPlatformLimits(platform: string): string;
  getPlatformHashtagRules(platform: string): string;
  getFormatSpecifications(format: string): string;
  getFormatStructure(format: string): string;
  getFormatGuidelines(format: string): string;
  
  // Strategy methods
  generateCrossPlatformStrategy(platforms: string[], formats: string[]): any;
  planContentVariations(platforms: string[], formats: string[]): any;
  analyzePhotoForPrompt(photoFile: any): any;
  
  // Validation and generation
  validateCompleteness(): any;
  generateClaudePrompt(): string;
  
  // Utility methods
  saveAndValidate(): any;
  resetPrompt(): void;
  notifyCompletionStatus(percentage: number, isComplete: boolean): void;
  exportPromptData(): any;
}
