import { createClient } from "@/lib/supabase/client";

export default async function apiFetch(
  path: string,
  method: "GET" | "PUT" | "POST" | "DELETE",
  body: any,
  headers?: any,
  supabase?: any,
) {
  const { data: session, error: _ } = await (supabase ?? createClient()).auth.getSession();

  if (!session) {
    throw new Error("No session found");
  }

  console.log(process.env.NEXT_PUBLIC_API_HOST);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${path}`, {
    method,
    headers: {
      ...headers,
      Authorization: `Bearer ${btoa(JSON.stringify({ access_token: session.session!.access_token, refresh_token: session.session!.refresh_token }))}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : "",
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return await response.json();
}
