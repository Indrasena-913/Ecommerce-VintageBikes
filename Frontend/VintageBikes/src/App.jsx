import "./App.css";
import RoutesComponent from "./AppRoutes/RoutesofApp";
import { useAuth } from "./context/AuthContext";
import Footer from "./pages/Footer";
import Header from "./pages/Header";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./Redux/Store";

function App() {
	const { isLoggedIn } = useAuth();

	return (
		<Provider store={store}>
			<div className="flex flex-col min-h-screen w-full">
				<Toaster
					position="top-right"
					toastOptions={{
						duration: 3000,
						style: {
							zIndex: 99999,
							background: "#333",
							color: "#fff",
						},
					}}
				/>

				{isLoggedIn && (
					<div className="fixed top-0 left-0 right-0 w-full z-50">
						<Header />
					</div>
				)}

				<div className="flex-grow w-full mt-24 pt-2 main-content">
					<RoutesComponent />
				</div>

				{isLoggedIn && <Footer />}
			</div>
		</Provider>
	);
}

export default App;
