import * as ToggleGroup from '@radix-ui/react-toggle-group'
import '../styles/SizeSelector.css'

interface SizeSelectorProps {
  value: string
  onChange: (value: string) => void
}

function SizeSelector({ value, onChange }: SizeSelectorProps) {
  return (
    <ToggleGroup.Root
      className='toggle-group'
      type='single'
      value={value}
      onValueChange={(v) => v && onChange(v)}
    >
      <ToggleGroup.Item className='toggle-item' value='6' data-label='6x6' />
      <ToggleGroup.Item className='toggle-item' value='8' data-label='8x8' />
      <ToggleGroup.Item className='toggle-item' value='10' data-label='10x10' />
      <ToggleGroup.Item className='toggle-item' value='12' data-label='12x12' />
    </ToggleGroup.Root>
  )
}

export default SizeSelector