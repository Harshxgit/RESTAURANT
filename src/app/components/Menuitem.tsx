'use client'
import { getMenu } from "@/app/actions/menu/addMenu";

import React, { useEffect, useState } from "react";


interface Items {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface groupItems {
  [category: string]: Items[];
}

export default function MenuItems() {
  const [allmenu, setAllmenu] = useState<Items[]>([]);
  const [getmenu, setGetmenu] = useState<groupItems>();
  const [selecteditems, setSelecteditems] = useState<Items[]>([]);
  const [selected, setSelected] = useState<boolean | null>(false);
  const setSelecteditem = (items: Items[]) => {
    setSelecteditems(items);
    setSelected(true);
  };
  const fetchdata = async () => {
    getMenu().then(setAllmenu)
  };
  useEffect(() => {
    fetchdata();

    const getmenu = allmenu.reduce<groupItems>((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = [];
      }
      acc[curr.category].push(curr);
      return acc;
    }, {});

    setGetmenu(getmenu);
  }, []);
  return (
    <div>
      <div>
        {Object.entries(getmenu ?? {}).map(([itemType, items]) => (
          <>
            <div key={itemType} onClick={() => setSelecteditem(items)}>
              {itemType}
            </div>

            {selected &&
              selecteditems.map((item) => (
                <div>
                  <div>{item.name}</div>
                </div>
              ))}
          </>
        ))}
      </div>
    </div>
  );
}
