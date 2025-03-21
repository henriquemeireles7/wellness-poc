**Frontend Implementation Plan (Revised for Next.js App Router)**

Below is the updated high-level plan to help you implement the **Frontend Specification** using the **latest Next.js App Router** in the `app/` directory (introduced in Next.js 13+). Each step still focuses on a single change to a single file or small set of files, ensuring clarity and simplicity. Follow these steps in order, and test your app after each to confirm everything works as expected.

---

## Introduction

The following plan aligns with the **Frontend Specification** but leverages the **Next.js App Router** rather than the Pages Router. In the new router structure, pages (and layout, loading, error) files live in the `app/` directory. You can also take advantage of [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) for separation of concerns, and server vs. client components to optimize data fetching and rendering.  

By completing these steps, you’ll have a solid foundation for **B2B** (business-facing) and **B2C** (consumer-facing) features, using Supabase for authentication, Stripe for payments, and optionally Google APIs for calendar functionality.

---

## Step-by-Step Guide

### Step 1: Create `tailwind.config.js`
- **Why**  
  The project uses Tailwind CSS for styling. We need a Tailwind configuration file to customize themes and purge unused CSS in production.
- **How**  
  1. In your project root, create `tailwind.config.js`.  
  2. In the `content` array, include any relevant files from your `app/` directory (e.g., `./app/**/*.{js,ts,jsx,tsx,mdx}`) and any shared components (`./components/**/*.{js,ts,jsx,tsx,mdx}`).
  3. Add any theme extensions or plugins as required.
