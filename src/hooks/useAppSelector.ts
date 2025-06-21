"use client"

import { useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux"; // Pastikan ini diimport
import type { RootState } from "@/store"; // Pastikan path benar

// Gunakan named export dan type assertion
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;