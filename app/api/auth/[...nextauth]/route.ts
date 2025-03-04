// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
// Import other providers as needed

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // add other providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // You can also configure callbacks, pages, etc.
};

const handler = NextAuth(authOptions);

// Export both GET and POST handlers
export { handler as GET, handler as POST };
