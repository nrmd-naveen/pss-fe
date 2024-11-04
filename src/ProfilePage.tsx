'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { User, Mail, Calendar, ShoppingBag, Edit, Key } from 'lucide-react'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 1, 2023',
    ordersPlaced: 15
  })

  const [editProfile, setEditProfile] = useState({ ...profile })
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setProfile(editProfile)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    })
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }
    // Here you would typically make an API call to change the password
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="container max-w-lg mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-secondary text-secondary-foreground hover:bg-secondary/80 p-6">
          <CardTitle className="text-xl md:text-2xl font-bold">Profile Information</CardTitle>
          <CardDescription className="text-xs md:text-md  text-secondary-foreground/80">
            You can update your profile & password here
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center space-x-4">
              <User className="w-8 h-8 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Name</p>
                <p className="text-md font-semibold">{profile.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="w-8 h-8 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Email</p>
                <p className="text-md font-semibold">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Join Date</p>
                <p className="text-md font-semibold">{profile.joinDate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ShoppingBag className="w-8 h-8 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Orders Placed</p>
                <p className="text-md font-semibold">{profile.ordersPlaced}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex w-full items-center">
                  <Edit className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={editProfile.name}
                        onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={editProfile.email}
                        onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Update your password here. You'll need to enter your current password first.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleChangePassword}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="current-password" className="text-right">
                        Current
                      </Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-password" className="text-right">
                        New
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="confirm-password" className="text-right">
                        Confirm
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Change Password</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}