'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createNewOrder } from './services/api/order'

export default function CreateOrderPopup({ refreshLiveOrders } ) {
  const [open, setOpen] = useState(false)
  const [maxParticipants, setMaxParticipants] = useState('10')
  const [liveHours, setLiveHours] = useState('4')

  const handleCreateOrder = async() => {
    // Validate inputs
    if (!maxParticipants || !liveHours) {
      alert('Please fill in all fields')
      return
    }

    // Convert inputs to numbers
    const participants = parseInt(maxParticipants, 10)
    const hours = parseInt(liveHours, 10)

    if (isNaN(participants) || isNaN(hours)) {
      alert('Please enter valid numbers')
      return
    }

    // TODO: Implement order creation logic here
    console.log('Creating order:', { maxParticipants: participants, liveHours: hours })
    const res = await createNewOrder(participants, hours)
    if(res) refreshLiveOrders();
    // Close the dialog
    setOpen(false)

    // Reset form
    setMaxParticipants('')
    setLiveHours('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxParticipants" className="text-right">
              Max Participants
            </Label>
            <Input
              id="maxParticipants"
              type="number"
              className="col-span-3"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="liveHours" className="text-right">
              Live for (hours)
            </Label>
            <Input
              id="liveHours"
              type="number"
              className="col-span-3"
              value={liveHours}
              onChange={(e) => setLiveHours(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleCreateOrder}>Create Order</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}