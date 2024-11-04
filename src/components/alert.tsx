import { RocketIcon } from "@radix-ui/react-icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertDemo() {
  return (
    <Alert>
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>Welcome !</AlertTitle>
      <AlertDescription>
        Hey name let's get started with TakeMyOrder app .
      </AlertDescription>
    </Alert>
  )
}
