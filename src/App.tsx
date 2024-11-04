import Home from "./Home";
import SignUp from "./components/signup";
import Login from "./components/login";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Layout from "./Layout";
import ProfilePage from "./ProfilePage";
import OrderHistoryPage from "./OrderHistory";

// function App() {
//   const location = useLocation();
//   const isAuthPath = location.pathname === "/login" || location.pathname === "/signup";
//   return (
//     <>
//       {!isAuthPath ? <Layout /> : null}
//     <Router>
//         <Routes>
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/login" element={<Login />} />

          
//             <Route path="/" element={<Home />} />

//           {/* Catch-all route for 404 */}
//           {/* <Route path="*" element={<NotFound />} /> */}
//         </Routes>
//     </Router>
//   </>
//   );
// }

const AppRoutes = () => {
  const location = useLocation();
  const isAuthPath = location.pathname === '/login' || location.pathname === '/signup';
  
  return (
    <>
      {!isAuthPath && <Layout />}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/history" element={<OrderHistoryPage />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);


export default App;
