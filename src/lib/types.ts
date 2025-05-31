export interface StockData {
  [ticker: string]: { Date: string; Close: number }[];
}
