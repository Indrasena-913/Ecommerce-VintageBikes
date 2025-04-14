import "./App.css";
import RoutesComponent from "./AppRoutes/RoutesofApp";
import { useAuth } from "./context/AuthContext";
import Header from "./pages/Header";

function App() {
	const { isLoggedIn } = useAuth();

	return (
		<div className="flex flex-col min-h-screen w-full">
			{isLoggedIn && (
				<div className="fixed top-0 left-0 right-0 w-full z-50">
					<Header />
				</div>
			)}
			<div className="mt-24 pt-2 w-full">
				<RoutesComponent />
			</div>
		</div>
	);
}

export default App;
