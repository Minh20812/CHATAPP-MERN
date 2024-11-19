import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useSearchUsersByEmailQuery } from "../../redux/api/userApiSlice";
import SearchResults from "./SearchResult";

const SearchComponent = ({
  addUserToAllTab,
  showSearchResults,
  setShowSearchResults,
}) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useSearchUsersByEmailQuery(debouncedQuery, {
    skip: !debouncedQuery,
  });

  const clearSearch = () => {
    setQuery("");
    setShowSearchResults(false);
  };

  return (
    <div className="w-full p-2 bg-gray-100 rounded-lg shadow-lg">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSearchResults(true);
        }}
        placeholder="Search other user by email or phone number"
        className="w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Conditionally render SearchResults */}
      {showSearchResults && (
        <SearchResults
          query={query}
          users={users}
          isLoading={isLoading}
          isError={isError}
          addUserToAllTab={(user) => {
            addUserToAllTab(user);
            clearSearch();
          }}
          setShowSearchResults={setShowSearchResults}
        />
      )}
    </div>
  );
};

export default SearchComponent;
