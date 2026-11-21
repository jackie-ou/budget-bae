import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatCard } from "@/components/StatCard";

const meta = {
  title: "Components/StatCard",
  component: StatCard,
  decorators: [
    (Story) => (
      <div className="max-w-60">
        <Story />
      </div>
    ),
  ],
  args: { label: "Dorothy's share", value: 620, person: "dorothy" },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Person: Story = {};
export const Accent: Story = { args: { label: "Household spending", value: 1265, accent: true, person: undefined } };
export const OverBudget: Story = {
  args: { label: "Household budget left", value: -220, tone: "danger", person: undefined },
};
export const Loading: Story = { args: { loading: true } };
