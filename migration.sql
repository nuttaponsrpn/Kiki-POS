-- Add cash_received and change columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS cash_received numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS change numeric DEFAULT 0;

-- Optional: Add comment to columns
COMMENT ON COLUMN public.orders.cash_received IS 'Amount of cash received from customer';
COMMENT ON COLUMN public.orders.change IS 'Change returned to customer';
