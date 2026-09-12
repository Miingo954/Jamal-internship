import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import Explore from "./pages/Explore";
import Author from "./pages/Author";
import ItemDetails from "./pages/ItemDetails";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const AuthorRoute = () => {
  const { id } = useParams();

  return <Author key={id} />;
};

function App() {
  return (
    <Router>
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
