import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ExpenseRow } from "@/components/ExpenseRow";
import { Panel } from "@/components/Panel";

const meta = {
  title: "Components/ExpenseRow",
  component: ExpenseRow,
  decorators: [
    (Story) => (
      <Panel className="max-w-xl">
        <Story />
      </Panel>
    ),
  ],
  args: {
    onClick: fn(),
    expense: {
      id: "1",
      title: "Thai takeout",
      amount: 50,
      expense_date: "2026-11-06",
      category: "Dining Out",
      expense_type: "shared",
      card_owner: "jackie",
      personal_owner: null,
    },
  },
} satisfies Meta<typeof ExpenseRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shared: Story = {};

export const Individual: Story = {
  args: {
    expense: {
      id: "2",
      title: "Car wash",
      amount: 30,
      expense_date: "2026-11-05",
      category: "Transportation",
      expense_type: "individual",
      card_owner: "dorothy",
      personal_owner: "jackie",
    },
  },
};

export const Locked: Story = { args: { locked: true } };
