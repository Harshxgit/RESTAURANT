"use client"
import { order } from '@/app/actions/order/order'
import {  useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { object } from 'zod'

//get user details from session 
export default function page() {
  const {data:session} = useSession()
  const [items , setItems] = useState([])
  const [price , setPrice] = useState(0)
  const [type, setType] = useState("string")
  const[partysize , setPartysize] = useState<number>(0)
  const[ totalmenuquantity , setTotalmenuquantity]= useState(0)
  const onBook =()=>{
    const sucess = order( session?.user._id ,partysize,  price ,items, totalmenuquantity,type ) 
  }
  const handledragStart = (e)=>{
    item.setelement(item.id)
  }
  const onDrop =({item}:any)=>{
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
