// import React, { useState } from 'react';
// import { Card } from '../common/Card';
// import { Button } from '../common/Button';
// import { Input } from '../common/Input';
// import * as adminApi from '@/api/admin.api';
// import { Settings, Calendar, CheckCircle } from 'lucide-react';

// export const LeavePolicyManagement: React.FC = () => {
//   const [formData, setFormData] = useState({
//     year: new Date().getFullYear(),
//     paidLeaveLimit: 0,
//     unpaidLeaveLimit: 0,
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await adminApi.setLeavePolicy(formData);
//       alert('Leave policy saved successfully');
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Failed to save leave policy');
//     }
//   };

//   return (
//     <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-violet-50 to-purple-50 min-h-screen">
//       {/* Header */}
//       <div className="animate-slide-up">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
//           Leave Policy Management
//         </h1>
//         <p className="text-neutral-600">Configure annual leave policies for teachers</p>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         {/* Policy Form */}
//         <div className="lg:col-span-2">
//           <Card 
//             title="Set Leave Policy" 
//             className="animate-slide-up shadow-lg border-2 border-white"
//             style={{ animationDelay: '100ms' }}
//           >
//             <div className="mb-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border-2 border-violet-200">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-white rounded-lg shadow-md">
//                   <Settings size={24} className="text-violet-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-violet-900">Policy Configuration</h3>
//                   <p className="text-sm text-violet-700">Define leave limits for the academic year</p>
//                 </div>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <Input
//                 label="Academic Year"
//                 type="number"
//                 value={formData.year}
//                 onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
//                 required
//               />

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="p-5 bg-emerald-50 rounded-xl border-2 border-emerald-200">
//                   <Input
//                     label="Paid Leave Limit"
//                     type="number"
//                     value={formData.paidLeaveLimit}
//                     onChange={(e) =>
//                       setFormData({ ...formData, paidLeaveLimit: parseInt(e.target.value) })
//                     }
//                     required
//                   />
//                   <p className="text-xs text-emerald-700 mt-2">Maximum paid leave days per year</p>
//                 </div>

//                 <div className="p-5 bg-amber-50 rounded-xl border-2 border-amber-200">
//                   <Input
//                     label="Unpaid Leave Limit"
//                     type="number"
//                     value={formData.unpaidLeaveLimit}
//                     onChange={(e) =>
//                       setFormData({ ...formData, unpaidLeaveLimit: parseInt(e.target.value) })
//                     }
//                     required
//                   />
//                   <p className="text-xs text-amber-700 mt-2">Maximum unpaid leave days per year</p>
//                 </div>
//               </div>

//               <Button 
//                 type="submit" 
//                 className="w-full flex items-center justify-center gap-2 shadow-lg"
//               >
//                 <CheckCircle size={20} />
//                 Save Policy
//               </Button>
//             </form>
//           </Card>
//         </div>

//         {/* Info Cards */}
//         <div className="space-y-6">
//           <Card className="animate-slide-up bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-xl border-none" style={{ animationDelay: '200ms' }}>
//             <div className="text-center">
//               <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
//                 <Calendar size={32} />
//               </div>
//               <h3 className="text-2xl font-bold mb-2">Current Year</h3>
//               <p className="text-5xl font-bold mb-2">{formData.year}</p>
//               <p className="text-violet-100 text-sm">Academic Year</p>
//             </div>
//           </Card>

//           <Card className="animate-slide-up bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl border-none" style={{ animationDelay: '300ms' }}>
//             <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
//               <CheckCircle size={20} />
//               Policy Guidelines
//             </h3>
//             <ul className="space-y-2 text-sm text-emerald-50">
//               <li className="flex items-start gap-2">
//                 <span className="text-xl">•</span>
//                 <span>Review and update policies annually</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-xl">•</span>
//                 <span>Ensure fair leave allocation</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-xl">•</span>
//                 <span>Consider academic calendar</span>
//               </li>
//             </ul>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import * as adminApi from '@/api/admin.api';
import { Settings, Calendar, CheckCircle } from 'lucide-react';

export const LeavePolicyManagement: React.FC = () => {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    paidLeaveLimit: 0,
    unpaidLeaveLimit: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.setLeavePolicy(formData);
      alert('Leave policy saved successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save leave policy');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6 bg-gradient-to-br from-neutral-50 via-violet-50 to-purple-50 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Leave Policy Management
        </h1>
        <p className="text-neutral-600 text-sm md:text-base">
          Configure annual leave policies for teachers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* POLICY FORM */}
        <div className="lg:col-span-2">
          <Card
            title="Set Leave Policy"
            className="shadow-lg border-2 border-white"
          >
            <div className="mb-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-lg shadow-md">
                  <Settings size={22} className="text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-violet-900">
                    Policy Configuration
                  </h3>
                  <p className="text-sm text-violet-700">
                    Define leave limits for the academic year
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Academic Year"
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="p-4 md:p-5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <Input
                    label="Paid Leave Limit"
                    type="number"
                    value={formData.paidLeaveLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paidLeaveLimit: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                  <p className="text-xs text-emerald-700 mt-2">
                    Maximum paid leave days per year
                  </p>
                </div>

                <div className="p-4 md:p-5 bg-amber-50 rounded-xl border border-amber-200">
                  <Input
                    label="Unpaid Leave Limit"
                    type="number"
                    value={formData.unpaidLeaveLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unpaidLeaveLimit: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                  <p className="text-xs text-amber-700 mt-2">
                    Maximum unpaid leave days per year
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 shadow-lg"
              >
                <CheckCircle size={20} />
                Save Policy
              </Button>
            </form>
          </Card>
        </div>

        {/* INFO CARDS */}
        <div className="space-y-4 md:space-y-6">
          <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-xl border-none">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <Calendar size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-1">
                Current Year
              </h3>
              <p className="text-4xl md:text-5xl font-bold mb-1">
                {formData.year}
              </p>
              <p className="text-violet-100 text-sm">Academic Year</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl border-none">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <CheckCircle size={18} />
              Policy Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-emerald-50">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Review and update policies annually</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Ensure fair leave allocation</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Consider academic calendar</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
