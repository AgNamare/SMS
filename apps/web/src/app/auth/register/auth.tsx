// app/auth/register/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className='p-4 max-w-md mx-auto'>
      <h2 className='text-red-600 font-bold'>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()} className='btn mt-2'>
        Try Again
      </button>
    </div>
  );
}
