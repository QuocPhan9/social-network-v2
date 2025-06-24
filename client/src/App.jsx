import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './RootLayout.jsx';
import { Home, Bookmarks, ErrorPage, Login, Logout, Messages, Profile, Register, SinglePost } from './pages/index.js';
import { MessagesList } from './components/index.js';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            { path: "messages", element: <MessagesList />, },
            { path: "messages/:receiverId", element: <Messages />, },
            { path: "bookmarks", element: <Bookmarks />, },
            { path: "users/:id", element: <Profile />, },
            { path: "posts/:id", element: <SinglePost />, }
        ]
    },
    { path: '/login', element: <Login />, },
    { path: '/register', element: <Register />, },
    { path: '/logout', element: <Logout />, },
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App
