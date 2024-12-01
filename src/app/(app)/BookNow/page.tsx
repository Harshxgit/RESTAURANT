"use client"
import { order } from '@/app/actions/order/order'
import { getSession } from 'next-auth/react'
import React, { useState } from 'react'

//get user details from session 
export default function page() {
  const session = getSession()
  const [items , setItems] = useState({})
  const [price , setPrice] = useState(0)

  const onBook =()=>{
    const sucess = order(items , session.user._id , price , totalmenuquantity ,  )
  }
  const onDrag =({item}:any)=>{
    if(item.name){
      setItems(item.qty++)
      setPrice(price)
    }
    setItems(item)
    setPrice(price + item.price)
  }
  const onDelete = ()=>{
    //whenever drag from the cart
    //get the item .
    //setActive cross option. 
    // then run filter from items.
  }
  return (
    <div  >
      <div>
        remove item from dashboard
      </div>
      <div>
        total price {price}
        {/* <span>{items.qty}</span> */}
      </div>
      <div>
        Book Now
      </div>
    </div>
  )
}
