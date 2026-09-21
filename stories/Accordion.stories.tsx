import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../src/components/Accordion'

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: 'A vertically stacked set of interactive headings that reveal content panels.',
      },
    },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <Accordion className="max-w-xl">
      <AccordionItem value="first">
        <AccordionTrigger>What is MailFlow?</AccordionTrigger>
        <AccordionContent>MailFlow keeps customer conversations organized.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="second">
        <AccordionTrigger>Does it support teams?</AccordionTrigger>
        <AccordionContent>Yes. Shared workflows keep every teammate aligned.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
