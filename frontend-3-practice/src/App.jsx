import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import BookingScreen from "./screens/BookingScreen";
import "./styles/booking.css";

function App() {
  return (
    <div className="page">
      <Header />
      <BookingScreen />
      <Footer />
    </div>
  );
}

export default App;
