import { TradeSignal} from '../types'

export interface AIPlugin {
  generateTradeSignal(marketData: string): Promise<TradeSignal>;
}

export interface ScraperPlugin {
  id: string;
  scriptUrl: string;
  scrapeData(): Promise<any>;
  formatDataForAI(rawData: any): string;
}