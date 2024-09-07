 
export abstract class Scraper {
  public abstract scrapeData(): Promise<any>;

  // Method to format data for AI (to be implemented by concrete Scraper classes)
  public abstract formatDataForAI(rawData: any): string; 
}