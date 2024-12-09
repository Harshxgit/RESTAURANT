"use client"
import Signin from '@/components/PROJECT-COMP/Signin'
import Signup from '@/components/PROJECT-COMP/Signup'

import React, { useState } from 'react'

export default function page() {
 const [isTrue , setTrue] = useState(true)
 const [isFalse , setFalse] = useState(true   )
  return (
    <div>
        
        {/* {isTrue && <Signin/>} */}
        
        {isFalse && <Signup/> }
 
    </div>
  )
}
