interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
}

function Button({ onClick, children }: ButtonProps) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  )
}

export default Button