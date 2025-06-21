"use client"

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";

// Gunakan named export
export const useAppDispatch = () => useDispatch<AppDispatch>(); // ✅ Named export