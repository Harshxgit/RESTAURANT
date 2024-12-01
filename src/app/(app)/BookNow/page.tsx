import { order } from '@/app/actions/order/order'
import React, { useState } from 'react'
//get user details from session 
export default function page() {
  const [items , setItems] = useState({})

  const onBook =()=>{
    const sucess = order(items , userid , price ,partysize , totalmenuquantity )
  }
  const onDrag =({item}:any)=>{
    if(item.name){
      setItems(item.qty++)
    }
    setItems(item)
  }
  return (
    <div  >
      <div>
        Book Now
      </div>
    </div>
  )
}
