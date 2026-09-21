import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@mailflow/ui/components'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Accordion', () => {
  it('opens a panel when its trigger is activated', async () => {
    render(
      <Accordion>
        <AccordionItem value="one">
          <AccordionTrigger>What is MailFlow?</AccordionTrigger>
          <AccordionContent>MailFlow keeps customer conversations organized.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    const trigger = screen.getByRole('button', { name: 'What is MailFlow?' })
    expect(
      screen.queryByText('MailFlow keeps customer conversations organized.'),
    ).not.toBeInTheDocument()

    fireEvent.click(trigger)
    expect(screen.getByText('MailFlow keeps customer conversations organized.')).toBeVisible()
  })
})
