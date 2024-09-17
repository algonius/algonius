import { TradeSignal} from '../types'

export interface AIPlugin {
  id: string
  generateTradeSignal(marketData: string): Promise<TradeSignal>;
}

export interface ScraperPlugin {
  id: string;
  scrapeData(): Promise<any>;
  formatDataForAI(rawData: any): Promise<string>;
}