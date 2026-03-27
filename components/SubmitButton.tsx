'use client'

import { useFormStatus } from 'react-dom'
import { Spinner } from '@/components/Spinner'

interface Props {
  label: string
  loadingLabel?: string
  className?: string
}

export function SubmitButton({ label, loadingLabel, className = '' }: Props) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`disabled:opacity-70 flex items-center justify-center gap-2 ${className}`}
    >
      {pending ? (
        <><Spinner />{loadingLabel ?? label}</>
      ) : (
        label
      )}
    </button>
  )
}
