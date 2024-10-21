"use client";
import { getContract, defineChain } from "thirdweb";
import { base } from "thirdweb/chains";
import { client } from "./app/client";

export const contract = getContract({ 
    client, 
    chain: base, 
    address: "0xc94a1108DF24011f113f3d16627E81393a9fd997"
  });