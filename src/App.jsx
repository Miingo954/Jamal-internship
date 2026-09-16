import Home from "./pages/Home";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Explore from "./pages/Explore";
import Author from "./pages/Author";
import ItemDetails from "./pages/ItemDetails";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const AuthorRoute = () => {
  const { id } = useParams();

  return <Author key={id} />;
};

const ScrollAnimations = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      offset: 80,
      once: true,
      mirror: false,
      disable: () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => AOS.refreshHard(), 0);
    return () => window.clearTimeout(refreshTimer);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollAnimations />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/author" element={<Author />} />
        <Route path="/author/:id" element={<AuthorRoute />} />
        <Route path="/item-details" element={<ItemDetails />} />
        <Route path="/item-details/:type/:id" element={<ItemDetails />} />
        <Route
          path="/item-details/author/:authorId/:id"
          element={<ItemDetails />}
        />
        <Route path="/item-details/:id" element={<ItemDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
