CREATE TABLE "bookings" (
	"booking_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"hotel_id" integer NOT NULL,
	"room_id" integer NOT NULL,
	"check_in_date" date NOT NULL,
	"check_out_date" date NOT NULL,
	"total_amount" integer NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "customer_support" (
	"ticket_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"subject" varchar(100) NOT NULL,
	"message" varchar(500) NOT NULL,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotels" (
	"hotel_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"location" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"contact_number" varchar(15) NOT NULL,
	"category" varchar(50) NOT NULL,
	"img_url" varchar(255) NOT NULL,
	"description" varchar(500) NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"payment_status" varchar(20) DEFAULT 'pending' NOT NULL,
	"transaction_id" varchar(100) NOT NULL,
	"payment_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"room_id" serial PRIMARY KEY NOT NULL,
	"hotel_id" integer NOT NULL,
	"room_number" varchar(20) NOT NULL,
	"room_type" varchar(50) NOT NULL,
	"price_per_night" integer NOT NULL,
	"capacity" integer NOT NULL,
	"amenities" varchar(255) NOT NULL,
	"availability" varchar(20) DEFAULT 'available' NOT NULL,
	"img_url" varchar(255) NOT NULL,
	"description" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
