export interface BillModel {
  bill_id: string;
  user_id: number;
  amount: number;
  due_date: string;
  status: "Paid" | "Due" | "Overdue";
}
