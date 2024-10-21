import { createThirdwebClient } from 'thirdweb'

const clientID = process.env.NEXT_PUBLIC_CLIENT_ID;
// const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

if (!clientID) {
    throw new Error("NEXT_PUBLIC_CLIENT_ID is notz set");
}

export const client = createThirdwebClient({
    clientId: clientID,
})