import "server-only";
import { z } from "zod";

const dateString = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Please pick a valid date." });

const timeString = z
  .string()
  .trim()
  .regex(/^\d{2}:\d{2}$/, { message: "Please pick a valid time." });

const guestName = z
  .string()
  .trim()
  .min(1, { message: "Please enter your name." })
  .max(120, { message: "Name is too long." });

const hourlyBookingSchema = z.object({
  booking_mode: z.literal("hourly"),
  guest_name: guestName,
  date: dateString,
  start_time: timeString,
  end_time: timeString,
});

const monthlyBookingSchema = z.object({
  booking_mode: z.literal("monthly"),
  guest_name: guestName,
  check_in: dateString,
  check_out: dateString,
});

export const bookingFormSchema = z.discriminatedUnion("booking_mode", [
  hourlyBookingSchema,
  monthlyBookingSchema,
]);

export type BookingFormInput = z.infer<typeof bookingFormSchema>;
