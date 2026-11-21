import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { MonthPicker } from "@/components/MonthPicker";
import { currentMonth, shiftMonth } from "@/lib/finance";

const meta = {
  title: "Components/MonthPicker",
  component: MonthPicker,
  args: { value: currentMonth(), onChange: () => {} },
  render: function Render(args) {
    const [month, setMonth] = useState(args.value);
    return <MonthPicker value={month} onChange={setMonth} />;
  },
} satisfies Meta<typeof MonthPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Next" is disabled on the current month. */
export const CurrentMonth: Story = {};
export const PastMonth: Story = { args: { value: shiftMonth(currentMonth(), -3) } };
