## Product Requirements Document (PRD) Summary

### Product Overview

This product helps wellness businesses (practitioners and small wellness companies) connect directly with individual customers seeking stress relief and holistic services. It solves the issue of limited revenue from insurance-paid services by offering a direct booking and payment platform.

### Target Audience

- **B2B (Supply Side)**: Independent wellness practitioners and small wellness business owners who want to offer their services directly.
- **B2C (Demand Side)**: People looking for stress relief or wellness services (e.g., massage, meditation, etc.) who want a straightforward way to discover and book providers online or nearby.

### Key Features

1. **B2B Onboarding & Scheduling**
    - Businesses set up their profiles, availability, location, category, and payment details.
2. **B2C Onboarding & Booking**
    - Individuals can browse/search wellness businesses, view availability, and book time slots.
3. **Calendar Integration (Google Calendar)**
    - Automates adding appointments to both parties’ calendars upon booking.
4. **Payments (Stripe)**
    - Secure checkout for users to pay and for providers to receive payments.
5. **Authentication & Database**
    - Basic signup/login (using Supabase), storing profiles, bookings, and payment records.

### User Scenarios

- **B2B Scenario**:
    1. A small wellness provider signs up with Google.
    2. They enter their business details: name, category, location, description.
    3. They set their available time slots and pricing.
    4. They finalize and publish their listing so clients can discover them.
- **B2C Scenario**:
    1. A stressed user signs up or browses as a guest.
    2. They look through available wellness providers (by category or location).
    3. They pick a provider, pick a time slot, and proceed to checkout.
    4. They pay via Stripe, and both the user and the provider receive an email confirmation plus a Google Calendar invite.

### User Flow

1. **B2B (Business) Flow**
    1. Click “Sign Up with Google”
    2. Enter business info (name, description, location, category, etc.)
    3. Configure availability and booking duration
    4. Link Google Calendar (store OAuth tokens)
    5. Publish profile
2. **B2C (Consumer) Flow**
    1. Sign up with Google or browse as a guest
    2. View a list of wellness providers (filtered by location, category, etc.)
    3. Select a provider and check available slots
    4. Choose a time slot, proceed to payment (Stripe)
    5. Upon successful payment, receive email confirmation + Google Calendar invite

### Tech Needs

- **Frontend**: Next.js (TypeScript, Tailwind CSS)
- **Backend/Database**: Supabase + Prisma
- **Integrations**:
    - **Stripe**: Payment processing
    - **Google Calendar API**: Calendar invites and availability
    - **Google Maps API**: Provider location services
    - **Supabase Auth**: User authentication
    - **Resend**: Email confirmations
- **Data to Store**:
    - User profiles (consumers)
    - Business profiles (providers)
    - Bookings (with date/time, status, and references to both user and business)
    - Payments (Stripe transaction details)
    - OAuth tokens for Google Calendar integration

### Screens

1. **Auth Screens**
    - **Login/Signup** (Google Auth via Supabase)
    - **Password Reset** (optional for MVP; can rely on Google Auth alone)
2. **Business Portal**
    - **Onboarding Form**: Business details (category, location, description)
    - **Availability Settings**: Time slots, booking duration, link to Google Calendar
    - **Dashboard** (optional MVP): Quick overview of upcoming bookings
3. **User Portal**
    - **Browse/Explore**: List of wellness providers (with filters for category/location)
    - **Provider Details**: Profile info, availability calendar
    - **Booking & Payment**: Time slot selection, checkout with Stripe, confirmation screen

---

**End of PRD Summary**

Feel free to let me know if you need any adjustments or additional details. This covers the essential requirements for your MVP.

--

## Database Schema

**Purpose**: Define the structure and relationships of the data stored for the wellness booking application. This schema ensures all relevant information (users, businesses, bookings, and payments) is organized for efficient retrieval, updates, and usage across the platform.

Below is a proposed schema using a relational model. Field types are suggestions and can be adjusted as needed for Supabase/Prisma integration:

1. **Users**
    - **id** (UUID, primary key)
    - **email** (string, unique, required)
    - **name** (string, optional)
    - **role** (enum: `B2B`, `B2C`; required)
    - **created_at** (timestamp, default: now)
    - **updated_at** (timestamp, auto-updated)
2. **Businesses**
    - **id** (UUID, primary key)
    - **owner_id** (UUID, foreign key referencing `Users.id`)
    - **name** (string, required)
    - **description** (text, optional)
    - **category** (string/enum, e.g., "Massage", "Yoga", "Meditation"; optional)
    - **location** (string or JSON for address/coordinates, optional)
    - **payment_provider_id** (string, e.g., a Stripe Connect ID, optional)
    - **created_at** (timestamp, default: now)
    - **updated_at** (timestamp, auto-updated)
