
const LOCAL_MODE = true;
export const BASE_URL = LOCAL_MODE ? "http://localhost:3000" : "https://backend-m5wv.onrender.com";

export const DEBUG_MODE = false;
if (DEBUG_MODE) document.documentElement.classList.add("noload"); 