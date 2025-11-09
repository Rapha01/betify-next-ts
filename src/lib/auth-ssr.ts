import { GetServerSideProps } from 'next';

// For SSR with auth, we need to handle tokens differently
// Since localStorage isn't available on server, we can use cookies or pass token in headers
// This is a basic example - for production, consider using httpOnly cookies

export function withAuthSSR<P extends object>(
  getServerSidePropsFunc?: GetServerSideProps<P>
): GetServerSideProps<P> {
  return async (context) => {
    // In a real app, you might check for auth token in cookies
    // For now, we'll just call the original function

    if (getServerSidePropsFunc) {
      return getServerSidePropsFunc(context);
    }

    return {
      props: {} as P,
    };
  };
}

// Example usage in a page:
/*
import { withAuthSSR } from '../lib/auth-ssr';

export const getServerSideProps = withAuthSSR(async (context) => {
  // This runs on server
  // You can make authenticated API calls here using the token from cookies

  return {
    props: {
      // your props
    },
  };
});

export default function ProtectedPage({ data }: { data: any }) {
  return (
    <div>
      <h1>Protected Page</h1>
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
}
*/

// For client-side only protection, use the ProtectedRoute component:
/*
import { ProtectedRoute } from '../components/protected-route';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Dashboard content - only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
*/