import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
 trustHost: true,
 providers: [
 Google({
 authorization: {
 params: {
 prompt: 'select_account',
 access_type: 'offline',
 response_type: 'code',
 },
 },
 }),
 ],
 callbacks: {
 async jwt({ token, profile }) {
 if (profile) {
 token.emailVerified = Boolean(profile.email_verified);
 token.picture = profile.picture || token.picture;
 }
 return token;
 },
 async session({ session, token }) {
 if (session.user) {
 session.user.emailVerified = Boolean(token.emailVerified);
 session.user.image = token.picture || session.user.image;
 }
 return session;
 },
 },
});
