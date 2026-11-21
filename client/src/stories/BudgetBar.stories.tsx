import type { Meta, StoryObj } from "@storybook/react-vite";

import { BudgetBar } from "@/components/BudgetBar";
import { Panel } from "@/components/Panel";

const meta = {
  title: "Components/BudgetBar",
  component: BudgetBar,
  decorators: [
    (Story) => (
      <Panel className="max-w-xl">
        <Story />
      </Panel>
    ),
  ],
  args: { label: "Household", spent: 1265, budget: 1600 },
} satisfies Meta<typeof BudgetBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Under 80% of budget. */
export const OnTrack: Story = { args: { spent: 900 } };
/** 80–100% of budget. */
export const Warning: Story = {};
/** Over budget. */
export const Over: Story = { args: { spent: 1820 } };
