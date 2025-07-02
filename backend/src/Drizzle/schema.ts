import { integer, pgTable,serial, timestamp, varchar } from "drizzle-orm/pg-core";




export const UserTable = pgTable("users",{
    user_id: serial("user_id").primaryKey(),
   first_name:varchar("first_name", { length: 50 }).notNull(),
   last_name:varchar("last_name", { length: 50 }).notNull(),
    email:varchar("email", { length: 100 }).notNull().unique(),
    password:varchar("password", { length: 255 }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    role: varchar("role", { length: 20 }).default("user").notNull(),
} )

export const HotelTable = pgTable("hotels", {
    hotel_id: serial("hotel_id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    location: varchar("location", { length: 255 }).notNull(),
   address: varchar("address", { length: 255 }).notNull(),
   contact_number: varchar("contact_number", { length: 15 }).notNull(),
   category: varchar("category", { length: 50 }).notNull(),
   rating: integer("rating").notNull().default(0),
   created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),


})

export const BookingTable = pgTable("bookings", {
    booking_id: serial("booking_id").primaryKey(),
    user_id: integer("user_id").notNull(),
    hotel_id: integer("hotel_id").notNull(),
    check_in_date: timestamp("check_in_date").notNull(),
    check_out_date: timestamp("check_out_date").notNull(),
    total_amount: integer("total_amount").notNull(),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});
export const RoomTable = pgTable("rooms", {
    room_id: serial("room_id").primaryKey(),
    hotel_id: integer("hotel_id").notNull(),
    room_number: varchar("room_number", { length: 20 }).notNull(),
    room_type: varchar("room_type", { length: 50 }).notNull(),
    price_per_night: integer("price_per_night").notNull(),
    availability: varchar("availability", { length: 20 }).default("available").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});


export const PaymentTable = pgTable("payments", {
    payment_id: serial("payment_id").primaryKey(),
    booking_id: integer("booking_id").notNull(),
    amount: integer("amount").notNull(),
    payment_method: varchar("payment_method", { length: 50 }).notNull(),
    payment_status: varchar("payment_status", { length: 20 }).default("pending").
notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

export const CustomerSupportTable = pgTable("customer_support", {
    ticket_id: serial("ticket_id").primaryKey(),
    user_id: integer("user_id").notNull(),
    subject: varchar("subject", { length: 100 }).notNull(),
    message: varchar("message", { length: 500 }).notNull(),
    status: varchar("status", { length: 20 }).default("open").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});


    

