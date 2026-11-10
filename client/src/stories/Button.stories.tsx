import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronLeft, ChevronRight, Plus, Settings, Trash2 } from "lucide-react"

import { Button } from "@/components/library"

const meta = {
  title: "Library/Button",
  component: Button,
  args: {
    children: "Button",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "destructive"],
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Save",
    size: "lg"
  },
}

export const Secondary: Story = {
  args: { variant: "secondary", children: "View settlement breakdown" },
}

export const Outline: Story = {
  args: { variant: "outline", children: "Cancel" },
}

export const Ghost: Story = {
  args: { variant: "ghost", children: "Skip" },
}

export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete", leftIcon: <Trash2 /> },
}

export const WithLeftIcon: Story = {
  args: { children: "Add expense", leftIcon: <Plus /> },
}

export const WithRightIcon: Story = {
  args: { variant: "outline", children: "See all", rightIcon: <ChevronRight /> },
}

export const IconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" icon={<Settings />} aria-label="Settings" />
      <Button variant="ghost" icon={<ChevronLeft />} aria-label="Previous month" />
      <Button variant="ghost" icon={<ChevronRight />} aria-label="Next month" />
      <Button variant="outline" icon={<Plus />} aria-label="Add" />
    </div>
  ),
}

export const Fab: Story = {
  render: () => <Button size="lg" icon={<Plus />} aria-label="Add expense" />,
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex items-center gap-2">
          <Button size={size}>Button</Button>
          <Button size={size} leftIcon={<Plus />}>
            Add expense
          </Button>
          <Button size={size} variant="ghost" icon={<Settings />} aria-label="Settings" />
        </div>
      ))}
    </div>
  ),
}

export const AllVariants: Story = {
  args: {
    size: "lg"
  },

  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  )
}

export const Disabled: Story = {
  args: { children: "Save", disabled: true },
}
