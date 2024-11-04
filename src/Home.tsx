"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from "react-router-dom"
import { isAuthenticated } from "./services/api/authentication"
import { getLiveOrders } from "./services/api/order"
import { MenuBookingPopup } from "./BookingPopup"
import CreateOrderPopup from "./OrderPopup"
import CloseOrderPopup from "./CloseOrder"
import Loader from "./components/loader"
import { ordersToClose } from "./config/ordersToClose"

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
// Mock data for live orders
const MockOrders : Order[] | [] = [
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
  

function CountdownTimer({ targetDate, OrderId }: { targetDatee: string , OrderId: string}) {
  const [timeLeft, setTimeLeft] = useState("Loading...");
  // const targetDate = "2024-11-01T20:50:03.809Z"
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      // console.log("Current Time (UTC):", new Date(now).toISOString());
      // console.log("Target Time (UTC):", targetDate, new Date(target).toISOString());
      // console.log("Difference (ms):", difference);

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        console.log("pushing", OrderId)
        if(!(ordersToClose.includes(OrderId))) ordersToClose.push(OrderId);
        setTimeLeft("Closed");
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span className="font-mono text-xs">{timeLeft}</span>;
}

const caluclateTotal = (bookings : Booking[] | [])=>{
  let totalOrderValue : number = 0;
  bookings.map( booking =>{
    totalOrderValue += booking.total;
  })
  return totalOrderValue;
}
function HomeComponent() {
  const [liveOrders, setLiveOrders] = useState<Order[] | []>(MockOrders);
  const Navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const fetchOrders = async ()=>{
    setLoader(true)
    const orders = await getLiveOrders();
    setLoader(false)
    console.log("Refresh ",orders)
    orders&&setLiveOrders(orders)
  }
  useEffect( ()=>{
    setLoader(true)
    if(!isAuthenticated()){
      Navigate('/login')
    }else{
      // console.log(getLiveOrders())
      // const orders = getLiveOrders();
      
      fetchOrders();
    }
  },[])
  
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  // const addItem = (item : Item) =>{
  //   const foundItem = overallOrder.find(el => el.itemName === item.itemName);
  //   if(foundItem){
  //     console.log("asd",foundItem)
  //     foundItem.quantity += item.quantity;
  //   }else{
  //     console.log(item)
  //     setOverallOrder( prev => {
  //       return ([
  //         ...prev,
  //         item
  //       ])
  //     })
  //   }
  // }
  


  return (
    <>
    {loader ? 
    (<div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Loader size="large" color="primary" />
      {/* <p className="mt-4 text-muted-foreground">Please wait while we prepare your order...</p> */}
    </div>)
    :
    (<>
    <div className="flex justify-around">
      <h1 className="text-2xl font-bold mb-4">Live Orders</h1>
      {/* Pop up to create new order */}
      <CreateOrderPopup refreshLiveOrders = {fetchOrders}/>
    </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {liveOrders.map((order) => (
          <Card key={order.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{order.createdBy}&apos;s Order</CardTitle>
              <div className="text-sm text-muted-foreground">
                <CountdownTimer OrderId = {order.id} targetDate={order.closingTime} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium">Bookings: {order.NoOfBookings}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2 mt-auto">
              <Collapsible>
                <div className="flex justify-between items-center">
                  <CollapsibleTrigger asChild>
                    <Button onClick={()=>toggleOrderDetails(order.id)} variant="outline" size="sm" className="mb-2 text-xs">
                      View Bookings
                      {expandedOrder === order.id ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                    </Button>
                  </CollapsibleTrigger>
                  <span className="text-sm font-bold">Total: ₹{order.bookings&&caluclateTotal(order.bookings)?.toFixed(2)}</span>
                </div>
                <CollapsibleContent>
                  <div className="max-h-40 overflow-auto relative">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow>
                          <TableHead className="text-xs w-1/3">Name</TableHead>
                          <TableHead className="text-xs w-1/3">Items</TableHead>
                          <TableHead className="text-xs w-1/3">Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.bookings?.flatMap((booking, bookingIndex) =>
                          booking.items?.map((item, itemIndex) => {
                            return (
                              <TableRow key={`${bookingIndex}-${itemIndex}`}>
                                {itemIndex === 0 && (
                                  <TableCell className="text-xs" rowSpan={booking.items.length}>
                                    {booking.bookedBy}
                                  </TableCell>
                                )}
                                <TableCell className="text-xs">{item.itemName}</TableCell>
                                <TableCell className="text-xs">{item.quantity}</TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <CloseOrderPopup orderData  = {order}  refreshLiveOrders = {fetchOrders} />
                  {/* <Button onClick={()=> handleClose(order)} variant="destructive" size="sm" className="w-full mt-2 text-xs">Close Order</Button> */}
                </CollapsibleContent>
              </Collapsible>
              <MenuBookingPopup orderId  = {order.id}  refreshLiveOrders = {fetchOrders}/>
            </CardFooter>
          </Card>
        ))}
      </div>
      </>
      )}
    </>
  )
}

export default function Home() {
  return(
    <div className="p-5">
      <HomeComponent />
    </div>
  )
}