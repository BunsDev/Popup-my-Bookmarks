import * as React from 'react'

import Input from '../../../../core/components/baseItems/Input'
import Select from '../../../../core/components/baseItems/Select'
import { OPTIONS } from '../../../../core/constants'
import { Options } from '../../../../core/types/options'
import classes from './styles.css'

const normalize = (value: string) => {
  return value
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .join(',')
}

interface Props<T = string> {
  choices: Array<T>
  optionName: OPTIONS
  optionValue: T
  updatePartialOptions: (options: Partial<Options>) => void
}
const InputSelect = ({
  choices,
  optionName,
  optionValue,
  updatePartialOptions,
}: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const selectRef = React.useRef<HTMLSelectElement>(null)

  const handleBlur = React.useCallback(
    (evt: React.FocusEvent<HTMLInputElement>) => {
      updatePartialOptions({
        [optionName]: normalize(evt.currentTarget.value),
      })
    },
    [optionName, updatePartialOptions],
  )

  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (evt.currentTarget === selectRef.current) {
        if (inputRef.current) inputRef.current.focus()
      }

      updatePartialOptions({
        [optionName]: evt.currentTarget.value,
      })
    },
    [optionName, updatePartialOptions],
  )

  return (
    <div className={classes.main}>
      <Input
        ref={inputRef}
        className={classes.input}
        name={optionName}
        value={optionValue}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <Select
        ref={selectRef}
        className={classes.select}
        defaultValue={optionValue}
        onChange={handleChange}
      >
        {choices.map((optionChoice, optionChoiceIndex) => (
          <option key={String(optionChoiceIndex)}>{optionChoice}</option>
        ))}
      </Select>
    </div>
  )
}

export default InputSelect
