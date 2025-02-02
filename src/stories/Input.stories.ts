import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '@/components/formElements';

const meta = {
  component: Input
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example = {
  args: {
    placeholder: 'name',
    valid: true,
    value: 'name',
    onChange: () => {},
    label: 'name'
  }
} satisfies Story;
