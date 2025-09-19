// import React, { useState } from 'react';
// import HRSidebar from '../../components/Common/HRSidebar';

// const initialFormData = {
//   employeeId: '',
//   details: {
//     personalEmail: '',
//     employmentType: '',
//     employmentStatus: '',
//     dateOfJoining: '',
//     confirmationDate: '',
//     phoneNumber: '',
//     emergencyContactNumber: '',
//     presentAddress: '',
//     permanentAddress: '',
//     aadhaarCardNumber: '',
//     panCardNumber: '',
//     bloodGroup: '',
//     medicalNotes: '',
//     highestEducationalQualification: '',
//     designation: '',
//     department: '',
//     bankName: '',
//     bankAccountNumber: '',
//     ifsCode: '',
//     assignedShiftId: '',
//   },
// };

// const employmentTypes = [
//   { value: 'PART_TIME', label: 'Part Time' },
//   { value: 'FULL_TIME', label: 'Full Time' },
//   { value: 'INTERN', label: 'Intern' },
//   { value: 'CONTRACT', label: 'Contract' },
//   { value: 'FREELANCER', label: 'Freelancer' },
// ];

// const employmentStatuses = [
//   { value: 'EMPLOYED', label: 'Employed' },
//   { value: 'RESIGNED', label: 'Resigned' },
//   { value: 'TERMINATED', label: 'Terminated' },
//   { value: 'SUSPENDED', label: 'Suspended' },
//   { value: 'PROBATION', label: 'Probation' },
// ];

// const bloodGroups = [
//   { value: 'A_positive', label: 'A+' },
//   { value: 'A_negative', label: 'A-' },
//   { value: 'B_positive', label: 'B+' },
//   { value: 'B_negative', label: 'B-' },
//   { value: 'AB_positive', label: 'AB+' },
//   { value: 'AB_negative', label: 'AB-' },
//   { value: 'O_positive', label: 'O+' },
//   { value: 'O_negative', label: 'O-' },
// ];

// const HRCreateEmployeeDetails = () => {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState(initialFormData);
//   const [message, setMessage] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith('details.')) {
//       const key = name.split('.')[1];
//       setFormData((prev) => ({
//         ...prev,
//         details: {
//           ...prev.details,
//           [key]: value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

// const token = localStorage.getItem('token'); // or wherever you keep your auth token

// const handleSubmit = async () => {
//   setIsSubmitting(true);
//   setMessage(null);

//   try {
//     // Clone and prepare formData
//     const payload = {
//       ...formData,
//       details: {
//         ...formData.details,
//         dateOfJoining: new Date(formData.details.dateOfJoining).toISOString(),
//         confirmationDate: formData.details.confirmationDate
//           ? new Date(formData.details.confirmationDate).toISOString()
//           : null,
//         assignedShiftId: formData.details.assignedShiftId || null // Handle empty string
//       }
//     };

//     const token = localStorage.getItem('token'); // Or however you store the token

//     const res = await fetch('https://backend.hrms.transev.site/admin/create-employee-details', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`, // Add if required
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || 'Submission failed');

