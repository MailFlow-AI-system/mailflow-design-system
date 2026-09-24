import { cn } from 'cn'

type ClassName<State> = string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>): ClassName<State> {
  return typeof className === 'function'
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

export { cn, mergeClassName }
