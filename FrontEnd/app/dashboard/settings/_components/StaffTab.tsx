"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { Field } from "./Field"
import { inputCls, initials, ROLES, StaffMember } from "./shared"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export function StaffTab() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [confirmId, setConfirmId] = useState<number | null>(null)

  const { data } = useQuery({
    queryKey: ["staff_data"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff_data`
      )
      return res.data
    },
  })

  const staffList: StaffMember[] = (data?.data ?? []).map((m: any) => ({
    id: m.id,
    name: m.staff_name,
    role: m.staff_role,
    initials: initials(m.staff_name),
  }))

  const addStaffMutation = useMutation({
    mutationFn: (payload: { staff_name: string; staff_role: string }) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create_staff`,
        payload
      ),
    onSuccess: async (_, vars) => {
      await queryClient.refetchQueries({ queryKey: ["staff_data"] })
      form.reset()
      setShowForm(false)
      toast.success("Staff member added", {
        description: `${vars.staff_name} has been added to the team.`,
        classNames: {
          toast: "!bg-green-50 !border !border-green-400",
          title: "!text-green-700 !font-semibold",
          description: "!text-green-600",
          icon: "!text-green-600",
        },
      })
    },
    onError: (error) => {
      const status = (error as any)?.response?.status
      const msg =
        (error as any)?.response?.data?.message || "Failed to add staff member"
      if (status >= 400 && status < 500) {
        toast.warning(msg, {
          classNames: {
            toast: "!bg-yellow-50 !border !border-yellow-400",
            title: "!text-yellow-700 !font-semibold",
          },
        })
      } else {
        toast.error(msg, {
          classNames: {
            toast: "!bg-red-50 !border !border-red-400",
            title: "!text-red-700 !font-semibold",
          },
        })
      }
    },
  })

  const updateStaffMutation = useMutation({
    mutationFn: (payload: {
      id: number
      staff_name: string
      staff_role: string
    }) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/update_staff`,
        payload
      ),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["staff_data"] })
      form.reset()
      setEditingId(null)
      setShowForm(false)
      toast.success("Staff member updated", {
        classNames: {
          toast: "!bg-green-50 !border !border-green-400",
          title: "!text-green-700 !font-semibold",
          description: "!text-green-600",
          icon: "!text-green-600",
        },
      })
    },
    onError: (error) => {
      const msg =
        (error as any)?.response?.data?.message ||
        "Failed to update staff member"
      toast.error(msg, {
        classNames: {
          toast: "!bg-red-50 !border !border-red-400",
          title: "!text-red-700 !font-semibold",
        },
      })
    },
  })

  const deleteStaffMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/delete_staff`, { id }),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["staff_data"] })
      setConfirmId(null)
      toast.success("Staff member removed", {
        classNames: {
          toast: "!bg-green-50 !border !border-green-400",
          title: "!text-green-700 !font-semibold",
        },
      })
    },
    onError: (error) => {
      const msg =
        (error as any)?.response?.data?.message ||
        "Failed to delete staff member"
      toast.error(msg, {
        classNames: {
          toast: "!bg-red-50 !border !border-red-400",
          title: "!text-red-700 !font-semibold",
        },
      })
    },
  })

  const form = useForm({
    defaultValues: { name: "", role: "Barber" },
    onSubmit: ({ value }) => {
      if (editingId !== null) {
        updateStaffMutation.mutate({
          id: editingId,
          staff_name: value.name.trim(),
          staff_role: value.role,
        })
      } else {
        addStaffMutation.mutate({
          staff_name: value.name.trim(),
          staff_role: value.role,
        })
      }
    },
  })

  const openAdd = () => {
    form.reset()
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (member: StaffMember) => {
    form.setFieldValue("name", member.name)
    form.setFieldValue("role", member.role)
    setEditingId(member.id)
    setShowForm(true)
  }

  const closeForm = () => {
    form.reset()
    setEditingId(null)
    setShowForm(false)
  }

  const isPending = addStaffMutation.isPending || updateStaffMutation.isPending

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <h2 className="text-lg font-bold text-gray-900">Staff</h2>
        <button
          onClick={openAdd}
          className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={15} /> Add member
        </button>
      </div>

      {showForm && (
        <div className="mb-5 rounded-2xl border-2 border-primary bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            {editingId !== null ? "Edit staff member" : "New staff member"}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="FULL NAME">
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value || value.trim().length < 2)
                        return "Name must be at least 2 characters"
                    },
                  }}
                >
                  {(field) => (
                    <div>
                      <input
                        autoFocus
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="e.g. Karim Alaoui"
                        className={inputCls}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="mt-1 text-sm text-red-500">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </Field>
              <Field label="ROLE">
                <form.Field name="role">
                  {(field) => (
                    <select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={inputCls}
                    >
                      {ROLES.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  )}
                </form.Field>
              </Field>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                className="cursor-pointer rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {isPending ? "Saving..." : editingId !== null ? "Save" : "Add"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="cursor-pointer rounded-md border px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {staffList.length > 0 ? (
          <>
            {staffList.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-xl border bg-white px-5 py-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {member.initials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <button
                  onClick={() => openEdit(member)}
                  className="cursor-pointer text-gray-400 transition-colors hover:text-primary"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setConfirmId(member.id)}
                  className="cursor-pointer text-gray-400 transition-colors hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </>
        ) : (
          <p className="text-sm text-gray-500">
            No staff members found. Add your team to manage their schedules and
            appointments.
          </p>
        )}
      </div>

      <Dialog
        open={confirmId !== null}
        onOpenChange={(open) => !open && setConfirmId(null)}
      >
        <DialogContent showCloseButton={false} className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove staff member?</DialogTitle>
            <DialogDescription>
              This will permanently delete the staff member. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button className="cursor-pointer rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={() => {
                if (confirmId !== null) {
                  deleteStaffMutation.mutate(confirmId)
                }
              }}
              className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {deleteStaffMutation.isPending ? "Removing..." : "Remove"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