3. **Availability**
    - **id** (UUID, primary key)
    - **business_id** (UUID, foreign key referencing `Businesses.id`)
    - **day_of_week** (enum or integer, e.g., 0=Sunday, 1=Monday, etc.)
    - **start_time** (time)
    - **end_time** (time)
    - **duration** (integer, e.g., 30 for 30-minute slots, if needed)
    - **created_at** (timestamp, default: now)
    - **updated_at** (timestamp, auto-updated)
4. **Bookings**
    - **id** (UUID, primary key)
    - **user_id** (UUID, foreign key referencing `Users.id`)
    - **business_id** (UUID, foreign key referencing `Businesses.id`)
    - **start_datetime** (timestamp, required)
    - **end_datetime** (timestamp, required)
    - **status** (enum: `pending`, `confirmed`, `completed`, `canceled`; default: `pending`)
    - **created_at** (timestamp, default: now)
    - **updated_at** (timestamp, auto-updated)
5. **Payments**
    - **id** (UUID, primary key)
    - **booking_id** (UUID, foreign key referencing `Bookings.id`)
    - **stripe_payment_intent_id** (string, optional but recommended)
    - **amount** (decimal or integer in cents)
    - **currency** (string, e.g., "USD")
    - **status** (enum: `pending`, `succeeded`, `failed`, etc.)
    - **created_at** (timestamp, default: now)
    - **updated_at** (timestamp, auto-updated)
6. **CalendarTokens** (if you store OAuth tokens in the database)
    - **id** (UUID, primary key)
    - **user_id** (UUID, foreign key referencing `Users.id`)
    - **google_access_token** (text)
    - **google_refresh_token** (text)
    - **token_expiry** (timestamp)
    - **created_at** (timestamp, default: now)
    - **updated_at** (timestamp, auto-updated)

> Note: For a POC, you can merge or simplify some tables. For instance, you might store availability as a single schedule string or a set of time slots. However, the above structure offers clarity and scalability.
> 

---

## Backend API Contract

**Purpose**: Define how the frontend and other services will interact with the server. It specifies endpoints, methods, request/response formats, and authentication requirements. For authentication, you are using Supabase, which typically handles JWT tokens or session-based flows; adapt as needed.

Below is a high-level overview of the main endpoints:

### 1. Authentication & User Management

Since you’re using Supabase Auth, many auth flows are handled automatically. If you need custom endpoints:

- **POST** `/auth/register`
    - *Request Body*:
        
        ```json
        {
          "email": "user@example.com",
          "password": "secretPassword",
          "role": "B2B" // or "B2C"
        }
        
        ```
        
    - *Response*:
        - **201** Created with user details or a session token.
        - **400** Bad Request if invalid data.
- **POST** `/auth/login`
    - *Request Body*:
        
        ```json
        {
          "email": "user@example.com",
          "password": "secretPassword"
        }
        
        ```
        
    - *Response*:
        - **200** OK with session token or user details.
        - **401** Unauthorized if credentials fail.

> Alternatively, you might rely fully on Supabase’s built-in endpoints for sign-up/sign-in with providers like Google.
> 

### 2. Business Endpoints

- **POST** `/businesses`
    - Creates a new business profile.
    - *Request Body*:
        
        ```json
        {
          "name": "Wellness Center",
          "description": "Meditation and yoga services",
          "category": "Meditation",
          "location": "123 Main St",
          "payment_provider_id": "stripe_account_id"
        }
        
        ```
        
    - *Response*:
        - **201** Created with the new business resource.
        - **401** if user is not authenticated (B2B role check).
- **GET** `/businesses`
    - Returns a list of all businesses (for B2C browsing).
    - *Query Params*:
        - `category` (optional), `location` (optional)
    - *Response*:
        
        ```json
        [
          {
            "id": "uuid",
            "name": "Wellness Center",
            ...
          }
        ]
        
        ```
        
- **GET** `/businesses/{business_id}`
    - Returns detailed info about a specific business, including any relevant availability or next time slots if needed.
- **PUT** `/businesses/{business_id}`
    - Updates business details.
    - *Request Body*: Partial or full business object.

### 3. Availability Endpoints

- **POST** `/businesses/{business_id}/availability`
    - Sets or updates availability for a business.
    - *Request Body*:
        
        ```json
        {
          "day_of_week": 1,
          "start_time": "09:00",
          "end_time": "17:00",
          "duration": 30
        }
        
        ```
        
    - *Response*:
        - **201** Created (or **200** OK if updating existing availability).
- **GET** `/businesses/{business_id}/availability`
    - Returns a list of available slots/days.

### 4. Booking Endpoints

