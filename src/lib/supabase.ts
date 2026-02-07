import { supabase } from "@/integrations/supabase/client";

export { supabase };

// Helper to get the Supabase URL for edge functions
export const getEdgeFunctionUrl = (functionName: string) => {
  return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`;
};

// Helper for calling edge functions with proper headers
export const callEdgeFunction = async <T>(
  functionName: string,
  body: Record<string, unknown>
): Promise<T> => {
  const response = await fetch(getEdgeFunctionUrl(functionName), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Error calling ${functionName}`);
  }

  return response.json();
};

// Upload file to storage and return URL
export const uploadFile = async (
  file: File,
  folder: string = "documents"
): Promise<{ url: string; path: string }> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, file);

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from("uploads")
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    path: filePath,
  };
};

// Calculate SHA-256 hash of a file
export const calculateFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
