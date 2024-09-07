
// Interface for AI providers (updated - only provides AIGC capabilities)
export interface AIProvider {
  name: string;
  configure: (config: any) => Promise<boolean>; 
  generateText: (prompt: string, options?: any) => Promise<string>; // Example AIGC function
  // ... other AIGC functions can be added here (e.g., image generation, etc.)
}