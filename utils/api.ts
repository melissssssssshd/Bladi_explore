export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Le token est expiré ou invalide, rediriger
    window.location.href = "/login";
  }

  return res.json();
}