import React, { useState } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getMenuItems } from './services/api/order'
import { createNewBooking } from './services/api/booking'

interface MenuItem {
  _id: string;
  name: string;
  price: number;
}
interface Books {
  item: string;
  quantity: number;
}

const dummyMenuItems: MenuItem[] = [
  { _id: "1", name: "Margherita Pizza", price: 12.99 },
  { _id: "2", name: "Pepperoni Pizza", price: 14.99 },
  { _id: "3", name: "Vegetarian Pizza", price: 13.99 },
  { _id: "4", name: "Hawaiian Pizza", price: 15.99 },
  { _id: "5", name: "BBQ Chicken Pizza", price: 16.99 },
  { _id: "6", name: "Mushroom Risotto", price: 18.99 },
  { _id: "7", name: "Spaghetti Carbonara", price: 16.99 },
  { _id: "8", name: "Caesar Salad", price: 10.99 },
  { _id: "9", name: "Garlic Bread", price: 5.99 },
  { _id: "10", name: "Tiramisu", price: 7.99 },
]

interface MenuBookingPopupProps {
  orderId: string; 
  refreshLiveOrders: () => void; 
}

export const MenuBookingPopup: React.FC<MenuBookingPopupProps> = ({ orderId, refreshLiveOrders }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookedItems, setBookedItems] = useState<Books[]|[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[] | []>(dummyMenuItems)
  const fetchMenu = async()=>{
  const items : MenuItem[] | [] = await getMenuItems();
  // console.log(items)
  setMenuItems(items)
  }

  useState(()=>{
    fetchMenu()
  },[])

//   const addItem = (itemId: string) => {
//     const existingItem = bookedItems.find(itm => itm.item === itemId);

//     if (existingItem) {
//         existingItem.quantity += 1;
//     } else {
//         setBookedItems(prev => {
//           return ([
//           ...prev,{
//             item: itemId,
//             quantity: 1
//         }
//         ])})
//     }
// }


const addItem = (itemId: string) => {
  setBookedItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.item === itemId);
      if (existingItemIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += 1;
          return updatedItems;
      } else {
          return [...prevItems, { item: itemId, quantity: 1 }];
      }
  });
};

const removeItem = (itemId: string) => {
  setBookedItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.item === itemId);
      if (existingItemIndex !== -1) {
          const updatedItems = [...prevItems];
          const existingItem = updatedItems[existingItemIndex];

          if (existingItem.quantity > 1) {
              // Decrease quantity by 1
              existingItem.quantity -= 1;
          } else {
              // Remove item if quantity is 1
              updatedItems.splice(existingItemIndex, 1);
          }
          return updatedItems;
      }
      return prevItems; // No change if item not found
  });
};

  const getTotalItems = () => {
    const quan : number = bookedItems.reduce((acc, el) => acc + el.quantity, 0)
    return quan
  }

  const getTotalPrice = () => {
    return bookedItems.reduce((acc, bItm) => {
      const itm = menuItems.find(el => el._id === bItm.item);
      return acc + (itm ? itm.price * bItm.quantity : 0);
    }, 0);
  }

  const getquantity = (id : string) => {
    const item = bookedItems.find(el => el.item === id)
    return item ? item.quantity : 0;
  }
  const confirmBooking = async() => {
    const booked = await createNewBooking(bookedItems , orderId)
    booked? refreshLiveOrders() : alert("Sorry! Booking cant be added")
    setIsOpen(false)
    console.log('Booking confirmed:', bookedItems);
    setBookedItems([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="w-full text-xs">Book Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg">Menu Booking</DialogTitle>
        </DialogHeader>
        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold text-sm mb-2">Your Order ({getTotalItems()} items)</h3>
          {bookedItems.map((itm) => {
            const item = menuItems.find(item => item._id === itm.item)
            return item ? (
              <div key={item._id} className="flex justify-between items-center mb-2 text-sm">
                <span>{item.name}</span>
                <span>x{getquantity(item._id)}</span>
              </div>
            ) : null
          })}
          {getTotalItems() > 0 && (
            <div className="font-semibold mt-2 text-sm">
              Total: ₹{getTotalPrice().toFixed(2)}
            </div>
          )}
        </div>
        <ScrollArea className="mt-4 border-t pt-4 h-[300px]">
          {menuItems.map(item => (
            <div key={item._id} className="flex items-center justify-between mb-4">
              <div className="flex-1 pl-3">
                <div className="text-sm">{item.name}</div>
                <div className="text-xs text-muted-foreground">₹{item.price.toFixed(2)}</div>
              </div>
              <div className="flex pr-3 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(item._id)}
                  disabled={false}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="mx-2 w-6 text-center text-sm">{getquantity(item._id)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addItem(item._id)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
        <DialogFooter>
          <Button onClick={confirmBooking} disabled={getTotalItems() === 0}>Confirm Booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}