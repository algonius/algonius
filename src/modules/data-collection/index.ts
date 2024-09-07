// src/modules/data-collection/index.ts
import { Scraper } from "../../scrapers/base";

// Define the interface for scraped data from each source
export interface ScrapedData {
  source: string; // Source name (e.g., "DEXScraper", "NewsScraper")
  rawData: any; // Raw data scraped from the source (can be any type)
  getAIFormattedData(): string; // Method to format data for AI
}

// Define the interface for the combined data from all sources
export interface CombinedData {
  [source: string]: ScrapedData;
}

export class DataCollector {
  private scrapers: Scraper[];

  constructor(scrapers: Scraper[]) {
    this.scrapers = scrapers;
  }

  public async collectData(): Promise<CombinedData> {
    const dataPromises = this.scrapers.map((scraper) =>
      scraper.scrapeData().then((rawData) => ({
        source: scraper.constructor.name,
        rawData,
        getAIFormattedData: () => scraper.formatDataForAI(rawData), // Use scraper's formatting method
      }))
    );
    const scrapedDataList: ScrapedData[] = await Promise.all(dataPromises);

    // Combine data from different sources into a single object
    const combinedData: CombinedData = {};
    for (const scrapedData of scrapedDataList) {
      combinedData[scrapedData.source] = scrapedData;
    }

    return combinedData;
  }
}
