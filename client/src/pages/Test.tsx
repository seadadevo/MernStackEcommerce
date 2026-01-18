import React, { useEffect, useState } from 'react'
import MyButton from './MyButton';

const Test = () => {
   
    const [count, setCount] = useState(0);
    const [text, setText] = useState("")

    const increament = () => {
        setCount( c => c + 1);
    }

  return (
    <div>
        <input type="text" value={text} onChange={(e) => setText(e.target.value) } />
        <MyButton onClick = {increament} label = "increase COunt"/>
    </div>
  )
}

export default Test