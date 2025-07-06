import axios from "axios";
import NextAuth, { NextAuthOptions, User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface ExtendedUser extends User {
  id: string;
  email: string;
  token: string;
  refreshToken: string;
  tokenExpires: number;
}

interface ExtendedSession extends Session {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL;

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials) return null;

        try {
          const response = await axios.post(`${AUTH_URL}/auth/email/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const userData = response.data;
          if (!userData) return null;

          const { user, token, refreshToken, tokenExpires } = userData;
          return {
            id: user.id.toString(),
            email: user.email,
            token,
            refreshToken,
            tokenExpires,
          } as ExtendedUser;
        } catch (error: any) {
          console.error(
            "Authorization error:",
            error.response?.data || error.message,
          );
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.id = extendedUser.id;
        token.email = extendedUser.email;
        token.accessToken = extendedUser.token;
        token.refreshToken = extendedUser.refreshToken;
        token.tokenExpires = extendedUser.tokenExpires;
      }

      if (Date.now() > (token.tokenExpires as number)) {
        try {
          const response = await axios.post(
            `${AUTH_URL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token.refreshToken}`,
              },
            },
          );

          const {
            token: newToken,
            refreshToken: newRefreshToken,
            tokenExpires,
          } = response.data;
          token.accessToken = newToken;
          token.refreshToken = newRefreshToken;
          token.tokenExpires = tokenExpires;
        } catch (error: any) {
          console.error(
            "Error refreshing token:",
            error.response?.data || error.message,
          );
        }
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id as string,
          email: token.email as string,
        },
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
      } as ExtendedSession;
    },
    async redirect({ url }) {
      const resolvedBaseUrl = process.env.NEXTAUTH_URL;
      return url.startsWith(resolvedBaseUrl as string)
        ? url
        : (resolvedBaseUrl as string);
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// Export the handler functions correctly for App Router
export { handler as GET, handler as POST }