//     setMessage({ type: 'success', text: 'Employee details created successfully!' });
//     setFormData(initialFormData);
//     setStep(1);
//   } catch (err) {
//     setMessage({ type: 'error', text: err.message });
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   return (
//     <div className="flex min-h-screen">
//       <HRSidebar />
//       <main className="flex-1 flex items-center justify-center bg-yellow-50 p-6">
//         <div className="w-full max-w-3xl bg-white p-10 rounded-xl shadow-xl border border-yellow-200">
//           <h2 className="text-3xl font-semibold text-yellow-600 mb-6 text-center">
//             Create Employee Details
//           </h2>

//           {message && (
//             <div
//               className={`mb-6 p-4 rounded-md text-sm ${message.type === 'success'
//                   ? 'bg-green-100 text-green-700'
//                   : 'bg-red-100 text-red-700'
//                 }`}
//             >
//               {message.text}
//             </div>
//           )}

//           {step === 1 ? (
//             <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-300 rounded-lg p-8 shadow-md space-y-5">
//               <label className="block text-yellow-700 font-semibold text-lg">Employee ID</label>

//               <input
//                 type="text"
//                 name="employeeId"
//                 value={formData.employeeId}
//                 onChange={handleChange}
//                 placeholder="e.g. 10450"
//                 className="w-full border border-yellow-300 px-4 py-3 rounded-lg focus:ring-4 focus:ring-yellow-400 outline-none transition"
//               />
//               {message && message.type === 'error' && (
//                 <p className="text-red-600 text-sm mt-1">{message.text}</p>
//               )}
//               <button
//                 onClick={() => {
//                   if (formData.employeeId.trim()) {
//                     setMessage(null);
//                     setStep(2);
//                   } else {
//                     setMessage({ type: 'error', text: 'Employee ID is required' });
//                   }
//                 }}
//                 className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-shadow shadow-md"
//               >
//                 Next
//               </button>
//             </div>
//           ) : (
//             <form onSubmit={(e) => e.preventDefault()} className="space-y-8 bg-yellow-50 p-8 rounded-lg shadow-md border border-yellow-300 max-w-4xl mx-auto">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
//                 {Object.entries(formData.details).map(([key, value]) => {
//                   // Dropdowns for enums
//                   if (key === 'employmentType') {
//                     return (
//                       <div key={key} className="flex flex-col">
//                         <label className="mb-2 font-semibold text-yellow-700 capitalize">Employment Type</label>
//                         <select
//                           name={`details.${key}`}
//                           value={value || ''}
//                           onChange={handleChange}
//                           className="border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
//                         >
//                           <option value="">Select Employment Type</option>
//                           {employmentTypes.map((opt) => (
//                             <option key={opt.value} value={opt.value}>
//                               {opt.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     );
//                   }
//                   if (key === 'employmentStatus') {
//                     return (
//                       <div key={key} className="flex flex-col">
//                         <label className="mb-2 font-semibold text-yellow-700 capitalize">Employment Status</label>
//                         <select
//                           name={`details.${key}`}
//                           value={value || ''}
//                           onChange={handleChange}
//                           className="border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
//                         >
//                           <option value="">Select Employment Status</option>
//                           {employmentStatuses.map((opt) => (
//                             <option key={opt.value} value={opt.value}>
//                               {opt.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     );
//                   }
//                   if (key === 'bloodGroup') {
//                     return (
//                       <div key={key} className="flex flex-col">
//                         <label className="mb-2 font-semibold text-yellow-700 capitalize">Blood Group</label>
//                         <select
//                           name={`details.${key}`}
//                           value={value || ''}
//                           onChange={handleChange}
//                           className="border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
//                         >
//                           <option value="">Select Blood Group</option>
//                           {bloodGroups.map((opt) => (
//                             <option key={opt.value} value={opt.value}>
//                               {opt.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     );
//                   }

//                   // Date inputs
//                   if (key.toLowerCase().includes('date')) {
//                     return (
//                       <div key={key} className="flex flex-col">
//                         <label className="mb-2 font-semibold text-yellow-700 capitalize">
//                           {key.replace(/([A-Z])/g, ' $1')}
//                         </label>
//                         <input
//                           type="date"
//                           name={`details.${key}`}
//                           value={value ? value.split('T')[0] : ''}
//                           onChange={handleChange}
//                           className="border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
//                         />
//                       </div>
//                     );
//                   }

//                   // Default text inputs
//                   return (
//                     <div key={key} className="flex flex-col">
//                       <label className="mb-2 font-semibold text-yellow-700 capitalize">
//                         {key.replace(/([A-Z])/g, ' $1')}
//                       </label>
//                       <input
//                         type="text"
//                         name={`details.${key}`}
//                         value={value || ''}
//                         onChange={handleChange}
//                         placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1')}`}
//                         className="border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
//                       />
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="flex justify-between pt-8">
//                 <button
//                   type="button"
//                   onClick={() => setStep(1)}
//                   className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg transition"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={isSubmitting}
//                   className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition"
//                 >
//                   {isSubmitting ? 'Submitting...' : 'Submit'}
//                 </button>
//               </div>
//             </form>

//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default HRCreateEmployeeDetails;
import React, { useState } from 'react';
import HRSidebar from '../../components/Common/HRSidebar';

const initialFormData = {
  employeeId: '',
  details: {
    personalEmail: '',
    employmentType: '',
    employmentStatus: '',
    dateOfJoining: '',
    confirmationDate: '',
    phoneNumber: '',
    emergencyContactNumber: '',
    presentAddress: '',
    permanentAddress: '',
    aadhaarCardNumber: '',
    panCardNumber: '',
    bloodGroup: '',
    medicalNotes: '',
    highestEducationalQualification: '',
    designation: '',
    department: '',
    bankName: '',
    bankAccountNumber: '',
    ifsCode: '',
    assignedShiftId: '',
  },
};

const employmentTypes = [
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'INTERN', label: 'Intern' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'FREELANCER', label: 'Freelancer' },
];

