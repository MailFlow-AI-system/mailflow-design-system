import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId, useRef, useState } from 'react'
import { userEvent, within } from 'storybook/test'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  Button,
  Input,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  Window,
  WindowBody,
  WindowClose,
  WindowContent,
  WindowDescription,
  WindowHeader,
  WindowMaximize,
  WindowMinimize,
  WindowMinimized,
  WindowRestore,
  WindowTitle,
  WindowTrigger,
} from '../src/components'
import {
  Bold,
  Clock,
  Image,
  Italic,
  Languages,
  Link2,
  List,
  ListOrdered,
  Paperclip,
  Save,
  ScanText,
  Send,
  Smile,
  Sparkles,
  SpellCheck,
  SquarePen,
  Underline,
  WandSparkles,
  X,
} from '../src/icons'
import type { WindowExampleProps } from './types/WindowExample'

const meta = {
  title: 'Components/Window',
  component: Window,
  args: { children: null },
  parameters: {
    docs: {
      story: { inline: false, height: 720 },
      description: {
        component:
          'A modal workspace with persistent content and a nonmodal minimized region. The consumer owns close interception and data.',
      },
    },
  },
} satisfies Meta<typeof Window>
export default meta
type Story = StoryObj<typeof meta>

function Example({
  initialState = 'normal',
  withAssistant = true,
  initiallyDirty = false,
  defaultOpen = true,
}: WindowExampleProps) {
  const fieldId = useId()
  const [revision, setRevision] = useState(0)
  const [initialBody, setInitialBody] = useState(
    initiallyDirty ? 'Conteúdo preservado ao mudar o estado da janela.' : '',
  )
  const [open, setOpen] = useState(defaultOpen)
  const [dirty, setDirty] = useState(initiallyDirty)
  const [confirm, setConfirm] = useState(false)
  const [cc, setCc] = useState(false)
  const [mobileAssistant, setMobileAssistant] = useState(false)
  const [bold, setBold] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <Window
      open={open}
      defaultState={initialState}
      onOpenChange={(next, details) => {
        if (!next && dirty) {
          details.cancel()
          setConfirm(true)
        } else setOpen(next)
      }}
    >
      <WindowTrigger ref={triggerRef} render={<Button />}>
        <SquarePen aria-hidden="true" /> Compose
      </WindowTrigger>
      <WindowContent key={revision} initialFocus={inputRef}>
        <WindowHeader>
          <WindowTitle>Nova mensagem</WindowTitle>
          <div className="flex shrink-0 gap-1">
            <WindowMinimize aria-label="Minimizar janela" />
            <WindowMaximize />
            <WindowClose
              aria-label="Fechar janela"
              render={<Button variant="ghost" size="icon" className="size-7" />}
            >
              <X aria-hidden="true" />
            </WindowClose>
          </div>
        </WindowHeader>
        <WindowDescription className="sr-only">
          Edite uma mensagem. Esta demonstração não envia emails nem executa ações de IA.
        </WindowDescription>
        <WindowBody className="flex">
          <div className="grid min-h-[520px] flex-1 grid-cols-1 md:grid-cols-[1fr_auto]">
            <div className="flex min-w-0 flex-col">
              <div className="border-b border-border">
                {['Para', ...(cc ? ['Cc', 'Bcc'] : []), 'Assunto'].map((label) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 border-b border-border px-4 last:border-0 focus-within:bg-accent/30"
                  >
                    <label
                      htmlFor={`${fieldId}-${label}`}
                      className="w-16 shrink-0 text-xs text-muted-foreground"
                    >
                      {label}
                    </label>
                    <Input
                      ref={label === 'Para' ? inputRef : undefined}
                      id={`${fieldId}-${label}`}
                      placeholder={
                        label === 'Assunto' ? 'Assunto do email' : 'destinatario@email.com'
                      }
                      className="h-8 min-w-0 flex-1 border-0 shadow-none dark:bg-transparent focus-visible:ring-1"
                      onChange={() => setDirty(true)}
                    />
                    {label === 'Para' && (
                      <Button
                        variant="ghost"
                        className="h-8 px-0 text-xs text-muted-foreground"
                        aria-expanded={cc}
                        onClick={() => setCc(!cc)}
                      >
                        Cc/Bcc
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex-1 p-4">
                <textarea
                  aria-label="Corpo da mensagem"
                  placeholder="Escreva sua mensagem…"
                  className="min-h-[280px] w-full resize-none rounded-md bg-transparent p-2 text-sm outline-none placeholder:font-medium placeholder:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue={initialBody}
                  onChange={() => setDirty(true)}
                />
              </div>
              <Toolbar aria-label="Formatação da mensagem">
                <ToolbarButton
                  aria-label="Negrito"
                  aria-pressed={bold}
                  onClick={() => setBold(!bold)}
                >
                  <Bold aria-hidden="true" />
                </ToolbarButton>
                <ToolbarButton aria-label="Itálico">
                  <Italic aria-hidden="true" />
                </ToolbarButton>
                <ToolbarButton aria-label="Sublinhado">
                  <Underline aria-hidden="true" />
                </ToolbarButton>
                <ToolbarSeparator />
                <ToolbarButton aria-label="Lista com marcadores">
                  <List aria-hidden="true" />
                </ToolbarButton>
                <ToolbarButton aria-label="Lista numerada">
                  <ListOrdered aria-hidden="true" />
                </ToolbarButton>
                <ToolbarSeparator />
                <ToolbarButton aria-label="Inserir link">
                  <Link2 aria-hidden="true" />
                </ToolbarButton>
                <ToolbarButton aria-label="Inserir imagem">
                  <Image aria-hidden="true" />
                </ToolbarButton>
                <ToolbarButton aria-label="Inserir emoji">
                  <Smile aria-hidden="true" />
                </ToolbarButton>
                <ToolbarButton aria-label="Anexar arquivo">
                  <Paperclip aria-hidden="true" />
                </ToolbarButton>
              </Toolbar>
              <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3">
                <Button>
                  <Send aria-hidden="true" /> Send
                </Button>
                <Button variant="outline" size="icon" aria-label="Agendar envio">
                  <Clock aria-hidden="true" />
                </Button>
                <Button variant="ghost" onClick={() => setDirty(false)}>
                  <Save aria-hidden="true" /> Rascunho
                </Button>
                {withAssistant && (
                  <Button
                    variant="ghost"
                    className="md:hidden"
                    aria-expanded={mobileAssistant}
                    aria-controls={`${fieldId}-assistant`}
                    onClick={() => setMobileAssistant(!mobileAssistant)}
                  >
                    IA
                  </Button>
                )}
                <span role="status" className="ml-auto text-xs text-muted-foreground">
                  {dirty ? 'Alterações não salvas' : 'Salvo há 3s'}
                </span>
              </div>
            </div>
            {withAssistant && (
              <aside
                id={`${fieldId}-assistant`}
                aria-label="AI Assistente"
                className={`${mobileAssistant ? 'flex' : 'hidden'} w-full flex-col gap-1 border-t border-border bg-muted/20 p-3 md:flex md:w-[220px] md:border-l md:border-t-0`}
              >
                <h3 className="mb-1 flex items-center gap-2 px-1 text-xs font-semibold">
                  <Sparkles aria-hidden="true" className="size-3.5 text-primary" />
                  AI Assistente
                </h3>
                {[
                  [WandSparkles, 'Escrever email'],
                  [ScanText, 'Melhorar texto'],
                  [Sparkles, 'Mais persuasivo'],
                  [SpellCheck, 'Corrigir gramática'],
                  [ScanText, 'Resumir'],
                  [Languages, 'Traduzir'],
                  [WandSparkles, 'Gerar assunto'],
                  [Sparkles, 'Gerar CTA'],
                ].map(([Icon, label]) => {
                  const ActionIcon = Icon as typeof Sparkles
                  return (
                    <Button
                      key={String(label)}
                      variant="ghost"
                      className="h-8 justify-start px-2 text-xs text-muted-foreground"
                    >
                      <ActionIcon aria-hidden="true" className="text-primary" />
                      {String(label)}
                    </Button>
                  )
                })}
              </aside>
            )}
          </div>
        </WindowBody>
      </WindowContent>
      <WindowMinimized aria-label="Mensagem minimizada">
        <WindowRestore aria-label="Restaurar mensagem">Nova mensagem</WindowRestore>
        <WindowClose
          aria-label="Fechar janela"
          render={<Button variant="ghost" size="icon" className="size-7" />}
        >
          <X aria-hidden="true" />
        </WindowClose>
      </WindowMinimized>
      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent
          initialFocus={cancelRef}
          finalFocus={() => (open ? true : triggerRef.current)}
        >
          <AlertDialogTitle>Fechar sem salvar?</AlertDialogTitle>
          <AlertDialogDescription>
            Há alterações não salvas. Continue editando ou feche a janela.
          </AlertDialogDescription>
          <div className="flex flex-wrap justify-end gap-2">
            <AlertDialogClose render={<Button ref={cancelRef} variant="outline" />}>
              Continuar editando
            </AlertDialogClose>
            <AlertDialogClose
              render={<Button variant="destructive" />}
              onClick={() => {
                setOpen(false)
                setDirty(false)
                setInitialBody('')
                setRevision((value) => value + 1)
              }}
            >
              Fechar sem salvar
            </AlertDialogClose>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Window>
  )
}

export const Normal: Story = { render: () => <Example /> }
export const Closed: Story = { render: () => <Example defaultOpen={false} /> }
export const Minimized: Story = { render: () => <Example initialState="minimized" /> }
export const Maximized: Story = { render: () => <Example initialState="maximized" /> }
export const CloseConfirmation: Story = {
  render: () => <Example initiallyDirty />,
  play: async ({ canvasElement }) => {
    const surface = within(canvasElement.ownerDocument.body)
    await userEvent.click(await surface.findByRole('button', { name: 'Fechar janela' }))
    await surface.findByRole('alertdialog', { name: 'Fechar sem salvar?' })
  },
}
export const WithoutAssistant: Story = { render: () => <Example withAssistant={false} /> }
