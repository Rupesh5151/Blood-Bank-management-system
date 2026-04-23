// // import { toast } from "react-hot-toast";

// // export const handleAuthError = (navigate) => {
// //   localStorage.removeItem("token");
// //   toast.error("Authentication error: Session expired. Please login again.");
// //   navigate("/login");
// // };

// // export const makeAuthenticatedRequest = async (url, options = {}, navigate) => {
// //   const token = localStorage.getItem("token");
  
// //   if (!token || !isTokenValid()) {
// //     handleAuthError(navigate);
// //     throw new Error("No valid authentication token found");
// //   }

// //   const defaultHeaders = {
// //     'Authorization': `Bearer ${token}`,
// //   };

// //   // Don't set Content-Type for FormData, let browser handle it
// //   if (!(options.body instanceof FormData)) {
// //     defaultHeaders['Content-Type'] = 'application/json';
// //   }

// //   const requestOptions = {
// //     ...options,
// //     headers: {
// //       ...defaultHeaders,
// //       ...options.headers,
// //     },
// //   };

// //   try {
// //     const response = await fetch(url, requestOptions);
    
// //     if (!response.ok) {
// //       if (response.status === 401 || response.status === 403) {
// //         console.log('Authentication failed, clearing token');
// //         handleAuthError(navigate);
// //         throw new Error("Authentication failed");
// //       }
      
// //       const errorData = await response.json().catch(() => ({}));
// //       throw new Error(errorData.message || `Request failed with status ${response.status}`);
// //     }
    
// //     return response;
// //   } catch (error) {
// //     if (error.message.includes("401") || error.message.includes("unauthorized") || error.message.includes("Authentication")) {
// //       handleAuthError(navigate);
// //     }
// //     throw error;
// //   }
// // };

// // export const isTokenValid = () => {
// //   const token = localStorage.getItem("token");
// //   if (!token) return false;
  
// //   try {
// //     const parts = token.split('.');
// //     if (parts.length !== 3) return false;
    
// //     const payload = JSON.parse(atob(parts[1]));
// //     const currentTime = Date.now() / 1000;
    
// //     return payload.exp > currentTime;
// //   } catch (error) {
// //     console.error('Token validation error:', error);
// //     return false;
// //   }
// // };
// import { toast } from "react-hot-toast";

// // ✅ Backend URL (LIVE)
// const BASE_URL = "https://blood-bank-management-system-ldeb.onrender.com";

// // ✅ Handle auth error
// export const handleAuthError = (navigate) => {
//   localStorage.removeItem("token");
//   toast.error("Session expired. Please login again.");
//   navigate("/login");
// };

// // ✅ Check token validity
// export const isTokenValid = () => {
//   const token = localStorage.getItem("token");
//   if (!token) return false;

//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload.exp > Date.now() / 1000;
//   } catch {
//     return false;
//   }
// };

// // ✅ Main API function (UPDATED)
// export const makeAuthenticatedRequest = async (url, options = {}, navigate) => {
//   const token = localStorage.getItem("token");

//   if (!token || !isTokenValid()) {
//     handleAuthError(navigate);
//     throw new Error("Invalid token");
//   }

//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

//   if (!(options.body instanceof FormData)) {
//     headers["Content-Type"] = "application/json";
//   }

//   try {
//     const response = await fetch(`${BASE_URL}${url}`, {
//       ...options,
//       headers: {
//         ...headers,
//         ...options.headers,
//       },
//     });

//     if (!response.ok) {
//       if (response.status === 401 || response.status === 403) {
//         handleAuthError(navigate);
//         throw new Error("Unauthorized");
//       }

//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || "Request failed");
//     }

//     return response.json();
//   } catch (error) {
//     console.error("API Error:", error.message);
//     throw error;
//   }
// };
import { toast } from "react-hot-toast";

// ✅ Backend URL (LIVE)
const BASE_URL = "https://blood-bank-management-system-ldeb.onrender.com";

// ✅ Handle auth error
export const handleAuthError = (navigate) => {
  localStorage.removeItem("token");
  toast.error("Session expired. Please login again.");
  navigate("/login");
};

// ✅ Check token validity
export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp > Date.now() / 1000;
  } catch (error) {
    console.error("Token error:", error);
    return false;
  }
};

// ✅ Main API function
export const makeAuthenticatedRequest = async (url, options = {}, navigate) => {
  const token = localStorage.getItem("token");

  if (!token || !isTokenValid()) {
    handleAuthError(navigate);
    throw new Error("Invalid token");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // FormData case handle
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        handleAuthError(navigate);
        throw new Error("Unauthorized");
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};