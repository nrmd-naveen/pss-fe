'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { closeAnOrder } from './services/api/order'

// Define the structure of an order item
interface Item{
  itemName: string,
  quantity: number,
  price: number
}
interface Booking {
  bookedBy : string,
  items: Item[],
  total: number
}
interface Order {
    id: string,
    createdBy: string,
    NoOfBookings: number,
    createdAt: string,
    closingTime: string,
    bookings: Booking[],
    totalPrice: number,
}
// This would typically come from your application state or API
const sampleOrder : Order[] | [] = [
  {
    id: "1",
    createdBy: "John Doe",
    NoOfBookings: 5,
    createdAt: "2023-06-15T10:30:00Z",
    closingTime: "2023-06-15T12:30:00Z",
    bookings: [
      { bookedBy: "Alice", items: [{ itemName: "Pizza", quantity: 2, price:20 }], total:50 },
      { bookedBy: "Bob", items: [{ itemName: "Burger", quantity: 1, price:20  }, { itemName: "Fries", quantity: 1, price:20  }] , total:50},
      { bookedBy: "fasdce", items: [{ itemName: "Pizza", quantity: 1, price:20  }], total:50 },
     ],
    totalPrice: 35.50,
  }
]

export default function CloseOrderPopup( { orderData, refreshLiveOrders } ) {
  const [overallOrder, setOverallOrder] = useState<Item[] | []>([]);
  const [isOpen, setIsOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const caluclateTotal = (bookings : Booking[] | [])=>{
    let totalOrderValue : number = 0;
    bookings.map( booking =>{
      totalOrderValue += booking.total;
    })
    return totalOrderValue;
  }

  useEffect(()=>{
    // console.log("--------",orderData)
    getOrderInvoice(orderData)
  },[orderData])

  const getOrderInvoice = (order: Order) => {
    // Create a temporary array to hold the consolidated items
    const tempOrder: Item[] = [];
    
    // Consolidate items from the order
    order.bookings.forEach(booking => 
      booking.items.forEach(item => {
        // console.log(item)
        const foundItem = tempOrder.find(el => el.itemName === item.itemName);
        if (foundItem) {
          console.log(foundItem)
          foundItem.quantity = foundItem.quantity + item.quantity;
          foundItem.price += (item.price * item.quantity)
        } else {
          tempOrder.push({
            itemName : item.itemName,
            price : (item.price * item.quantity),
            quantity : item.quantity
          });
        }
      })
    );
    // Update overallOrder state
    console.log(tempOrder)
    setOverallOrder(tempOrder);
    };
  
    // const handleClose = (orderData : Order)=>{
    //   const orderItems = getOrderInvoice(orderData)
    //   console.log(orderItems)
    // }

  const handleOrderPaid = async() => {
    // Implement your order paid logic here
    
    console.log(orderData)
    console.log("Order marked as paid")
    const res = await closeAnOrder(orderData.id)
    
    if(res){
      refreshLiveOrders()
      setIsAlertOpen(false)
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="w-full mt-2 text-xs">Close Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Invoice</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overallOrder.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹ {item.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-right font-bold">
            Total : <span className='text-xl '> ₹{caluclateTotal(orderData.bookings)?.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button>Order Paid</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to mark this order as paid? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleOrderPaid}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  )
}