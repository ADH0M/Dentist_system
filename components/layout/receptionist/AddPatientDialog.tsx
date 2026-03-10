"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AddPatientDialogProps = {
  onAdd: (patient: { name: string; phone?: string }) => void
}

export function AddPatientDialog({ onAdd }: AddPatientDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")

  const handleSubmit = () => {
    if (!name.trim()) return alert("Name is required")
    onAdd({ name, phone: phone.trim() || undefined })
    setName("")
    setPhone("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Patient</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Patient name"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional phone number"
            />
          </div>
          <Button onClick={handleSubmit}>Add Patient</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}