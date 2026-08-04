"use client"

import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { z } from "zod"
import { Reveal } from "@/components/Reveal"

const contactSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().min(1, "Please enter your email").pipe(z.email("Invalid email")),
  message: z.string().min(1, "Please enter a message"),
})

const inputCls =
  "w-full bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none"

export default function Contact() {
  const sendMessage = useMutation({
    mutationFn: (data) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, data),
    onSuccess: () => {
      toast.success("Thanks! We'll get back to you shortly.")
      form.reset()
    },
    onError: () => {
      toast.error("Failed to send your message. Please try again.")
    },
  })

  const form = useForm({
    defaultValues: { name: "", email: "", message: "" },
    onSubmit: async ({ value }) => {
      const parsed = contactSchema.safeParse(value)
      if (!parsed.success) {
        toast.error("Please fix the highlighted fields")
        return
      }
      await sendMessage.mutateAsync(parsed.data)
    },
  })

  return (
    <section id="contact" className="bg-background px-6 py-24 md:px-12">
      <div className="mx-auto max-w-3xl">
        <Reveal>
        <p className="mb-4 text-xs font-semibold tracking-widest text-primary uppercase">
          / Contact
        </p>
        <h2 className="mb-14 text-4xl leading-tight font-black text-white md:text-5xl">
          Got a Question? Reach Out
        </h2>
        </Reveal>

        <Reveal delay={150}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex flex-col gap-10"
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const r = contactSchema.shape.name.safeParse(value)
                return r.success ? undefined : r.error.issues[0].message
              },
            }}
          >
            {(field) => (
              <div className="border-b border-white/15 pb-3 focus-within:border-primary">
                <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
                  <span className="shrink-0 text-base text-white/80">
                    Hi, my name is
                  </span>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Your name"
                    className={inputCls}
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-400">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const r = contactSchema.shape.email.safeParse(value)
                return r.success ? undefined : r.error.issues[0].message
              },
            }}
          >
            {(field) => (
              <div className="border-b border-white/15 pb-3 focus-within:border-primary">
                <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
                  <span className="shrink-0 text-base text-white/80">
                    You can reach me at
                  </span>
                  <input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-400">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="message"
            validators={{
              onChange: ({ value }) => {
                const r = contactSchema.shape.message.safeParse(value)
                return r.success ? undefined : r.error.issues[0].message
              },
            }}
          >
            {(field) => (
              <div>
                <p className="mb-4 text-xs font-semibold tracking-widest text-primary uppercase">
                  My message
                </p>
                <textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="How can we help you?"
                  rows={3}
                  className={`resize-none border-b border-white/15 pb-3 focus:border-primary ${inputCls}`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-sm text-red-400">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <button
            type="submit"
            disabled={sendMessage.isPending}
            className="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sendMessage.isPending ? "Sending..." : "Send message"}
          </button>
        </form>
        </Reveal>
      </div>
    </section>
  )
}
