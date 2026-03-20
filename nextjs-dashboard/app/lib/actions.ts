'use server';
import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import {redirect} from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: {
    rejectUnauthorized: false,
  },
});
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({invalid_type_error: "Please select customer"}),
  amount: z.coerce.number().gt(0, {message: "Amount must be greater than 0"}),
  status: z.enum(['pending', 'paid'],{invalid_type_error: "Please select a status"}),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id:true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState:State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if(!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date= new Date().toISOString().split('T')[0];
 
  try{
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}, date = ${date}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error('Error updating invoice:', error);
    return{
      message: 'Database error: Failed to update invoice.',
    };  
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try{
  await sql`
    DELETE FROM invoices
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error('Error deleting invoice:', error);
  }

  revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Return the error message to the useActionState hook in the UI
    if (error.message.includes('Invalid login credentials')) {
      return 'Invalid credentials.';
    }
    return 'Something went wrong.';
  }

  // If successful, redirect to the dashboard
  redirect('/dashboard');
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function signUp(
  prevState: string | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Basic client-side validation
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  } 

  // Call Supabase to create the new user
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  // If Supabase returns an error, pass the message back to the form UI
  if (error) {
    return error.message;
  }

  // If successful, redirect the user. 
  // Note: If email confirmations are turned ON in Supabase, they won't be fully logged in yet!
  redirect('/dashboard');
}