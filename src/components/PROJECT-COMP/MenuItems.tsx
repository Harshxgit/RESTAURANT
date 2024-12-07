"use client";
import { getMenu } from "@/app/actions/menu/addMenu";
import React, { useEffect, useState } from "react";
import { object, string } from "zod";

interface Items {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface groupItems{
  [category:string] : Items[]
}


export default function MenuItems() {
  const [allmenu, setAllmenu] = useState<Items[]>([]);
  const [getmenu, setGetmenu] = useState<groupItems>();
  useEffect(() => {
    (async () => {
      const menu = await getMenu();
      setAllmenu(menu);
    })();

    const getmenu = allmenu.reduce<groupItems>((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = []
      } 
        acc[curr.category].push(curr)
      
      return acc
    }, {});

    setGetmenu(getmenu);
  }, []);
  return (
    <div>
      <div>
        {Object.entries(getmenu ?? {}).map(([itemType, items]) => (
          <>
            <div>{itemType}</div>
            <div>
              {items.map((item) => (
                <div>
                  <div>{item.name}</div>
                  {/* <div>{item.img}</div> */}
                </div>
              ))}
            </div>
          </>
        )
        )}
      </div>
    </div>
  );
}