const employmentStatuses = [
  { value: 'EMPLOYED', label: 'Employed' },
  { value: 'RESIGNED', label: 'Resigned' },
  { value: 'TERMINATED', label: 'Terminated' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'PROBATION', label: 'Probation' },
];

const bloodGroups = [
  { value: 'A_positive', label: 'A+' },
  { value: 'A_negative', label: 'A-' },
  { value: 'B_positive', label: 'B+' },
  { value: 'B_negative', label: 'B-' },
  { value: 'AB_positive', label: 'AB+' },
  { value: 'AB_negative', label: 'AB-' },
  { value: 'O_positive', label: 'O+' },
  { value: 'O_negative', label: 'O-' },
];

const HRCreateEmployeeDetails = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEmployee, setIsCheckingEmployee] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('details.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


// Function to check employee presence via API - SAME STRUCTURE AS ADMIN CODE
const checkEmployeePresence = async () => {
  if (!formData.employeeId.trim()) {
    setMessage({ type: 'error', text: 'Please enter an Employee ID' });
    return false;
  }

  setIsCheckingEmployee(true);
  setMessage(null);

  try {
    const token = localStorage.getItem('token');
    const hrToken = localStorage.getItem('hr_token'); // Check if hr_token exists
    
    // Use hr_token if available, otherwise use token
    const authToken = hrToken || token;
    
    if (!authToken) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch('https://backend.hrms.transev.site/hr/check-employee-presence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`, // Try with Bearer prefix
        // Also try these alternative header formats if Bearer doesn't work:
        // 'Authorization': authToken,
        // 'hr_token': authToken,
        // 'x-access-token': authToken,
      },
      body: JSON.stringify({
        employeeId: formData.employeeId
      }),
    });

    // Check if response is OK
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API Response:', data); // Debugging
    
    // Check the presence field in the response - handle both string and boolean values
    const isPresent = data.presence === true || data.presence === "true";
    
    if (isPresent) {
      setMessage({ type: 'success', text: 'Employee found! Proceeding to details...' });
      setTimeout(() => setStep(2), 1000); // Move to next step after a brief delay
      return true;
    } else {
      setMessage({ type: 'error', text: 'Employee not found. Please check the Employee ID.' });
      return false;
    }
  } catch (err) {
    console.error('Error checking employee presence:', err);
    // More specific error messages
    if (err.message.includes('Failed to fetch')) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
    } else if (err.message.includes('401') || err.message.includes('403')) {
      setMessage({ type: 'error', text: 'Authentication failed. Please log in again.' });
    } else {
      setMessage({ type: 'error', text: err.message || 'Error checking employee presence. Please try again.' });
    }
    return false;
  } finally {
    setIsCheckingEmployee(false);
  }
};

