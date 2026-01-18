import React, { memo } from 'react'

const MyButton = ({onClick, label}) => {
    console.log(label)
    return (
    <div>
        <button onClick={onClick}>{label}</button>
    </div>
  )
}

export default memo(MyButton)