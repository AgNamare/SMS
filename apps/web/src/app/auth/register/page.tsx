// app/auth/register/page.tsx
import { z } from "zod";
import { redirect } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
});

export default function RegisterPage() {
  async function handleSubmit(formData: FormData) {
    "use server";

    try {
      const name = formData.get("name")?.toString() || "";
      const email = formData.get("email")?.toString() || "";
      const password = formData.get("password")?.toString() || "";

      const validated = registerSchema.parse({ name, email, password });

    } catch (err: any) {
      throw err;
      redirect("/auth/login");
    }
  }

  return (
    <form
      action={handleSubmit}
      className='flex flex-col gap-3 p-4 max-w-md mx-auto'>
      <input name='name' placeholder='Name' className='input' />
      <input name='email' placeholder='Email' className='input' />
      <input
        name='password'
        type='password'
        placeholder='Password'
        className='input'
      />
      <button type='submit' className='btn'>
        Register
      </button>
    </form>
  );
}
