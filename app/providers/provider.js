"use client"; // Add this directive

import { RecoilRoot } from "recoil";
export default function Providers({ children }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
