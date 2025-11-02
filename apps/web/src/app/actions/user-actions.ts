import toast from "react-hot-toast";

export async function createUser(data: FormData) {
  const promise = fetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || "Failed to create user");
    }
    return json;
  });

  return toast.promise(promise, {
    loading: "Creating user...",
    success: "User created successfully!",
    error: (err: unknown) =>
      err instanceof Error ? err.message : "Failed to create user",
  });
}