- **POST** `/bookings`
    - Creates a new booking.
    - *Request Body*:
        
        ```json
        {
          "business_id": "uuid",
          "start_datetime": "2025-04-10T10:00:00Z",
          "end_datetime": "2025-04-10T10:30:00Z"
        }
        
        ```
        
    - *Response*:
        - **201** Created with booking details (including booking ID and status).
- **GET** `/bookings/{booking_id}`
    - Retrieves booking details (for confirmation screens, etc.).
- **PUT** `/bookings/{booking_id}`
    - Updates a booking (e.g., to change status to `canceled`).

### 5. Payment Endpoints

- **POST** `/payments`
    - Initiates or confirms payment for a booking using Stripe.
    - *Request Body*:
        
        ```json
        {
          "booking_id": "uuid",
          "amount": 5000,
          "currency": "USD"
        }
        
        ```
        
    - *Response*:
        - **200** if payment was successfully created/synced with Stripe.
        - Payment status updates can be handled via Stripe webhooks.

### 6. Calendar Integration Endpoints (Optional)

- **POST** `/integrations/google-calendar`
    - Stores OAuth tokens from Google for a B2B user’s account.
    - May be handled client-side or server-side depending on your approach.
- **POST** `/bookings/{booking_id}/sync-calendar`
    - Triggers a call to Google Calendar to create an event for the booking.
    - The user/business must have valid tokens stored.

> Note: Some or all of these endpoints may be replaced or supplemented by serverless functions in Next.js, but this contract outlines the typical REST structure.
> 

---

## Frontend Specification

**Purpose**: Define how users (both B2B and B2C) interact with the system via the browser or client app. This includes page structure, navigation, and key UI components.

### 1. High-Level Architecture

- Built with **Next.js (TypeScript + Tailwind CSS)**.
- **Supabase** used for authentication and database interactions.
- **Stripe** for payment checkout.
- **Google APIs** (Calendar, Maps) integrated where needed.

### 2. Main Screens & Components

1. **Auth Flow**
    - **Login Page**:
        - A “Sign in with Google” button (supabase social login).
        - An optional “Email/Password” form (depending on your approach).
    - **Signup Page**:
        - Similar to Login, plus a field to select “I am a Wellness Business (B2B)” or “I am seeking wellness services (B2C).”
    - **Reset Password** (optional for MVP):
        - Could rely on Google sign-in primarily.
2. **B2B Portal**
    - **Business Onboarding** (/onboarding):
        - Form: Business Name, Category, Location (Google Maps auto-complete?), Description.
        - Availability Setup: A component where the provider selects days of the week and sets start/end times.
        - Payment Provider: Possibly a link to “Connect with Stripe” flow.
    - **Business Dashboard** (/dashboard):
        - List of upcoming bookings with date/time, client name.
        - Button to add/edit availability or business details.
3. **B2C Portal**
    - **Home / Browse Businesses** (/):
        - A list or grid of wellness providers with category filters and location filters.
    - **Business Details** (/business/[id]):
        - Shows provider info: name, description, reviews (if any), address.
        - Interactive calendar to pick a time slot from available slots.
    - **Booking & Payment Flow**:
        - After selecting an available slot, user proceeds to a checkout page:
            - Payment info via Stripe Checkout (redirect or embedded).
            - Confirmation page on success, with “Add to Calendar” link or auto-sync if integrated.
4. **Shared UI Components**
    - **Header**: Navigation links (Home, Dashboard, Login/Logout).
    - **Footer**: Basic site info or contact details.
    - **Calendar Picker**: For selecting time slots (may be a custom or third-party component).
    - **Notifications**: Toasts or modals for success/error messages.
    - **Loading/Spinner**: Common element while waiting for data or actions.

### 3. User Flows (Summary)

1. **B2B User Flow**
    - Sign up/log in → Complete business onboarding form → Set availability → Wait for bookings to appear in Dashboard.
2. **B2C User Flow**
    - Browse homepage → Select a wellness provider → View details & available slots → Book & pay → Receive email/calendar invite.

### 4. Styling & Layout

- **Tailwind CSS** used for rapid UI design.
- Keep the design minimal and focus on clarity. Ensure accessibility (e.g., proper color contrast, alt text).

### 5. State Management & Data Fetching

- Likely to use React hooks (e.g., `useState`, `useEffect`) alongside [Next.js data fetching methods](https://nextjs.org/docs/basic-features/data-fetching).
- Authentication state handled by Supabase client library.

---

**That’s it!** These specifications cover the core aspects of the system:

- A **Database Schema** to store all critical data for users, businesses, bookings, and payments.
- A **Backend API Contract** to define how clients interact with the server for CRUD operations, authentication, payment flows, and calendar integrations.
- A **Frontend Specification** describing the major pages, UI elements, and user flows in Next.js with Tailwind CSS.

This set of documents should provide your development team a solid starting point for implementing the MVP.