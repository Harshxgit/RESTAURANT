"use client";
import React, { useEffect, useState } from "react";
import { object } from "zod";

export default function MenuItems() {
  const [allmenu, setAllmenu] = useState([]);
  const [getmenu, setGetmenu] = useState();
  useEffect(async () => {
    const menu = await getMenu();
    setAllmenu(menu);

    const getmenu = allmenu.reduce((acc, curr) => {
      if (!acc[curr.type]) {
        acc.push(curr.type);
      } else {
        acc[curr.type] = curr;
      }
    }, {});

    setGetmenu(getmenu);
  });
  return (
    <div>
      <div>
        {object.entries(getmenu).map(([itemType, item]) =>
         (
          <>
          <div>{itemType}</div>
          <div>{item.map((name)=>(
             <>{name}</>
          ))}</div>
          </>
        ))}
      </div>
    </div>
  );
}
