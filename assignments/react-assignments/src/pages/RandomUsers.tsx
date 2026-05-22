import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://api.freeapi.app/api/v1/public/randomusers";

interface UserName {
  title: string;
  first: string;
  last: string;
}

interface UserLocation {
  street: { number: number; name: string };
  city: string;
  state: string;
  country: string;
  postcode: string;
  coordinates: { latitude: string; longitude: string };
  timezone: { offset: string; description: string };
}

interface UserPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

interface User {
  id: number;
  gender: string;
  name: UserName;
  location: UserLocation;
  email: string;
  phone: string;
  cell: string;
  picture: UserPicture;
  dob: { date: string; age: number };
  registered: { date: string; age: number };
  nat: string;
}

interface ApiResponse {
  statusCode: number;
  data: {
    page: number;
    limit: number;
    totalPages: number;
    previousPage: boolean;
    nextPage: boolean;
    totalItems: number;
    currentPageItems: number;
    data: User[];
  };
  message: string;
  success: boolean;
}

export default function RandomUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async (pageNum: number = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}?page=${pageNum}&limit=12`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: ApiResponse = await res.json();
      if (data.success && data.data?.data) {
        setUsers(data.data.data);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <nav className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-[#2d2d2d] no-underline font-medium px-4 py-2 border-2 border-[#2d2d2d] rounded-lg hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all"
        >
          ← Back to Projects
        </Link>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-[#2d2d2d]">Random Users</h1>
        <p className="text-[#6b6b6b] mt-1">
          Browse user profiles from around the world
        </p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading && users.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="text-[#6b6b6b]">Loading users...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl p-6 hover:-translate-y-1 hover:shadow-[6px_6px_0_#2d2d2d] transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={user.picture.large}
                    alt={`${user.name.first} ${user.name.last}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#2d2d2d]"
                  />
                  <div>
                    <h3 className="text-[#2d2d2d] font-medium">
                      {user.name.first} {user.name.last}
                    </h3>
                    <p className="text-[#6b6b6b] text-sm capitalize">
                      {user.gender}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-[#6b6b6b]">
                    <span className="text-[#2d2d2d]">📍</span>{" "}
                    {user.location.city}, {user.location.country}
                  </p>
                  <p className="text-[#6b6b6b]">
                    <span className="text-[#2d2d2d]">📧</span> {user.email}
                  </p>
                  <p className="text-[#6b6b6b]">
                    <span className="text-[#2d2d2d]">🎂</span> {user.dob.age}{" "}
                    years old
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#2d2d2d]/20">
                  <span className="text-xs bg-[#e8d5c4] text-[#2d2d2d] px-2 py-0.5 rounded">
                    {user.nat}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => {
                const p = page - 1;
                setPage(p);
                fetchUsers(p);
              }}
              disabled={page === 1 || loading}
              className="px-4 py-2 border-2 border-[#2d2d2d] rounded-lg font-medium hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-[#6b6b6b]">Page {page}</span>
            <button
              onClick={() => {
                const p = page + 1;
                setPage(p);
                fetchUsers(p);
              }}
              disabled={loading}
              className="px-4 py-2 border-2 border-[#2d2d2d] rounded-lg font-medium hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedUser.picture.large}
                    alt={`${selectedUser.name.first} ${selectedUser.name.last}`}
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#2d2d2d]"
                  />
                  <div>
                    <h2 className="text-2xl font-semibold text-[#2d2d2d]">
                      {selectedUser.name.title} {selectedUser.name.first}{" "}
                      {selectedUser.name.last}
                    </h2>
                    <p className="text-[#6b6b6b] capitalize">
                      {selectedUser.gender}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-[#6b6b6b] hover:text-[#2d2d2d] text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#e8d5c4] rounded-lg p-4">
                  <h3 className="text-sm font-medium text-[#6b6b6b] mb-2">
                    Location
                  </h3>
                  <p className="text-[#2d2d2d]">
                    {selectedUser.location.street.number}{" "}
                    {selectedUser.location.street.name}
                    <br />
                    {selectedUser.location.city}, {selectedUser.location.state}
                    <br />
                    {selectedUser.location.country} -{" "}
                    {selectedUser.location.postcode}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#e8d5c4] rounded-lg p-4">
                    <h3 className="text-sm font-medium text-[#6b6b6b] mb-1">
                      Email
                    </h3>
                    <p className="text-[#2d2d2d] text-sm">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div className="bg-[#e8d5c4] rounded-lg p-4">
                    <h3 className="text-sm font-medium text-[#6b6b6b] mb-1">
                      Phone
                    </h3>
                    <p className="text-[#2d2d2d] text-sm">
                      {selectedUser.phone}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#e8d5c4] rounded-lg p-4">
                    <h3 className="text-sm font-medium text-[#6b6b6b] mb-1">
                      Age
                    </h3>
                    <p className="text-[#2d2d2d]">
                      {selectedUser.dob.age} years
                    </p>
                  </div>
                  <div className="bg-[#e8d5c4] rounded-lg p-4">
                    <h3 className="text-sm font-medium text-[#6b6b6b] mb-1">
                      Nationality
                    </h3>
                    <p className="text-[#2d2d2d]">{selectedUser.nat}</p>
                  </div>
                </div>

                <div className="bg-[#e8d5c4] rounded-lg p-4">
                  <h3 className="text-sm font-medium text-[#6b6b6b] mb-1">
                    Timezone
                  </h3>
                  <p className="text-[#2d2d2d] text-sm">
                    {selectedUser.location.timezone.offset} -{" "}
                    {selectedUser.location.timezone.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
