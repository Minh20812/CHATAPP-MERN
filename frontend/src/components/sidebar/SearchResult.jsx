import { useSelector } from "react-redux";

const SearchResults = ({
  query,
  users,
  isLoading,
  isError,
  addUserToAllTab,
  setShowSearchResults,
}) => {
  if (!query) return null;

  const currentUserId = useSelector((state) => state.auth.userInfo._id);
  const filteredUsers = users.filter((user) => user._id !== currentUserId);

  return (
    <div className="absolute z-10 mt-2 p-2 bg-white border border-gray-300 rounded-lg shadow-md">
      <p className="text-gray-500 mb-2">Showing results for "{query}"</p>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}

      {isError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">
            Failed to load results. Please try again.
          </p>
        </div>
      )}

      {!isLoading && filteredUsers.length === 0 && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-gray-500">No users found matching your search.</p>
        </div>
      )}

      {!isLoading && !isError && filteredUsers.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
              onClick={() => {
                addUserToAllTab(user);
                setShowSearchResults(false);
              }}
            >
              <div className="flex items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user.username}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.email || user.phone}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
