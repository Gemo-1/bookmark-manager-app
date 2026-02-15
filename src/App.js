// import './App.css';
import { BookMarkerProvider } from "./Context/BookMarkerContext";
import BookmarkList from "./components/BookmarkList";
//  
function App() {
  return (
    <BookMarkerProvider>
      <div className="App">
        <BookmarkList />
      </div>
    </BookMarkerProvider>
  );
}

export default App;


















////////////نهايه الملف
