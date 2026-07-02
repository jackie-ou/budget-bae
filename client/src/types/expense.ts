export interface ExpenseType {
  id: string;
  created_at: string; // TODO: Convert to Date type
  payer_id?: string;
  amount?: number;
  purchase_type?: string;
  category_id?: string;
  transaction_date: string; // TODO: Convert to Date type
  description?: string;
  credit_card_id?: string;
  title: string;
  csp_category?: string;
}
