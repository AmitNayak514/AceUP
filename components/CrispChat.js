"use client";
import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("c5770309-a120-449c-a026-d7eb174bcaf6");
  }, []);
  return null;
};
