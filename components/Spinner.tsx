export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block w-[14px] h-[14px] border-2 border-current border-t-transparent rounded-full animate-spin ${className}`}
    />
  )
}
