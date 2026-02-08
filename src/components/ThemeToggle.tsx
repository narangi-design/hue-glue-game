import * as Toggle from '@radix-ui/react-toggle'
import sunIcon from '../assets/sun.svg?raw'
import moonIcon from '../assets/moon.svg?raw'
import '../styles/ThemeToggle.css'

interface ThemeToggleProps {
  darkTheme: boolean
  onToggle: (pressed: boolean) => void
}

function ThemeToggle({ darkTheme, onToggle }: ThemeToggleProps) {
  return (
    <Toggle.Root
      className='theme-toggle'
      pressed={darkTheme}
      onPressedChange={onToggle}
    >
      <span className='theme-knob'>
        <span className='theme-icon' dangerouslySetInnerHTML={{ __html: darkTheme ? moonIcon : sunIcon }} />
      </span>
    </Toggle.Root>
  )
}

export default ThemeToggle
