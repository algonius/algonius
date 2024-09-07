export interface KlineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsData {
  title: string;
  content: string;
  source: string;
  timestamp: number;
  sentiment: 'positive' | 'negative' | 'neutral'; 
}

export interface TradeSignal {
  symbol: string;
  action: 'buy' | 'sell';
  price: number;
  quantity: number;
  reason: string;
}