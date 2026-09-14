import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    interface User {
        id: string;
        username: string;
        color?: string;
        icon?: string;
    }

    interface Session {
        user: {
            id: string;
            username: string;
            email: string;
            color?: string;
            icon?: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        username: string;
        color?: string;
        icon?: string;
    }
}