const handleSubmit = async () => {
  setIsSubmitting(true);
  setMessage(null);

  try {
    const token = localStorage.getItem('token');
    const hrToken = localStorage.getItem('hr_token');
    const authToken = hrToken || token;
    
    if (!authToken) {
      throw new Error('Authentication token not found');
    }

    const payload = {
      ...formData,
      details: {
        ...formData.details,
        dateOfJoining: new Date(formData.details.dateOfJoining).toISOString(),
        confirmationDate: formData.details.confirmationDate
          ? new Date(formData.details.confirmationDate).toISOString()
          : null,
        assignedShiftId: formData.details.assignedShiftId || null,
      },
    };

    const res = await fetch('https://backend.hrms.transev.site/hr/create-employee-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Submission failed');

    setMessage({ type: 'success', text: 'Employee details created successfully!' });
    setFormData(initialFormData);
    setStep(1);
  } catch (err) {
    setMessage({ type: 'error', text: err.message });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="flex min-h-screen">
      <HRSidebar />
      <main className="flex-1 flex items-center justify-center bg-yellow-50 p-6">
        <div className="w-full max-w-3xl bg-white p-10 rounded-xl shadow-xl border border-yellow-200">
          <h2 className="text-3xl font-semibold text-yellow-600 mb-6 text-center">
            Create Employee Details
          </h2>

          {message && (
            <div
              className={`mb-6 p-4 rounded-md text-sm ${message.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
                }`}
            >
              {message.text}
            </div>
          )}

          {step === 1 ? (
            <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-300 rounded-lg p-8 shadow-md space-y-5">
              <label className="block text-yellow-700 font-semibold text-lg">
                Employee ID<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="e.g. 10000"
                className="w-full border border-yellow-300 px-4 py-3 rounded-lg focus:ring-4 focus:ring-yellow-400 outline-none transition"
                disabled={isCheckingEmployee}
              />
              
              <button
                onClick={checkEmployeePresence}
                disabled={isCheckingEmployee || !formData.employeeId.trim()}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-shadow shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isCheckingEmployee ? 'Checking...' : 'Check Employee'}
              </button>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800">Testing Note:</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Use employee ID <span className="font-mono">10000</span> for testing. This should return a successful response.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8 bg-yellow-50 p-8 rounded-lg shadow-md border border-yellow-300 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-yellow-700">Employee Details for ID: {formData.employeeId}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                {Object.entries(formData.details).map(([key, value]) => {
                  // Dropdowns for enums
                  if (key === 'employmentType') {
                    return (
                      <div key={key} className="flex flex-col">
                        <label className="mb-2 font-semibold text-yellow-700 capitalize">Employment Type</label>
                        <select
                          name={`details.${key}`}
                          value={value || ''}
                          onChange={handleChange}
                          className="border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                        >
                          <option value="">Select Employment Type</option>
                          {employmentTypes.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (key === 'employmentStatus') {
                    return (
                      <div key={key} className="flex flex-col">
                        <label className="mb-2 font-semibold text-yellow-700 capitalize">Employment Status</label>
                        <select
                          name={`details.${key}`}
                          value={value || ''}
                          onChange={handleChange}
                          className="border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                        >
                          <option value="">Select Employment Status</option>
                          {employmentStatuses.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (key === 'bloodGroup') {
                    return (
                      <div key={key} className="flex flex-col">
                        <label className="mb-2 font-semibold text-yellow-700 capitalize">Blood Group</label>
                        <select
                          name={`details.${key}`}
                          value={value || ''}
                          onChange={handleChange}
                          className="border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                        >
                          <option value="">Select Blood Group</option>
                          {bloodGroups.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  // Date inputs
                  if (key.toLowerCase().includes('date')) {
                    return (
                      <div key={key} className="flex flex-col">
                        <label className="mb-2 font-semibold text-yellow-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input
                          type="date"
                          name={`details.${key}`}
                          value={value ? value.split('T')[0] : ''}
                          onChange={handleChange}
                          className="border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                        />
                      </div>
                    );
                  }

                  // Default text inputs
                  return (
                    <div key={key} className="flex flex-col">
                      <label className="mb-2 font-semibold text-yellow-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <input
                        type="text"
                        name={`details.${key}`}
                        value={value || ''}
                        onChange={handleChange}
                        placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1')}`}
                        className="border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default HRCreateEmployeeDetails;