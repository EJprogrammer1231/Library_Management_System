import { useState } from "react";

function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const About = () => {
    setIsAboutOpen(true);
  };
  const closeAbout = () => {
    setIsAboutOpen(false);
  };
  const View = () => {
    alert("The view feature allows users to see a list of all the books in their library collection. Users can click on each book to view more details, such as the author, publication date, and genre. This feature helps users keep track of their library inventory and easily access information about their books.")
  }
  const features = () => {
    alert("The features of this library management system include: \n1. Adding new books to the library collection. \n2. Viewing a list of all books in the collection. \n3. Deleting books from the collection. \n4. An intuitive user interface for easy navigation and interaction with the library data.")
  }
  return (
   <>
   <header className="flex justify-around bg-green-300 p-2">
    <div className="text-lg">
      Library Management System
    </div>
    <nav className="flex justify-around gap-5 list-none text-lg">
      <button onClick={About} className="bg-green-400 pl-1 pr-1 rounded">
        About
      </button>
      <button onClick={View} className="bg-green-500 pl-1 pr-1 rounded">
        View
      </button>
      <button  onClick={features} className="bg-green-600 pl-1 pr-1 rounded">
        Features
      </button>
    </nav>
   </header>
   {isAboutOpen && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={closeAbout}
    >
      <div
        className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-green-800">
          About the Library Management System
        </h2>
        <p className="mt-4 text-gray-700">
          This library management system is designed to help users efficiently manage their book collections. It provides features for adding new books, viewing existing books, and deleting books from the collection. The system is built with a user-friendly interface to ensure easy navigation and interaction with the library data.
        </p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={closeAbout}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
   )}
   </>
  )
}

export default App
