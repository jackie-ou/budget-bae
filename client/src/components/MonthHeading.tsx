import { format, startOfMonth, lastDayOfMonth } from 'date-fns';

export function MonthHeading() {
  const today = new Date();
  const monthName = format(today, 'MMMM');

  const firstDayOfThisMonth = format(startOfMonth(today), 'M/d');
  const lastDayOfThisMonth = format(lastDayOfMonth(today), 'M/d');

  return (
    <div className="flex gap-2 items-center pb-4">
      <h2 className="text-3xl tracking-normal">
        {monthName}'s Expenses
      </h2> 
      <p className="font-light tracking-wider">
        {firstDayOfThisMonth} - {lastDayOfThisMonth}
      </p>
    </div>
  )
}