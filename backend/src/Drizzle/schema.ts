import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  boolean,
  date,
} from "drizzle-orm/pg-core";

// Users
export const UserTable = pgTable("users", {
  user_id: serial("user_id").primaryKey(),
  first_name: varchar("first_name", { length: 50 }).notNull(),
  last_name: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  is_verified: boolean("is_verified").default(false).notNull(),
});

// Hotels
export const HotelTable = pgTable("hotels", {
  hotel_id: serial("hotel_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  contact_number: varchar("contact_number", { length: 15 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  img_url: varchar("img_url", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  rating: integer("rating").notNull().default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Rooms
export const RoomTable = pgTable("rooms", {
  room_id: serial("room_id").primaryKey(),
  hotel_id: integer("hotel_id").notNull()
    .references(() => HotelTable.hotel_id, { onDelete: "cascade" }),
  room_number: varchar("room_number", { length: 20 }).notNull(),
  room_type: varchar("room_type", { length: 50 }).notNull(),
  price_per_night: integer("price_per_night").notNull(),
  capacity: integer("capacity").notNull(),
  amenities: varchar("amenities", { length: 255 }).notNull(),
  availability: varchar("availability", { length: 20 }).default("available").notNull(),
  img_url: varchar("img_url", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Bookings
export const BookingTable = pgTable("bookings", {
  booking_id: serial("booking_id").primaryKey(),
  user_id: integer("user_id").notNull()
    .references(() => UserTable.user_id, { onDelete: "cascade" }),
  hotel_id: integer("hotel_id").notNull()
    .references(() => HotelTable.hotel_id, { onDelete: "cascade" }),
  room_id: integer("room_id").notNull()
    .references(() => RoomTable.room_id, { onDelete: "cascade" }),
  check_in_date: date("check_in_date").notNull(),
  check_out_date: date("check_out_date").notNull(),
  total_amount: integer("total_amount").notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Payments
export const PaymentTable = pgTable("payments", {
  payment_id: serial("payment_id").primaryKey(),
  booking_id: integer("booking_id").notNull()
    .references(() => BookingTable.booking_id, { onDelete: "cascade" }),
  user_id: integer("user_id").notNull()
    .references(() => UserTable.user_id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  payment_method: varchar("payment_method", { length: 50 }).notNull(),
  payment_status: varchar("payment_status", { length: 20 }).default("pending").notNull(),
  transaction_id: varchar("transaction_id", { length: 100 }).notNull(),
  payment_date: timestamp("payment_date").defaultNow(),
});

// Customer Support
export const CustomerSupportTable = pgTable("customer_support", {
  ticket_id: serial("ticket_id").primaryKey(),
  user_id: integer("user_id").notNull()
    .references(() => UserTable.user_id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 100 }).notNull(),
  description: varchar("message", { length: 500 }).notNull(),
  status: varchar("status", { length: 20 }).default("open").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// ----------------- RELATIONS ------------------

export const RoomRelations = relations(RoomTable, ({ one }) => ({
  hotel: one(HotelTable, {
    fields: [RoomTable.hotel_id],
    references: [HotelTable.hotel_id],
  }),
}));

export const UserRelations = relations(UserTable, ({ many }) => ({
  bookings: many(BookingTable),
  customerSupportTickets: many(CustomerSupportTable),
}));

export const HotelRelations = relations(HotelTable, ({ many }) => ({
  rooms: many(RoomTable),
  bookings: many(BookingTable),
}));

export const BookingRelations = relations(BookingTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [BookingTable.user_id],
    references: [UserTable.user_id],
  }),
  hotel: one(HotelTable, {
    fields: [BookingTable.hotel_id],
    references: [HotelTable.hotel_id],
  }),
  room: one(RoomTable, {
    fields: [BookingTable.room_id],
    references: [RoomTable.room_id],
  }),
}));

export const PaymentRelations = relations(PaymentTable, ({ one }) => ({
  booking: one(BookingTable, {
    fields: [PaymentTable.booking_id],
    references: [BookingTable.booking_id],
  }),
  user: one(UserTable, {
    fields: [PaymentTable.user_id],
    references: [UserTable.user_id],
  }),
}));

export const CustomerSupportRelations = relations(CustomerSupportTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [CustomerSupportTable.user_id],
    references: [UserTable.user_id],
  }),
}));

// ----------------- TYPES ------------------

export type TIUser = typeof UserTable.$inferInsert;
export type TSUser = typeof UserTable.$inferSelect;
export type TIHotel = typeof HotelTable.$inferInsert;
export type TSHotel = typeof HotelTable.$inferSelect;
export type TIBooking = typeof BookingTable.$inferInsert;
export type TSBooking = typeof BookingTable.$inferSelect;
export type TIRoom = typeof RoomTable.$inferInsert;
export type TSRooom = typeof RoomTable.$inferSelect;
export type TIPayment = typeof PaymentTable.$inferInsert;
export type TSPayment = typeof PaymentTable.$inferSelect;
export type TICustomerSupport = typeof CustomerSupportTable.$inferInsert;
export type TSCustomerSupport = typeof CustomerSupportTable.$inferSelect;
