"use server";
import { createClient } from "../lib/supabase/server";

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (!error) {
    return { message: "success" };
  } else {
    return { message: error.message };
  }
};
