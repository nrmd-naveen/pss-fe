'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Clock, IndianRupee, Utensils, User } from 'lucide-react'

// Mock data for demonstration
const orders = [
  {
    id: '6723b008e6911124ba58af2a',
    createdBy: 'John Doe',
    paidBy: 'Alice',
    createdAt: '2023-05-15T10:00:00Z',
    closedAt: '2023-05-15T12:00:00Z',
    totalValue: 1500,
    bookingsCount: 3,
    bookings: [
      { id: 'b1', bookedBy: 'Alice', item: 'Pizza', quantity: 2, price: 300 },
      { id: 'b2', bookedBy: 'Bob', item: 'Burger', quantity: 1, price: 150 },
      { id: 'b3', bookedBy: 'Charlie', item: 'Salad', quantity: 3, price: 450 }
    ]
  },
  {
    id: '6723b008e6911124ba58af2b',
    createdBy: 'Jane Smith',
    paidBy: 'Jane Smith',
    createdAt: '2023-05-16T14:00:00Z',
    closedAt: '2023-05-16T16:30:00Z',
    totalValue: 2000,
    bookingsCount: 4,
    bookings: [
      { id: 'b4', bookedBy: 'David', item: 'Steak', quantity: 1, price: 500 },
      { id: 'b5', bookedBy: 'Eve', item: 'Fish', quantity: 2, price: 600 },
      { id: 'b6', bookedBy: 'Frank', item: 'Pasta', quantity: 3, price: 450 },
      { id: 'b7', bookedBy: 'Grace', item: 'Dessert', quantity: 3, price: 450 }
    ]
  }
]

// Assume the current user is 'Alice' for highlighting purposes
const currentUser = 'Alice'

export default function OrderHistoryPage() {
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  }

  const truncateId = (id: string) => {
    return `${id.slice(0, 6)}...${id.slice(-6)}`
  }

  const getUserBooking = (bookings) => {
    return bookings.find(booking => booking.bookedBy === currentUser)
  }

  const getOtherBookings = (bookings) => {
    return bookings.filter(booking => booking.bookedBy !== currentUser)
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map(order => {
          const userBooking = getUserBooking(order.bookings)
          const otherBookings = getOtherBookings(order.bookings)

          return (
            <Card key={order.id} className="w-full overflow-hidden">
              <div className="bg-gradient-to-r from-secondary/20 to-secondary text-secondary-foreground p-3">
                <h2 className="text-lg font-semibold mb-1">Order #{truncateId(order.id)}</h2>
                <div className="flex justify-between items-center text-xs">
                  <Badge variant="secondary" className="text-xs">
                    {order.bookingsCount} bookings
                  </Badge>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="space-y-3 text-sm">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>By: {order.createdBy}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Closed: {formatDate(order.closedAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center space-x-1">
                      <IndianRupee className="w-4 h-4" />
                      <span className="font-semibold">Total: ₹{order.totalValue}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-medium text-primary">
                        Paid by: {order.paidBy}
                      </span>
                    </div>
                  </div>
                  {userBooking && (
                    <div className="bg-primary/10 border border-primary rounded-md p-2 mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold">Your Booking</span>
                        <span className="font-bold text-primary">
                          ₹{userBooking.price * userBooking.quantity}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <Utensils className="w-3 h-3" />
                        <span>{userBooking.item} x {userBooking.quantity}</span>
                      </div>
                    </div>
                  )}
                  <Collapsible open={expandedOrders.includes(order.id)} onOpenChange={() => toggleOrderExpansion(order.id)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        {expandedOrders.includes(order.id) ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            Hide All Bookings
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            Show All Bookings
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ScrollArea className="h-[200px] w-full rounded-md border p-3 mt-3">
                        {otherBookings.map(booking => (
                          <div 
                            key={booking.id} 
                            className="p-2 rounded-md mb-2 bg-secondary/10"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold">{booking.bookedBy}</span>
                              <span className="font-bold">
                                ₹{booking.price * booking.quantity}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                              <Utensils className="w-3 h-3" />
                              <span>{booking.item} x {booking.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}