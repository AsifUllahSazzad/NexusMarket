import {createBrowserRouter} from 'react-router'
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/public/Home';

const router = createBrowserRouter([
    {
        element: <MainLayout/>,
        children: [
            {
                path: '/',
                element: <Home/>
            }
        ]
    }
])

export default router;