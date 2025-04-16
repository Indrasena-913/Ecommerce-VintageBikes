import "./App.css";
import RoutesComponent from "./AppRoutes/RoutesofApp";
import { useAuth } from "./context/AuthContext";
import Footer from "./pages/Footer";
import Header from "./pages/Header";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./Redux/Store";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
	"pk_test_51REBHrRc7PjhLyfA41VMWedZFq5UszuKjYd3LSfV4igf8uV4guJb55etpFzRxd7qKibjziOUqtvvRcnk9d997cPZ00cuSvdkY6"
);

function App() {
	const { isLoggedIn } = useAuth();
	const [count, setCount] = useState(0);

	return (
		<Elements stripe={stripePromise}>
			<Provider store={store}>
				<div className="flex flex-col min-h-screen w-full">
					<Toaster
						position="top-right"
						toastOptions={{
							duration: 800,
							style: {
								zIndex: 99999,
								background: "#333",
								color: "#fff",
							},
						}}
					/>

					{isLoggedIn && (
						<div className="fixed top-0 left-0 right-0 w-full z-50">
							<Header count={count} />
						</div>
					)}

					<div className="flex-grow w-full mt-24 pt-2 main-content">
						<RoutesComponent count={count} setCount={setCount} />
					</div>

					{isLoggedIn && <Footer />}
				</div>
			</Provider>
		</Elements>
	);
}

export default App;
