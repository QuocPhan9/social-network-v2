import { Navbar, Sidebar, Widgets } from './components/index.js';
import { Outlet } from 'react-router-dom';

function RootLayout() {
    return (
        <>
            <Navbar />
            <main className='main'>
                <div className="container main__container">
                    <Sidebar />
                    <Outlet />
                    <Widgets />
                </div>
            </main>
        </>
    );
}

export default RootLayout;
