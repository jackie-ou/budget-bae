export interface ExpenseType {
  id: string;
  title: string;
  price: number;
  date: string; // TODO: Convert to Date type
  mcc?: string;
  payer?: string;
  details?: string;
  type: string;
}