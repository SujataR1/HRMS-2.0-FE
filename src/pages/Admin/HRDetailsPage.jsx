import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/Common/AdminSidebar"; // Adjust path if needed
import { MdPeopleOutline, MdSearch } from "react-icons/md";

const dummyHRDetails = [
  {
    id: 1,
    name: "Alice Johnson",
    position: "HR Manager",
    email: "alice.johnson@example.com",
    phone: "+1 234 567 890",
    location: "New York",
    status: "Active",
  },
  {
    id: 2,
    name: "Bob Smith",
    position: "Recruitment Specialist",
    email: "bob.smith@example.com",
    phone: "+1 987 654 321",
    location: "Los Angeles",
    status: "Active",
  },
  {
    id: 3,
    name: "Clara Lee",
    position: "HR Coordinator",
    email: "clara.lee@example.com",
    phone: "+1 555 123 456",
    location: "Chicago",
    status: "On Leave",
  },
  // Add more dummy data as needed
];

const HRDetailsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHRDetails, setFilteredHRDetails] = useState(dummyHRDetails);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredHRDetails(dummyHRDetails);
    } else {
      const filtered = dummyHRDetails.filter(({ name, position, email }) =>
        [name, position, email]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredHRDetails(filtered);
    }
  }, [searchTerm]);

  return (
    <div className="flex min-h-screen bg-yellow-50 font-sans">
      <AdminSidebar />

      <main className="ml-64 flex flex-col flex-grow p-10 w-full">
        <header className="flex items-center space-x-3 mb-8">
          <MdPeopleOutline size={32} className="text-orange-500" />
          <h1 className="text-3xl font-extrabold text-yellow-900 tracking-wide">
            HR Details
          </h1>
        </header>

        {/* Search bar */}
        <div className="mb-6 max-w-md">
          <div className="relative text-yellow-900 focus-within:text-orange-500">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <MdSearch size={20} className="text-yellow-700" />
            </span>
            <input
              type="search"
              name="search"
              placeholder="Search by name, position, or email"
              className="w-full py-3 pl-10 pr-4 rounded-lg border border-yellow-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search HR details"
            />
          </div>
        </div>

        {/* HR Details Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-yellow-300">
          <table className="min-w-full divide-y divide-yellow-200 text-yellow-900">
            <thead className="bg-yellow-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yellow-100 bg-white">
              {filteredHRDetails.length > 0 ? (
                filteredHRDetails.map(
                  ({ id, name, position, email, phone, location, status }) => (
                    <tr
                      key={id}
                      className="hover:bg-yellow-50 transition-colors cursor-pointer"
                      tabIndex={0}
                      aria-label={`${name}, ${position}, email: ${email}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{position}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{location}</td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap font-semibold ${
                          status === "Active"
                            ? "text-green-600"
                            : status === "On Leave"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {status}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-yellow-700 italic"
                  >
                    No HR details found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default HRDetailsPage;
