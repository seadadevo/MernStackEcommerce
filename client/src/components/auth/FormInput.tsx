import React, { type ComponentProps } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

interface  IFormInputProps extends ComponentProps<"input"> {
    label: string;
}

const FormInput = ({label , id, ...rest}: IFormInputProps) => {

  return (
     <div className="grid gap-2">
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                {...rest}
              />
            </div>
  )
}

export default FormInput