import 'next-auth';
declare module 'next-auth' {
    interface Session {
      user: {
        _id?: string;
        name?: string;
        number?: string;
      } & DefaultSession['user'];
    }
  
    interface User {
      _id?: string;
      name?: string;
      number?: string;
    }
  }