- **Tips/Points of Attention**  
  - Enable [JIT mode](https://tailwindcss.com/docs/just-in-time-mode) if you want faster development builds and more dynamic styling features.
- **Packages**  
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  ```


### Step 2: Create `postcss.config.js`
- **Why**  
  Tailwind relies on PostCSS to process your CSS. This configuration tells PostCSS which plugins to use.
- **How**  
  1. In the project root, create a file called `postcss.config.js`.  
  2. Include `tailwindcss` and `autoprefixer` in the `plugins` array.
- **Tips/Points of Attention**  
  - Ensure the plugin order is correct (`tailwindcss` first, then `autoprefixer`).
- **Packages**  
  - Already covered in Step 1.


### Step 3: Add Global Styles in `globals.css`
- **Why**  
  You need a global stylesheet to import Tailwind’s base styles and your own custom CSS.
- **How**  
  1. In a `styles` folder (or wherever you keep global styles), create a file named `globals.css`.  
  2. Add the Tailwind directives `@tailwind base; @tailwind components; @tailwind utilities;` at the top.
- **Tips/Points of Attention**  
  - Check the official Tailwind docs on how to structure global imports to avoid duplication or missing layers.
- **Packages**  
  - Already included with the Tailwind setup.


### Step 4: Configure the Root Layout in `app/layout.tsx`
- **Why**  
  The new App Router uses a `layout.tsx` in the `app/` directory as a shared layout for your entire application. We must import our global styles here so that Tailwind is available across the app.
- **How**  
  1. Create `app/layout.tsx`.  
  2. Import your `globals.css` file at the top, like `import '../styles/globals.css';`.  
  3. Export a default function that includes the `<html>`, `<body>`, and a `{children}` prop for nested pages.
  4. Optionally wrap children in any context providers (e.g., for Supabase auth state).
- **Tips/Points of Attention**  
  - Keep `layout.tsx` clean, only referencing essential global providers or components.
- **Packages**  
  - None additional.


### Step 5: Add Supabase Client in `lib/supabaseClient.ts`
- **Why**  
  The **Frontend Specification** uses Supabase for authentication and data. You need a centralized file to initialize the Supabase client.
- **How**  
  1. Create a new file, `lib/supabaseClient.ts`.  
  2. Import `createClient` from `@supabase/supabase-js`.  
  3. Initialize the client using your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from environment variables.
- **Tips/Points of Attention**  
  - Store your keys in `.env.local` (Next.js ensures these are not exposed if you do not prefix them with `NEXT_PUBLIC_`—but for client-side usage, you do need the public key).  
  - Avoid committing secrets to version control.
- **Packages**  
  ```bash
  npm install @supabase/supabase-js
  ```


### Step 6: Create or Update `.env.local`
- **Why**  
  Your application will likely need environment variables for Supabase, Stripe, and possibly Google APIs.
- **How**  
  1. Create or update `.env.local` in the project root.  
  2. Add variables like `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `STRIPE_PUBLIC_KEY`, etc.  
  3. Ensure `.env.local` is in `.gitignore`.
- **Tips/Points of Attention**  
  - Prefix variables with `NEXT_PUBLIC_` if the client (browser) needs them.
- **Packages**  
  - None additional.


### Step 7: Create a Shared Header Component: `components/Header.tsx`
- **Why**  
  Per the **Frontend Specification**, a header with navigation (Home, Dashboard, Login/Logout) is part of the shared UI.
- **How**  
  1. In `components/`, create `Header.tsx`.  
  2. Include a logo or brand name, plus relevant nav items (Home, Dashboard, Login/Signup).  
  3. Style with Tailwind classes.  
  4. Import and use `<Header />` in `app/layout.tsx` or in a route group layout (e.g., `app/(b2c)/layout.tsx`), depending on how you want to structure your site.
- **Tips/Points of Attention**  
  - Use conditional rendering to show “Dashboard” or “Logout” if the user is authenticated, else show “Login/Signup.”  
  - Consider accessibility: semantic `<nav>` element, ARIA attributes as necessary.
- **Packages**  
  - None additional.


### Step 8: Create a Shared Footer Component: `components/Footer.tsx`
- **Why**  
  A common footer is part of the **Frontend Specification**, containing site info, contact details, or disclaimers.
- **How**  
  1. In `components/`, create `Footer.tsx`.  
  2. Add any branding, links, or disclaimers you need.  
  3. Style with Tailwind classes.  
  4. Import and render `<Footer />` in the layout file(s) to make it appear on all pages where needed.
- **Tips/Points of Attention**  
  - Maintain consistent design with the header.
- **Packages**  
  - None additional.


### Step 9: Organize Layouts with Route Groups in `app/`
- **Why**  
  The App Router allows you to group routes by feature or user type (e.g., `(b2c)`, `(auth)`, `(b2b)`).
- **How**  
  1. Create subfolders in the `app/` directory, such as `app/(b2c)` for consumer-facing pages and `app/(b2b)` for business-facing pages.  
  2. Each subfolder can have its own `layout.tsx` if you need a different layout for that user type. For instance, `app/(b2b)/layout.tsx` might include the business nav sidebar in addition to `<Header />` and `<Footer />`.
- **Tips/Points of Attention**  
  - Using route groups is optional but helps keep your app organized.  
  - Check out Next.js documentation on [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups).
- **Packages**  
  - None additional.


### Step 10: Implement the Home (B2C) Page: `app/(b2c)/page.tsx`
- **Why**  
  The **Frontend Specification** says that B2C users should see a homepage that lists or filters businesses. This is your main entry point for visitors.
- **How**  
  1. In `app/(b2c)/page.tsx`, create a React component for the homepage.  
  2. Fetch a list of businesses (using the Supabase client or a server component with `fetch` from an API route).  
  3. Display results in a grid/list with optional filters (category, location).  
  4. Wrap in the route group’s layout or the root layout, ensuring the `<Header />` and `<Footer />` are included.
- **Tips/Points of Attention**  
  - Consider using a [Server Component](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#fetching-in-server-components) to fetch business data, which can simplify data fetching and reduce client bundle size.
- **Packages**  
  - None additional.


### Step 11: Create the Login Page: `app/(auth)/login/page.tsx`
- **Why**  
  The **Frontend Specification** calls for a login page supporting “Sign in with Google” or email/password, using Supabase Auth.
- **How**  
  1. In `app/(auth)/login/page.tsx`, create a React component for your login form.  
  2. Use the Supabase client to trigger social login or email/password sign-in.  
  3. On success, redirect to either a B2B or B2C route, depending on the user role.
- **Tips/Points of Attention**  
  - Handle authentication status on the server or client. For example, a server component can check for an existing auth session and redirect if already logged in.
  - Display error messages when login fails.
- **Packages**  
  - Supabase (already installed).


### Step 12: Create the Signup Page: `app/(auth)/signup/page.tsx`
- **Why**  
  A signup flow with a “B2B” or “B2C” role selection is required by the **Frontend Specification**.
- **How**  
  1. In `app/(auth)/signup/page.tsx`, build a form that collects email, password, and user role.  
  2. Use `supabase.auth.signUp()` or similar. Optionally store role in `user_metadata`.
  3. Redirect to the correct post-signup page (B2B onboarding or B2C home).
- **Tips/Points of Attention**  
  - Validate form inputs before submission.  
  - Confirm role assignment works as intended for subsequent logic.
- **Packages**  
  - Supabase (already installed).


### Step 13: Create the Business Onboarding Page: `app/(b2b)/onboarding/page.tsx`
- **Why**  
  B2B users need to input business details (name, description, category, location) and set availability.
- **How**  
  1. In `app/(b2b)/onboarding/page.tsx`, create a React component with a form to capture business data.  
  2. Include fields for name, category, location, and a way to specify availability (day of week, start/end times).  
  3. On form submission, call your Supabase or API route to store data in the `Businesses` and `Availability` tables.
- **Tips/Points of Attention**  
  - Use interactive UI elements (like a date/time picker) for availability.  
  - Pre-populate fields if data already exists (editing scenario).
- **Packages**  
  - A location autocomplete library (e.g., `@react-google-maps/api`) if you want Google Maps integration.


### Step 14: Create the B2B Dashboard Page: `app/(b2b)/dashboard/page.tsx`
- **Why**  
  The **Frontend Specification** includes a dashboard where B2B owners see upcoming bookings and manage their business details.
- **How**  
  1. In `app/(b2b)/dashboard/page.tsx`, fetch user-specific data (e.g., upcoming bookings) from Supabase or your API.  
  2. Display bookings in a list or a small calendar.  
  3. Include options to edit availability or business info.
- **Tips/Points of Attention**  
  - Restrict access to authenticated B2B users only. You might implement a [Server Component with RSC-based auth checks](https://nextjs.org/docs/app/building-your-application/routing/authentication) or a client-side redirect if unauthorized.
- **Packages**  
  - None additional.


### Step 15: Create the Business Details Page: `app/(b2c)/business/[id]/page.tsx`
- **Why**  
  B2C users need to view details for a specific business (e.g., name, description, availability) and book a timeslot.
- **How**  
  1. In `app/(b2c)/business/[id]/page.tsx`, fetch the business data by `id`.  
  2. Display the provider’s details and an interactive calendar or list of time slots.  
  3. On time slot selection, navigate to the booking flow (see next step).
- **Tips/Points of Attention**  
  - Handle errors if the business does not exist.  
  - Show a loading state or fallback UI while fetching data.
- **Packages**  
  - A calendar/time slot component if desired (`react-calendar` or similar).


### Step 16: Create a Booking Page or Route: `app/(b2c)/booking/page.tsx`
- **Why**  
  After selecting a time slot, the user needs to confirm the booking details and potentially proceed to payment.
- **How**  
  1. In `app/(b2c)/booking/page.tsx`, display the selected date/time, business info, and any payment details.  
  2. On confirmation, call your backend (`/bookings`) to create the booking record in Supabase.
- **Tips/Points of Attention**  
  - Validate that the time slot is still open.  
  - Handle errors if booking creation fails.
- **Packages**  
  - None additional.


### Step 17: Prepare Stripe Integration File: `lib/stripe.ts`
- **Why**  
  The **Frontend Specification** uses Stripe for payments. A dedicated file keeps Stripe config organized.
- **How**  
  1. Create `lib/stripe.ts`.  
  2. Initialize a Stripe instance with your public key for client-side usage (and consider a server-side approach for secrets).
- **Tips/Points of Attention**  
  - Keep secret keys on the server side, in serverless functions or API routes.  
  - Only reference the public key in client-side code.
- **Packages**  
  ```bash
  npm install @stripe/stripe-js
  ```


### Step 18: Create a Payment/Checkout Page: `app/(b2c)/checkout/page.tsx`
- **Why**  
  B2C users must pay for a booking. This page handles the Stripe checkout flow.
- **How**  
  1. In `app/(b2c)/checkout/page.tsx`, display booking cost and initiate Stripe checkout.  
  2. On success, store payment data in the `Payments` table.  
  3. Redirect to a confirmation or success page.
- **Tips/Points of Attention**  
  - Provide clear error handling if payment fails.  
  - You might use a server route or server action to securely create a PaymentIntent, then pass the client secret to the client.
- **Packages**  
  - `@stripe/stripe-js` (already installed).


### Step 19: Create Notifications Component: `components/Notification.tsx`
- **Why**  
  The specification includes toast or modal notifications for success/errors (e.g., booking success, login failure).
- **How**  
  1. In `components/`, create `Notification.tsx` to show messages.  
  2. Accept props like `message`, `type` (“success” or “error”), and conditionally style using Tailwind.  
  3. Render this component from client components where relevant, or via a global provider that manages notifications.
- **Tips/Points of Attention**  
  - Consider a global state (e.g., React Context) so you can trigger notifications anywhere.
- **Packages**  
  - None additional, unless you prefer a third-party toast library.


### Step 20: (Optional) Add Google Calendar Integration in `lib/googleCalendar.ts`
- **Why**  
  If desired, add “Add to Calendar” or auto-sync bookings to Google Calendar.
- **How**  
  1. Create `lib/googleCalendar.ts`.  
  2. Implement functions for creating/updating events with stored OAuth tokens (in the `CalendarTokens` table).  
  3. Call these functions after a booking is confirmed.
- **Tips/Points of Attention**  
  - Google OAuth flows can be handled via server routes in Next.js or client-based sign-in flows.  
  - Securely store and refresh tokens. Avoid exposing them in client code.
- **Packages**  
  ```bash
  npm install googleapis
  ```

---

## Conclusion

By following these 20 steps and adapting them to the **Next.js App Router**, you will:

1. Configure **Tailwind CSS** for styling.  
2. Set up a **Supabase** client for authentication and data operations.  
3. Organize your project with the new **App Router** (`app/` directory), using route groups for B2B/B2C flows.  
4. Implement **core pages and layouts** (home, login, signup, onboarding, dashboard, business details, booking, checkout).  
5. Integrate **Stripe** for payments and optionally **Google Calendar**.

After each step:

1. **Test** locally via `npm run dev` or `yarn dev`.  
2. **Validate** the new feature or page.  
3. **Iterate** if issues arise, then continue to the next step.

This incremental approach keeps your project organized, aligns with the **Frontend Specification**, and ensures each feature is thoroughly tested. Once completed, your MVP frontend will be ready for end-to-end testing with the backend and database. Good luck building your wellness booking application!